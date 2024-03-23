"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfilSession } from "../profilSession/profilSession";

function NavMobile() {
  const pathname = usePathname();
  const navLinks = [
    { title: "Accueil", path: "/" },
    { title: "Films", path: "/films" },
    { title: "tv lives", path: "/tv" },
    { title: "mes favoris", path: "/favoris" },
    { title: "À propos", path: "/about" },
  ];
  return (
    <div className="nav__mobile">
      <div className="link__nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            passHref
            className={
              pathname === link.path
                ? "active-item nav__item__mobile"
                : " nav__item__mobile"
            }
          >
            {link.title}
          </Link>
        ))}
      </div>
      <ProfilSession connected={false} nameUser="Norbert" />
    </div>
  );
}

export default NavMobile;
