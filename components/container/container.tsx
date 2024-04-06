/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [isScrollable, setIsScrollable] = useState<boolean>(false);
  const [reachedLeftLimit, setReachedLeftLimit] = useState<boolean>(true);
  const [reachedRightLimit, setReachedRightLimit] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (containerRef.current) {
        const container = containerRef.current;
        setIsScrollable(container.scrollWidth > container.clientWidth);
        setReachedLeftLimit(container.scrollLeft === 0);
        setReachedRightLimit(
          container.scrollLeft >= container.scrollWidth - container.clientWidth
        );
      }
    };

    if (containerRef.current) {
      const container = containerRef.current;
      setIsScrollable(container.scrollWidth > container.clientWidth);
      container.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (containerRef.current) {
        const container = containerRef.current;
        container.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

  const handleScrollLeft = () => {
    if (!isScrollable || !containerRef.current) return;

    const container = containerRef.current;
    if (container.scrollLeft > 0) {
      container.scrollLeft -= 100;
    }
  };

  const handleScrollRight = () => {
    if (!isScrollable || !containerRef.current) return;

    const container = containerRef.current;
    if (container.scrollLeft < container.scrollWidth - container.clientWidth) {
      container.scrollLeft += 100;
    }
  };

  return (
    <main className="container__scroll" ref={containerRef}>
      {!isMobile && (
        <button
          className={`btn btn-scroll btn-secondary btn-left ${
            reachedLeftLimit ? "hidden" : ""
          }`}
          onClick={handleScrollLeft}
        >
          <FaCircleChevronLeft />
        </button>
      )}
      {children}
      {!isMobile && (
        <button
          className={`btn btn-scroll btn-secondary btn-right ${
            reachedRightLimit ? "hidden" : ""
          }`}
          onClick={handleScrollRight}
        >
          <FaCircleChevronRight />
        </button>
      )}
    </main>
  );
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
