import { Card as GameCard } from "@/lotr/lotr-schema";

// Custom comparison function for memoization
export const arePropsEqual = (
  prevProps: { card: GameCard },
  nextProps: { card: GameCard },
) => {
  // Compare card properties that matter for rendering
  return (
    prevProps.card.Slug === nextProps.card.Slug &&
    prevProps.card.Front.Title === nextProps.card.Front.Title &&
    prevProps.card.Front.Sphere === nextProps.card.Front.Sphere &&
    prevProps.card.Front.IsUnique === nextProps.card.Front.IsUnique &&
    prevProps.card.Front.Stage === nextProps.card.Front.Stage
  );
};
