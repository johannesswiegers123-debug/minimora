import type { LoaderFunctionArgs } from "react-router";
import { Outlet, useLoaderData, useRouteError } from "react-router";
import { boundary } from "@shopify/shopify-app-react-router/server";
import { AppProvider } from "@shopify/shopify-app-react-router/react";
import { NavigationMenu } from "@shopify/app-bridge-react";

import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    await authenticate.admin(request);
  } catch (error) {
    // Continue without requiring auth - let the child routes handle it
  }
  return { apiKey: process.env.SHOPIFY_API_KEY || "" };
};

export default function App() {
  const { apiKey } = useLoaderData<typeof loader>();

  return (
    <AppProvider embedded apiKey={apiKey}>
      <NavigationMenu
        navigationLinks={[
          {
            label: "Dashboard",
            destination: "/app",
          },
          {
            label: "Orders",
            destination: "/app/orders",
          },
          {
            label: "Settings",
            destination: "/app/settings",
          },
          {
            label: "Help",
            destination: "/app/help",
          },
        ]}
        matcher={(link, location) => {
          if (link.destination === "/app" && location.pathname === "/app") {
            return true;
          }
          return location.pathname.startsWith(link.destination) && link.destination !== "/app";
        }}
      />
      <Outlet />
    </AppProvider>
  );
}

// Shopify needs React Router to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}
  return boundary.error(useRouteError());
}

