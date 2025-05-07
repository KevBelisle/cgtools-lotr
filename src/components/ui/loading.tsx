import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export const Loading = () => {
  return (
    <Center mt={16}>
      <VStack>
        <Spinner
          borderWidth={4}
          animationDuration="0.3s"
          color="gray.200"
          size="xl"
        />
        <Text fontSize="md" mt={4} color="gray.400">
          Loading database...
        </Text>
      </VStack>
    </Center>
  );
};

export default Loading;
