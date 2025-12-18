import type { ReactElement } from "react";
import { Link, useLocation } from "react-router";

/**
 * ShopifyNavigation Component
 * 
 * A styled navigation section that appears in the app layout
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
    container: {
      backgroundColor: "#fff",
      borderBottom: "1px solid #e8eaed",
      padding: "0 32px",
      marginBottom: "0",
    } as React.CSSProperties,
    nav: {
      display: "flex",
      gap: "0",
      margin: "0",
      padding: "0",
      listStyle: "none" as const,
    } as React.CSSProperties,
    item: {
      display: "flex",
      alignItems: "center",
      height: "48px",
      padding: "0 16px",
      borderBottom: "3px solid transparent",
      margin: "0",
    } as React.CSSProperties,
    link: (active: boolean) => ({
      color: active ? "#1f9e6e" : "#5f6368",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: active ? "600" : "500" as const,
      borderBottom: active ? "3px solid #1f9e6e" : "none",
      backgroundColor: "transparent",
      transition: "all 0.2s ease",
      cursor: "pointer",
      display: "block",
      padding: "12px 0",
      marginBottom: "3px",
    }),
  };

  return (
    <div style={styles.container}>
      <ul style={styles.nav}>
        {navItems.map((item) => (
          <li key={item.path} style={styles.item}>
            <Link
              to={item.path}
              style={styles.link(isActive(item.path))}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
