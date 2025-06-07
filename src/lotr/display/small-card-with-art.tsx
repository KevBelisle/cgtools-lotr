import { Card as GameCard } from "@/lotr/lotr-schema";
import { Box } from "@chakra-ui/react";

import { CardImages } from "@/lotr/display/art-only";
import { SmallCard } from "@/lotr/display/small-card";

export const SmallCardWithArt = ({ card }: { card: GameCard }) => {
  return (
    <Box>
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
      <SmallCard card={card} />
    </Box>
  );
};

export default SmallCardWithArt;
