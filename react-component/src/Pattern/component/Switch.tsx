import * as React from "react";
import "../style/index.css";

const noop = () => {};

interface SwitchProps {
  on?: boolean;
  onClick: () => void;
  "aria-label"?: string;
  className?: string;
}

class Switch extends React.Component<SwitchProps> {
  render() {
    const {
      on,
      className = "",
      "aria-label": ariaLabel,
      onClick,
      ...props
    } = this.props;
    const btnClassName = [
      className,
      "toggle-btn",
      on ? "toggle-btn-on" : "toggle-btn-off",
    ]
      .filter(Boolean)
      .join(" ");
    return (
      <label aria-label={ariaLabel || "Toggle"} style={{ display: "block" }}>
        <input
          className="toggle-input"
          type="checkbox"
          checked={on}
          onChange={noop}
          onClick={onClick}
          data-testid="toggle-input"
        />
        <span className={btnClassName} {...props} />
      </label>
    );
  }
}

export { Switch };
