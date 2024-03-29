import React, { useEffect, useState } from "react";
import "./style.scss";
import { Button } from "../button/button";

interface ModalMessageProps {
  isOpen: boolean;
  children: React.ReactNode;
}

export const ModalMessage: React.FC<ModalMessageProps> = ({
  isOpen,
  children,
}) => {
  const [showContentModal, setShowContentModal] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      timeout = setTimeout(() => {
        setShowContentModal(isOpen);
      }, 0.002);
    } else {
      setShowContentModal(false);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  return (
    <div
      className={`modal-message-overlay  ${isOpen && "overlay-modal-show"} `}
    >
      <div
        className={`modal-content  ${
          showContentModal && "modal-content-open"
        } `}
      >
        <div className="container-content-modal">{children}</div>
      </div>
    </div>
  );
};

interface ModalProps {
  isOpen: boolean;
  videoLink: string;
  onClose: () => void;
}

const ModalVideo: React.FC<ModalProps> = ({ isOpen, videoLink, onClose }) => {
  const [showContentModal, setShowContentModal] = useState<boolean>(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isOpen) {
      timeout = setTimeout(() => {
        setShowContentModal(isOpen);
      }, 0.002);
    } else {
      setShowContentModal(false);
    }

    return () => clearTimeout(timeout);
  }, [isOpen]);

  const handleClose = () => {
    setShowContentModal(false);
    onClose();
  };

  return (
    <div className={`modal__video ${isOpen && "modal__video__show"}`}>
      <div className="video-container">
        <div
          className={`container-modal-video ${
            showContentModal && "container-modal-video-open"
          }`}
        >
          <iframe
            src={videoLink}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          />
          <Button variant="primary" onClick={handleClose}>
            Fermer
          </Button>
        </div>
      </div>
    </div>
  );
};
export default ModalVideo;
