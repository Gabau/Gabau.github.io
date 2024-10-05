// src/components/CodeBlock.js
import { useEffect, useRef } from "react";
import hljs from "highlight.js";
import "../styles/atom-one-dark.min.css";
// import './CodeBlock.css';

const CodeBlock = ({
  language,
  code,
  className,
}: {
  language: string;
  code: string;
  className?: string;
}) => {
  const codeRef = useRef(null);
  useEffect(() => {
    const fn = async () => {
      if (codeRef.current) {
        hljs.highlightElement(codeRef.current);
      }
    };
    fn();
  }, [code]); // Re-run this effect when the theme changes
  const data: string[] = code.split("\\n");
  return (
    <div className={className}>
      <pre>
        <code ref={codeRef} className={`language-${language}`}>
            {data.join('\n')}
        </code>
      </pre>
    </div>
  );
};

export default CodeBlock;
