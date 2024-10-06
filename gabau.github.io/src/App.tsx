import { useEffect, useState } from 'react'
import './App.css'
import { createHashRouter, RouterProvider } from 'react-router-dom'
import ThemeContext from './context/ThemeContext'
import routes from './routes';



function checkPreference(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";  // dark mode
  }
  return "light";
}

function App() {
  const [theme, setTheme] = useState<Theme>(checkPreference());
  
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
      <ThemeContext.Provider value={{theme, setTheme}}>
        <RouterProvider router={router} />
      </ThemeContext.Provider>
    </>
  )
}

export default App
