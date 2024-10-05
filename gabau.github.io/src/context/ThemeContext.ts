import { createContext } from "react";

const ThemeContext = createContext<{theme: Theme, setTheme: (v: Theme) => void}>({
    theme: "light",
    setTheme: () => {

    }
});

export default ThemeContext;