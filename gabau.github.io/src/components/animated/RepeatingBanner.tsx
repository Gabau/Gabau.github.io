import { useGSAP } from "@gsap/react"
import { gsap } from "gsap/gsap-core";
import { useRef } from "react";

/**
 * Idea: translate div in the banner left or right
 * @returns 
 */
export default function RepeatingBanner({
    children,
    count,
    width,
    height,
    duration
}: {
    children: JSX.Element,
    width: number,
    height: number,
    count?: number,
    duration?: number
}) {
    const movingRef = useRef<HTMLDivElement | null>(null);
    // const movingRef1 = useRef<HTMLDivElement | null>(null);
    // const movingRef2 = useRef<HTMLDivElement | null>(null);    
    const wrappedCount = (count ?? 5) * 2;
    const singleDuration = duration ?? 1;
    useGSAP(() => {
        const tl = gsap.timeline({ repeat: -1 });
        tl.to(movingRef.current, {
            x: `-50%`,
            duration: 0.01
        })
        tl.to(
            movingRef.current,
            {
                x: '0%',
                duration: singleDuration * wrappedCount,
                ease: 'none',
            }
        )
    }, {
        scope: movingRef
    });



    return <div className={`relative overflow-clip text-nowrap z-10`} style={{ width, height }}>
        <div className="flex flex-row absolute" ref={movingRef}>
            {Array.from(Array(wrappedCount).keys()).map((i) => (
                <div key={i}>
                    {children}
                </div>
            ))}
        </div>
    </div>
}
