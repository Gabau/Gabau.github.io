import { Link } from "react-router-dom";

import TypeWriterHeader from "../components/TypeWriterHeader";

const ProjectCard = ({ title, img, description, link  }: { title: string, img?: string, description?: string, link: string }) => {
    return <li key={title} className="md:w-1/2 lg:w-1/3 h-32 m-3 dark:bg-slate-800 hover:dark:bg-slate-500 hover:bg-slate-400 bg-slate-300 flex flex-col p-4 rounded-md shadow-lg">
        <Link reloadDocument to={link} >
            <div className="flex flex-row">
                <div className="flex flex-col w-2/12 overflow-auto text-center">
                    {img && <img src={img} width={64} height={64}></img>}
                    {!img && <img src={'/logo.png'} width={64} height={64} />}
                    <div className="w-[64px] py-2 items-center justify-center">
                        {title}
                    </div>
                </div>
                <div className="m-5 overflow-auto">
                    {description}
                </div>
            </div>
        </Link>
    </li>
}

export default function Projects() {
    return <>
        <TypeWriterHeader className="p-10" title="Projects" timeout={300} />
        <ul className="items-center flex flex-col p-8">
            <ProjectCard title="Peerprep" description="Monolithic web application using t3 stack" link="https://github.com/CS3219-AY2324S1/ay2324s1-course-assessment-g39" />
            <ProjectCard title="Sariel" description="Simple Java GUI application" link="https://gabau.github.io/ip/" />
        </ul>
    </>

}