import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/cards/$cardSlug")({
  component: RouteComponent,
  //   staleTime: 30 * 60 * 1000, // 30 minutes
  //   preloadStaleTime: 30 * 60 * 1000, // 30 minutes
  loader: async ({ params, context }) => {
    console.log({ params, context });
    return context.test.sqljsDb.exec("SELECT * FROM cards LIMIT 1");
  },
});

function RouteComponent() {
  const { cardSlug } = Route.useParams();
  const posts = Route.useLoaderData();
  return (
    <div>
      Hello "/cards/{cardSlug}"! {JSON.stringify(posts)}
    </div>
  );
}
