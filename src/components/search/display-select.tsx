import {
  createListCollection,
  IconButton,
  Portal,
  Select,
  useSelectContext,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useContext, useMemo } from "react";

import { displayOptions } from "@/lotr/display-options";
import { DisplayContext } from "../ui/display-provider";

function SelectTrigger() {
  const select = useSelectContext();
  const Icon = displayOptions[parseInt(select.value[0])].icon;

  return (
    <IconButton
      size="lg"
      borderColor="sand.500"
      borderWidth={2}
      background="sand.100"
      variant="subtle"
      color="night.900"
      borderRadius={0}
      borderRightRadius={4}
      {...select.getTriggerProps()}
    >
      <Icon />
    </IconButton>
  );
}

export function DisplaySelect() {
  const [displayOption, setDisplayOption] = useContext(DisplayContext);
  const router = useRouter();

  const onValueChange = useCallback(
    (e: { value: string[] }) => {
      setDisplayOption(displayOptions[parseInt(e.value[0])]);
      //router.invalidate();
    },
    [setDisplayOption, router],
  );

  const displayOptionsCollection = useMemo(
    () =>
      createListCollection({
        items: displayOptions.map((option, index) => ({
          label: option.name,
          value: index.toString(),
        })),
      }),
    [displayOptions],
  );

  const displayOptionIndex = displayOptions.findIndex(
    (option) => option.name === displayOption.name,
  );

  return (
    <Select.Root
      positioning={{ sameWidth: false }}
      collection={displayOptionsCollection}
      size="sm"
      width="auto"
      value={[displayOptionIndex.toString()]}
      onValueChange={onValueChange}
    >
      <Select.HiddenSelect />
      <Select.Control>
        <SelectTrigger />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content minW="32" colorScheme={"red"}>
            {displayOptionsCollection.items.map((option) => (
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
