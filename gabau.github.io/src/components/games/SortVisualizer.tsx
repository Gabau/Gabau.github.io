import { Stage } from "@pixi/react";
import { Graphics as GraphicComponent } from "@pixi/react";
import { Color, Graphics } from "pixi.js";
import { useCallback, useContext } from "react";
import ThemeContext from "../../context/ThemeContext";

const sortingColor = {
  dark: {
    bgColor: new Color("black"),
    barColor: new Color("green"),
    selectedColor: new Color("white")
  },
  light: {
    bgColor: new Color("white"),
    barColor: new Color("black"),
    selectedColor: new Color("grey")
  }
}

const SortVisualizer: React.FC<{
  values: number[],
  currentPosition: number,
  width: number,
  height: number,
  base_offset?: number,
  gap?: number
}> = ({ gap, values, width, height, currentPosition, base_offset }) => {
  const {theme} = useContext(ThemeContext);
  const currColors = theme === "dark" ? sortingColor.dark : sortingColor.light;
  const m = base_offset ? base_offset : 100;
  const draw = useCallback((g: Graphics) => {
    g.clear();
    g.beginFill(currColors.bgColor);
    g.drawRect(0, 0, width, height);
    // render each of the values in the item
    let max_val = values[0];
    let min_val = values[0];
    for (const v of values) {
      max_val = Math.max(v, max_val);
      min_val = Math.min(v, min_val);
    }
    const w = width / values.length;
    
    const gapWrapper = gap ? gap : 0.05 * w;
    for (let i = 0; i < values.length; ++i) {
      const perc = Math.round( (values[i] - min_val) / (max_val - min_val) * (height - m)) + m;
      g.beginFill(currColors.barColor);
      if (currentPosition === i) {
        g.beginFill(currColors.selectedColor);
      }
      g.drawRect(i*w, height - perc, w - gapWrapper, perc);
    }
  }, [currColors.bgColor, currColors.barColor, currColors.selectedColor, width, height, values, gap, m, currentPosition]);
  return <Stage width={width} height={height}>
    <GraphicComponent draw={draw} />
  </Stage>
}

export default SortVisualizer;