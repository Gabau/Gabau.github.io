import Navbar from "./components/NavBar";

export default function ErrorPage() {
    
    return <>
        <Navbar />
        <div className="h-full w-full flex-col items-center">
            <h1>
        404 Error
        </h1>
        <p>Page does not exist</p>
        </div>
    </>
}
