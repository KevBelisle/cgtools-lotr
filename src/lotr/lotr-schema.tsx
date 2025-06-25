import { CardBaseQueryResult } from "@/lotr/database-schema";

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
  Orientation: "Horizontal" | "Vertical";
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
  RingsDbCode: string | null;
};

export type Card = {
  Slug: string;
  IsRCO: boolean;
  StandardCardBack: "Encounter" | "Player" | null;
  Front: CardSide;
  Back: CardSide | null;
  ProductCards: ProductCard[];
};

export function lotrCardFromCardBaseQuery(card: CardBaseQueryResult): Card {
  return {
    Slug: card["c.Slug"],
    IsRCO: card["c.IsRCO"] ?? false,
    StandardCardBack: card["c.StandardCardBack"],
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
    ProductCards: JSON.parse(card["ProductCards"] as any).map(
      (pc: any) =>
        ({
          Product: {
            Code: pc["p.Code"],
            Name: pc["p.Name"],
            Type: pc["p.Type"],
            Abbreviation: pc["p.Abbreviation"],
            Cycle: pc["p.Cycle"],
            FirstReleased: pc["p.FirstReleased"],
            IsRepackage: pc["p.IsRepackage"]!,
            ExpansionSymbol: pc["p.ExpansionSymbol"],
          } as Product,
          CardSlug: pc["pc.CardSlug"],
          Quantity: pc["pc.Quantity"],
          Number: pc["pc.Number"],
          FrontImageUrl: pc["pc.FrontImageUrl"],
          BackNumber: pc["pc.BackNumber"],
          BackImageUrl: pc["pc.BackImageUrl"],
          RingsDbCode: pc["pc.RingsDbCode"],
        }) as ProductCard,
    ),
  };
}
