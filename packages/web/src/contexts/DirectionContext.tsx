import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import { useTranslation } from "react-i18next";

type Direction = "ltr" | "rtl";

interface DirectionContextValue {
  direction: Direction;
}

const DirectionContext = createContext<DirectionContextValue | undefined>(
  undefined,
);

function getDirectionFromLanguage(lang: string): Direction {
  return lang === "ar" ? "rtl" : "ltr";
}

export function DirectionProvider({ children }: { children: ReactNode }) {
  const { i18n } = useTranslation();
  const [direction, setDirection] = useState<Direction>(
    getDirectionFromLanguage(i18n.language),
  );

  useEffect(() => {
    const newDirection = getDirectionFromLanguage(i18n.language);
    setDirection(newDirection);
    document.documentElement.setAttribute("dir", newDirection);
  }, [i18n.language]);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      const newDirection = getDirectionFromLanguage(lng);
      setDirection(newDirection);
      document.documentElement.setAttribute("dir", newDirection);
    };

    i18n.on("languageChanged", handleLanguageChanged);
    return () => {
      i18n.off("languageChanged", handleLanguageChanged);
    };
  }, [i18n]);

  return (
    <DirectionContext.Provider value={{ direction }}>
      {children}
    </DirectionContext.Provider>
  );
}

export function useDirection(): DirectionContextValue {
  const context = useContext(DirectionContext);
  if (context === undefined) {
    throw new Error("useDirection must be used within a DirectionProvider");
  }
  return context;
}
