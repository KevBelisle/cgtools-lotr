import { CardBaseQueryResult } from "@/sqljs/database-schema";

export type CardSide = {
  Slug: string;
  Title: string;
  Text: string;
  FlavorText: string | null;
  Traits: string;
  Keywords: string;

  Attack: number | null;
  Defense: number | null;
  HitPoints: number | null;
  Willpower: number | null;
  IsUnique: boolean | null;
  ThreatCost: number | null;
  ResourceCost: number | null;
  VictoryPoints: number | null;
  QuestPoints: number | null;
  ThreatStrength: number | null;
  EngagementCost: number | null;
  ShadowEffect: string | null;
  MaxPerDeck: number | null;
  Orientation: string;
  Sphere: string | null;
  Type: string;
  Direction: string | null;
  Subtype: string | null;
  Stage: string | null;
};

export type Product = {
  Code: string;
  Name: string;
  Type: string;
  Abbreviation: string;
  Category: string;
  Cycle: string | null;
  FirstReleased: string | null;
  IsRepackage: boolean;
  ExpansionSymbol: string | null;
};

export type ProductCard = {
  Product: Product;
  CardSlug: string;
  Quantity: number;
  Number: string;
  FrontImageUrl: string;
  BackNumber: string | null;
  BackImageUrl: string | null;
  OctgnId: string | null;
  RingsDbCode: string | null;
};

export type Card = {
  Slug: string;
  Front: CardSide;
  Back: CardSide | null;
  ProductCard: ProductCard | null;
};

export function lotrCardFromCardBaseQuery(card: CardBaseQueryResult): Card {
  return {
    Slug: card["c.Slug"],
    Front: {
      Slug: card["f.Slug"]!,
      Title: card["f.Title"]!,
      Text: card["f.Text"]!,
      FlavorText: card["f.FlavorText"],
      Traits: card["f.Traits"]!,
      Keywords: card["f.Keywords"]!,

      Attack: card["f.Attack"],
      Defense: card["f.Defense"],
      HitPoints: card["f.HitPoints"],
      Willpower: card["f.Willpower"],
      IsUnique: card["f.IsUnique"],
      ThreatCost: card["f.ThreatCost"],
      ResourceCost: card["f.ResourceCost"],
      VictoryPoints: card["f.VictoryPoints"],
      QuestPoints: card["f.QuestPoints"],
      ThreatStrength: card["f.ThreatStrength"],
      EngagementCost: card["f.EngagementCost"],
      ShadowEffect: card["f.ShadowEffect"],
      MaxPerDeck: card["f.MaxPerDeck"],
      Orientation: card["f.Orientation"]!,
      Sphere: card["f.Sphere"],
      Type: card["f.Type"]!,
      Direction: card["f.Direction"],
      Subtype: card["f.Subtype"],
      Stage: card["f.Stage"],
    },
    Back: {
      Slug: card["b.Slug"]!,
      Title: card["b.Title"]!,
      Text: card["b.Text"]!,
      FlavorText: card["b.FlavorText"],
      Traits: card["b.Traits"]!,
      Keywords: card["b.Keywords"]!,

      Attack: card["b.Attack"],
      Defense: card["b.Defense"],
      HitPoints: card["b.HitPoints"],
      Willpower: card["b.Willpower"],
      IsUnique: card["b.IsUnique"],
      ThreatCost: card["b.ThreatCost"],
      ResourceCost: card["b.ResourceCost"],
      VictoryPoints: card["b.VictoryPoints"],
      QuestPoints: card["b.QuestPoints"],
      ThreatStrength: card["b.ThreatStrength"],
      EngagementCost: card["b.EngagementCost"],
      ShadowEffect: card["b.ShadowEffect"],
      MaxPerDeck: card["b.MaxPerDeck"],
      Orientation: card["b.Orientation"]!,
      Sphere: card["b.Sphere"],
      Type: card["b.Type"]!,
      Direction: card["b.Direction"],
      Subtype: card["b.Subtype"],
      Stage: card["b.Stage"],
    },
    ProductCard: {
      Product: {
        Code: card["p.Code"]!,
        Name: card["p.Name"]!,
        Type: card["p.Type"]!,
        Abbreviation: card["p.Abbreviation"]!,
        Category: card["p.Category"]!,
        Cycle: card["p.Cycle"],
        FirstReleased: card["p.FirstReleased"],
        IsRepackage: card["p.IsRepackage"]!,
        ExpansionSymbol: card["p.ExpansionSymbol"],
      },
      CardSlug: card["pc.CardSlug"]!,
      Quantity: card["pc.Quantity"]!,
      Number: card["pc.Number"]!,
      FrontImageUrl: card["pc.FrontImageUrl"]!,
      BackNumber: card["pc.BackNumber"],
      BackImageUrl: card["pc.BackImageUrl"],
      OctgnId: card["pc.OctgnId"],
      RingsDbCode: card["pc.RingsDbCode"],
    },
  };
}
