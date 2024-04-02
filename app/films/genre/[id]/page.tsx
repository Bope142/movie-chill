import { ContainerPage } from "./containerPage";

export const metadata = {
  title: "Films par Genre - Explorez les fims de tout genre sur Movie Chill",
  description:
    "Découvrez une sélection captivante de films sur Movie Chill. Plongez dans un monde de divertissement où chaque film vous transporte dans une aventure unique. Trouvez facilement des films correspondant à vos goûts et profitez d'une expérience cinématographique exceptionnelle, spécialement conçue pour les amateurs de {nom du genre}!",
};

export default function MoviePopular({
  params,
}: {
  params: Record<string, string>;
}) {
  const id = parseInt(params.id);
  return <ContainerPage idCategorie={id} />;
}
