import { useEffect, useState } from 'react'
import './App.css'
import { createHashRouter, Outlet, RouterProvider } from 'react-router-dom'
import ThemeContext from './context/ThemeContext'
import Root from './pages/Root';
import Contact from './pages/Contact';
import ErrorPage from './ErrorPage';
import Navbar from './components/NavBar';
import Projects from './pages/Projects';
import About from './pages/About';

const NavBarWrapper = () => {
  return <>
      <Navbar />
      <div className="w-full h-full">
      <Outlet />
      </div>
  </>
};

function checkPreference(): Theme {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return "dark";  // dark mode
  }
  return "light";
}

function App() {
  const [theme, setTheme] = useState<Theme>(checkPreference());
  
  const router = createHashRouter([
    {
      path: "/",
      element: <NavBarWrapper />,
      errorElement: <ErrorPage />,
      children: [
        {
          path: "/",
          element: <Root />
        },
        {
          path: "/contact",
          element: <Contact />
        },
        {
          path: "/projects",
          element: <Projects />
        }, 
        {
          path: '/about',
          element: <About />
        }
      ]
    }
  ]);
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
