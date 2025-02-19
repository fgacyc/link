import {
  createContext,
  type Dispatch,
  type SetStateAction,
  useState,
} from "react";

export const TitleContext = createContext<{
  title: string;
  setTitle: Dispatch<SetStateAction<string>>;
}>({
  title: "",
  setTitle: () => undefined, // provide explicit return value
});

export const TitleContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [title, setTitle] = useState("");

  return (
    <TitleContext.Provider value={{ title, setTitle }}>
      {children}
    </TitleContext.Provider>
  );
};
