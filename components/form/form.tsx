"use client";
import React, { useEffect, useState } from "react";
import "./style.scss";

type TypePropsInputBoxForm = {
  label: string;
  placeholder: string;
  typeInput: string;
  nameInput: string;
  required?: boolean;
  onValidityChange?: (isValid: boolean) => void;
};

export function InputBoxForm({
  label,
  placeholder,
  typeInput,
  nameInput,
  required,
  onValidityChange,
}: TypePropsInputBoxForm) {
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isValid, setIsValid] = useState(false); // État pour suivre la validité du champ

  useEffect(() => {
    switch (typeInput) {
      case "email":
        setErrorMessage("Adresse e-mail invalide.");
        break;
      case "password":
        setErrorMessage(
          "Mot de passe invalide. Il doit contenir au moins 8 caractères avec au moins une lettre et un chiffre."
        );
        break;
      case "text":
        setErrorMessage("Ce champ doit contenir au moins 4 caractères");
        break;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const validateInput = (inputValue: string) => {
    let valid = true;
    if (required) {
      valid = !!inputValue.trim();
    }

    if (typeInput === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      valid = emailRegex.test(inputValue);
    }

    if (typeInput === "password") {
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[^\s]{8,20}$/;
      valid = inputValue.length < 8 ? false : true;
    }

    if (typeInput === "text") {
      const usernameRegex = /^[a-zA-Z0-9._-]{4,20}$/;
      valid = usernameRegex.test(inputValue);
    }

    setIsValid(valid);
    if (onValidityChange) {
      onValidityChange(valid);
    }
    //onValidityChange(valid);
    return valid;
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setShowErrorMessage(false);
    validateInput(inputValue);
  };

  const handleInputBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    validateInput(inputValue);
    setShowErrorMessage(!validateInput(inputValue));
  };

  return (
    <div className="box-form">
      <div className={`input_box_form ${showErrorMessage && "invalid-data"}`}>
        <label htmlFor={nameInput}>{label}</label>
        <input
          type={typeInput}
          className="input__form__box"
          placeholder={placeholder}
          name={nameInput}
          id={nameInput}
          required={required ? true : undefined}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
        />
      </div>

      <span className={`error-message ${showErrorMessage && "show-error-msg"}`}>
        {errorMessage}
      </span>
    </div>
  );
}
