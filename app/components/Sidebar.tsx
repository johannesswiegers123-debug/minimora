import { Link, useLocation } from "react-router";

export function SidebarLayout({ children }: { children: React.ReactNode }) {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const styles = {
    sidebar: {
      width: "250px",
      backgroundColor: "#f8f9fa",
      borderRight: "1px solid #e8eaed",
      padding: "20px 0",
      height: "100vh",
      position: "fixed" as const,
      left: 0,
      top: 0,
      overflowY: "auto" as const,
      zIndex: 1000,
    },
    container: {
      display: "flex",
      minHeight: "100vh",
      width: "100%",
    },
    content: {
      marginLeft: "250px",
      flex: 1,
      width: "calc(100% - 250px)",
      backgroundColor: "#fff",
    },
    title: {
      padding: "16px 20px",
      fontSize: "18px",
      fontWeight: "700" as const,
      color: "#202124",
      margin: "0 0 20px 0",
    },
    nav: {
      display: "flex",
      flexDirection: "column" as const,
    },
    link: (active: boolean) => ({
      padding: "12px 20px",
      color: active ? "#1f9e6e" : "#5f6368",
      textDecoration: "none",
      fontSize: "14px",
      fontWeight: active ? "600" : "500" as const,
      borderLeft: active ? "3px solid #1f9e6e" : "3px solid transparent",
      paddingLeft: active ? "17px" : "20px",
      backgroundColor: active ? "#f0fdf4" : "transparent",
      transition: "all 0.2s ease",
      cursor: "pointer",
      display: "block",
    }),
  };

  const menuItems = [
    { label: "Dashboard", path: "/app/dashboard" },
    { label: "Orders", path: "/app/orders" },
    { label: "Settings", path: "/app/settings" },
    { label: "Help", path: "/app/help" },
  ];

  return (
    <div style={styles.container}>
      <div style={styles.sidebar}>
        <h1 style={styles.title}>minimora</h1>
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
      </div>
      <div style={styles.content}>{children}</div>
    </div>
  );
}
