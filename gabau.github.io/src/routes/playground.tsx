import Terminal from "../components/Terminal";
import TypeWriterHeader from "../components/TypeWriterHeader";
import AnimatedSandPage from "../pages/fun/AnimatedSandPage";
import APage from "../pages/fun/APage";
import PongPage from "../pages/fun/PongPage";
import RepeatingBannerPage from "../pages/fun/RepeatingBannerPage";
import SortVisPage from "../pages/fun/SortVisPage";

export const playgroundRoutes = [
  {
    path: "terminal",
    title: "Terminal",
    description: "Simple terminal that runs in the browser",
    element: (
      <div>
        <TypeWriterHeader title="Terminal" timeout={300} className="p-10" />
        <p>Basic unix-like terminal. No persistant storage</p>
        <Terminal />
      </div>
    ),
  },
  {
    path: "apage",
    title: "A page",
    description: "Just a page",
    element: (
      <APage
        values={[
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
          "Never gonna tell a lie and hurt you",
        ]}
      />
    ),
  },
  {
    path: "rotating",
    title: "Repeating Text",
    description: "Simple repeating Text",
    element: <RepeatingBannerPage />,
  },
  {
    path: "sand",
    title: "Sand",
    description: "Simple sand falling in pixi.js",
    element: <AnimatedSandPage />,
  },
  {
    path: "pong",
    title: "Pong",
    description: "Pong game",
    element: <PongPage />,
  },
  {
    path: "sort",
    title: "Sort visualisation",
    description: "Simple sorting visualisation of quick sort. It is pure quick sort which makes it slow on sorted array",
    element: <SortVisPage />
  },
];


