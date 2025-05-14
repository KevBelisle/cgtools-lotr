import { Center, ProgressCircle, Text, VStack } from "@chakra-ui/react";

export const Loading = ({
  message,
  progress,
}: {
  message: string;
  progress: number | undefined;
}) => {
  return (
    <Center mt={16}>
      <VStack>
        <ProgressCircle.Root
          value={progress ?? null}
          colorPalette={"teal"}
          size="xl"
        >
          <ProgressCircle.Circle>
            <ProgressCircle.Track />
            <ProgressCircle.Range strokeLinecap="round" />
          </ProgressCircle.Circle>
        </ProgressCircle.Root>
        <Text fontSize="md" mt={4} color="gray.400">
          {message}
        </Text>
      </VStack>
    </Center>
  );
};

export default Loading;
