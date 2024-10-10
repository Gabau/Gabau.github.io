import Root from "./pages/Root";
import Contact from './pages/Contact';
import ErrorPage from './ErrorPage';
import Projects from './pages/Projects';
import About from './pages/About';
import Chess from './components/games/Chess';
import PlayGround from './pages/Playground';
import NavBarWrapper from "./components/NavBarWrapper";
import Terminal from "./components/Terminal";
import TypeWriterHeader from "./components/TypeWriterHeader";
import APage from "./pages/fun/APage";
import RepeatingBannerPage from "./pages/fun/RepeatingBannerPage";
import AnimatedSandPage from "./pages/fun/AnimatedSandPage";





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
        element: (
          <div>
            <TypeWriterHeader title="Terminal" timeout={300} className="p-10" />
            <p>Basic unix-like terminal. No persistant storage</p>
            <Terminal />
          </div>
        )
      },
      {
        path: 'play/apage',
        element: <APage values={[
          "We're no strangers",
          "to love",
          "you know the rules",
          "and so do I",
          "A full commitment's",
          "what i'm thinking of",
          "You wouldn't get this",
          "from any other guy",
          "I just wanna tell you",
          "How I'm feeling",
          "Gotta make you understand",
          "Chorus :)",
          "Never gonna give you up",
          "Never gonna let you down",
          "Never gonna run around and desert you",
          "Never gonna say goodbye",
          "Never gonna tell a lie and hurt you"
        ]} />
      },
      {

        path: '/play/rotating',
        element: <RepeatingBannerPage />
      },
      {
        path: "/play/sand",
        element: <AnimatedSandPage />
      }
    ]
  }
];

export default routes;