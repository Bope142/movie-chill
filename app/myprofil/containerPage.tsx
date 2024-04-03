"use client";
import "./style.scss";
import LoaderPage from "@/components/loader/loader";
import { Suspense, useState } from "react";
import { useSession } from "next-auth/react";
import useAuthRedirect from "@/hooks/useAuthRedirect";
import { PageContent } from "@/components/container/container";
import Image from "next/image";
import { MdModeEdit } from "react-icons/md";
import { useGettAllCategories } from "@/hooks/useCategory";
import { CardCategorie } from "@/components/card/card";
import { TypeMovieCategory } from "@/types/categorie";
import { Button } from "@/components/button/button";
import { FaCheck } from "react-icons/fa6";

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
const CardFavoriteGenreMovieUser = () => {
  const { data: categoriesMovie, isLoading } = useGettAllCategories();
  const [selectedCategories, setSelectedCategories] = useState<
    SelectedCategory[]
  >([]);
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
  };
  return (
    <div className="card__favorites__genre">
      <h3>Vos genres des films</h3>
      <div className="content__favorite__genre">
        {isLoading === false &&
          categoriesMovie.map((genre: TypeMovieCategory) => (
            <CardCategorie
              key={genre.category_id}
              variant="primary"
              title={genre.category_name}
              id={genre.category_id}
              onClick={() =>
                handleCategoryClick(genre.category_id, genre.category_name)
              }
            />
          ))}
      </div>
      <Button variant="primary">Enregistrer</Button>
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
