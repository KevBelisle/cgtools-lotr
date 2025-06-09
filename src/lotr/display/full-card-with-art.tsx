import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box, type HTMLChakraProps } from "@chakra-ui/react";

import { CardImages } from "@/lotr/display/art-only";
import { FullCard } from "@/lotr/display/full-card";

export const FullCardWithArt = ({
  card,
  ...rootProps
}: {
  card: GameCard;
} & HTMLChakraProps<"div">) => {
  return (
    <Box {...rootProps}>
      <Box
        height="270px"
        overflow="hidden"
        display={"flex"}
        justifyContent={"center"}
      >
        <Box
          height="400px"
          width="400px"
          position="relative"
          display={"flex"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <CardImages card={card} />
        </Box>
      </Box>
      <FullCard card={card} />
    </Box>
  );
};

export default FullCardWithArt;
