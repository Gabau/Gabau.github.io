import { useEffect, useRef, useState } from "react";
import useModals from "../hooks/useModals";
import hljs from "highlight.js";
import "../styles/atom-one-dark.min.css";
const ModalWrapper = ({
  children,
  onClose,
}: {
  children: false | JSX.Element;
  onClose: () => void;
}) => {
  return (
    <div
      className="flex flex-col items-center justify-center fixed top-0 left-0 w-full h-full bg-black/50 z-10"
      onClick={() => onClose()}
    >
      <div className="flex flex-row items-center justify-center w-full h-full">
        {children}
      </div>
    </div>
  );
};

// todo
const TextEditor = ({ file }: { file?: VirtualFile }) => {
  const [data, setData] = useState("");
  const codeRef = useRef(null);
  const preRef = useRef(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const textareaRef = useRef<any | null>(null);
  const fileData = file?.data;
  const [scroll, setScroll] = useState(0);
  useEffect(() => {
    if (fileData !== undefined) {
      setData(fileData);
    }
  }, []);

  useEffect(() => {
    if (codeRef.current) {
      const v = hljs.highlightAuto(data);
      (codeRef.current as HTMLElement).innerHTML = v.value;
    }
    if (file) {
      file.data = data;
    }
  }, [data]);

  useEffect(() => {
    if (preRef.current) {
      (preRef.current as HTMLPreElement).scrollTop = scroll;
    }
    if (textareaRef.current) {
      (textareaRef.current as HTMLTextAreaElement).scrollTop = scroll;
    }
  }, [scroll]);
  return (
    <div
      className="dark:bg-stone-900 bg-slate-100 w-4/5 h-2/3 z-20 rounded-lg shadow-lg"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
      }}
    >
      <textarea
        className="dark:bg-slate-600 bg-slate-300 w-full h-1/2 p-3 overflow-auto"
        onChange={(e) => {
          setData(e.target.value);
        }}
        
        onScroll={(e) => {
          const m = (e.target as HTMLTextAreaElement).scrollTop;
          setScroll(m);
        }}
        ref={textareaRef}
        onKeyDown={(e: React.KeyboardEvent) => {
          if (e.key === "Tab" && !e.shiftKey) {
            e.preventDefault();
            const tab = "    ";
            const value = textareaRef.current!.value;
            const selectionStart = textareaRef.current!.selectionStart;
            const selectionEnd = textareaRef.current!.selectionEnd;
            textareaRef.current!.value =
              value.substring(0, selectionStart) +
              tab +
              value.substring(selectionEnd);
            textareaRef.current!.selectionStart =
              selectionEnd + tab.length - (selectionEnd - selectionStart);
            textareaRef.current!.selectionEnd =
              selectionEnd + tab.length - (selectionEnd - selectionStart);
          }
          if (e.key === "Tab" && e.shiftKey) {
            e.preventDefault();
            const value = textareaRef.current!.value;
            const selectionStart = textareaRef.current!.selectionStart;
            const selectionEnd = textareaRef.current!.selectionEnd;

            const beforeStart = value
              .substring(0, selectionStart)
              .split("")
              .reverse()
              .join("");
            const indexOfTab = beforeStart.indexOf("  ");
            const indexOfNewline = beforeStart.indexOf("\n");

            if (indexOfTab !== -1 && indexOfTab < indexOfNewline) {
              textareaRef.current!.value =
                beforeStart
                  .substring(indexOfTab + 2)
                  .split("")
                  .reverse()
                  .join("") +
                beforeStart
                  .substring(0, indexOfTab)
                  .split("")
                  .reverse()
                  .join("") +
                value.substring(selectionEnd);

              textareaRef.current!.selectionStart = selectionStart - 2;
              textareaRef.current!.selectionEnd = selectionEnd - 2;
            }
          }
        }}
        value={data}
      ></textarea>
      <pre onScroll={(e) => {
        setScroll((e.target as HTMLPreElement).scrollTop);
      }} ref={preRef} className="text-left h-1/2 p-3 overflow-auto">
        <code className="language-cpp" ref={codeRef}></code>
      </pre>
    </div>
  );
};

const ModalManager = () => {
  const { modal, setModalType, modalProps } = useModals();
  if (modal === "none") {
    return <></>;
  }
  return (
    <ModalWrapper onClose={() => setModalType("none")}>
      {modal === "editor" && <TextEditor file={modalProps?.virt_file} />}
    </ModalWrapper>
  );
};

export default ModalManager;
