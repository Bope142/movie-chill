"use client";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useEffect, useState } from "react";
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

type propsCardProfil = {
  image: string | null;
  name: string | null;
};
interface SelectedCategory {
  id: number;
  title: string;
}
const CardProfilUser = ({ image, name }: propsCardProfil) => {
  return (
    <div className="card__profil__user">
      <div className="content__image__profil">
        {image !== null && (
          <Image
            src={image}
            width={100}
            height={100}
            alt=""
            className="img-fluid"
            priority={true}
          />
        )}

        <div className="container__action__pic">
          <Button variant="primary" isDisabled={true}>
            <FaCheck />
          </Button>
          <Button variant="secondary">
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
