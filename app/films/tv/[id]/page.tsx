import { ContainerPage } from "./containerPage";

export const metadata = {
  title: "Détails de l'Émission TV - Explorez en profondeur sur Movie Chill",
  description:
    "Découvrez les détails fascinants d'une émission de télévision sur Movie Chill. Plongez dans l'univers captivant de {nom de l'émission}, avec des informations sur les épisodes, les critiques, les acteurs principaux et bien plus encore. Explorez chaque aspect de votre émission préférée et profitez d'une expérience de divertissement immersive, où chaque détail compte!",
};

export default function MovieTvDetailPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const id = parseInt(params.id);

  return <ContainerPage idMovie={id} />;
}
