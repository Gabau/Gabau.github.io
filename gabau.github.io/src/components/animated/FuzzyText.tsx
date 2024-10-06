import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { useRef } from "react";
import './FuzzyText.css';

export default function FuzzyText({
  text,
  className,
  fuzzyOnEnter
}: {
  text: string;
  className?: string;
  fuzzyOnEnter?: boolean;
}) {
  const element = useRef<HTMLHeadingElement | null>(null);
  
  useGSAP(
    () => {
      if (element == null) {
        return;
      }
      element.current!.addEventListener(fuzzyOnEnter ? "mouseenter" : "mouseleave", () => {
        gsap.to(".distort feDisplacementMap", {
          attr: {
            scale: 100
          },
          duration: 1,
          ease: "circ.out",
        });
        gsap.to(".distort feTurbulence", {
          duration: 1,
          attr: {
            baseFrequency: "2.08 .08",
          },
          ease: "circ.out",
        });
        gsap.to(element.current!, {
          duration: 1,
          fontVariationSettings: "'wght' 650",
          ease: "back.out",
        });
      });
      element.current!.addEventListener(fuzzyOnEnter ? "mouseleave" : "mouseenter", () => {
        gsap.to(".distort feDisplacementMap", {
          attr: {
            scale: 0
          },
          duration: 1,
          ease: "circ.out",
        });
        gsap.to(".distort feTurbulence", {
          duration: 1,
          attr: {
            baseFrequency: "2.01 .01",
          },
          ease: "circ.out",
        });
        gsap.to(
          element.current,
          {
            fontVariationSettings: "'wght' 700",
            ease: "back.out",
            duration: 1
          },
        );
      });
    },
    { scope: element }
  );

  return (
    <div className="flex flex-row items-center justify-center">
      <h1 ref={element} className={`p-10 font-extrabold ${className ?? ''} fuzzy-h1 dark:selection:bg-black selection:bg-gray-500`}>
        {text}
      </h1>
      <svg className="distort absolute top-32 w-0 h-0 pointer-events-none">
        <filter id="distortionFilter">
          <feTurbulence
            type="fractalNoise"
            baseFrequency="2.01 .01"
            numOctaves="5"
            seed="2"
            stitchTiles="noStitch"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            result="noise"
          ></feTurbulence>
          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale={fuzzyOnEnter ? "0" : "100"}
            xChannelSelector="R"
            yChannelSelector="B"
            x="0%"
            y="0%"
            width="100%"
            height="100%"
            filterUnits="userSpaceOnUse"
          ></feDisplacementMap>
        </filter>
      </svg>
    </div>
  );
}
