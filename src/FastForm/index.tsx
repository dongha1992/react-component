import React from "react";
import FastInput from "../FastForm/component/FastInput";
import getFieldError from "../utils/getFieldError";
import ConfirmPassword from "../FastForm/component/ConfirmPassword";

export default function FastForm() {
  const [wasSubmitted, setWasSubmitted] = React.useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const fieldValues = Object.fromEntries(formData.entries());

    const formIsValid = Object.values(fieldValues).every(
      (value: any) => !getFieldError(value)
    );

    setWasSubmitted(true);
    if (formIsValid) {
      console.log(`Fast Form Submitted`, fieldValues);
    }
  }

  return (
    <form noValidate onSubmit={handleSubmit}>
      <FastInput name="email" wasSubmitted={wasSubmitted} />
      <FastInput name="password" type="password" wasSubmitted={wasSubmitted} />
      <ConfirmPassword
        name="confirmPassword"
        passwordInputName="password"
        wasSubmitted={wasSubmitted}
      />
      <button type="submit">Submit</button>
    </form>
  );
}
