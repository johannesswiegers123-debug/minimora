import { useState, useEffect } from "react";

export default function Settings() {
  const [mounted, setMounted] = useState(false);
  const [settings, setSettings] = useState({
    enabled: true,
    discountPercent: 5,
    packagingCost: 8,
    showOnProductPage: true,
    showOnCart: false,
    language: 'en',
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('eco_packaging_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const handleSave = () => {
    localStorage.setItem('eco_packaging_settings', JSON.stringify(settings));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  if (!mounted) return null;

  const styles = {
    container: {
      fontFamily: "Inter, -apple-system, sans-serif",
      backgroundColor: "#fafbfc",
      padding: "32px",
      minHeight: "100vh",
      maxWidth: "800px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "32px",
    },
    title: {
      fontSize: "28px",
      fontWeight: "600",
      margin: "0 0 8px 0",
      color: "#202124",
    },
    subtitle: {
      fontSize: "14px",
      color: "#5f6368",
      margin: 0,
    },
    card: {
      backgroundColor: "#fff",
      border: "1px solid #e8eaed",
      borderRadius: "8px",
      padding: "24px",
      marginBottom: "24px",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    cardTitle: {
      fontSize: "16px",
      fontWeight: "600",
      margin: "0 0 16px 0",
      color: "#202124",
    },
    row: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      borderBottom: "1px solid #e8eaed",
    },
    rowLast: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
    },
    label: {
      fontSize: "14px",
      fontWeight: "500",
      color: "#202124",
    },
    description: {
      fontSize: "13px",
      color: "#5f6368",
      marginTop: "4px",
    },
    input: {
      padding: "10px 14px",
      border: "1px solid #d2d3d4",
      borderRadius: "6px",
      fontSize: "14px",
      width: "120px",
      textAlign: "right" as const,
    },
    select: {
      padding: "10px 14px",
      border: "1px solid #d2d3d4",
      borderRadius: "6px",
      fontSize: "14px",
      backgroundColor: "#fff",
    },
    toggle: (enabled: boolean) => ({
      width: "50px",
      height: "28px",
      backgroundColor: enabled ? "#1f9e6e" : "#d2d3d4",
      border: "none",
      borderRadius: "14px",
      cursor: "pointer",
      position: "relative" as const,
      transition: "background-color 0.2s",
    }),
    toggleKnob: (enabled: boolean) => ({
      position: "absolute" as const,
      top: "3px",
      left: enabled ? "25px" : "3px",
      width: "22px",
      height: "22px",
      backgroundColor: "#fff",
      borderRadius: "50%",
      transition: "left 0.2s",
      boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
    }),
    button: {
      padding: "12px 24px",
      backgroundColor: "#1f9e6e",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "600",
      cursor: "pointer",
    },
    savedBadge: {
      display: "inline-block",
      padding: "8px 16px",
      backgroundColor: "#d4edda",
      color: "#155724",
      borderRadius: "6px",
      fontSize: "14px",
      fontWeight: "500",
      marginLeft: "12px",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>⚙️ Settings</h1>
        <p style={styles.subtitle}>Configure your eco packaging options</p>
      </div>

      {/* Main Toggle */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Feature Status</h2>
        <div style={styles.rowLast}>
          <div>
            <div style={styles.label}>Enable Eco Packaging</div>
            <div style={styles.description}>Show the eco packaging option to customers</div>
          </div>
          <button 
            style={styles.toggle(settings.enabled)}
            onClick={() => setSettings({...settings, enabled: !settings.enabled})}
          >
            <span style={styles.toggleKnob(settings.enabled)} />
          </button>
        </div>
      </div>

      {/* Discount Settings */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Discount & Pricing</h2>
        <div style={styles.row}>
          <div>
            <div style={styles.label}>Discount Percentage</div>
            <div style={styles.description}>Discount given when customer chooses eco packaging</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="number"
              style={styles.input}
              value={settings.discountPercent}
              onChange={(e) => setSettings({...settings, discountPercent: parseInt(e.target.value) || 0})}
              min="0"
              max="100"
            />
            <span style={{ color: "#5f6368" }}>%</span>
          </div>
        </div>
        <div style={styles.rowLast}>
          <div>
            <div style={styles.label}>Packaging Cost</div>
            <div style={styles.description}>Your estimated cost per package (for savings calculation)</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <input
              type="number"
              style={styles.input}
              value={settings.packagingCost}
              onChange={(e) => setSettings({...settings, packagingCost: parseInt(e.target.value) || 0})}
              min="0"
            />
            <span style={{ color: "#5f6368" }}>kr</span>
          </div>
        </div>
      </div>

      {/* Display Settings */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>Display Options</h2>
        <div style={styles.row}>
          <div>
            <div style={styles.label}>Show on Product Page</div>
            <div style={styles.description}>Display eco option on product pages</div>
          </div>
          <button 
            style={styles.toggle(settings.showOnProductPage)}
            onClick={() => setSettings({...settings, showOnProductPage: !settings.showOnProductPage})}
          >
            <span style={styles.toggleKnob(settings.showOnProductPage)} />
          </button>
        </div>
        <div style={styles.rowLast}>
          <div>
            <div style={styles.label}>Language</div>
            <div style={styles.description}>Language for customer-facing text</div>
          </div>
          <select 
            style={styles.select}
            value={settings.language}
            onChange={(e) => setSettings({...settings, language: e.target.value})}
          >
            <option value="en">English</option>
            <option value="da">Dansk</option>
          </select>
        </div>
      </div>

      {/* Save Button */}
      <div style={{ display: "flex", alignItems: "center" }}>
        <button style={styles.button} onClick={handleSave}>
          Save Settings
        </button>
        {saved && <span style={styles.savedBadge}>✓ Saved!</span>}
      </div>
    </div>
  );
}
