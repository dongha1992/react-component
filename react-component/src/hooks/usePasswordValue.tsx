import React from "react";

export default function usePasswordValue(
  ref: React.RefObject<HTMLInputElement>,
  passwordInputName: string
) {
  const [passwordValue, setPasswordValue] = React.useState("");

  React.useEffect(() => {
    const node = ref.current;
    if (node === null) return;

    const form = node?.closest("form");
    const inputs = form?.getElementsByTagName("input");
    if (inputs === undefined) {
      throw new Error(`This element must be a decendent of a form`);
    }

    let passwordInput: HTMLInputElement | undefined;
    for (const element of Array.from(inputs)) {
      if (element instanceof HTMLInputElement) {
        if (element.name === passwordInputName) {
          passwordInput = element;
        }
      }
    }
    if (passwordInput === undefined) {
      throw new Error(`No input found with the name ${passwordInputName}`);
    }

    const handleChange = () => {
      if (passwordInput === undefined) return; // not sure why TS thinks passwordInput could be undefined
      setPasswordValue(passwordInput.value);
    };
    passwordInput.addEventListener("change", handleChange);
    // cleanup
    return () => {
      if (passwordInput === undefined) return; // not sure why TS thinks passwordInput could be undefined
      passwordInput.removeEventListener("change", handleChange);
    };
  });

  return passwordValue;
}
