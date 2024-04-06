"use server";

import { PrismaClient } from "@prisma/client";
import { isWithinExpirationDate, TimeSpan, createDate } from "oslo";
import { sendMail } from "../email/sendEmail";
import { renderVerificationCodeEmail } from "../email/template/emailVerification";
import db from "./db";
const bcrypt = require("bcrypt");
const prisma = new PrismaClient();

export async function existingUser(email: string): Promise<boolean> {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
    });
    return user ? true : false;
  } catch (error) {
    throw new Error("error verifying user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function createUser(
  username: string,
  email: string,
  password: string
) {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: password_hash,
      },
    });
    return user !== null ? user : null;
  } catch (error) {
    throw new Error("error creating user");
  } finally {
    await prisma.$disconnect();
  }
}

function generateVerificationCode(length: number): string {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  let code = "";
  for (let i = 0; i < length; i++) {
    code += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return code;
}

export async function saveEmailVerification(
  userId: number,
  email: string
): Promise<string> {
  try {
    await prisma.email_verification.deleteMany({
      where: {
        email: email,
        user_id: userId,
      },
    });
    const verificationCode = generateVerificationCode(8);
    const newVerificationCode = await prisma.email_verification.create({
      data: {
        user_id: userId,
        email: email,
        expires_at: createDate(new TimeSpan(5, "m")),
        verification_code: verificationCode,
      },
    });
    return newVerificationCode !== null
      ? newVerificationCode.verification_code
      : "";
  } catch (error) {
    console.error("Error saving email verification code:", error);
    throw new Error("Failed to save email verification code.");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getUser(email: string) {
  try {
    const user = await prisma.users.findUnique({
      where: { email: email },
      include: {
        email_verification: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

const timeFromNow = (time: Date) => {
  const now = new Date();
  const diff = time.getTime() - now.getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  const seconds = Math.floor(diff / 1000) % 60;
  return `${minutes}m ${seconds}s`;
};

export async function resendVerificationEmail(
  userId: number,
  email: string
): Promise<{
  error?: string;
  success?: boolean;
}> {
  try {
    const lastSent = await prisma.email_verification.findMany({
      where: { email: email, user_id: userId },
    });
    if (lastSent.length > 0) {
      if (lastSent && isWithinExpirationDate(lastSent[0].expires_at)) {
        return {
          error: `Désolé, veuillez patienter ${timeFromNow(
            lastSent[0].expires_at
          )} avant de renvoyer le code de vérification.`,
        };
      }
      const verificationCode = await saveEmailVerification(userId, email);
      await sendMail({
        to: email,
        subject:
          "Vérifiez votre adresse e-mail pour finaliser votre inscription à MOVIE CHILL",
        body: renderVerificationCodeEmail({ code: verificationCode }),
      });

      return { success: true };
    }
    return {
      error: `no existing verification code`,
    };
  } catch (error) {
    console.error("Error resend verification code:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function verifyUser(userId: number, email: string) {
  try {
    const user = await prisma.email_verification.updateMany({
      where: { email: email, user_id: userId },
      data: {
        is_verified: true,
      },
    });
    return user;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function isVerifyUser(email?: string | null) {
  try {
    if (email !== undefined) {
      const user = await prisma.users.findFirst({
        where: { email: email },
      });
      if (!user) return false;
      const verifying = await prisma.email_verification.findFirst({
        where: { user_id: user.user_id },
      });
      return verifying ? true : false;
    } else return false;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function verifyEmail(
  userId: number,
  email: string,
  code: string
): Promise<{
  error?: string;
  success?: boolean;
}> {
  const dbCode = await prisma.email_verification.findMany({
    where: { email: email, user_id: userId, verification_code: code },
  });
  if (dbCode.length > 0) {
    if (!isWithinExpirationDate(dbCode[0].expires_at)) {
      return { error: "Le code de vérification a expiré." };
    }
    const validEmailUser = await verifyUser(userId, email);
    if (validEmailUser) {
      return { success: true };
    }
    return { error: "L'adresse e-mail ne correspond pas." };
  }
  return {
    error: "Aucun code de vérification existant n'a été trouvé.",
  };
}

export async function createSessionUser(
  userId: number,
  deletePrevSession?: boolean
): Promise<any> {
  try {
    if (deletePrevSession !== undefined && deletePrevSession) {
      await prisma.user_sessions.deleteMany({
        where: {
          user_id: userId,
        },
      });
    }

    const expirationTime = createDate(new TimeSpan(1, "d"));
    const sessionUser = await prisma.user_sessions.create({
      data: {
        user_id: userId,
        expires_at: expirationTime,
      },
    });
    return sessionUser;
  } catch (error) {
    console.error("Error creating session:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function isSessionValid(userId: number): Promise<boolean> {
  try {
    const userSession = await prisma.user_sessions.findFirst({
      where: {
        user_id: userId,
      },
      orderBy: {
        created_at: "desc",
      },
    });

    if (!userSession) {
      console.log("No session found for the user.");
      return false;
    }
    const expiresAt = userSession.expires_at;
    if (!isWithinExpirationDate(expiresAt)) {
      console.log("Session has expired.");
      return false;
    }

    console.log(`Session is valid.`);
    return true;
  } catch (error) {
    console.error("Error checking session validity:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

export async function updateProfilUser(
  userId: number,
  email: string,
  profilUrl: string
) {
  try {
    const user = await prisma.users.update({
      where: { user_id: userId, email: email },
      data: {
        profile_picture: profilUrl,
      },
    });
    return user;
  } catch (error) {
    throw new Error("error get user");
  } finally {
    await prisma.$disconnect();
  }
}

interface SelectedCategory {
  id: number;
  title: string;
}

interface UserFavoriteCategory {
  id: number;
  category_id: number;
  user_id?: number;
}

function adaptFavoriteCategories(
  favoriteCategories: SelectedCategory[],
  userId: number
): UserFavoriteCategory[] {
  return favoriteCategories.map((category) => ({
    id: 0, // Vous pouvez spécifier un ID ou le laisser par défaut pour être auto-incrémenté
    category_id: category.id,
    user_id: userId,
  }));
}

export async function onboardingProfil(
  userId: number,
  email: string,
  profilUrl: string,
  favoriteCategory: SelectedCategory[]
) {
  try {
    // Changement de la photo de profil
    const user = await prisma.users.update({
      where: { user_id: userId, email: email },
      data: {
        profile_picture: profilUrl,
      },
    });

    if (user !== null && favoriteCategory.length !== 0) {
      await prisma.user_favorite_categories.deleteMany({
        where: { user_id: userId },
      });

      const adaptedCategories = adaptFavoriteCategories(
        favoriteCategory,
        userId
      );
      const userFavorisCategorie =
        await prisma.user_favorite_categories.createMany({
          data: adaptedCategories,
        });
      return {
        url: user.profile_picture,
        moviesGenres: userFavorisCategorie,
      };
    }

    return null;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du profil utilisateur");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFavoritesMovieUser(
  userId: number,
  skip: number,
  max: number
) {
  try {
    const favoriteMovies = await prisma.user_favorite_movies.findMany({
      where: {
        user_id: userId,
      },
      skip: skip,
      take: max,
    });

    return favoriteMovies !== null ? favoriteMovies : [];
  } catch (error) {
    throw new Error("error get favorite movie user");
  } finally {
    await prisma.$disconnect();
  }
}

interface UserFavoriteMovie {
  id?: number;
  idMovieDb: number;
  title: string;
  poster: string;
  release_date: string;
  rating_count: number;
  user_id?: number | null;
}

export async function addMovieAsFavorite(
  movie: UserFavoriteMovie
): Promise<UserFavoriteMovie> {
  try {
    const newFavoriteMovie = await prisma.user_favorite_movies.create({
      data: movie,
    });

    return newFavoriteMovie;
  } catch (error) {
    throw new Error("Error adding movie as favorite");
  } finally {
    await prisma.$disconnect();
  }
}

export async function removeMovieFromFavorites(
  movieId: number,
  userId: number
) {
  try {
    const deletedMovies = await prisma.user_favorite_movies.deleteMany({
      where: {
        idMovieDb: movieId,
        user_id: userId,
      },
    });
    return deletedMovies;
  } catch (error) {
    throw new Error("Error removing movie from favorites");
  } finally {
    await prisma.$disconnect();
  }
}

export async function isMovieFavorited(
  movieId: number,
  userId: number
): Promise<boolean> {
  try {
    const favorite = await prisma.user_favorite_movies.findFirst({
      where: {
        idMovieDb: movieId,
        user_id: userId,
      },
    });
    return favorite !== null;
  } catch (error) {
    console.error("Error checking if movie is favorited", error);
    throw new Error("Error checking if movie is favorited");
  } finally {
    await prisma.$disconnect();
  }
}

export async function getFavoritesGenreMovieUser(userId: number) {
  try {
    const favoriteGenreMovies = await prisma.user_favorite_categories.findMany({
      where: {
        user_id: userId,
      },
    });

    return favoriteGenreMovies !== null ? favoriteGenreMovies : [];
  } catch (error) {
    throw new Error("error get favorite genre movie user");
  } finally {
    await prisma.$disconnect();
  }
}

export async function addFavoriteGenreMovieUser(
  userId: number,
  favoriteCategory: SelectedCategory[]
) {
  try {
    if (favoriteCategory.length !== 0) {
      await prisma.user_favorite_categories.deleteMany({
        where: { user_id: userId },
      });

      const adaptedCategories = adaptFavoriteCategories(
        favoriteCategory,
        userId
      );
      const userFavorisCategorie =
        await prisma.user_favorite_categories.createMany({
          data: adaptedCategories,
        });
      return {
        moviesGenres: userFavorisCategorie,
      };
    }

    return null;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du profil utilisateur");
  } finally {
    await prisma.$disconnect();
  }
}

export async function updatePictureUser(
  userId: number,
  email: string,
  profilUrl: string
) {
  try {
    // Changement de la photo de profil
    const user = await prisma.users.update({
      where: { user_id: userId, email: email },
      data: {
        profile_picture: profilUrl,
      },
    });

    return user.profile_picture;
  } catch (error) {
    throw new Error("Erreur lors de la mise à jour du profil utilisateur");
  } finally {
    await prisma.$disconnect();
  }
}

export async function saveResetPasswordTokenUser(
  userId: number,
  token: string
) {
  try {
    await db.password_reset_tokens.deleteMany({
      where: {
        user_id: userId,
      },
    });
    const expirationTime = createDate(new TimeSpan(2, "m"));
    const newTokenPassword = await db.password_reset_tokens.create({
      data: {
        user_id: userId,
        token,
        expires_at: expirationTime,
      },
    });

    return newTokenPassword;
  } catch (error) {
    throw new Error("Erreur lors de la création du token");
  }
}

export const checkIfResetLinkValid = async (
  userId: number
): Promise<{ error?: string; success?: boolean }> => {
  try {
    const existResetLinkUser = await db.password_reset_tokens.findFirst({
      where: {
        user_id: userId,
      },
    });

    if (!existResetLinkUser) {
      return {
        success: false,
      };
    }

    if (isWithinExpirationDate(existResetLinkUser.expires_at)) {
      const remainingTime = timeFromNow(existResetLinkUser.expires_at);
      return {
        error: `Désolé, veuillez patienter ${remainingTime} avant de renvoyer le lien de  vérification.`,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.error(
      "Une erreur s'est produite lors de la vérification de la validité du lien de réinitialisation :",
      error
    );
    return {
      error:
        "Oups ! Une erreur s'est produite lors de la vérification de la validité du lien de réinitialisation.",
    };
  }
};

export const checkTokenResetLink = async (
  token: string
): Promise<{ userId?: number; error?: string }> => {
  try {
    const checkToken = await db.password_reset_tokens.findFirst({
      where: {
        token,
      },
    });

    if (!checkToken) {
      return {
        error: "Le lien de réinitialisation de mot de passe est invalide.",
      };
    }

    if (!isWithinExpirationDate(checkToken.expires_at)) {
      return { error: "Le lien de réinitialisation de mot de passe a expiré." };
    }

    return { userId: checkToken.user_id };
  } catch (error) {
    return {
      error:
        "Une erreur s'est produite lors de la vérification de la validité du lien de réinitialisation de mot de passe.",
    };
  }
};

export async function updatePasswordUser(
  userId: number,
  password: string
): Promise<boolean> {
  try {
    const password_hash = await bcrypt.hash(password, 10);
    const user = await db.users.update({
      where: {
        user_id: userId,
      },
      data: {
        password: password_hash,
      },
    });
    await createSessionUser(user.user_id, true);
    return user !== null ? true : false;
  } catch (error) {
    throw new Error("error creating user");
  } finally {
    await prisma.$disconnect();
  }
}
