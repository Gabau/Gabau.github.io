import { useEffect, useState } from 'react'
import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ThemeContext from './context/ThemeContext'
import routes from './routes';
import ModalContext from './context/ModalContext';
import ModalManager from './components/ModalManager';



function checkPreference(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";  // dark mode
  }
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
      <ThemeContext.Provider value={{theme, setTheme}}>
        <RouterProvider router={router} />
      </ThemeContext.Provider>
      </ModalContext.Provider>
    </>
  )
}

export default App
