import { config } from "@/lotr/config";
import {
  Box,
  Button,
  Center,
  Link as ChakraLink,
  Container,
  Heading,
  List,
  Separator,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState } from "react";

export default function Footer() {
  const [showCredits, setShowCredits] = useState(false);

  return (
    <Container fontSize="sm" my={8} as="footer">
      <Separator />

      <VStack alignItems={"center"} gap={0} my={8}>
        <Heading as="h1">{config.gameName}</Heading>
        <Heading as="h2" size="xs" fontWeight={200}>
          by CardGame.Tools
        </Heading>
      </VStack>

      {showCredits ? (
        <Box padding="4">
          <Text pb="2">
            CardGame.Tools is a project by Klutz (aka Kevin Belisle) but would
            not have been possible without the help and previous work by these
            fine people.
          </Text>

          <List.Root gap={2} pl={4}>
            <List.Item>
              The amazing and open-source{" "}
              <ChakraLink
                href="http://hallofbeorn.com"
                target="_blank"
                variant="underline"
                color="teal.300"
              >
                Hall of Beorn
              </ChakraLink>{" "}
              for the vast majority of card data and product card lists.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                @kirbsta2
              </Text>{" "}
              on the COTR Discord for the detailed card list of the repackaged
              Fellowship of the Ring saga.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                @Exaton
              </Text>{" "}
              on the COTR Discord for the detailed card list of the repackaged
              Angmar Awakened saga expansions.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                Tana G
              </Text>{" "}
              from the Lord of the Rings LCG Players group on Facebook for the
              detailed card list of the repackaged Dream-chaser Hero Expansion.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                u/LepcisMagna
              </Text>{" "}
              from Reddit's r/lotrlcg for the 600 DPI scans of almost all the
              original releases, PODs and Nigthmare decks.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                u/Guczini
              </Text>{" "}
              from Reddit's r/lotrlcg for the 600 DPI scans of the Dark of
              Mirkwood cards.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                @Campfire
              </Text>{" "}
              on the COTR Discord for the card list of the repackaged Ered
              Mithrin Campaign Expansion and The Return of the King saga
              expansion.
            </List.Item>
            <List.Item>
              <Text as="span" color="teal.300">
                Jonathan B
              </Text>{" "}
              from the Lord of the Rings LCG Players group on Facebook for the
              card list of the repackaged Ered Mithrin Hero Expansion.
            </List.Item>
          </List.Root>
          {/* <Text py="2">Here are a few things I'm still looking for:</Text>
          <UnorderedList>
            <List.Item>
              600+ DPI scans of the new campaign cards from the newly repackaged
              Dream-chaser Campaign expansions.
            </List.Item>
          </UnorderedList> */}
        </Box>
      ) : (
        <Center>
          <Button
            onClick={() => setShowCredits(true)}
            variant="outline"
            size="xs"
            maxW="80vw"
            px="32"
            colorPalette={"teal"}
          >
            Show credits
          </Button>
        </Center>
      )}

      <Separator my={8} />

      <Text color="night.600" fontSize="xs">
        This website is not produced, endorsed, supported, or affiliated with
        Fantasy Flight Games. The copyrightable portions of The Lord of the
        Rings: The Card Game and its expansions are © 2011 - 2023 Fantasy
        Flight Publishing, Inc. The Lord of the Rings, and the characters,
        items, events and places therein are trademarks or registered trademarks
        of The Saul Zaentz Company d/b/a Middle-earth Enterprises and are used,
        under license, by Fantasy Flight Games. Living Card Game, LCG, LCG logo
        and Fantasy Flight Supply are trademarks and/or registered trademarks of
        Fantasy Flight Publishing, Inc. All Rights Reserved to their respective
        owners.
      </Text>
    </Container>
  );
}
