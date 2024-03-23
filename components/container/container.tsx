import React from "react";
import "./style.scss";
import { Button } from "../button/button";
import { FaCircleChevronLeft } from "react-icons/fa6";
import { FaCircleChevronRight } from "react-icons/fa6";
import Header from "../header/header";
import NavMobile from "../navMobile/NavMobile";
type typeProps = {
  children: React.ReactNode;
};

export const ContainerScroll: React.FC<typeProps> = ({ children }) => {
  return <main className="container__scroll">{children}</main>;
};

export const HeaderContainer = () => {
  return (
    <>
      <Header />
      <NavMobile />
    </>
  );
};
