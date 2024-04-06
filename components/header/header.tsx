"use client";
import React, { useState } from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfilSession } from "../profilSession/profilSession";

interface ButtonMenuMobileProps {
  setIsActive: React.Dispatch<React.SetStateAction<boolean>>;
  isActive: boolean;
}

const ButtonMenuMobile: React.FC<ButtonMenuMobileProps> = ({
  setIsActive,
  isActive,
}) => {
  const handleClick = () => {
    setIsActive(!isActive);
    const navMobile = document.querySelector(".nav__mobile");
    if (navMobile) {
      navMobile.classList.toggle("nav__mobile_show");
    }
  };

  return (
    <button
      className={`btn btn-menu btn-clic-effect ${isActive && "active"}`}
      onClick={handleClick}
    >
      <span className="line"></span>
      <span className="line"></span>
      <span className="line"></span>
    </button>
  );
};

const HeaderLogo = () => {
  return (
    <div onClick={() => window.location.assign("/")} className="logo-header">
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
  const isActive = (path: string) => {
    const pathRegex = new RegExp(`^${path}(\/|$)`);
    return pathRegex.test(pathname);
  };

  return (
    <nav className="header__nav">
      {navLinks.map((link) => (
        <Link
          key={link.path}
          href={link.path}
          className={
            isActive(link.path)
              ? "active_item_nav nav__item__header"
              : " nav__item__header"
          }
          replace
        >
          {link.title}
        </Link>
      ))}
    </nav>
  );
};
type profilUser = {
  name: string | null;
  image: string | null;
};
function Header({ name, image }: profilUser) {
  const [isNavMobileActive, setIsNavMobileActive] = useState(false);

  return (
    <header className="header__page">
      <HeaderLogo />
      <HeaderNav />
      {name === null ? (
        <ProfilSession
          connected={false}
          nameUser="Norbert"
          profilCover={null}
        />
      ) : (
        <ProfilSession connected={true} nameUser={name} profilCover={image} />
      )}
      <ButtonMenuMobile
        setIsActive={setIsNavMobileActive}
        isActive={isNavMobileActive}
      />
    </header>
  );
}

export default Header;
