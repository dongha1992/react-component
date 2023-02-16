import React from "react";
import usePasswordValue from "../../hooks/usePasswordValue";

export default function ConfirmPassword({
  name,
  passwordInputName,
  wasSubmitted,
}: {
  name: string;
  passwordInputName: string;
  wasSubmitted: boolean;
}) {
  const ref = React.useRef<HTMLInputElement>(null);
  const passwordValue = usePasswordValue(ref, passwordInputName);
  const [value, setValue] = React.useState("");
  const [touched, setTouched] = React.useState(false);
  const errorMessage =
    passwordValue !== value ? "password does not match" : null;
  const displayErrorMessage = (wasSubmitted || touched) && errorMessage;

  return (
    <div key={name}>
      <label htmlFor={`${name}-input`}>{name}:</label>{" "}
      <input
        ref={ref}
        id={`${name}-input`}
        name={name}
        type="password"
        onChange={(event) => setValue(event.currentTarget.value)}
        onBlur={() => setTouched(true)}
        pattern="[a-z]{3,10}"
        required
        aria-describedby={displayErrorMessage ? `${name}-error` : undefined}
      />
      {displayErrorMessage ? (
        <span role="alert" id={`${name}-error`} className="error-message">
          {errorMessage}
        </span>
      ) : null}
    </div>
  );
}
