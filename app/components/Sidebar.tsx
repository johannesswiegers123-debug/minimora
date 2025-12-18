import type { ReactElement } from "react";
import { Link, useLocation } from "react-router";

interface NavItem {
  label: string;
  path: string;
  icon: string;
  subItems?: NavItem[];
}

export function Sidebar(): ReactElement {
  const location = useLocation();

  const navItems: NavItem[] = [
    { label: "Dashboard", path: "/app/dashboard", icon: "📊" },
    { label: "Orders", path: "/app/orders", icon: "📦" },
    { label: "Settings", path: "/app/settings", icon: "⚙️" },
    { label: "Help", path: "/app/help", icon: "❓" },
  ];

  const isActive = (path: string) => location.pathname === path;

  const styles = {
    sidebar: {
      width: "240px",
      backgroundColor: "#f6f7f8",
      borderRight: "1px solid #e8eaed",
      height: "100vh",
      overflowY: "auto" as const,
      position: "fixed" as const,
      left: "0",
      top: "0",
      paddingTop: "20px",
    },
    nav: {
      display: "flex",
      flexDirection: "column" as const,
      gap: "8px",
      padding: "0 8px",
    },
    navItem: {
      display: "flex",
      alignItems: "center",
      gap: "12px",
      padding: "10px 16px",
      color: "#5f6368",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: "500" as const,
      backgroundColor: "transparent",
      transition: "all 0.2s ease",
      cursor: "pointer",
      borderRadius: "8px",
      border: "none",
    },
    navItemActive: {
      color: "#1f9e6e",
      backgroundColor: "#e8f5f0",
      fontWeight: "600" as const,
      borderLeft: "3px solid #1f9e6e",
      paddingLeft: "13px",
    },
    icon: {
      fontSize: "18px",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    label: {
      flex: "1",
    },
  };

  return (
    <aside style={styles.sidebar}>
      <nav style={styles.nav}>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            style={{
              ...styles.navItem,
              ...(isActive(item.path) ? styles.navItemActive : {}),
            }}
          >
            <span style={styles.icon}>{item.icon}</span>
            <span style={styles.label}>{item.label}</span>
          </Link>
        ))}
      </nav>
    </aside>
  );
}
