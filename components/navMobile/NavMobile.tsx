"use client";
import React from "react";
import "./style.scss";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ProfilSession } from "../profilSession/profilSession";
type profilUser = {
  name: string | null;
  image: string | null;
};
function NavMobile({ name, image }: profilUser) {
  const pathname = usePathname();
  const navLinks = [
    { title: "Accueil", path: "/" },
    { title: "Films", path: "/films" },
    { title: "tv lives", path: "/tv" },
    { title: "mes favoris", path: "/favoris" },
    { title: "À propos", path: "/about" },
  ];
  const isActive = (path: string) => {
    if (path === "/") return pathname === path;
    const modifiedPath = path.substring(1);
    return pathname.includes(modifiedPath);
  };
  return (
    <div className="nav__mobile">
      <div className="link__nav">
        {navLinks.map((link) => (
          <Link
            key={link.path}
            href={link.path}
            passHref
            className={
              isActive(link.path)
                ? "active-item nav__item__mobile"
                : " nav__item__mobile"
            }
          >
            {link.title}
          </Link>
        ))}
      </div>
      {name === null ? (
        <ProfilSession
          connected={false}
          nameUser="Norbert"
          profilCover={null}
        />
      ) : (
        <ProfilSession connected={true} nameUser={name} profilCover={image} />
      )}
    </div>
  );
}

export default NavMobile;
