import type { ReactElement } from "react";
import { useEffect } from "react";

/**
 * ShopifyNavigation Component
 * 
 * Renders navigation in Shopify admin sidebar using App Bridge Navigation Menu API
 */

export function ShopifyNavigation(): ReactElement {
  useEffect(() => {
    // Wait for App Bridge to be available
    const checkForShopify = () => {
      if (typeof (window as any).shopify !== "undefined") {
        // App Bridge is loaded, ui-nav-menu is available
        return true;
      }
      return false;
    };

    // Create nav menu if Shopify is available
    if (checkForShopify()) {
      const navMenu = document.createElement("ui-nav-menu");
      
      // Home item (required)
      const homeLink = document.createElement("a");
      homeLink.href = "/app";
      homeLink.rel = "home";
      homeLink.textContent = "Minimora";
      navMenu.appendChild(homeLink);

      // Navigation items
      const items = [
        { label: "Dashboard", path: "/app/dashboard" },
        { label: "Orders", path: "/app/orders" },
        { label: "Settings", path: "/app/settings" },
        { label: "Help", path: "/app/help" },
      ];

      items.forEach((item) => {
        const link = document.createElement("a");
        link.href = item.path;
        link.textContent = item.label;
        navMenu.appendChild(link);
      });

      // Append to body
      document.body.appendChild(navMenu);

      return () => {
        if (navMenu.parentElement) {
          navMenu.parentElement.removeChild(navMenu);
        }
      };
    }
  }, []);

  // Return empty - the ui-nav-menu element handles rendering in sidebar
  return <></>;
}
