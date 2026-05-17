
import React, {
  createContext,
  useEffect,
  useState,
} from "react";

export const ThemeContext = createContext();

const ThemeProvider = ({ children }) => {

  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "light"
  );


  useEffect(() => {

    document.body.className = theme;

    localStorage.setItem("theme", theme);

  }, [theme]);


  const toggleTheme = () => {

    setTheme((prev) =>
      prev === "light"
        ? "dark"
        : "light"
    );
  };


  return (
    <ThemeContext.Provider
      value={{
        theme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeProvider;
