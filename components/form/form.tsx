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
        setErrorMessage("Veuillez saisir une adresse e-mail valide");
        break;
      case "password":
        setErrorMessage("Le mot de passe doit contenir au moins 4 caractères");
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
      valid = inputValue.length >= 4;
    }

    if (typeInput === "text") {
      valid = inputValue.length >= 4;
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
