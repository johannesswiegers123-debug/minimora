import { useEffect, useState } from "react";
import type { LoaderFunctionArgs } from "react-router";
import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  try {
    const { admin } = await authenticate.admin(request);
    
    const response = await admin.graphql(
      `#graphql
        query {
          orders(first: 100, sortKey: CREATED_AT, reverse: true) {
            edges {
              node {
                id
                name
                createdAt
                customer {
                  firstName
                  lastName
                  email
                }
                lineItems(first: 20) {
                  edges {
                    node {
                      quantity
                      title
                    }
                  }
                }
                note
                customAttributes {
                  key
                  value
                }
                subtotalPriceSet {
                  shopMoney {
                    amount
                    currencyCode
                  }
                }
                totalDiscountsSet {
                  shopMoney {
                    amount
                  }
                }
              }
            }
          }
        }
      `
    );

    const data = await response.json();
    const orders = data.data?.orders?.edges?.map((edge: any) => {
      const ecoAttribute = edge.node.customAttributes?.find(
        (attr: any) => attr.key === 'eco_packaging'
      );
      const hasEcoPackaging = ecoAttribute?.value === 'yes' || 
        edge.node.note?.toLowerCase().includes('eco') ||
        edge.node.note?.toLowerCase().includes('minimal packaging');

      return {
        id: edge.node.id,
        name: edge.node.name,
        createdAt: edge.node.createdAt,
        customer: edge.node.customer,
        lineItems: edge.node.lineItems?.edges?.map((le: any) => ({ 
          quantity: le.node.quantity,
          title: le.node.title 
        })) || [],
        subtotal: parseFloat(edge.node.subtotalPriceSet?.shopMoney?.amount || "0"),
        currency: edge.node.subtotalPriceSet?.shopMoney?.currencyCode || "DKK",
        discount: parseFloat(edge.node.totalDiscountsSet?.shopMoney?.amount || "0"),
        ecoPackaging: hasEcoPackaging,
      };
    }) || [];

    return { orders };
  } catch (error) {
    console.error("Error fetching orders:", error);
    return { orders: [] };
  }
};

export default function Orders() {
  const { orders } = useLoaderData<typeof loader>();
  const [filter, setFilter] = useState<'all' | 'eco' | 'standard'>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const filteredOrders = orders.filter((order: any) => {
    if (filter === 'eco') return order.ecoPackaging;
    if (filter === 'standard') return !order.ecoPackaging;
    return true;
  });

  const ecoCount = orders.filter((o: any) => o.ecoPackaging).length;
  const standardCount = orders.filter((o: any) => !o.ecoPackaging).length;

  const styles = {
    container: {
      fontFamily: "Inter, -apple-system, sans-serif",
      backgroundColor: "#fafbfc",
      padding: "32px",
      minHeight: "100vh",
      maxWidth: "1200px",
      margin: "0 auto",
    },
    header: {
      marginBottom: "24px",
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
    filters: {
      display: "flex",
      gap: "8px",
      marginBottom: "24px",
    },
    filterBtn: (active: boolean) => ({
      padding: "8px 16px",
      border: "1px solid #e8eaed",
      borderRadius: "20px",
      backgroundColor: active ? "#1f9e6e" : "#fff",
      color: active ? "#fff" : "#202124",
      fontSize: "13px",
      fontWeight: "500",
      cursor: "pointer",
    }),
    table: {
      width: "100%",
      borderCollapse: "collapse" as const,
      backgroundColor: "#fff",
      border: "1px solid #e8eaed",
      borderRadius: "8px",
      overflow: "hidden",
      boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
    },
    th: {
      padding: "14px 16px",
      textAlign: "left" as const,
      fontSize: "12px",
      fontWeight: "600",
      color: "#5f6368",
      textTransform: "uppercase" as const,
      backgroundColor: "#f8f9fa",
      borderBottom: "1px solid #e8eaed",
    },
    td: {
      padding: "14px 16px",
      borderBottom: "1px solid #e8eaed",
      fontSize: "14px",
      color: "#202124",
    },
    badge: (eco: boolean) => ({
      display: "inline-block",
      padding: "4px 10px",
      borderRadius: "12px",
      fontSize: "12px",
      fontWeight: "500",
      backgroundColor: eco ? "#d4edda" : "#f8f9fa",
      color: eco ? "#155724" : "#5f6368",
    }),
    emptyState: {
      textAlign: "center" as const,
      padding: "60px 20px",
      color: "#5f6368",
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>📦 All Orders</h1>
        <p style={styles.subtitle}>View all orders and their packaging choices</p>
      </div>

      <div style={styles.filters}>
        <button 
          style={styles.filterBtn(filter === 'all')} 
          onClick={() => setFilter('all')}
        >
          All Orders ({orders.length})
        </button>
        <button 
          style={styles.filterBtn(filter === 'eco')} 
          onClick={() => setFilter('eco')}
        >
          ✓ Eco Packaging ({ecoCount})
        </button>
        <button 
          style={styles.filterBtn(filter === 'standard')} 
          onClick={() => setFilter('standard')}
        >
          Standard ({standardCount})
        </button>
      </div>

      {filteredOrders.length === 0 ? (
        <div style={styles.emptyState}>
          <p style={{ fontSize: "48px", margin: "0 0 16px 0" }}>📭</p>
          <p style={{ fontSize: "16px", fontWeight: "500" }}>No orders found</p>
          <p style={{ fontSize: "14px" }}>Orders will appear here once customers place them</p>
        </div>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Order</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Customer</th>
              <th style={styles.th}>Items</th>
              <th style={styles.th}>Total</th>
              <th style={styles.th}>Packaging</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order: any) => (
              <tr key={order.id}>
                <td style={styles.td}>
                  <strong>{order.name}</strong>
                </td>
                <td style={styles.td}>
                  {new Date(order.createdAt).toLocaleDateString("da-DK")}
                </td>
                <td style={styles.td}>
                  {order.customer?.firstName} {order.customer?.lastName}
                  <br />
                  <span style={{ fontSize: "12px", color: "#5f6368" }}>
                    {order.customer?.email}
                  </span>
                </td>
                <td style={styles.td}>
                  {order.lineItems?.reduce((sum: number, li: any) => sum + li.quantity, 0) || 0} items
                </td>
                <td style={styles.td}>
                  {order.subtotal.toLocaleString("da-DK", { maximumFractionDigits: 0 })} {order.currency}
                </td>
                <td style={styles.td}>
                  <span style={styles.badge(order.ecoPackaging)}>
                    {order.ecoPackaging ? "✓ Eco" : "Standard"}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <div style={{ textAlign: "center", padding: "24px 0", fontSize: "12px", color: "#5f6368" }}>
        Showing {filteredOrders.length} of {orders.length} orders
      </div>
    </div>
  );
}
