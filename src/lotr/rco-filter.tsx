import { Tooltip } from "@/components/ui/tooltip";
import { Switch } from "@chakra-ui/react";
import { useRouter } from "@tanstack/react-router";
import { useContext } from "react";
import { RCOOnlyFilterContext } from "./rco-filter-provider";

export function RCOFilter({
  ...props
}: Switch.RootProps & React.RefAttributes<HTMLLabelElement>) {
  const [RCOOnlyFilter, setRCOOnlyFilter] = useContext(RCOOnlyFilterContext);
  const router = useRouter();

  return (
    <Switch.Root
      checked={RCOOnlyFilter.checked}
      onCheckedChange={(e) => {
        setRCOOnlyFilter(e);
        router.invalidate();
      }}
      colorPalette={"teal"}
      px="4"
      {...props}
    >
      <Switch.HiddenInput />
      <Switch.Control></Switch.Control>
      <Tooltip content="Repackaged Content Only">
        <Switch.Label>RCO Only</Switch.Label>
      </Tooltip>
    </Switch.Root>
  );
}
