import { NavMenu } from "@shopify/app-bridge-react";
import type { ReactElement } from "react";

/**
 * ShopifyNavigation Component
 * 
 * This component renders Shopify's native navigation menu using the NavMenu
 * component from App Bridge React. This integrates the navigation directly into
 * Shopify's admin UI instead of using a custom React component.
 * 
 * The navigation appears:
 * - On desktop: In the left sidebar of Shopify admin
 * - On mobile: In a dropdown from the app title bar
 */

interface NavItem {
  label: string;
  path: string;
}

export function ShopifyNavigation(): ReactElement {
  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Orders", path: "/app/orders" },
    { label: "Settings", path: "/app/settings" },
    { label: "Help", path: "/app/help" },
  ];

  return (
    <NavMenu>
      <a href="/app" rel="home" style={{ color: "green", fontSize: "16px", fontWeight: "bold" }}>
        Minimora
      </a>
      {navItems.map((item) => (
        <a key={item.path} href={item.path} style={{ color: "green", fontSize: "16px", fontWeight: "bold" }}>
          {item.label}
        </a>
      ))}
    </NavMenu>
  );
}
