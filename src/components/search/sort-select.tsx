import {
  createListCollection,
  IconButton,
  Portal,
  Select,
  useSelectContext,
} from "@chakra-ui/react";
import { useContext, useMemo } from "react";
import { LuArrowDownWideNarrow } from "react-icons/lu";

import { sortOptions } from "@/lotr/sort-options";
import { SortOrderContext, SortOrderType } from "../ui/sort-order-provider";

function SelectTrigger() {
  const select = useSelectContext();
  return (
    <IconButton
      size="lg"
      borderColor="sand.500"
      borderWidth={2}
      background="sand.100"
      variant="subtle"
      color="night.900"
      {...select.getTriggerProps()}
    >
      <LuArrowDownWideNarrow />
    </IconButton>
  );
}

export function OrderSelect() {
  const [sortOrder, setSortOrder] = useContext(SortOrderContext);

  const frameworks = useMemo(
    () =>
      createListCollection({
        items: [
          { label: "Random", value: "Random" },
          ...sortOptions.map((option) => ({
            label: option,
            value: option,
          })),
        ],
      }),
    [sortOptions],
  );

  return (
    <Select.Root
      positioning={{ sameWidth: false }}
      collection={frameworks}
      size="sm"
      width="auto"
      value={[sortOrder as string]}
      onValueChange={(e) => setSortOrder(e.value[0] as SortOrderType)}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <SelectTrigger />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content minW="32">
            {frameworks.items.map((framework) => (
              <Select.Item item={framework} key={framework.value}>
                {framework.label}
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
