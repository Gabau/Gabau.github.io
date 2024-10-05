// src/components/CodeBlock.js
import { useContext, useEffect, useRef } from 'react';
import hljs from 'highlight.js';
import ThemeContext from '../context/ThemeContext';
import '../styles/atom-one-dark.min.css';
// import './CodeBlock.css';

const CodeBlock = ({ language, code, className }: {language: string, code: string, className?: string}) => {
    const {theme} = useContext(ThemeContext);
    const codeRef = useRef(null);
    useEffect(() => {
        const fn = async () => {
            
            if (codeRef.current) {
                hljs.highlightElement(codeRef.current);
            }
        }
        fn();
      }, [theme]); // Re-run this effect when the theme changes
    

  return (
    <div className={className}>
    <pre>
      <code ref={codeRef} className={`language-${language}`}>{code}</code>
    </pre>
    </div>
  );
};

export default CodeBlock;