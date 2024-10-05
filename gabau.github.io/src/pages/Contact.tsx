import CodeBlock from "../components/CodeBlock";

export default function Contact() {
    return <div className="dark:text-white">
        <h1 className="p-10">
        Contact information
        </h1>
        <div className="flex flex-col items-center">
        <CodeBlock className="w-1/2 rounded-xl border-separate overflow-clip" code="email='augabriel95@gmail.com'" language="bash" />
        </div>
    </div>
}
