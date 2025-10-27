import {
  Box,
  Link as ExternalLink,
  HStack,
  IconButton,
  Text,
} from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { TbFileTypeHtml, TbFileTypePdf } from "react-icons/tb";

export function RulebookLink({ rulebook }: { rulebook: any }) {
  return (
    <Box containerType="inline-size">
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        gapX={2}
        gapY={1}
        _container_sm={{
          flexDirection: "row",
          alignItems: "flex-start",
          gap: 2,
        }}
      >
        <HStack>
          <ExternalLink
            href={`https://images.cardgame.tools/lotr/rules/${rulebook.Filename}.pdf`}
            target="_blank"
          >
            <IconButton
              size="md"
              color="sand.800"
              _hover={{ color: "yellow.700" }}
              variant="outline"
              _container_sm={{
                // Equivalent to size="lg" but works within container queries
                fontSize: "var(--chakra-font-sizes-md)",
                height: "var(--chakra-sizes-12)",
                minWidth: "var(--chakra-sizes-12)",
              }}
            >
              <TbFileTypePdf style={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </ExternalLink>
          <Link
            to="/rulebooks/$rulebook"
            params={{ rulebook: rulebook.Filename }}
          >
            <IconButton
              size="md"
              color="sand.800"
              _hover={{ color: "yellow.700" }}
              variant="outline"
              _container_sm={{
                // Equivalent to size="lg" but works within container queries
                fontSize: "var(--chakra-font-sizes-md)",
                height: "var(--chakra-sizes-12)",
                minWidth: "var(--chakra-sizes-12)",
              }}
            >
              <TbFileTypeHtml style={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </Link>
        </HStack>
        <Box>
          <Text fontSize="md" color="fg">
            {rulebook.Title}
          </Text>
          <Text fontSize="sm" color="gray.emphasized">
            Source: {rulebook.Source}
          </Text>
        </Box>
      </Box>
    </Box>
  );
}
