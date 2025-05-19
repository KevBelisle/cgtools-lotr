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
  Search_Title: string;
  Search_Text: string;
  Search_FlavorText: string | null;
}

export interface ProductCardTable {
  CardSlug: string;
  FrontImageUrl: string;
}

export type Card = Selectable<CardTable>;
export type CardSide = Selectable<CardSideTable>;
export type ProductCard = Selectable<ProductCardTable>;

export const kysely = new Kysely<Database>({
  dialect: {
    createAdapter: () => new SqliteAdapter(),
    createDriver: () => new DummyDriver(),
    createIntrospector: (db) => new SqliteIntrospector(db),
    createQueryCompiler: () => new SqliteQueryCompiler(),
  },
});
