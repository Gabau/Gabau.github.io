import { useRef, useState } from "react";

const imageUrls = [
  "/kelly-sikkema-YJZLIFmE0F8-unsplash.jpg",
  "/kevin-mueller-NzoJDM2CmH0-unsplash.jpg",
];

// Image sources
// https://unsplash.com/photos/a-woman-sitting-at-a-table-with-a-notebook-and-pen-YJZLIFmE0F8
// https://unsplash.com/photos/a-woman-sitting-at-a-table-with-a-notebook-and-pen-YJZLIFmE0F8?utm_content=creditShareLink&utm_medium=referral&utm_source=unsplash
export default function SplitImageAnimationPage() {
  const height = 500;
  const width = 500;
  const [tmpWidth, setTempWidth] = useState(width / 2);
  const [mouseDown, setMouseDown] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const image1 = imageUrls[0];
  const image2 = imageUrls[1];

  return (
    <div
      className="relative select-none"
      
      onMouseUp={() => setMouseDown(false)}
      onMouseMove={(e) => {
        if (!mouseDown) return;
        if (panelRef.current) {
          setTempWidth(Math.min(width, e.clientX));
        }
      }}
    >
      <div className="absolute" style={{ width, height }}>
        <img src={image1} className="w-full h-full" />
      </div>
      <div className="flex flex-row">
        <div
          ref={panelRef}
          style={{ width: tmpWidth, height }}
          className="overflow-hidden"
        >
          <div className="relative" style={{ width, height }}>
            <img src={image2} className="w-full h-full" />
          </div>
        </div>
        <div
          onMouseDown={() => setMouseDown(true)}
          className="flex-grow-0 flex-shrink-0 z-10 bg-black dark:bg-white w-1 cursor-col-resize m-0"
        >
          &nbsp;
        </div>
      </div>
    </div>
  );
}
