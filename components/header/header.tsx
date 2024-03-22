"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button, ButtonIcon } from "../button/button";
import { FaPlay } from "react-icons/fa";
import { CardMovie } from "../card/card";

const HeaderProfilUser = () => {
  return (
    <div className="profil__user_header">
      <Button variant="primary">Se connecter primary</Button>
      <Button variant="secondary">Se connecter secondary</Button>
      <Button variant="danger">
        Se connecter danger <FaPlay />
      </Button>
      <ButtonIcon variant="primary">
        <FaPlay />
      </ButtonIcon>
      <CardMovie
        variant="primary"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
      <CardMovie
        variant="primary"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="popular"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="popular"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
      <CardMovie
        variant="simple"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={false}
      />
      <CardMovie
        variant="simple"
        id={15}
        title="La démoiselle et le dragon"
        poster="/images/cover/zTYdMdMeMxkPxzLtbkP44HThIAW.jpg"
        isLoading={true}
      />
    </div>
  );
};

const HeaderLogo = () => {
  return (
    <h1 id="headerLogo">
      MOVIE <span>CHILL</span>
    </h1>
  );
};

const HeaderNav = () => {
  const pathname = usePathname();
  const navLinks = [
    { title: "Accueil", path: "/" },
    { title: "Films", path: "/films" },
    { title: "tv lives", path: "/tv" },
    { title: "mes favoris", path: "/favoris" },
    { title: "À propos", path: "/about" },
  ];
  return (
    <nav className="header__nav">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          passHref
          className={
            pathname === link.path
              ? "active_item_nav nav__item__header"
              : " nav__item__header"
          }
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};

function Header() {
  return (
    <header className="header">
      <HeaderLogo />
      <HeaderNav />
      <HeaderProfilUser />
    </header>
  );
}

export default Header;
