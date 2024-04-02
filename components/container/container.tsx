import React from "react";
import "./style.scss";
import { Button } from "../button/button";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import Header from "../header/header";
import NavMobile from "../navMobile/NavMobile";
import Footer from "../footer/footer";
type typeProps = {
  children: React.ReactNode;
};

type typePropsContainer = {
  name: string | null | undefined;
  image: string | null | undefined;
  children: React.ReactNode;
};

export const ContainerScroll: React.FC<typeProps> = ({ children }) => {
  return <main className="container__scroll">{children}</main>;
};

export const PageContent: React.FC<typePropsContainer> = ({
  name,
  image,
  children,
}) => {
  return (
    name !== undefined &&
    image !== undefined && (
      <>
        <Header name={name} image={image} />
        <NavMobile name={name} image={image} />
        {children}
        <Footer />
      </>
    )
  );
};
