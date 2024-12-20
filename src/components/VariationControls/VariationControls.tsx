import {
  Box,
  Button,
  HStack,
  Icon,
  Link,
  Radio,
  RadioGroup,
  Select,
  Switch,
  Text,
  VStack,
} from "@chakra-ui/react";
import { ChangeEvent, useEffect, useState } from "react";
import { Variation } from "@/src/types/Variations/Variation";
import { action } from "mobx";
import { FaTrashAlt } from "react-icons/fa";
import { BiDuplicate, BiLinkExternal } from "react-icons/bi";
import { Block } from "@/src/types/Block";
import { FlatVariation } from "@/src/types/Variations/FlatVariation";
import { LinearVariation } from "@/src/types/Variations/LinearVariation";
import {
  PeriodicVariation,
  PeriodicVariationType,
} from "@/src/types/Variations/PeriodicVariation";
import { LinearVariation4 } from "@/src/types/Variations/LinearVariation4";
import { HexColorPicker } from "react-colorful";
import { hexToRgb, vector4ToHex } from "@/src/utils/color";
import { HexColorInput } from "react-colorful";
import { SplineVariation } from "@/src/types/Variations/SplineVariation";
import { ExtraParams } from "@/src/types/PatternParams";
import { useStore } from "@/src/types/StoreContext";
import { ScalarInput } from "@/src/components/ScalarInput";
import {
  EasingVariation,
  EasingVariationType,
} from "@/src/types/Variations/EasingVariation";
import { easings } from "@/src/utils/easings";
import { PaletteVariation } from "@/src/types/Variations/PaletteVariation";
import { PaletteVariationControls } from "@/src/components/VariationControls/PaletteVariationControls";
import { AudioVariation } from "@/src/types/Variations/AudioVariation";
import { AudioVariationControls } from "@/src/components/VariationControls/AudioVariationControls";

type VariationControlsProps = {
  uniformName: string;
  variation: Variation;
  block: Block<ExtraParams>;
};

export const VariationControls = function VariationControls({
  uniformName,
  variation,
  block,
}: VariationControlsProps) {
  const store = useStore();

  const [duration, setDuration] = useState(variation.duration.toString());

  const controlsProps = { uniformName, block };
  const controls =
    variation instanceof FlatVariation ? (
      <FlatVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof LinearVariation ? (
      <LinearVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof PeriodicVariation ? (
      <PeriodicVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof SplineVariation ? (
      <SplineVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof EasingVariation ? (
      <EasingVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof AudioVariation ? (
      <AudioVariationControls variation={variation} {...controlsProps} />
    ) : variation instanceof LinearVariation4 ? (
      <LinearVariation4Controls variation={variation} {...controlsProps} />
    ) : variation instanceof PaletteVariation ? (
      <PaletteVariationControls variation={variation} {...controlsProps} />
    ) : (
      <Text>Needs implementation!</Text>
    );

  const parameterName = block.pattern.params[uniformName].name;

  return (
    <VStack p={1} bgColor="gray.700" fontSize={10} m={1} borderRadius={6}>
      <VStack spacing={0}>
        <Text fontWeight="bold">{parameterName}</Text>
        <Text>{variation.displayName} Variation</Text>
      </VStack>
      <VStack spacing={1}>
        {controls}
        <ScalarInput
          name="Duration"
          onChange={(valueString, valueNumber) => {
            variation.duration = valueNumber;
            setDuration(valueString);
            block.triggerVariationReactions(uniformName);
          }}
          value={duration}
        />
      </VStack>
      <HStack spacing={0}>
        <Button
          aria-label="Duplicate"
          variant="ghost"
          size="xs"
          fontSize={8}
          color="gray.400"
          leftIcon={<BiDuplicate size={14} />}
          onClick={action(() =>
            store.duplicateVariation(block, uniformName, variation),
          )}
        >
          Duplicate
        </Button>
        <Button
          aria-label="Delete"
          variant="ghost"
          size="xs"
          fontSize={8}
          color="gray.400"
          leftIcon={<FaTrashAlt size={12} />}
          onClick={action(() =>
            store.deleteVariation(block, uniformName, variation),
          )}
        >
          Delete
        </Button>
      </HStack>
    </VStack>
  );
};

type FlatVariationControlsProps = {
  uniformName: string;
  variation: FlatVariation;
  block: Block;
};

function FlatVariationControls({
  uniformName,
  variation,
  block,
}: FlatVariationControlsProps) {
  const [value, setValue] = useState(variation.value.toString());

  return (
    <ScalarInput
      name="Value"
      onChange={(valueString, valueNumber) => {
        variation.value = valueNumber;
        setValue(valueString);
        block.triggerVariationReactions(uniformName);
      }}
      value={value}
    />
  );
}

type LinearVariation4ControlsProps = {
  uniformName: string;
  variation: LinearVariation4;
  block: Block;
};

function LinearVariation4Controls({
  uniformName,
  variation,
  block,
}: LinearVariation4ControlsProps) {
  const [fromColor, setFromColor] = useState(vector4ToHex(variation.from));
  const [toColor, setToColor] = useState(vector4ToHex(variation.to));

  const onFromColorChange = (newHex: string) => {
    setFromColor(newHex);
    const rgb = hexToRgb(newHex);
    variation.from.set(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    block.triggerVariationReactions(uniformName);
  };

  const onToColorChange = (newHex: string) => {
    setToColor(newHex);
    const rgb = hexToRgb(newHex);
    variation.to.set(rgb.r / 255, rgb.g / 255, rgb.b / 255, 1);
    block.triggerVariationReactions(uniformName);
  };

  return (
    <VStack className="colorPickerContainer">
      <HStack width="100%" justify="space-around">
        <Box width={6} height={6} bgColor={fromColor} />
        <HexColorInput
          className="hexColorInput"
          color={fromColor}
          onChange={onFromColorChange}
        />
      </HStack>
      <HexColorPicker color={fromColor} onChange={onFromColorChange} />
      <HStack width="100%" justify="space-around">
        <Box width={6} height={6} bgColor={toColor} />
        <HexColorInput
          className="hexColorInput"
          color={toColor}
          onChange={onToColorChange}
        />
      </HStack>
      <HexColorPicker color={toColor} onChange={onToColorChange} />
    </VStack>
  );
}

type LinearVariationControlsProps = {
  uniformName: string;
  variation: LinearVariation;
  block: Block;
};

function LinearVariationControls({
  uniformName,
  variation,
  block,
}: LinearVariationControlsProps) {
  const [from, setFrom] = useState(variation.from.toString());
  const [to, setTo] = useState(variation.to.toString());

  return (
    <>
      <ScalarInput
        name="From"
        onChange={(valueString, valueNumber) => {
          variation.from = valueNumber;
          setFrom(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={from}
      />
      <ScalarInput
        name="To"
        onChange={(valueString, valueNumber) => {
          variation.to = valueNumber;
          setTo(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={to}
      />
    </>
  );
}

type PeriodicVariationControlsProps = {
  uniformName: string;
  variation: PeriodicVariation;
  block: Block;
  matchPeriodAndDuration?: boolean;
  onChange?: () => void;
};

export function PeriodicVariationControls({
  uniformName,
  variation,
  block,
  matchPeriodAndDuration,
  onChange,
}: PeriodicVariationControlsProps) {
  const [periodicType, setPeriodicType] = useState(variation.periodicType);
  const [amplitude, setAmplitude] = useState(variation.amplitude.toString());
  const [period, setPeriod] = useState(variation.period.toString());
  const [phase, setPhase] = useState(variation.phase.toString());
  const [offset, setOffset] = useState(variation.offset.toString());

  const [min, setMin] = useState(variation.min.toString());
  const [max, setMax] = useState(variation.max.toString());

  const [showingMinMax, setShowingMinMax] = useState(true);

  useEffect(() => {
    onChange?.();
  }, [periodicType, amplitude, period, phase, offset, min, max, onChange]);

  return (
    <>
      <RadioGroup
        onChange={(type: PeriodicVariationType) => {
          setPeriodicType(type);
          variation.periodicType = type;
          block.triggerVariationReactions(uniformName);
        }}
        value={periodicType}
        size="xs"
      >
        <VStack spacing={0}>
          <Radio value="sine">Sine</Radio>
          <Radio value="square">Square</Radio>
          <Radio value="triangle">Triangle</Radio>
        </VStack>
      </RadioGroup>
      <HStack m={1}>
        <Text>Min/max mode</Text>
        <Switch
          size="sm"
          m={1}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            setShowingMinMax(event.target.checked);
            // re sync the min/max/amplitude/offset
            setAmplitude(variation.amplitude.toString());
            setOffset(variation.offset.toString());
            setMin(variation.min.toString());
            setMax(variation.max.toString());
          }}
          isChecked={showingMinMax}
        />
      </HStack>
      {showingMinMax ? (
        <>
          <ScalarInput
            name="Min"
            onChange={(valueString, valueNumber) => {
              setMin(valueString);
              if (!isNaN(valueNumber)) {
                variation.min = valueNumber;
                block.triggerVariationReactions(uniformName);
              }
            }}
            value={min}
          />
          <ScalarInput
            name="Max"
            onChange={(valueString, valueNumber) => {
              setMax(valueString);
              if (!isNaN(valueNumber)) {
                variation.max = valueNumber;
                block.triggerVariationReactions(uniformName);
              }
            }}
            value={max}
          />
        </>
      ) : (
        <>
          <ScalarInput
            name="Offset"
            onChange={(valueString, valueNumber) => {
              variation.offset = valueNumber;
              setOffset(valueString);
              block.triggerVariationReactions(uniformName);
            }}
            value={offset}
          />
          <ScalarInput
            name="Amplitude"
            onChange={(valueString, valueNumber) => {
              variation.amplitude = valueNumber;
              setAmplitude(valueString);
              block.triggerVariationReactions(uniformName);
            }}
            value={amplitude}
          />
        </>
      )}
      <ScalarInput
        name="Period"
        onChange={(valueString, valueNumber) => {
          // do not allow setting period to 0
          if (valueNumber) variation.period = valueNumber;
          setPeriod(valueString);
          if (matchPeriodAndDuration) variation.duration = valueNumber;
          block.triggerVariationReactions(uniformName);
        }}
        value={period}
      />
      <ScalarInput
        name="Phase"
        onChange={(valueString, valueNumber) => {
          variation.phase = valueNumber;
          setPhase(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={phase}
      />
    </>
  );
}

type SplineVariationControlsProps = {
  uniformName: string;
  variation: SplineVariation;
  block: Block;
};

function SplineVariationControls({
  uniformName,
  variation,
  block,
}: SplineVariationControlsProps) {
  const [min, setMin] = useState(variation.domainMin.toString());
  const [max, setMax] = useState(variation.domainMax.toString());

  return (
    <>
      <ScalarInput
        name="Min"
        onChange={(valueString, valueNumber) => {
          variation.domainMin = valueNumber;
          setMin(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={min}
      />
      <ScalarInput
        name="Max"
        onChange={(valueString, valueNumber) => {
          variation.domainMax = valueNumber;
          setMax(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={max}
      />
    </>
  );
}

type EasingVariationControlsProps = {
  uniformName: string;
  variation: EasingVariation;
  block: Block;
};

function EasingVariationControls({
  uniformName,
  variation,
  block,
}: EasingVariationControlsProps) {
  const [easingType, setEasingType] = useState<EasingVariationType>(
    variation.easingType,
  );
  const [from, setFrom] = useState(variation.from.toString());
  const [to, setTo] = useState(variation.to.toString());

  return (
    <>
      <Link href="https://easings.net/" isExternal>
        Easing reference <Icon as={BiLinkExternal} />
      </Link>
      <Select
        size="xs"
        value={easingType}
        onChange={(e) => {
          variation.easingType = e.target.value as EasingVariationType;
          setEasingType(variation.easingType);
          block.triggerVariationReactions(uniformName);
        }}
      >
        {Object.keys(easings).map((easingName) => (
          <option key={easingName} value={easingName}>
            {easingName}
          </option>
        ))}
      </Select>
      <ScalarInput
        name="From"
        onChange={(valueString, valueNumber) => {
          variation.from = valueNumber;
          setFrom(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={from}
      />
      <ScalarInput
        name="To"
        onChange={(valueString, valueNumber) => {
          variation.to = valueNumber;
          setTo(valueString);
          block.triggerVariationReactions(uniformName);
        }}
        value={to}
      />
    </>
  );
}
