import Variation from "@/src/types/Variation";
import { lerp } from "three/src/math/MathUtils";

export default class LinearVariation extends Variation<number> {
  from: number;
  to: number;

  constructor(duration: number, from: number, to: number) {
    super("flat", duration);

    this.from = from;
    this.to = to;
  }

  valueAtTime = (time: number) => {
    return lerp(this.from, this.to, time / this.duration);
  };
}
