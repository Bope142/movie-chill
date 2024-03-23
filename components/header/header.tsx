"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfilSession } from "../profilSession/profilSession";

const HeaderLogo = () => {
  return (
    <div className="logo-header">
      Movie <span>Chill</span>
    </div>
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
    <header className="header__page">
      <HeaderLogo />
      <HeaderNav />
      <ProfilSession connected={false} nameUser="Norbert" />
    </header>
  );
}

export default Header;
