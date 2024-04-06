/* eslint-disable react/no-unescaped-entities */
import { render } from "@react-email/render";
import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import { APP_TITLE } from "@/lib/constants";

interface Props {
  link: string;
}

export const ResetPasswordEmail = ({ link }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>Réinitialisez votre mot de passe</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>{APP_TITLE}</Text>
            <Text style={text}>Bonjour,</Text>
            <Text style={text}>
              Quelqu'un a récemment demandé un changement de mot de passe pour
              votre compte {APP_TITLE}. Si c'était vous, vous pouvez définir un
              nouveau mot de passe ici :
            </Text>
            <Button style={button} href={link}>
              Cliquez ici pour réinitialiser votre mot de passe
            </Button>
            <Text style={text}>
              Si vous ne souhaitez pas changer votre mot de passe ou si vous
              n'avez pas effectué cette demande, ignorez simplement ce message
              et supprimez-le.
            </Text>
            <Text style={text}>
              Pour garantir la sécurité de votre compte, veuillez ne pas
              transférer cet e-mail à quiconque.
            </Text>
            <Text style={text}>Bonne journée !</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const renderResetPasswordEmail = ({ link }: Props) =>
  render(<ResetPasswordEmail link={link} />);

const main = {
  backgroundColor: "#f6f9fc",
  padding: "10px 0",
};

const container = {
  backgroundColor: "#ffffff",
  border: "1px solid #f0f0f0",
  padding: "45px",
};

const text = {
  fontSize: "16px",
  fontFamily:
    " 'ClashGrotesk-Regular', 'Open Sans', 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue', Helvetica, Arial, 'Lucida Grande', sans-serif",
  fontWeight: "300",
  color: "#000000",
  lineHeight: "26px",
  fontStyle: "italic",
};

const title = {
  ...text,
  fontSize: "22px",
  fontWeight: "700",
  lineHeight: "32px",
};

const button = {
  backgroundColor: "#ffac00",
  border: "1px solid #2d2a2a",
  borderRadius: "4px",
  color: "#000000",
  fontFamily: "'poppins','Open Sans', 'Helvetica Neue', Arial",
  fontSize: "15px",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  width: "210px",
  padding: "14px 25px",
  fontStyle: "italic",
};
