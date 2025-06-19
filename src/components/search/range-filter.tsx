import {
  Button,
  CheckboxCheckedChangeDetails,
  Em,
  Field,
  Flex,
  HStack,
  Slider,
  SliderValueChangeDetails,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";

import { formatNumber } from "@/lotr/card-text-formatting";
import { CardSideTable } from "@/lotr/database-schema";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { Checkbox } from "../ui/checkbox";
import {
  RangeFilterType,
  RangeFilterValueType,
  SearchFilterType,
} from "./types";

export function RangeFilter({
  id,
  filter,
  onChange,
}: {
  id: keyof CardSideTable;
  filter: RangeFilterType;
  onChange: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  const enableFilter = useCallback(() => {
    onChange((prevFilters) => {
      return prevFilters.map((filterItem) =>
        filterItem.id === id
          ? ({
              ...filterItem,
              value: {
                range: [filter.min, filter.max],
                special: filter.special ?? [],
              } as RangeFilterValueType,
            } as RangeFilterType)
          : filterItem,
      );
    });
  }, [onChange, id]);

  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => {
    if (!open && filter.value == undefined) {
      enableFilter();
    }
    setOpen((prev) => !prev);
  }, [enableFilter, filter.value, open, setOpen]);

  const handleRangeChange = useCallback(
    ({ value }: SliderValueChangeDetails) => {
      onChange((prevFilters) => {
        return prevFilters.map((filterItem) =>
          filterItem.id === id
            ? ({
                ...filterItem,
                value: {
                  range: value as [number, number],
                  special: (filterItem as RangeFilterType).value!.special,
                },
              } as RangeFilterType)
            : filterItem,
        );
      });
    },
    [onChange, id],
  );

  const handleSpecialChange = useCallback(
    (special: number, details: CheckboxCheckedChangeDetails) => {
      onChange((prevFilters) => {
        return prevFilters.map((filterItem) =>
          filterItem.id === id
            ? ({
                ...filterItem,
                value: {
                  range: (filterItem as RangeFilterType).value!.range,
                  special: details.checked
                    ? [
                        ...(filterItem as RangeFilterType).value!.special,
                        special,
                      ]
                    : (filterItem as RangeFilterType).value!.special.filter(
                        (s) => s !== special,
                      ),
                },
              } as RangeFilterType)
            : filterItem,
        );
      });
    },
    [onChange, id],
  );

  const handleClearFilter = useCallback(() => {
    onChange((prevFilters) => {
      return prevFilters.map((filterItem) =>
        filterItem.id === id
          ? ({
              ...filterItem,
              value: undefined,
            } as RangeFilterType)
          : filterItem,
      );
    });
    setOpen(false);
  }, [onChange, id]);

  return (
    <>
      <Field.Root>
        <Field.Label width="100%" onClick={toggleOpen} cursor="pointer">
          <Flex
            justifyContent={"space-between"}
            alignItems={"center"}
            width="100%"
          >
            <Text color="night.500" lineClamp={1}>
              <Text color="night.100" as="span">
                {filter.label}
              </Text>{" "}
              {filter.value ? (
                <Em>
                  (
                  {[
                    `${filter.value.range[0]}-${filter.value.range[1]}`,
                    ...filter.value.special.map(formatNumber),
                  ].join(", ")}
                  )
                </Em>
              ) : null}
            </Text>
            {open ? (
              <LuChevronUp style={{ flexShrink: 0 }} />
            ) : (
              <LuChevronDown style={{ flexShrink: 0 }} />
            )}
          </Flex>
        </Field.Label>
      </Field.Root>

      {open ? (
        <>
          <Slider.Root
            min={filter.min}
            max={filter.max}
            step={1}
            onValueChange={handleRangeChange}
            value={filter.value?.range ?? [filter.min, filter.max]}
            width="100%"
            mt={4}
          >
            <Slider.Control>
              <Slider.Track>
                <Slider.Range />
              </Slider.Track>
              <Slider.Thumbs />
              <Slider.Marks
                textAlign={"center"}
                marks={Array.from(
                  { length: filter.max - filter.min + 1 },
                  (_, i) => {
                    const value = filter.min + i;
                    return {
                      value,
                      label: value.toString(),
                    };
                  },
                )}
              />
            </Slider.Control>
          </Slider.Root>

          <HStack mt={4} gap={8}>
            {filter.special.map((special) => {
              return (
                <Checkbox
                  checked={filter.value?.special.includes(special) ?? true}
                  key={special}
                  onCheckedChange={(details) =>
                    handleSpecialChange(special, details)
                  }
                >
                  {formatNumber(special)}
                </Checkbox>
              );
            })}
          </HStack>
          <Button
            onClick={handleClearFilter}
            variant="outline"
            size="xs"
            mt={2}
            colorPalette="red"
            alignSelf="flex-end"
          >
            Remove this filter
          </Button>
        </>
      ) : null}
    </>
  );
}
