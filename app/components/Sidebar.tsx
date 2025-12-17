import { Link, useLocation } from "react-router";

export function Navigation() {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const menuItems = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Orders", path: "/app/orders" },
    { label: "Settings", path: "/app/settings" },
    { label: "Help", path: "/app/help" },
  ];

  const styles = {
    nav: {
      display: "flex",
      gap: "0",
      borderBottom: "1px solid #e8eaed",
      marginBottom: "20px",
      flexWrap: "wrap" as const,
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
      {menuItems.map((item) => (
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
