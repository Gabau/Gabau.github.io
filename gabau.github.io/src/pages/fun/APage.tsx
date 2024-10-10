import { useRef, useState } from "react";
import "./APage.css";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap/gsap-core";
import { Link } from "react-router-dom";

// Inspired by https://codepen.io/alvarotrigo/pen/eYEqPZa
export default function APage({ values }: { values: string[] }) {
  const [textIndex, setTextIndex] = useState(0);
  const [text2Index, setText2Index] = useState(1);
  const text1Content = values[textIndex % values.length];
  const text2Content = values[text2Index % values.length];
  const text1Ref = useRef<HTMLSpanElement | null>(null);
  const text2Ref = useRef<HTMLSpanElement | null>(null);
  // Can be props
  const morphTime = 3;
  const coolDownTime = 1.0;

  useGSAP(
    () => {
      const tl = gsap.timeline({
        repeat: -1,
        repeatDelay: coolDownTime,
        delay: 2.0
      });
      tl.to(text1Ref.current, { duration: morphTime, opacity: 0.0, ease: "power2.out" });
      
      tl.to(text1Ref.current, { duration: 0.01, onStart: () => {
        setTextIndex((v) => v + 2);
      } })
      tl.to(text1Ref.current, { duration: morphTime, opacity: 1.0, ease: "power2.out", delay: coolDownTime });

      const blurTl = gsap.timeline({
        repeat: -1,
        repeatDelay: coolDownTime,
        delay: 2.0
      });
      blurTl.to(text1Ref.current, { duration: morphTime / 2, filter: 'blur(10px)' });
      blurTl.to(text1Ref.current, { duration: morphTime / 2, filter: 'blur(0px)' });
    },
    { scope: text1Ref }
  );

  useGSAP(() => {
    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: coolDownTime,
      delay: 2.0,
    });
    tl.to(text2Ref.current, { duration: morphTime, opacity: 1.0, ease: "power2.out"  });
    tl.to(text2Ref.current, { duration: morphTime, opacity: 0.0, ease: "power2.out", delay: coolDownTime  });


    tl.to(text2Ref.current, { duration: 0.01, onStart: () => {
      setText2Index((v) => v + 2);
    } });

    
    const blurTl = gsap.timeline({
      repeat: -1,
      repeatDelay: coolDownTime,
      delay: 2.0
    });
    blurTl.to(text2Ref.current, { duration: morphTime / 2, filter: 'blur(10px)' });
    blurTl.to(text2Ref.current, { duration: morphTime / 2, filter: 'blur(0px)' });
  }, { scope: text2Ref });

  return (
    <>
      <div id="APage-container">
        <span id="APage-text1" ref={text1Ref}>
          {text1Content}
        </span>
        <span id="APage-text2" style={{
          opacity: 0.0
        }} ref={text2Ref}>
          {text2Content}
        </span>
      </div>
        <div className="p-3">Inspired by <Link to="https://codepen.io/alvarotrigo/pen/eYEqPZa">https://codepen.io/alvarotrigo/pen/eYEqPZa</Link></div>
      <svg id="APage-filter">
        <defs>
          <filter id="APage-threshold">
            <feColorMatrix
              in="SourceGraphic"
              type="matrix"
              values="1 0 0 0 0
									0 1 0 0 0
									0 0 1 0 0
									0 0 0 255 -140"
            />
          </filter>
        </defs>
      </svg>
    </>
  );
}
