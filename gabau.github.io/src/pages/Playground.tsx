import { Link } from "react-router-dom";
import TypeWriterHeader from "../components/TypeWriterHeader";

const PlayGroundCard = ({
  title,
  description,
  link,
}: {
  title: string;
  description: string;
  link?: string;
}) => {
  return (
    <Link
      to={link ? link : "/playground"}
      className="cursor-pointer m-5 sm:w-64 sm:h-64 w-96 h-96 rounded-md shadow-lg dark:bg-zinc-900 bg-slate-200 hover:dark:bg-black hover:bg-slate-100"
    >
      <div className="p-3">{title}</div>
      <br />
      <div className="m-3 p-3 overflow-auto">{description}</div>
    </Link>
  );
};

// function createRandomCard() {
//   return {
//     title: faker.airline.airline().name,
//     description: faker.lorem.paragraph()
//   };
// }

const playgrounds = [
  {
    title: "Terminal",
    description: "Simple terminal that runs in the browser",
    link: "/play/terminal",
  },
  {
    title: "A Page",
    description: "Just a page",
    link: "/play/apage",
  },
  {

    title: 'Repeating text',
    description: "Simple repeating animation",
    link: "/play/rotating",
  },{
    title: "Animated Sand",
    description: "Simple sand falling in pixi.js",
    link: "/play/sand"
  }
];

export default function PlayGround() {
  return (
    <>
      <TypeWriterHeader title="Playground" timeout={300} className="p-10" />
      <p>For the miscellaneous stuff</p>
      <div className="flex flex-wrap flex-row h-full w-full justify-center">
        {playgrounds.map((v) => {
          return (
            <PlayGroundCard
              key={v.title}
              title={v.title}
              description={v.description}
              link={v.link}
            />
          );
        })}
      </div>
    </>
  );
}
