import {
  Button,
  createListCollection,
  IconButtonProps,
  Portal,
  Select,
  Text,
  useSelectContext,
} from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useCallback, useContext, useMemo } from "react";

import { type DisplayOptionType } from "@/lotr/display-options";
import { DisplayContext } from "../ui/display-provider";

function SelectTrigger({
  displayOption,
  showLabel = false,
  ...props
}: { displayOption: DisplayOptionType; showLabel: boolean } & IconButtonProps &
  React.RefAttributes<HTMLButtonElement>) {
  const select = useSelectContext();
  const Icon = displayOption.icon;

  return (
    <Button size="lg" variant="subtle" {...select.getTriggerProps()} {...props}>
      <Icon /> {showLabel ? displayOption.name : null}
    </Button>
  );
}

export function DisplaySelect({
  showLabel = false,
  ...props
}: { showLabel?: boolean } & IconButtonProps &
  React.RefAttributes<HTMLButtonElement>) {
  const [displayOption, setDisplayOption, displayOptions] =
    useContext(DisplayContext);
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
          icon: option.icon,
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
        <SelectTrigger
          displayOption={displayOption}
          showLabel={showLabel}
          {...props}
        />
      </Select.Control>
      <Portal>
        <Select.Positioner>
          <Select.Content minW="32" colorScheme={"red"}>
            {displayOptionsCollection.items.map((option) => (
              <Select.Item item={option} key={option.value}>
                <option.icon />
                <Text as="span" textAlign="left" flexGrow={1}>
                  {option.label}
                </Text>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
}
