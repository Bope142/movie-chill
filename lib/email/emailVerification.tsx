/* eslint-disable react/no-unescaped-entities */
import * as React from "react";
import {
  Body,
  Container,
  Head,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

import { render } from "@react-email/render";

interface Props {
  code: string;
}

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

const codePlaceholder = {
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
  padding: "14px 7px",
};

export const VerificationCodeEmail = ({ code }: Props) => {
  return (
    <Html>
      <Head />
      <Preview>
        Vérifiez votre adresse e-mail pour finaliser votre inscription à MOVIE
        CHILL
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section>
            <Text style={title}>MOVIE CHILL</Text>
            <Text style={text}>Salut 👋,</Text>
            <Text style={text}>
              Nous vous remercions de vous être inscrit(e) à{" "}
              <Text style={title}>MOVIE CHILL</Text>. Pour finaliser votre
              inscription, veuillez vérifier votre adresse e-mail en utilisant
              le code de vérification suivant :
            </Text>
            <Text style={codePlaceholder}>{code}</Text>

            <Text style={text}>
              Ce code est nécessaire pour activer votre compte et assurer la
              sécurité de votre compte <Text style={title}>MOVIE CHILL</Text>.
            </Text>
            <Text style={text}>
              Si vous n'avez pas créé de compte sur MOVIE CHILL, veuillez
              ignorer cet e-mail.
            </Text>
            <Text style={text}>Bonne journée !😉</Text>
            <Text style={text}>Cordialement, L'équipe MOVIE CHILL</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

export const renderVerificationCodeEmail = ({ code }: Props) =>
  render(<VerificationCodeEmail code={code} />);
