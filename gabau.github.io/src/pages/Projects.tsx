import { Link } from "react-router-dom";

import BearLogo from '../assets/bear.svg';

const ProjectCard = ({ title, img, link  }: { title: string, img?: string, description?: string, link: string }) => {
    return <li key={title} className="md:w-1/2 lg:w-1/3 h-32 dark:bg-slate-950 bg-slate-500 flex flex-col p-4 rounded-md shadow-sm">
        <Link to={link} >
            <div className="flex flex-row">
                <div className="flex flex-col">
                    {img && <img src={img} width={64} height={64}></img>}
                    {!img && <img src={BearLogo} width={64} height={64} />}
                <div className="w-1/6">
                    {title}
                </div>
                </div>
            </div>
        </Link>
    </li>
}

export default function Projects() {
    return <>
        <ul className="items-center flex flex-col">
            <li>
                <Link to="https://gabau.github.io/ip/">
                    Sariel: Simple java GUI application
                </Link>
            </li>
            
            <ProjectCard title="Sariel" description="Simple Java GUI application" link="https://gabau.github.io/ip/" />
        </ul>
    </>

}