"use client";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { PageContent } from "@/components/container/container";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import { useGetAllGenreMovieUser } from "@/hooks/useCategory";
import { CardCategorie } from "@/components/card/card";
import { TypeMovieCategory } from "@/types/categorie";
import { Button } from "@/components/button/button";
import { FaCheck } from "react-icons/fa6";
import { useMutation } from "react-query";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { storage } from "@/lib/firebaseConfig";

type propsCardProfil = {
  image: string | null;
  name: string | null;
};
interface SelectedCategory {
  id: number;
  title: string;
}

interface DataProfilUser {
  urlProfil: string;
}

const isFirebaseStorageURL = (url: string) => {
  const firebaseStorageRegex = /^https:\/\/firebasestorage\.googleapis\.com\//;
  return firebaseStorageRegex.test(url);
};

const deleteOlderProfil = async (fileUrl: string) => {
  try {
    if (isFirebaseStorageURL(fileUrl)) {
      const fileRef = ref(storage, fileUrl);
      await deleteObject(fileRef);
      return true;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error deleting file: ", error);
    return false;
  }
};
const CardProfilUser = ({ image, name }: propsCardProfil) => {
  const odlderPicture: string | null = image !== null ? image : null;
  const fileInputRef = useRef(null);
  const [awaitBtnSave, setAwaitBtnSave] = useState<boolean>(false);
  const [disabledBtnSave, setDisabledBtnSave] = useState<boolean>(true);
  const [disabledBtnChangeProfil, setDisabledBtnChangeProfil] =
    useState<boolean>(false);
  const [profilPic, setProfilPic] = useState<string>(
    image !== null ? image : "/images/icons/female_profile.svg"
  );

  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const { mutate: updateProfil } = useMutation<void, unknown, DataProfilUser>(
    (newProfil) => axios.put("/api/users/profil", newProfil),
    {
      onSuccess: async (response) => {
        setAwaitBtnSave(false);
        setDisabledBtnSave(true);
        setDisabledBtnChangeProfil(false);
        toast.success("Votre photo de profil a été mis à jour avec succès !");
        if (odlderPicture !== null) {
          await deleteOlderProfil(odlderPicture);
          //window.location.reload();
        }
        //window.location.reload();
      },
      onError: async (error) => {
        setAwaitBtnSave(false);
        setDisabledBtnSave(true);
        setDisabledBtnChangeProfil(false);
        console.error(error);
        toast.error(
          "Oups 🫡 une erreur s'est produite. Veuillez réessayer ultérieurement."
        );
      },
    }
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size <= 1572864) {
        // Check if file is less than or equal to 1.5MB
        setSelectedImage(file);
        const imageUrl = URL.createObjectURL(file);
        setProfilPic(imageUrl);
        setDisabledBtnSave(false);
      } else {
        setDisabledBtnSave(true);
        toast.error("La taille du fichier est supérieure à 1.5MB !");
      }
    } else {
      setDisabledBtnSave(true);
    }
  };

  const uploadImage = async (file: File): Promise<string> => {
    try {
      const storageRef = ref(storage, `profil/${file.name}`);
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return downloadURL;
    } catch (error: any) {
      console.error("Error uploading file: ", error);
      setAwaitBtnSave(false);
      throw error;
    }
  };

  const handleSave = async () => {
    try {
      if (selectedImage) {
        setAwaitBtnSave(true);
        setDisabledBtnSave(true);
        setDisabledBtnChangeProfil(true);
        const imageUrl = await uploadImage(selectedImage);
        updateProfil({
          urlProfil: imageUrl,
        });
      } else {
        setAwaitBtnSave(false);
        setDisabledBtnSave(false);
        setDisabledBtnChangeProfil(false);
        toast.warn("Aucune photo!");
      }
    } catch (error: any) {
      setAwaitBtnSave(false);
      setDisabledBtnSave(false);
      setDisabledBtnChangeProfil(false);
      console.error("Error uploading image: ", error);
    }
  };
  return (
    <div className="card__profil__user">
      <input
        type="file"
        ref={fileInputRef}
        accept="image/jpeg, image/png"
        onChange={handleImageChange}
        style={{ display: "none" }}
      />
      <div className="content__image__profil">
        <Image
          src={profilPic}
          width={100}
          height={100}
          alt=""
          className="img-fluid"
          priority={true}
        />

        <div className="container__action__pic">
          <Button
            variant="primary"
            isDisabled={disabledBtnSave}
            isLoading={awaitBtnSave}
            onClick={handleSave}
          >
            <FaCheck />
          </Button>
          <Button
            variant="secondary"
            isDisabled={disabledBtnChangeProfil}
            onClick={() => {
              if (
                fileInputRef.current !== null &&
                fileInputRef.current !== undefined
              ) {
                (fileInputRef.current as HTMLInputElement).click();
              }
            }}
          >
            <MdModeEdit />
          </Button>
        </div>
      </div>
      <h2>{name}</h2>
    </div>
  );
};
interface GenreFavoriteUser {
  categoriesMovie: SelectedCategory[];
}
const CardFavoriteGenreMovieUser = () => {
  const { data, isLoading } = useGetAllGenreMovieUser();
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
  const [initialCategories, setInitialCategories] = useState<
    SelectedCategory[]
  >([]);
  const [awaitBtnSave, setAwaitBtnSave] = useState<boolean>(false);
  const [isDirty, setIsDirty] = useState<boolean>(false); // state to track if categories have changed
  const { mutate: updateGenreMovieUser } = useMutation<
    void,
    unknown,
    GenreFavoriteUser
  >((categoriesMovie) => axios.post("/api/users/profil", categoriesMovie), {
    onSuccess: async (response) => {
      console.log(response);
      setAwaitBtnSave(false);
      toast.success(
        "Les genres de films préférés ont été mis à jour avec succès !"
      );
    },
    onError: async (error) => {
      setAwaitBtnSave(false);
      console.error(error);
      toast.error(
        "Une erreur est survenue lors de la mise à jour des genres de films préférés. Veuillez réessayer ultérieurement."
      );
    },
  });
  console.log(selectedCategories);
  useEffect(() => {
    if (data) {
      const initial = data.categories
        .filter((genre: TypeMovieCategory) => genre.isFavorite)
        .map((genre: TypeMovieCategory) => ({
          id: genre.category_id,
          title: genre.category_name,
          isFavorite: true,
        }));
      setSelectedCategories(initial);
      setInitialCategories(initial);
    }
  }, [data]);

  const handleCategoryClick = (id: number, title: string) => {
    const categoryIndex = selectedCategories.findIndex((cat) => cat.id === id);
    if (categoryIndex === -1) {
      setSelectedCategories((prevCategories) => [
        ...prevCategories,
        { id, title },
      ]);
    } else {
      setSelectedCategories((prevCategories) =>
        prevCategories.filter((cat) => cat.id !== id)
      );
    }
    setIsDirty(true); // categories have been changed
  };

  const isSaveDisabled = () => {
    // Compare selectedCategories with initialCategories to determine if they're different
    return (
      JSON.stringify(selectedCategories) === JSON.stringify(initialCategories)
    );
  };

  const handleSave = () => {
    setAwaitBtnSave(true);
    updateGenreMovieUser({
      categoriesMovie: selectedCategories,
    });
  };

  return (
    <div className="card__favorites__genre">
      <h3>Vos genres des films</h3>
      <div className="content__favorite__genre">
        {isLoading === false &&
          data.categories.map((genre: TypeMovieCategory) => (
            <CardCategorie
              key={genre.category_id}
              variant="primary"
              title={genre.category_name}
              id={genre.category_id}
              onClick={() =>
                handleCategoryClick(genre.category_id, genre.category_name)
              }
              isSelected={genre.isFavorite !== undefined && genre.isFavorite}
            />
          ))}
      </div>
      <Button
        variant="primary"
        onClick={handleSave}
        isDisabled={!isDirty || isSaveDisabled()}
        isLoading={awaitBtnSave}
      >
        Enregistrer
      </Button>
    </div>
  );
};
export const ContainerPage = () => {
  const { data: session, status } = useSession();
  useAuthRedirect(session, status);

  if (status === "loading") {
    return (
      <main className="page__content">
        <LoaderPage />
      </main>
    );
  } else if (status === "authenticated" && session.user !== undefined) {
    return (
      <main className="container__page ">
        <Suspense fallback={<LoaderPage />}>
          <PageContent name={session.user?.name} image={session.user?.image}>
            <main className="page__profil container__padding">
              {session.user?.name !== undefined &&
                session.user?.image !== undefined && (
                  <>
                    <CardProfilUser
                      name={session.user?.name}
                      image={session.user?.image}
                    />
                    <CardFavoriteGenreMovieUser />
                  </>
                )}
            </main>
            <ToastContainer
              position="bottom-right"
              autoClose={5000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="dark"
            />
          </PageContent>
        </Suspense>
      </main>
    );
  }
  return (
    <main className="page__content">
      <LoaderPage />
    </main>
  );
};
