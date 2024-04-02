import { ContainerPage } from "./containerPage";

export const metadata = {
  title: "Détails du Film - Explorez en profondeur sur Movie Chill",
  description:
    "Plongez dans l'univers captivant d'un film avec Movie Chill. Découvrez les détails fascinants, les critiques, les acteurs principaux et bien plus encore. Explorez chaque aspect de votre film préféré et profitez d'une expérience immersive, où chaque détail compte!",
};

function MovieDetailPage({ params }: { params: Record<string, string> }) {
  const id = parseInt(params.id);
  return <ContainerPage idMovie={id} />;
}

export default MovieDetailPage;
