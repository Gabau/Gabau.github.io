import { Link } from "react-router-dom";

import BearLogo from '../assets/bear.svg';
import TypeWriterHeader from "../components/TypeWriterHeader";

const ProjectCard = ({ title, img, description, link  }: { title: string, img?: string, description?: string, link: string }) => {
    return <li key={title} className="md:w-1/2 lg:w-1/3 h-32 dark:bg-slate-950 bg-slate-300 flex flex-col p-4 rounded-md shadow-lg">
        <Link reloadDocument to={link} >
            <div className="flex flex-row">
                <div className="flex flex-col">
                    {img && <img src={img} width={64} height={64}></img>}
                    {!img && <img src={BearLogo} width={64} height={64} />}
                <div className="w-1/6 items-center justify-center p-3">
                    {title}
                </div>
                </div>
                <div className="m-5">
                    {description}
                </div>
            </div>
        </Link>
    </li>
}

export default function Projects() {
    return <>
        <TypeWriterHeader className="p-10" title="Projects" timeout={1000} />
        <ul className="items-center flex flex-col p-8">
            
            <ProjectCard title="Sariel" description="Simple Java GUI application" link="https://gabau.github.io/ip/" />
        </ul>
    </>

}