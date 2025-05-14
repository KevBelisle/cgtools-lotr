import { Center, Spinner, Text, VStack } from "@chakra-ui/react";

export const Loading = ({ message }: { message: string }) => {
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
          {message}
        </Text>
      </VStack>
    </Center>
  );
};

export default Loading;
