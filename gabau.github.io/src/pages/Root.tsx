import CodeBlock from "../components/CodeBlock";



export default function Root() {
    return <div className="p-10">
        <h1 className="p-10">
            Gabau
        </h1>
        <div className="flex flex-row items-center justify-center">
        <CodeBlock className="w-1/2 border-separate overflow-clip rounded-2xl" code='cout << "Hello world" << endl' language={"cpp"}/>
        </div>
    </div>
}