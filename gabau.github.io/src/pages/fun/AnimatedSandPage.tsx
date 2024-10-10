import { Color } from "pixi.js";
import AnimatedSand from "../../components/games/AnimatedSand";



export default function AnimatedSandPage() {
  return (<div className="w-full h-full flex flex-col items-center justify-center">
      <AnimatedSand sand_color={new Color("white")} width={800} height={800} background={new Color("gray")} />
    </div>)
}



