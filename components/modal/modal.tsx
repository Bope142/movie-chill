import React, { useEffect, useState } from "react";
import "./style.scss";

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
  title: string;
  children: React.ReactNode;
  onClose: () => void;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {isOpen && (
        <div className="modal-overlay" onClick={onClose}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{title}</h3>
              <button className="modal-close-btn" onClick={onClose}>
                Close
              </button>
            </div>
            <div className="modal-body">{children}</div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
