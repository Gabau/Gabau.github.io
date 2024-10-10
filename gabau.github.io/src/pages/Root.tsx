import FuzzyText from "../components/animated/FuzzyText";
import CodeBlock from "../components/CodeBlock";



export default function Root() {
    return <div className="p-10">
        <FuzzyText text="Gabau" />
        <div className="flex flex-row items-center justify-center">
            <CodeBlock className="sm:w-1/2 text-left w-full border-separate overflow-clip rounded-2xl" code='#include <iostream>\nusing namespace std;\nint main()\n{\n    cout << "Hello world" << endl \n}' language={"cpp"} />
        </div>
    </div>
}