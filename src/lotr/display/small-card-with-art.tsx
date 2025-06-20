import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box, type HTMLChakraProps } from "@chakra-ui/react";

import { CardImages } from "@/lotr/display/art-only";
import { SmallCard } from "@/lotr/display/small-card";

export const SmallCardWithArt = ({
  card,
  highlighted,
  ...rootProps
}: {
  card: GameCard;
  highlighted?: boolean;
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
          <CardImages card={card} highlighted={highlighted} />
        </Box>
      </Box>
      <SmallCard card={card} highlighted={highlighted} />
    </Box>
  );
};

export default SmallCardWithArt;
