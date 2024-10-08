import { Stage } from "@pixi/react";
import { Color, Graphics } from "pixi.js";
import { Graphics as GraphicComponent } from "@pixi/react";
import { MouseEvent, useCallback, useEffect, useState } from "react";

type Sand = {
  color: Color,
  x: number,
  y: number,
  velocity_x: number,
  velocity_y: number
};

class AnimatedSandState {
  particles: Sand[];
  height: number;
  width: number;
  sand_size: number;
  force_redraw: boolean;
  mouse_x: number = 0;
  mouse_y: number = 0;
  clicked: boolean = false;
  constructor(w: number, h: number, sand_size: number = 5) {
    this.particles = [];
    this.height = h;
    this.width = w;
    this.sand_size = sand_size;
    this.force_redraw = false;
  }

  onDraw(g: Graphics) {
    for (const particle of this.particles) {
      g.beginFill(particle.color);
      g.drawRect(particle.x, particle.y, this.sand_size, this.sand_size);
    }
  }

  tick(delta: number) {
    const new_particles = [];
    for (const particle of this.particles) {
      if (particle.y > this.height || particle.y <= 0 || particle.x > this.width || particle.x <= 0) {
        continue;
      }
      particle.y += particle.velocity_y * delta / 1000;
      particle.x += particle.velocity_x * delta / 1000;
      new_particles.push(particle);
    }
    this.particles = new_particles;
  }

};

export default function AnimatedSand({ width, height, background, sand_color }: {
  width: number,
  height: number,
  background: Color,
  sand_color: Color
}) {
  const [state] = useState<AnimatedSandState>(new AnimatedSandState(width, height));
  const [redraw, setRedraw] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, setCurrentTimeout] = useState(0);
  
  const x_range = 30;
  const spawningFunction = () => {
    if (!state.clicked) return;
    const x = state.mouse_x;
    const y = state.mouse_y;
    state.particles.push({
      color: sand_color,
      x,
      y,
      velocity_x: Math.random() * x_range * 2 - x_range,
      velocity_y: Math.random() * 50 + 20
    });
  };
  const forceRedraw = () => setRedraw(!redraw);
  const draw = useCallback((g: Graphics) => {
    // draw the background
    g.clear();
    g.beginFill(background);
    g.drawRect(0, 0, width, height);
    state.onDraw(g);
    console.log("Drawing")
  }, [background, width, height, state, forceRedraw]);
  const onClick = (e: MouseEvent<HTMLCanvasElement>) => {
    const target = e.target;
    const rect = (target as HTMLCanvasElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    state.particles.push({
      color: sand_color,
      x,
      y,
      velocity_x: Math.random() * x_range * 2 - x_range,
      velocity_y: Math.random() * 50
    });


    state.clicked = true;
    state.mouse_x = x;
    state.mouse_y = y;
    forceRedraw();
  }

  // animation loop
  useEffect(() => {
    const timeOutFn = () => {
      state.tick(16);
      spawningFunction();
      const v = setTimeout(timeOutFn, 16);
      setCurrentTimeout(v);
      forceRedraw();
    };
    setTimeout(timeOutFn, 16);
  }, []);

  return <Stage width={width} height={height}
      onMouseDown={onClick}
      onMouseMove={(e) => {
        const target = e.target;
        const rect = (target as HTMLCanvasElement).getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        state.mouse_x = x;
        state.mouse_y = y;
      }}
      onMouseUp={() => {
        state.clicked = false;
      }}
    >
      <GraphicComponent draw={draw} />
    </Stage>
}
