import React from "react";
import "./style.scss";
import { IoLogoLinkedin } from "react-icons/io";
import { AiFillInstagram } from "react-icons/ai";
import { FaFacebookSquare } from "react-icons/fa";
import { FaGithub } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer__page">
      <p>
        © 2024{" "}
        <div className="logo">
          Movie <span>Chill</span>
        </div>
        . Designed with ❤️ for you by <a href="">Norbert Yemuang</a>
      </p>
      <div className="social__media">
        <a href="">
          {" "}
          <IoLogoLinkedin />
        </a>
        <a href="">
          {" "}
          <AiFillInstagram />
        </a>
        <a href="">
          {" "}
          <FaFacebookSquare />
        </a>
        <a href="">
          {" "}
          <FaGithub />
        </a>
      </div>
    </footer>
  );
}

export default Footer;
