import { ContainerPage } from "./containerPage";

export const metadata = {
  title: "Choisir un nouveau mot de passe - Movie Chill",
  description:
    "Choisissez un nouveau mot de passe pour votre compte Movie Chill. Assurez-vous de choisir un mot de passe sécurisé pour protéger votre compte.",
};

export default function ResetPasswordPage({
  params,
}: {
  params: Record<string, string>;
}) {
  const token = params.token;
  return <ContainerPage token={token} />;
}
