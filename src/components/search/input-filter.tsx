import { Em, Field, Flex, Input, Text } from "@chakra-ui/react";
import { useCallback, useState } from "react";
import { LuChevronDown, LuChevronUp } from "react-icons/lu";

import { CardSideTable } from "@/lotr/database-schema";
import { InputFilterType, SearchFilterType } from "./types";

export function InputFilter({
  id,
  filter,
  onChange,
}: {
  id: keyof CardSideTable;
  filter: InputFilterType;
  onChange: React.Dispatch<React.SetStateAction<SearchFilterType>>;
}) {
  const [open, setOpen] = useState(false);
  const toggleOpen = useCallback(() => setOpen((prev) => !prev), []);

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      let value = event.target.value as string | undefined;
      value = value!.trim() || undefined; // Convert empty string to undefined

      onChange((prevFilters) => {
        return prevFilters.map((filterItem) =>
          filterItem.id === id
            ? ({ ...filterItem, value } as InputFilterType)
            : filterItem,
        );
      });
    },
    [onChange],
  );

  return (
    <Field.Root>
      <Field.Label width="100%" onClick={toggleOpen} cursor="pointer">
        <Flex
          justifyContent={"space-between"}
          alignItems={"center"}
          width="100%"
        >
          <Text>
            {filter.label}{" "}
            {filter.value ? <Em color="night.500">({filter.value})</Em> : null}
          </Text>
          {open ? <LuChevronUp /> : <LuChevronDown />}
        </Flex>
      </Field.Label>
      {open ? (
        <Input
          value={filter.value ?? ""}
          onChange={handleChange}
          placeholder={filter.placeholder}
          variant="subtle"
          borderColor="sand.500"
          borderWidth={2}
          background="sand.50"
          color="night.900"
          marginTop={2}
        />
      ) : null}
    </Field.Root>
  );
}
