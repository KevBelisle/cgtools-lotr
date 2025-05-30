import { Link } from "@chakra-ui/react";
import { createLink, LinkComponent } from "@tanstack/react-router";
import * as React from "react";

interface ChakraLinkProps
  extends Omit<React.ComponentPropsWithoutRef<typeof Link>, "href"> {
  // Add any additional props you want to pass to the link
}

const ChakraLinkComponent = React.forwardRef<
  HTMLAnchorElement,
  ChakraLinkProps
>((props, ref) => {
  return <Link ref={ref} {...props} />;
});

const CreatedLinkComponent = createLink(ChakraLinkComponent);

export const CustomLink: LinkComponent<typeof ChakraLinkComponent> = (
  props,
) => {
  return (
    <CreatedLinkComponent
      textDecoration={"underline"}
      _hover={{ textDecoration: "none" }}
      _focus={{ textDecoration: "none" }}
      preload={"intent"}
      {...props}
    />
  );
};
