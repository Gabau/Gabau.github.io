import CodeBlock from "../components/CodeBlock";
import TypeWriterHeader from "../components/TypeWriterHeader";

export default function Contact() {
    return <div className="dark:text-white">
        <TypeWriterHeader title="Contact Information" timeout={100} cursorTimeout={300} className="p-10" />
        <div className="flex flex-col items-center">
        <CodeBlock className="w-1/2 rounded-xl border-separate overflow-clip" code="email='augabriel95@gmail.com'" language="bash" />
        </div>
    </div>
}
