import { useEffect, useState } from 'react'
import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ThemeContext from './context/ThemeContext'
import routes from './routes';
import ModalContext from './context/ModalContext';
import ModalManager from './components/ModalManager';


const themeKey = "gabau-theme";
function checkPreference(): Theme {
  const storedTheme = localStorage.getItem(themeKey);
  if (storedTheme === 'light' || storedTheme === 'dark') {
    return storedTheme;
  }
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    localStorage.setItem(themeKey, "dark");
    return "dark";  // dark mode
  }
  
  localStorage.setItem(themeKey, "light");
  return "light";
}


function App() {
  const [theme, setTheme] = useState<Theme>(checkPreference());
  const [modal, setModal] = useState<ModalTypes>("none");
  const [modalProps, setModalProps] = useState<ModalProps>();
  const router = createHashRouter(routes);
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      
      document.documentElement.setAttribute('data-theme', 'light');
    }
  }, [theme]);

  return (
    <>
    <ModalContext.Provider value={{modal, modalProps, setModalType: (a, b) => {
      setModal(a);
      if (b) setModalProps(b);
    }}}>
      <ModalManager />
      <ThemeContext.Provider value={{theme, setTheme: (v) => {
        setTheme(v);
        localStorage.setItem(themeKey, v);
      }}}>
        <RouterProvider router={router} />
      </ThemeContext.Provider>
      </ModalContext.Provider>
    </>
  )
}

export default App
