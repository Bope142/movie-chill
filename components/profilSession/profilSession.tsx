/* eslint-disable react/no-unescaped-entities */
"use client";
import React from "react";
import "./style.scss";
import Image from "next/image";
import { Button, ButtonLink } from "../button/button";
import { IoIosLogOut } from "react-icons/io";
import { signOut } from "next-auth/react";
import Link from "next/link";
type propsProfil = {
  connected: boolean;
  profilCover?: string | null;
  nameUser?: string;
};

export const ProfilSession: React.FC<propsProfil> = ({
  connected,
  profilCover,
  nameUser,
}) => {
  if (connected) {
    return (
      <div className="profil__session">
        <Link href={"/myprofil"} className="profil">
          {profilCover ? (
            <Image
              src={profilCover}
              alt={`profil picture ${nameUser}`}
              className="img-fluid poster-movie"
              width={100}
              height={100}
            />
          ) : (
            <p>{nameUser && nameUser.substring(0, 2).toUpperCase()}</p>
          )}
        </Link>
        <Button
          variant="danger"
          onClick={() => {
            signOut();
          }}
        >
          <IoIosLogOut />
        </Button>
      </div>
    );
  } else {
    return (
      <div className="profil__session">
        <ButtonLink variant="secondary" href="/signup">
          S'inscrire
        </ButtonLink>
        <ButtonLink variant="primary" href="/login">
          Connexion
        </ButtonLink>
      </div>
    );
  }
};
