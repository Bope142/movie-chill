/* eslint-disable react/no-unescaped-entities */

import Link from "next/link";
import "../public/style/main.scss";

const NotFoundPage = () => {
  return (
    <main className=" container__padding" id="notFoundPage">
      {/* <Image src={"/public/images/404.svg"} width={100} height={100} alt=""/> */}
      <h1>Erreur 404</h1>
      <p>Désolé, la page que vous recherchez semble introuvable.</p>
      <p>
        Vous pouvez retourner à la <Link href="/">page d'accueil</Link> pour
        continuer votre navigation.
      </p>
    </main>
  );
};

export default NotFoundPage;
