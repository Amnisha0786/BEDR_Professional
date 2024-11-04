import React from "react";

interface LimitedTextProps {
  textLength?: number;
  className?: string;
  text: string;
}

const LimitedText: React.FC<LimitedTextProps> = ({
  textLength = 0,
  className = "",
  text,
}) => {
  if (textLength > 0 && text?.length > textLength) {
    return (
      <span title={text} className={className}>
        {text.slice(0, textLength) + "..."}
      </span>
    );
  }
  return <span className={className}>{text}</span>;
};

export default LimitedText;
