import { Pattern } from "@/src/types/Pattern";
import pulse from "./shaders/pulse.frag";

export { pulse };
export const Pulse = () =>
  new Pattern("Pulse", pulse, {
    u_time_factor: {
      name: "Time Factor",
      value: 0.4,
      max: 5,
    },
    u_time_offset: {
      name: "Time Offset",
      value: 0,
      min: -5,
      max: 5,
    },
    u_hue_start: {
      name: "Hue Start",
      value: 0,
    },
    u_hue_width: {
      name: "Hue Width",
      value: 0.8,
    },
    u_saturation: {
      name: "Saturation",
      value: 1,
    },
    u_duty_cycle: {
      name: "Duty Cycle",
      value: 0.5,
    },
    u_scale: {
      name: "Scale",
      value: 1,
      max: 10,
    },
    u_wave_period: {
      name: "Wave Period",
      value: 0.25,
    },
    u_wave_amplitude: {
      name: "Wave Amplitude",
      value: 0,
    },
    u_waviness: {
      name: "Waviness",
      value: 1,
    },
    u_spiral_factor: {
      name: "Spiral Factor",
      value: 0,
    },
    u_number_colors: {
      name: "Number of Colors",
      value: 4,
      min: 1,
      max: 20,
      step: 1,
    },
    u_white_leading_edge: {
      name: "White Leading Edge",
      value: 0.1,
    },
  });
