import { CardSideTable } from "@/lotr/database-schema";

export const sortOptions: (keyof CardSideTable)[] = [
  "Title",
  "ResourceCost",
  "Willpower",
  "Attack",
  "Defense",
  "HitPoints",
  "ThreatCost",
  "EngagementCost",
  "QuestPoints",
  "VictoryPoints",
];

export default sortOptions;
