import { useEffect, useState } from "react";


export default function TypeWriterHeader({ title, timeout, cursorTimeout , className, delay }: { title: string, 
  timeout: number, 
  cursorTimeout?: number, 
  className?: string,
  delay?: number }) {
  // not ideal but looks ok
  const [typedTitle, setTitle] = useState("");
  const [cursor, setCursor] = useState("|");
  const [startAnimation, setStartAnimation] = useState(false);

  const delayWrapper = delay ? delay : 2000;
  useEffect(() => {
    
    if (!startAnimation) {
      setTimeout(() => {
        setStartAnimation(true);
      }, delayWrapper);
      return;
    }
    
    if (title === typedTitle) {
      return;
    }
    setTimeout(() => setTitle(title.substring(0, typedTitle.length + 1)), timeout);
  }, [startAnimation, typedTitle, title, timeout]);
  useEffect(() => {
    if (typedTitle === "") {
        setTimeout(() => setCursor(cursor === " " ? "|" : " "), cursorTimeout ? cursorTimeout : 300);
        return;
    }
    if (title === typedTitle) {
      setCursor("");
      return;
    }
    setCursor("|");
  }, [cursor, title, typedTitle, cursorTimeout]);
  return (
    <h1 className={`${className}`} >{typedTitle === "" && <>&nbsp;</>}{typedTitle}<span>{cursor}</span></h1>
  )

}
