import { CardSideTable } from "@/sqljs/database-schema.tsx";
import {
  CheckboxCard,
  CheckboxGroup,
  createListCollection,
  Em,
  Field,
  Flex,
  Portal,
  Select,
  SelectValueChangeDetails,
  Text,
} from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";
import { MultiselectFilterType, SearchFilterType } from "./types.tsx";

function Dropdown({
  id,
  filter,
  onChange,
}: {
  id: keyof CardSideTable;
  filter: MultiselectFilterType;
  onChange: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  const options = createListCollection({
    items: filter.options.map((option) => ({
      label: option,
      value: option,
    })),
  });

  const handleChange = useCallback(
    ({ value }: SelectValueChangeDetails) => {
      // If value is empty, set it to undefined
      const val = value && value.length > 0 ? value : undefined;

      onChange((prevFilters) => {
        return prevFilters.map((filterItem) =>
          filterItem.id === id
            ? ({ ...filterItem, value: val } as MultiselectFilterType)
            : filterItem,
        );
      });
    },
    [onChange],
  );

  return (
    <Select.Root
      closeOnSelect={false}
      value={filter.value ?? []}
      multiple
      collection={options}
      onValueChange={handleChange}
      mt={2}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <Select.Trigger
          borderColor="sand.500"
          borderWidth={2}
          background="sand.50"
          color="night.900"
        >
          <Select.ValueText placeholder={filter.placeholder} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content>
            {options.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                {option.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}

function CheckboxList({
  id,
  filter,
  onChange,
}: {
  id: keyof CardSideTable;
  filter: MultiselectFilterType;
  onChange: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  const handleChange = useCallback(
    (value: string[] | undefined) => {
      // If value is empty, set it to undefined
      value = value && value.length > 0 ? value : undefined;

      onChange((prevFilters) => {
        return prevFilters.map((filterItem) =>
          filterItem.id === id
            ? ({ ...filterItem, value } as MultiselectFilterType)
            : filterItem,
        );
      });
    },
    [onChange],
  );

  filter = filter ?? [];

  return (
    <CheckboxGroup
      onValueChange={handleChange}
      value={filter.value ?? []}
      mt={2}
    >
      <Flex wrap="wrap" gap={2}>
        {filter.options.map((option) => (
          <CheckboxCard.Root key={option} value={option} size="sm" flexGrow={0}>
            <CheckboxCard.HiddenInput />
            <CheckboxCard.Control>
              <CheckboxCard.Content>
                <CheckboxCard.Label>{option}</CheckboxCard.Label>
              </CheckboxCard.Content>
              <CheckboxCard.Indicator />
            </CheckboxCard.Control>
          </CheckboxCard.Root>
        ))}
      </Flex>
    </CheckboxGroup>
  );
}

export function MultiselectFilter({
  id,
  filter,
  onChange,
}: {
  id: keyof CardSideTable;
  filter: MultiselectFilterType;
  onChange: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

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
              {filter.value ? <Em>({filter.value!.join(", ")})</Em> : null}
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
        filter.options.length > 8 ? (
          <Dropdown id={id} onChange={onChange} filter={filter} />
        ) : (
          <CheckboxList id={id} onChange={onChange} filter={filter} />
        )
      ) : null}
    </>
  );
}
