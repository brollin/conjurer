import { HStack } from "@chakra-ui/react";
import { memo, useState } from "react";
import { Block } from "@/src/types/Block";
import {
  ExtraParams,
  ParamType,
  PatternParam,
} from "@/src/types/PatternParams";
import { DEFAULT_VARIATION_DURATION } from "@/src/utils/time";
import { runInAction } from "mobx";
import { Vector4 } from "three";
import { HexColorInput, HexColorPicker } from "react-colorful";
import { hexToRgb, vector4ToHex } from "@/src/utils/color";
import { LinearVariation4 } from "@/src/types/Variations/LinearVariation4";
import { ParameterControlName } from "@/src/components/PatternPlayground/ParameterControlName";

type ColorParameterControlProps = {
  block: Block<ExtraParams>;
  uniformName: string;
  patternParam: PatternParam<Vector4>;
  parameters: Record<string, ParamType>;
  setParameters: (params: Record<string, ParamType>) => void;
};

export const ColorParameterControl = memo(function ColorParameterControl({
  block,
  uniformName,
  patternParam,
  parameters,
  setParameters,
}: ColorParameterControlProps) {
  const setParameter = (value: Vector4) => {
    setParameters({ ...parameters, [uniformName]: value });
    block.pattern.params[uniformName].value = value;

    runInAction(() => {
      // Also insert a variation so that this parameter value is serializable
      if (!block.parameterVariations[uniformName])
        block.parameterVariations[uniformName] = [];

      block.parameterVariations[uniformName]![0] = new LinearVariation4(
        DEFAULT_VARIATION_DURATION,
        value,
        value,
      );
    });
  };

  const [color, setColor] = useState(vector4ToHex(patternParam.value));
  const onColorChange = (newHex: string) => {
    setColor(newHex);
    const rgb = hexToRgb(newHex);
    patternParam.value.set(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    setParameter(patternParam.value);
  };

  return (
    <HStack pt={6} width="100%" gap={4}>
      <ParameterControlName patternParam={patternParam} />
      <HexColorInput
        className="hexColorInput"
        color={color}
        onChange={onColorChange}
      />
      <HexColorPicker color={color} onChange={onColorChange} />
    </HStack>
  );
});
