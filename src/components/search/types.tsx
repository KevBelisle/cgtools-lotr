import { CardSideTable } from "@/lotr/database-schema";

export type InputFilterType = {
  id: keyof CardSideTable;
  type: "input";
  label: string;
  placeholder: string;
  value?: string;
};

export type MultiselectFilterType = {
  id: keyof CardSideTable;
  type: "multiselect";
  label: string;
  placeholder: string;
  value?: string[];
  options: string[];
};

export type RangeFilterValueType = {
  range: [number, number];
  special: number[];
};
export type RangeFilterType = {
  id: keyof CardSideTable;
  type: "range";
  label: string;
  min: number;
  max: number;
  special: number[];
  value?: RangeFilterValueType;
};

export type SearchFilterType = (
  | InputFilterType
  | MultiselectFilterType
  | RangeFilterType
)[];
