import RepeatingBanner from "../../components/animated/RepeatingBanner";


export default function RepeatingBannerPage() {
    return (
        <div className="flex flex-col items-center w-full h-full flex-grow justify-center">
            <div className="flex flex-row items-center">
                <RepeatingBanner width={50} count={10} duration={0.2} height={30}>
                    <div>
                        Hello World&nbsp;
                    </div>
                </RepeatingBanner>
            </div>
        </div>
    )
}
