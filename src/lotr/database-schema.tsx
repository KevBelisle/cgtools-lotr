import {
  DummyDriver,
  Kysely,
  QueryResult,
  Selectable,
  SqliteAdapter,
  SqliteIntrospector,
  SqliteQueryCompiler,
} from "kysely";
import { jsonArrayFrom } from "kysely/helpers/sqlite";

export interface Database {
  cards: CardTable;
  cardSides: CardSideTable;
  productCards: ProductCardTable;
  products: ProductTable;
  glossary: GlossaryTable;
  ruleBooks: RuleBookTable;
}

export interface CardTable {
  Slug: string;
  IsRCO: boolean;
  FrontSlug: string;
  BackSlug: string | null;
  StandardCardBack: "Encounter" | "Player" | null;
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
  Orientation: "Horizontal" | "Vertical";
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
  RingsDbCode: string | null;
}

export interface ProductTable {
  Code: string;
  Name: string;
  Type: string;
  Abbreviation: string;
  Cycle: string | null;
  FirstReleased: string | null;
  IsRepackage: boolean;
  ExpansionSymbol: string | null;
}

export interface GlossaryTable {
  Term: string;
  Type: string;
  Definition: string;
  SeeAlso: string | null;
  Source: string | null;
}

export interface RuleBookTable {
  Filename: string;
  Source: string | null;
  ProductCode: string | null;
  Title: string;
}

export type Card = Selectable<CardTable>;
export type CardSide = Selectable<CardSideTable>;
export type ProductCard = Selectable<ProductCardTable>;
export type Product = Selectable<ProductTable>;
export type Glossary = Selectable<GlossaryTable>;
export type RuleBook = Selectable<RuleBookTable>;

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
  .select((eb) => [
    "c.Slug as c.Slug",
    "c.IsRCO as c.IsRCO",
    "c.StandardCardBack as c.StandardCardBack",

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
    jsonArrayFrom(
      eb
        .selectFrom("productCards as pc")
        .leftJoin("products as p", "p.Code", "pc.ProductCode")
        .select([
          "pc.ProductCode as pc.ProductCode",
          "pc.CardSlug as pc.CardSlug",
          "pc.Quantity as pc.Quantity",
          "pc.Number as pc.Number",
          "pc.FrontImageUrl as pc.FrontImageUrl",
          "pc.BackNumber as pc.BackNumber",
          "pc.BackImageUrl as pc.BackImageUrl",
          "pc.RingsDbCode as pc.RingsDbCode",

          "p.Code as p.Code",
          "p.Name as p.Name",
          "p.Type as p.Type",
          "p.Abbreviation as p.Abbreviation",
          "p.Cycle as p.Cycle",
          "p.FirstReleased as p.FirstReleased",
          "p.IsRepackage as p.IsRepackage",
          "p.ExpansionSymbol as p.ExpansionSymbol",
        ])
        .whereRef("pc.CardSlug", "=", "c.Slug")
        .orderBy("p.Code"),
    ).as("ProductCards"),
  ]);

const compiledCardBaseQuery = cardBaseQuery.compile();
type CompiledCardBaseQuery = typeof compiledCardBaseQuery;

export function execCompiledQuery(
  compiledQuery: CompiledCardBaseQuery,
  db: Kysely<Database>,
) {
  return db.executeQuery(compiledQuery);
}
type extractGeneric<Type> = Type extends QueryResult<infer X> ? X : never;
export type CardBaseQueryResult = extractGeneric<
  Awaited<ReturnType<typeof execCompiledQuery>>
>;
