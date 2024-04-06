"use client";
import React from "react";
import "./style.scss";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer__page">
      <div className="text-footer">
        © {new Date().getFullYear()}
        <div className="logo">
          Movie <span>Chill</span>
        </div>
        . Designed with ❤️ for you by{" "}
        <a href="https://www.linkedin.com/in/norbert-yemuang-bope-69662318a">
          Norbert Yemuang
        </a>
      </div>
      <div className="social__media">
        <a href="https://www.linkedin.com/in/norbert-yemuang-bope-69662318a">
          <IoLogoLinkedin />
        </a>
        <a href="https://www.instagram.com/norbert_yemuang_bope_officiel/">
          <AiFillInstagram />
        </a>
        <a href="https://web.facebook.com/profile.php?id=100063692963866">
          <FaFacebookSquare />
        </a>
        <a href="https://github.com/Bope142/movie-chill.git">
          <FaGithub />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
