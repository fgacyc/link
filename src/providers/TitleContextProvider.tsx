import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

export const TitleContext = createContext<{
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
  rightIcon: React.ReactNode;
  setRightIcon: Dispatch<SetStateAction<React.ReactNode>>;
  transparent: boolean;
  setTransparent: Dispatch<SetStateAction<boolean>>;
  white: boolean;
  setWhite: Dispatch<SetStateAction<boolean>>;
  fixed: boolean;
  setFixed: Dispatch<SetStateAction<boolean>>;
}>({
  title: "",
  setTitle: () => undefined, // provide explicit return value
  fixed: false,
  setFixed: () => undefined,
  rightIcon: null,
  setRightIcon: () => undefined,
  transparent: false,
  setTransparent: () => undefined,
  white: false,
  setWhite: () => undefined,
});

export const TitleContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [title, setTitle] = useState("");
  const [rightIcon, setRightIcon] = useState<React.ReactNode>(null);
  const [transparent, setTransparent] = useState(false);
  const [white, setWhite] = useState(false);
  const [fixed, setFixed] = useState(false);

  return (
    <TitleContext.Provider
      value={{
        title,
        fixed,
        setFixed,
        setTitle,
        rightIcon,
        setRightIcon,
        transparent,
        setTransparent,
        white,
        setWhite,
      }}
    >
      {children}
    </TitleContext.Provider>
  );
};
