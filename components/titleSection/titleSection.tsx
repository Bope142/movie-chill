import React from "react";
import "./style.scss";
import Link from "next/link";
import { IoIosArrowForward } from "react-icons/io";

type propsTitleSection = {
  variant: "title-large" | "title-small";
  title: string;
  linkMore?: string;
};

export const TitleSection: React.FC<propsTitleSection> = ({
  variant,
  title,
  linkMore,
}) => {
  return (
    <div className="title__section">
      <span className={variant}>{title}</span>
      {linkMore && (
        <Link href={linkMore}>
          <IoIosArrowForward />
        </Link>
      )}
    </div>
  );
};
