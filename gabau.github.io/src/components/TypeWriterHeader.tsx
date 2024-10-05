import { useEffect, useState } from "react";


export default function TypeWriterHeader({ title, timeout, cursorTimeout , className }: { title: string, timeout: number, cursorTimeout?: number, className?: string }) {
  // not ideal but looks ok
  const [typedTitle, setTitle] = useState(title[0]);
  const [cursor, setCursor] = useState("");
  useEffect(() => {
    if (title === typedTitle) {
      return;
    }
    setTimeout(() => setTitle(title.substring(0, typedTitle.length + 1)), timeout);
  }, [typedTitle, title, timeout]);
  useEffect(() => {
    if (title === typedTitle) {
      setCursor("");
      return;
    }
    setTimeout(() => setCursor(cursor === " " ? "|" : " "), cursorTimeout ? cursorTimeout : 300);
  }, [cursor, title, typedTitle, cursorTimeout]);
  return (
    <h1 className={`${className}`} >{typedTitle}<span className="absolute">{cursor}</span></h1>
  )

}
