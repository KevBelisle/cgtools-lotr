import { CustomLink } from "@/components/ui/custom-link";
import { Tag } from "@/components/ui/tag";
import { Box, Card, HStack, List, Text } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import Markdown from "react-markdown";

interface GlossaryTermCardProps {
  Term: string;
  Type: string;
  Definition: string;
  SeeAlso?: string | null;
  Source?: string | null;
}

export function GlossaryTermCard({
  Term,
  Type,
  Definition,
  SeeAlso,
  Source,
}: GlossaryTermCardProps) {
  return (
    <Card.Root
      size={"sm"}
      borderWidth={2}
      backgroundColor="neutral.fg/10"
      borderColor="sand.700"
      fontFamily={"EB Garamond, times, serif"}
    >
      <Card.Header
        fontFamily={"vafthrudnir"}
        fontVariant={"small-caps"}
        fontWeight={"normal"}
        fontSize="2xl"
      >
        <HStack justifyContent="space-between">
          <Link
            to="/glossary/$glossary-term"
            params={{ "glossary-term": Term }}
          >
            {Term}
          </Link>
        </HStack>
      </Card.Header>
      <Card.Body position="relative" pt={1} alignItems={"stretch"} gap={2}>
        {Type != "TBD" ? (
          <Box>
            <Tag size="lg" fontFamily="EB Garamond, times, serif">
              {Type}
            </Tag>
          </Box>
        ) : null}
        <Markdown
          components={{
            p: ({ node, ...props }) => <Text textWrap="pretty" {...props} />,
            ul: ({ node, ...props }) => <List.Root as="ul" pl={6} {...props} />,
            ol: ({ node, ...props }) => <List.Root as="ol" pl={6} {...props} />,
            li: ({ node, ...props }) => <List.Item {...props} />,
            h1: ({ node, ...props }) => <Text fontWeight="bold" {...props} />,
          }}
        >
          {Definition}
        </Markdown>
      </Card.Body>
      {Source || SeeAlso ? (
        <Card.Footer
          borderTopWidth="1px"
          borderTopStyle="solid"
          pt={4}
          display="flex"
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap"
          fontFamily={"sans-serif"}
          color="sand.400"
        >
          {SeeAlso ? (
            <Text fontStyle="italic">
              See also:{" "}
              {SeeAlso?.split(";").map((term, i, arr) => (
                <span key={term}>
                  <CustomLink
                    to="/glossary/$glossary-term"
                    params={{ "glossary-term": term }}
                  >
                    {term}
                  </CustomLink>
                  {i < arr.length - 1 ? ", " : ""}
                </span>
              ))}
            </Text>
          ) : null}
          {Source ? <Text textAlign="right">Source: {Source}</Text> : null}
        </Card.Footer>
      ) : null}
    </Card.Root>
  );
}
