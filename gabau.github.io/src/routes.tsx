import Root from "./pages/Root";
import Contact from './pages/Contact';
import ErrorPage from './ErrorPage';
import Projects from './pages/Projects';
import About from './pages/About';
import Chess from './components/games/Chess';
import PlayGround from './pages/Playground';
import NavBarWrapper from "./components/NavBarWrapper";
import Terminal from "./components/Terminal";




const routes = [
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
      },
      {
        path: '/chess',
        element: <Chess />
      },
      {
        path: '/playground',
        element: <PlayGround />
      },
      {
        path: '/play/terminal',
        element: <Terminal />
      }
    ]
  }
];

export default routes;