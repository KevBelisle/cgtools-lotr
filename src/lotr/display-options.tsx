import { ArtOnly } from "@/lotr/display/art-only";
import { FullCard } from "@/lotr/display/full-card";
import { SmallCard } from "@/lotr/display/small-card";
import type { Card } from "@/lotr/lotr-schema";
import type { ComponentType } from "react";
import type { IconType } from "react-icons/lib";

import {
  LuFile,
  LuFileSpreadsheet,
  LuRectangleHorizontal,
  LuRows2,
} from "react-icons/lu";
import { SmallCardWithArt } from "./display/small-card-with-art";

export type DisplayOptionType = {
  name: string;
  component: ComponentType<{ card: Card }>;
  icon: IconType;
  minWidth?: string;
};

export const displayOptions: DisplayOptionType[] = [
  {
    name: "Small card",
    component: SmallCard,
    icon: LuRectangleHorizontal,
    minWidth: "400px",
  },
  { name: "Full card", component: FullCard, icon: LuRows2, minWidth: "400px" },
  {
    name: "Small card + art",
    component: SmallCardWithArt,
    icon: LuFileSpreadsheet,
    minWidth: "400px",
  },
  { name: "Art only", component: ArtOnly, icon: LuFile, minWidth: "300px" },
];

export type DisplayOptionsType = typeof displayOptions;
export default displayOptions;
