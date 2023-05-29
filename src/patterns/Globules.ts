import { Pattern } from "@/src/types/Pattern";
import globules from "./shaders/globules.frag";

export const Globules = () =>
  new Pattern("Globules", globules, {
    u_time_factor: {
      name: "Time Factor",
      value: 1,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
    },
  });