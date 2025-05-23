/* eslint-disable */

// @ts-nocheck

// noinspection JSUnusedGlobalSymbols

// This file was automatically generated by TanStack Router.
// You should NOT make any changes in this file as it will be overwritten.
// Additionally, you should also exclude this file from your linter and/or formatter to prevent it from being checked or modified.

// Import Routes

import { Route as rootRoute } from './routes/__root'
import { Route as DebugImport } from './routes/debug'
import { Route as IndexImport } from './routes/index'
import { Route as CardsSearchImport } from './routes/cards/search'
import { Route as CardsCardSlugImport } from './routes/cards/$cardSlug'

// Create/Update Routes

const DebugRoute = DebugImport.update({
  id: '/debug',
  path: '/debug',
  getParentRoute: () => rootRoute,
} as any)

const IndexRoute = IndexImport.update({
  id: '/',
  path: '/',
  getParentRoute: () => rootRoute,
} as any)

const CardsSearchRoute = CardsSearchImport.update({
  id: '/cards/search',
  path: '/cards/search',
  getParentRoute: () => rootRoute,
} as any)

const CardsCardSlugRoute = CardsCardSlugImport.update({
  id: '/cards/$cardSlug',
  path: '/cards/$cardSlug',
  getParentRoute: () => rootRoute,
} as any)

// Populate the FileRoutesByPath interface

declare module '@tanstack/react-router' {
  interface FileRoutesByPath {
    '/': {
      id: '/'
      path: '/'
      fullPath: '/'
      preLoaderRoute: typeof IndexImport
      parentRoute: typeof rootRoute
    }
    '/debug': {
      id: '/debug'
      path: '/debug'
      fullPath: '/debug'
      preLoaderRoute: typeof DebugImport
      parentRoute: typeof rootRoute
    }
    '/cards/$cardSlug': {
      id: '/cards/$cardSlug'
      path: '/cards/$cardSlug'
      fullPath: '/cards/$cardSlug'
      preLoaderRoute: typeof CardsCardSlugImport
      parentRoute: typeof rootRoute
    }
    '/cards/search': {
      id: '/cards/search'
      path: '/cards/search'
      fullPath: '/cards/search'
      preLoaderRoute: typeof CardsSearchImport
      parentRoute: typeof rootRoute
    }
  }
}

// Create and export the route tree

export interface FileRoutesByFullPath {
  '/': typeof IndexRoute
  '/debug': typeof DebugRoute
  '/cards/$cardSlug': typeof CardsCardSlugRoute
  '/cards/search': typeof CardsSearchRoute
}

export interface FileRoutesByTo {
  '/': typeof IndexRoute
  '/debug': typeof DebugRoute
  '/cards/$cardSlug': typeof CardsCardSlugRoute
  '/cards/search': typeof CardsSearchRoute
}

export interface FileRoutesById {
  __root__: typeof rootRoute
  '/': typeof IndexRoute
  '/debug': typeof DebugRoute
  '/cards/$cardSlug': typeof CardsCardSlugRoute
  '/cards/search': typeof CardsSearchRoute
}

export interface FileRouteTypes {
  fileRoutesByFullPath: FileRoutesByFullPath
  fullPaths: '/' | '/debug' | '/cards/$cardSlug' | '/cards/search'
  fileRoutesByTo: FileRoutesByTo
  to: '/' | '/debug' | '/cards/$cardSlug' | '/cards/search'
  id: '__root__' | '/' | '/debug' | '/cards/$cardSlug' | '/cards/search'
  fileRoutesById: FileRoutesById
}

export interface RootRouteChildren {
  IndexRoute: typeof IndexRoute
  DebugRoute: typeof DebugRoute
  CardsCardSlugRoute: typeof CardsCardSlugRoute
  CardsSearchRoute: typeof CardsSearchRoute
}

const rootRouteChildren: RootRouteChildren = {
  IndexRoute: IndexRoute,
  DebugRoute: DebugRoute,
  CardsCardSlugRoute: CardsCardSlugRoute,
  CardsSearchRoute: CardsSearchRoute,
}

export const routeTree = rootRoute
  ._addFileChildren(rootRouteChildren)
  ._addFileTypes<FileRouteTypes>()

/* ROUTE_MANIFEST_START
{
  "routes": {
    "__root__": {
      "filePath": "__root.tsx",
      "children": [
        "/",
        "/debug",
        "/cards/$cardSlug",
        "/cards/search"
      ]
    },
    "/": {
      "filePath": "index.tsx"
    },
    "/debug": {
      "filePath": "debug.tsx"
    },
    "/cards/$cardSlug": {
      "filePath": "cards/$cardSlug.tsx"
    },
    "/cards/search": {
      "filePath": "cards/search.tsx"
    }
  }
}
ROUTE_MANIFEST_END */
