import { createFileRoute } from "@tanstack/react-router";
import { Card } from "@chakra-ui/react";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return (
    <Card.Root>
      <Card.Header>
        <Card.Title>Home</Card.Title>
        <Card.Description>Welcome to the home page!</Card.Description>
      </Card.Header>
    </Card.Root>
  );
}
