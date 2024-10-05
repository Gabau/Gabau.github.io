import TypeWriterHeader from "../components/TypeWriterHeader";


export default function About() {
    return (<>
        <TypeWriterHeader title="About me" className="p-10" timeout={400} />
        <p className="p-8">
            A person interested in applications, web servers and tinkering with hardware.
        </p>
    </>)
}