import {
  Kysely,
  Selectable,
  DummyDriver,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";

export interface Database {
  cards: CardTable;
  cardSides: CardSideTable;
  productCards: ProductCardTable;
  products: ProductTable;
}

export interface CardTable {
  Slug: string;
  FrontSlug: string;
  BackSlug: string | null;
}

export interface CardSideTable {
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

  Search_Title: string;
  Search_Text: string;
  Search_FlavorText: string | null;
}

export interface ProductCardTable {
  ProductCode: string;
  CardSlug: string;
  Quantity: number;
  Number: string;
  FrontImageUrl: string;
  BackNumber: string | null;
  BackImageUrl: string | null;
  OctgnId: string | null;
  RingsDbCode: string | null;
}

export interface ProductTable {
  Code: string;
  Name: string;
  Type: string;
  Abbreviation: string;
  Category: string;
  Cycle: string | null;
  FirstReleased: string | null;
  IsRepackage: boolean;
  ExpansionSymbol: string | null;
}

export type Card = Selectable<CardTable>;
export type CardSide = Selectable<CardSideTable>;
export type ProductCard = Selectable<ProductCardTable>;
export type Product = Selectable<ProductTable>;

export const kysely = new Kysely<Database>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
});

export const cardBaseQuery = kysely
  .selectFrom("cards as c")
  .leftJoin("cardSides as f", "f.Slug", "c.FrontSlug")
  .leftJoin("cardSides as b", "b.Slug", "c.BackSlug")
  .leftJoin("productCards as pc", "pc.CardSlug", "c.Slug")
  .leftJoin("products as p", "p.Code", "pc.ProductCode")
  .select([
    "c.Slug as c.Slug",

    "f.Slug as f.Slug",
    "f.Title as f.Title",
    "f.Text as f.Text",
    "f.FlavorText as f.FlavorText",
    "f.Traits as f.Traits",
    "f.Keywords as f.Keywords",
    "f.Attack as f.Attack",
    "f.Defense as f.Defense",
    "f.HitPoints as f.HitPoints",
    "f.IsUnique as f.IsUnique",
    "f.ThreatCost as f.ThreatCost",
    "f.Willpower as f.Willpower",
    "f.ResourceCost as f.ResourceCost",
    "f.VictoryPoints as f.VictoryPoints",
    "f.QuestPoints as f.QuestPoints",
    "f.ThreatStrength as f.ThreatStrength",
    "f.EngagementCost as f.EngagementCost",
    "f.ShadowEffect as f.ShadowEffect",
    "f.MaxPerDeck as f.MaxPerDeck",
    "f.Orientation as f.Orientation",
    "f.Sphere as f.Sphere",
    "f.Subtype as f.Subtype",
    "f.Type as f.Type",
    "f.Direction as f.Direction",
    "f.Stage as f.Stage",

    "b.Slug as b.Slug",
    "b.Title as b.Title",
    "b.Text as b.Text",
    "b.FlavorText as b.FlavorText",
    "b.Traits as b.Traits",
    "b.Keywords as b.Keywords",
    "b.Attack as b.Attack",
    "b.Defense as b.Defense",
    "b.HitPoints as b.HitPoints",
    "b.IsUnique as b.IsUnique",
    "b.ThreatCost as b.ThreatCost",
    "b.Willpower as b.Willpower",
    "b.ResourceCost as b.ResourceCost",
    "b.VictoryPoints as b.VictoryPoints",
    "b.QuestPoints as b.QuestPoints",
    "b.ThreatStrength as b.ThreatStrength",
    "b.EngagementCost as b.EngagementCost",
    "b.ShadowEffect as b.ShadowEffect",
    "b.MaxPerDeck as b.MaxPerDeck",
    "b.Orientation as b.Orientation",
    "b.Sphere as b.Sphere",
    "b.Subtype as b.Subtype",
    "b.Type as b.Type",
    "b.Direction as b.Direction",
    "b.Stage as b.Stage",

    "pc.ProductCode as pc.ProductCode",
    "pc.CardSlug as pc.CardSlug",
    "pc.Quantity as pc.Quantity",
    "pc.Number as pc.Number",
    "pc.FrontImageUrl as pc.FrontImageUrl",
    "pc.BackNumber as pc.BackNumber",
    "pc.BackImageUrl as pc.BackImageUrl",
    "pc.OctgnId as pc.OctgnId",
    "pc.RingsDbCode as pc.RingsDbCode",

    "p.Code as p.Code",
    "p.Name as p.Name",
    "p.Type as p.Type",
    "p.Abbreviation as p.Abbreviation",
    "p.Category as p.Category",
    "p.Cycle as p.Cycle",
    "p.FirstReleased as p.FirstReleased",
    "p.IsRepackage as p.IsRepackage",
    "p.ExpansionSymbol as p.ExpansionSymbol",
  ]);

export type CardBaseQueryResult = {
  "c.Slug": string;

  "f.Slug": string;
  "f.Title": string;
  "f.Text": string;
  "f.FlavorText": string | null;
  "f.Traits": string;
  "f.Keywords": string;
  "f.Attack": number | null;
  "f.Defense": number | null;
  "f.HitPoints": number | null;
  "f.Willpower": number | null;
  "f.IsUnique": boolean | null;
  "f.ThreatCost": number | null;
  "f.ResourceCost": number | null;
  "f.VictoryPoints": number | null;
  "f.QuestPoints": number | null;
  "f.ThreatStrength": number | null;
  "f.EngagementCost": number | null;
  "f.ShadowEffect": string | null;
  "f.MaxPerDeck": number | null;
  "f.Orientation": string;
  "f.Sphere": string | null;
  "f.Type": string;
  "f.Direction": string | null;
  "f.Subtype": string | null;
  "f.Stage": string | null;

  "b.Slug": string;
  "b.Title": string;
  "b.Text": string;
  "b.FlavorText": string | null;
  "b.Traits": string;
  "b.Keywords": string;
  "b.Attack": number | null;
  "b.Defense": number | null;
  "b.HitPoints": number | null;
  "b.Willpower": number | null;
  "b.IsUnique": boolean | null;
  "b.ThreatCost": number | null;
  "b.ResourceCost": number | null;
  "b.VictoryPoints": number | null;
  "b.QuestPoints": number | null;
  "b.ThreatStrength": number | null;
  "b.EngagementCost": number | null;
  "b.ShadowEffect": string | null;
  "b.MaxPerDeck": number | null;
  "b.Orientation": string;
  "b.Sphere": string | null;
  "b.Type": string;
  "b.Direction": string | null;
  "b.Subtype": string | null;
  "b.Stage": string | null;

  "pc.ProductCode": string;
  "pc.CardSlug": string;
  "pc.Quantity": number;
  "pc.Number": string;
  "pc.FrontImageUrl": string;
  "pc.BackNumber": string | null;
  "pc.BackImageUrl": string | null;
  "pc.OctgnId": string | null;
  "pc.RingsDbCode": string | null;

  "p.Code": string;
  "p.Name": string;
  "p.Type": string;
  "p.Abbreviation": string;
  "p.Category": string;
  "p.Cycle": string | null;
  "p.FirstReleased": string | null;
  "p.IsRepackage": boolean;
  "p.ExpansionSymbol": string | null;
};
