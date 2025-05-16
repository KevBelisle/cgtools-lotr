import * as React from "react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import { Button } from "@chakra-ui/react";

interface ChakraLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Button>, "href"> {
  // Add any additional props you want to pass to the link
}

const ChakraButtonComponent = React.forwardRef<
  HTMLButtonElement,
  ChakraLinkProps
>((props, ref) => {
  return <Button ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(ChakraButtonComponent);

export const CustomButtonLink: LinkComponent<typeof ChakraButtonComponent> = (
  props
) => {
  return <CreatedLinkComponent preload={"intent"} {...props} />;
};
