import { Container, Flex, Text } from "@chakra-ui/react";
import { CustomButtonLink } from "@/components/ui/custom-button-link";

export function NotFound() {
  return (
    <Container my="16">
      <Flex flexDirection={"column"} alignItems={"center"} gap="4">
        <Text>This is the notFoundComponent configured on root route.</Text>
        <CustomButtonLink to="/" colorPalette="teal">
          Start Over
        </CustomButtonLink>
      </Flex>
    </Container>
  );
}
