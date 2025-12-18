import type { ReactElement } from "react";
import { Link, useLocation } from "react-router";

/**
 * ShopifyNavigation Component
 * 
 * Custom navigation menu for the Shopify app with active state styling
 */

interface NavItem {
  label: string;
  path: string;
}

export function ShopifyNavigation(): ReactElement {
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Orders", path: "/app/orders" },
    { label: "Settings", path: "/app/settings" },
    { label: "Help", path: "/app/help" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const styles = {
    nav: {
      display: "flex",
      gap: "0",
      borderBottom: "1px solid #e8eaed",
      marginBottom: "20px",
      flexWrap: "wrap" as const,
      backgroundColor: "#fff",
      padding: "0",
    },
    link: (active: boolean) => ({
      padding: "12px 16px",
      color: active ? "#1f9e6e" : "#5f6368",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: active ? "600" : "500" as const,
      borderBottom: active ? "3px solid #1f9e6e" : "3px solid transparent",
      backgroundColor: "transparent",
      transition: "all 0.2s ease",
      cursor: "pointer",
      display: "block",
      marginBottom: "-1px",
    }),
  };

  return (
    <nav style={styles.nav}>
      {navItems.map((item) => (
        <Link
          key={item.path}
          to={item.path}
          style={styles.link(isActive(item.path))}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  );
}
