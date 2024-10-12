import { useEffect, useState } from "react";
import SortVisualizer from "../../components/games/SortVisualizer";
import CenteredDivLayout from "../../components/layouts/CenteredDivLayout";

// stores the states for partition sort
class PartitionSortState {
  partitions: { start: number; end: number }[];
  currPos: number;
  frontPointer: number;
  start: number;
  end: number;
  constructor() {
    this.partitions = [];
    this.currPos = 0;
    this.frontPointer = 0;
    this.start = 0;
    this.end = 0;
  }

  reset(values: number[]) {

    this.start = 0;
    this.end = values.length;
    this.frontPointer = 0;
    this.currPos = 1;
  }

  swap(values: number[], i: number, j: number) {
    if (i >= values.length || j >= values.length) return;
    const tmp = values[i];
    values[i] = values[j];
    values[j] = tmp;
  }

  getNextStep(values: number[]) {
    if (
      this.currPos >= this.end ||
      this.frontPointer >= this.end ||
      this.start >= this.end
    ) {
      // push the current partitions onto the stack
      if (this.start < this.end) {
        if (this.frontPointer !== this.end) {
          this.partitions.push({
            start: this.start,
            end: this.frontPointer,
          });
        }
        if (this.start !== this.frontPointer + 1) {
          this.partitions.push({
            start: this.frontPointer + 1,
            end: this.end,
          });
        }
      }

      //  console.log(values);
      // return "finished"
      // reset the position to the partitions
      // Finshed sorting
      if (this.partitions.length === 0) {
        return "finished";
      }
      this.currPos = this.partitions[0].start + 1;
      this.frontPointer = this.partitions[0].start;
      this.end = this.partitions[0].end;
      this.start = this.frontPointer;
      this.partitions = this.partitions.slice(1);
    }
    if (values[this.currPos] <= values[this.frontPointer]) {
      this.swap(values, this.currPos, this.frontPointer + 1);
      this.swap(values, this.frontPointer, this.frontPointer + 1);
      this.frontPointer += 1;
    }
    this.currPos += 1;
    return values;
  }
}

export default function SortVisPage() {
  const [values, setValues] = useState<number[]>([4, 0]);
  const [partSort] = useState(new PartitionSortState());
  const [startAnim, setStartAnim] = useState(false);
  const [currPosition, setCurrPosition] = useState(0);
  const [arraySize, setArraySize] = useState(40);
  const [animating, setAnimating] = useState(false);
  const [intervalTime, setIntervalTime] = useState(10);
  const [currTimeout, setCurrTimeout] = useState<number | null>(null);
  useEffect(() => {
    setValues(Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)));
  }, []);

  useEffect(() => {
    if (!startAnim) return;
    partSort.reset(values);
    const f = () => {
      if (!animating) return;
      const r = partSort.getNextStep(values);
      if (r === "finished") {
        setAnimating(false);
        return;
      }
      setCurrPosition(partSort.currPos);
      setCurrTimeout(setTimeout(f, intervalTime));
    };
    const t = setTimeout(f, intervalTime);
    return () => clearTimeout(t);
  }, [partSort, startAnim, values, animating, intervalTime]);

  return (
    <CenteredDivLayout>
      <div className="flex flex-row bg-slate-500 dark:bg-slate-800">
        <div className="flex flex-col items-center w-full h-full flex-auto m-8 space-y-2">
          <div className="flex flex-row flex-wrap">
            <button
              onClick={() => {
                if (animating) return;
                setAnimating(true);
                setStartAnim(true);
                setTimeout(() => setStartAnim(false), 1000);
              }}
              className="bg-gray-200 hover:bg-gray-400 dark:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              Start Animation
            </button>
            <button
              className="bg-gray-200 hover:bg-gray-400 dark:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={() => {
                setValues(
                  Array.from({ length: arraySize }, () =>
                    Math.floor(Math.random() * arraySize)
                  )
                );
              }}
            >
              Randomise array
            </button>
            <button
              className="text-red-800 dark:text-red-300 bg-gray-200 hover:bg-gray-400 dark:hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
              onClick={() => {
                if (currTimeout !== null) {
                  clearTimeout(currTimeout);
                }
                setAnimating(false);
              }}
            >
              Stop Sorting
            </button>
          </div>
          <label>Set the number of values to sort</label>
          <input
            type="number"
            max="1000"
            value={arraySize}
            onChange={(e) => setArraySize(e.target.value as unknown as number)}
            className="rounded-lg bg-slate-200 dark:bg-slate-600 p-3 shadow my-5"
          />
          <input
            type="range"
            max="1000"
            value={arraySize}
            onChange={(e) => setArraySize(e.target.value as unknown as number)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />

<label>Set the time in miliseconds </label>
          <input
            type="number"
            max="1000"
            value={intervalTime}
            onChange={(e) => setIntervalTime(e.target.value as unknown as number)}
            className="rounded-lg bg-slate-200 dark:bg-slate-600 p-3 shadow my-5"
          />
          <input
            type="range"
            max="1000"
            value={intervalTime}
            onChange={(e) => setIntervalTime(e.target.value as unknown as number)}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
        </div>
        <SortVisualizer
          values={values}
          currentPosition={currPosition}
          width={800}
          height={800}
        />
      </div>
    </CenteredDivLayout>
  );
}
