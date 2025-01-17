import { styled } from "@mui/system";
import React, { useEffect, useImperativeHandle, useRef, useState } from "react";
import { CSSTransition } from "react-transition-group";
import { useAppState } from "../state/AppState";

// Styled container for the text with transparent background

export const textUpdater = (text: string) => {
  useAppState.getState().setAiTextOutput(text);
};

const TextContainer = styled("div")(({ theme }) => ({
  backgroundColor: "rgba(0, 0, 0, 0.5)", // Semi-transparent background
  color: "white",
  padding: theme.spacing(2),
  margin: theme.spacing(2),
  borderRadius: theme.shape.borderRadius,
  maxWidth: "80%",
  // margin: "auto",
  fontSize: "1.2rem",
  textAlign: "center",
  overflow: "hidden",
}));

// StreamingText component
const StreamingText = React.forwardRef((props, ref) => {
  const [visible, setVisible] = useState(true);

  const { aiTextOutput } = useAppState();

  return (
    <CSSTransition
      in={visible}
      timeout={1000} // Transition duration
      classNames="fade"
      unmountOnExit
    >
      <TextContainer>{aiTextOutput}</TextContainer>
    </CSSTransition>
  );
});

export default StreamingText;
