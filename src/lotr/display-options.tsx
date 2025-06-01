import { FullCard } from "@/lotr/full-card";
import type { Card } from "@/lotr/lotr-schema";
import { SmallCard } from "@/lotr/small-card";
import type { JSX } from "react";
import type { IconType } from "react-icons/lib";

import { LuRectangleHorizontal, LuRows2 } from "react-icons/lu";

export type DisplayOptionType = {
  name: string;
  component: ({ card }: { card: Card }) => JSX.Element;
  icon: IconType;
};

export const displayOptions: DisplayOptionType[] = [
  {
    name: "Small card",
    component: SmallCard,
    icon: LuRectangleHorizontal,
  },
  { name: "Full card", component: FullCard, icon: LuRows2 },
];

export type DisplayOptionsType = typeof displayOptions;
export default displayOptions;
