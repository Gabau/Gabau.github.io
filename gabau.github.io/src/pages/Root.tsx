import CodeBlock from "../components/CodeBlock";
import TypeWriterHeader from "../components/TypeWriterHeader";



export default function Root() {

    return <div className="p-10">
        <TypeWriterHeader title={"Gabau"} timeout={300} className="p-10" />
        <div className="flex flex-row items-center justify-center">
        <CodeBlock className="text-left w-1/2 border-separate overflow-clip rounded-2xl" code='#include <iostream>\nusing namespace std;\nint main()\n{\n    cout << "Hello world" << endl \n}' language={"cpp"}/>
        </div>
    </div>
}