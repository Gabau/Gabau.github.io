import { useEffect, useState } from "react";
import SortVisualizer from "../../components/games/SortVisualizer";
import CenteredDivLayout from "../../components/layouts/CenteredDivLayout";

interface SortingState {
  currPos: number;
  reset(values: number[]): void;
  getNextStep(values: number[]): undefined | "finished" | number[];
}

class CountingSortState implements SortingState {
  currPos: number = 0;
  loggingState: "counting" | "sorting" = "counting";
  numMap = new Map<number, number>();
  currItem: number = 0;
  min_val = 0;
  simulate_counting: boolean = true;
  max_val = 0;
  reset(values: number[]): void {
    this.currPos = 0;
    this.loggingState = "counting";
    this.numMap.clear();
    if (values.length > 0) {
      this.min_val = values[0];
      this.max_val = values[0];
    }
  }
  getNextStep(values: number[]): undefined | "finished" | number[] {
    if (this.loggingState === "counting") {
      if (this.currPos < values.length) {
        this.numMap.set(
          values[this.currPos],
          (this.numMap.get(values[this.currPos]) ?? 0) + 1
        );
        this.min_val = Math.min(values[this.currPos], this.min_val);
        this.max_val = Math.max(values[this.currPos], this.max_val);
        this.currPos += 1;
      } else {
        this.loggingState = "sorting";
        this.currPos = 0;
        this.currItem = this.min_val;
      }
      return values;
    }

    if (this.currPos >= values.length) {
      return "finished";
    }

    while (
      !this.simulate_counting &&
      (this.numMap.get(this.currItem) === undefined ||
        this.numMap.get(this.currItem) === 0)
    ) {
      this.currItem += 1;
    }
    // perform the writing
    if (this.numMap.get(this.currItem) ?? 0 > 0) {
      this.numMap.set(this.currItem, this.numMap.get(this.currItem)! - 1);
      values[this.currPos] = this.currItem;
      this.currPos += 1;
    } else {
      // Treat the increase in count as a step
      this.currItem += 1;
    }
  }
}

class InsertionSortState implements SortingState {
  i: number;
  currPos: number;
  middleOfLoop: boolean = false;
  key: number = 0;
  constructor() {
    this.i = 1;
    this.currPos = 0;
  }
  reset(): void {
    this.i = 1;
    this.middleOfLoop = false;
    this.currPos = 0;
  }
  getNextStep(values: number[]): undefined | "finished" | number[] {
    if (this.i >= values.length && !this.middleOfLoop) return "finished";
    if (values.length <= 1) return "finished";
    if (!this.middleOfLoop) {
      this.currPos = this.i - 1;
      this.key = values[this.i];
      this.middleOfLoop = true;
      this.i += 1;
    }
    if (this.currPos >= 0 && values[this.currPos] > this.key) {
      values[this.currPos + 1] = values[this.currPos];
      this.currPos -= 1;
    } else {
      values[this.currPos + 1] = this.key;
      this.middleOfLoop = false;
    }
    return values;
  }
}

// stores the states for partition sort
class PartitionSortState implements SortingState {
  partitions: { start: number; end: number }[];
  frontPointer: number;
  start: number;
  end: number;
  currPos: number;
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
  const [partSort, setSort] = useState<SortingState>(new PartitionSortState());
  const [startAnim, setStartAnim] = useState(false);
  const [currPosition, setCurrPosition] = useState(0);
  const [arraySize, setArraySize] = useState(40);
  const [animating, setAnimating] = useState(false);
  const [intervalTime, setIntervalTime] = useState(10);
  const [maxVal, setMaxVal] = useState(40);
  const [simulateCounting, setSimulateCounting] = useState(false);
  const [currAlgorithm, setCurrAlgorithm] = useState("Quick");
  const [currTimeout, setCurrTimeout] = useState<number | null>(null);
  const [canvasWidth, setCanvasWidth] = useState<number>(800);

  useEffect(() => {
    function updateSize() {
      if (document.body.clientWidth <= 1024) {
        setCanvasWidth((document.body.clientWidth * 8) / 9);
        return;
      }
      setCanvasWidth((document.body.clientWidth - 200) / 2);
    }
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  useEffect(() => {
    setValues(Array.from({ length: 40 }, () => Math.floor(Math.random() * 40)));
  }, []);
  useEffect(() => {
    if (partSort instanceof CountingSortState) {
      (partSort as CountingSortState).simulate_counting = simulateCounting;
    }
  }, [simulateCounting, partSort]);

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

  useEffect(() => {
    setValues(
      Array.from({ length: arraySize }, () =>
        Math.floor(Math.random() * maxVal)
      )
    );
  }, [arraySize, maxVal]);
  return (
    <CenteredDivLayout>
      <div className="flex flex-col sm:flex sm:flex-row bg-slate-500 dark:bg-slate-800">
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
                    Math.floor(Math.random() * maxVal)
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
              disabled={!animating}
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
            className="w-3/4 sm:w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />

          <label>Set the time between each step in miliseconds</label>
          <input
            type="number"
            max="1000"
            value={intervalTime}
            onChange={(e) =>
              setIntervalTime(e.target.value as unknown as number)
            }
            className="rounded-lg bg-slate-200 dark:bg-slate-600 p-3 shadow my-5"
          />
          <input
            type="range"
            max="1000"
            value={intervalTime}
            onChange={(e) =>
              setIntervalTime(e.target.value as unknown as number)
            }
            className="w-3/4 sm:w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <label>Set the range of values</label>
          <input
            type="number"
            max="5000"
            min="5"
            value={maxVal}
            onChange={(e) => setMaxVal(e.target.value as unknown as number)}
            className="rounded-lg bg-slate-200 dark:bg-slate-600 p-3 shadow my-5"
          />
          <input
            type="range"
            max="5000"
            min="5"
            value={maxVal}
            onChange={(e) => setMaxVal(e.target.value as unknown as number)}
            className="w-3/4 sm:w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
          />
          <label>Select the type of sort</label>
          <select
            className="bg-gray-200 dark:bg-slate-800 border border-slate-950 rounded-lg p-3 shadow dark:focus:border-none"
            onChange={(e) => {
              if (e.target.value === "Insertion") {
                setSort(new InsertionSortState());
              }
              if (e.target.value === "Quick") {
                setSort(new PartitionSortState());
              }
              if (e.target.value === "Counting") {
                setSort(new CountingSortState());
              }
              setCurrAlgorithm(e.target.value);
            }}
            defaultValue={"Quick"}
          >
            <option value="Quick">Quick Sort</option>
            <option value="Insertion">Insertion Sort</option>
            <option value="Counting">Counting Sort</option>
          </select>
          {currAlgorithm === "Counting" && (
            <label className="inline-flex items-center cursor-pointer p-4">
              <input
                type="Checkbox"
                className="sr-only peer"
                checked={simulateCounting}
                onChange={(e) => {
                  setSimulateCounting(e.target.checked);
                }}
              />
              <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
              <span className="ms-3 text-sm font-medium ">
                Simulate counting
              </span>
            </label>
          )}
        </div>
        <CenteredDivLayout>
          <SortVisualizer
            values={values}
            currentPosition={currPosition}
            width={canvasWidth}
            height={canvasWidth}
          />
        </CenteredDivLayout>
      </div>
    </CenteredDivLayout>
  );
}
