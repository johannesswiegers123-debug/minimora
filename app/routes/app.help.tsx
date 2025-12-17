import { useState, useEffect } from "react";

export default function Help() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const faqs = [
    {
      question: "How does eco packaging work?",
      answer: "When a customer adds items to their cart, they see an option to choose minimal packaging. If they select it, they get a discount (default 5%) and you save on packaging materials."
    },
    {
      question: "How is the discount applied?",
      answer: "The discount is automatically applied when the customer selects eco packaging. You can configure the discount percentage in Settings."
    },
    {
      question: "Where does the eco option appear?",
      answer: "The eco packaging toggle appears on product pages. You need to add the 'Eco Packaging' app block to your theme in the Theme Editor."
    },
    {
      question: "How do I add the widget to my theme?",
      answer: "Go to Online Store → Themes → Customize. Navigate to a product page, click 'Add block', and select 'Eco Packaging' from the app blocks."
    },
    {
      question: "How are savings calculated?",
      answer: "Savings = (Number of eco orders) × (Your packaging cost per order). You can set your packaging cost in Settings."
    },
    {
      question: "Can I see which customers chose eco packaging?",
      answer: "Yes! Go to the Orders page to see all orders with their packaging choice. You can filter by eco packaging only."
    },
  ];

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
    faqItem: {
      borderBottom: "1px solid #e8eaed",
    },
    faqQuestion: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "16px 0",
      cursor: "pointer",
      fontSize: "14px",
      fontWeight: "500",
      color: "#202124",
    },
    faqAnswer: {
      padding: "0 0 16px 0",
      fontSize: "14px",
      color: "#5f6368",
      lineHeight: "1.6",
    },
    step: {
      display: "flex",
      gap: "16px",
      padding: "16px 0",
      borderBottom: "1px solid #e8eaed",
    },
    stepNumber: {
      width: "32px",
      height: "32px",
      backgroundColor: "#1f9e6e",
      color: "#fff",
      borderRadius: "50%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "600",
      fontSize: "14px",
      flexShrink: 0,
    },
    stepContent: {
      flex: 1,
    },
    stepTitle: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#202124",
      marginBottom: "4px",
    },
    stepDescription: {
      fontSize: "13px",
      color: "#5f6368",
      lineHeight: "1.5",
    },
    contactCard: {
      backgroundColor: "#f0fdf4",
      border: "1px solid #bbf7d0",
      borderRadius: "8px",
      padding: "24px",
      textAlign: "center" as const,
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>❓ Help & Support</h1>
        <p style={styles.subtitle}>Learn how to use Eco Packaging effectively</p>
      </div>

      {/* Quick Start */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>🚀 Quick Start Guide</h2>
        
        <div style={styles.step}>
          <div style={styles.stepNumber}>1</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>Add the widget to your theme</div>
            <div style={styles.stepDescription}>
              Go to Online Store → Themes → Customize → Product page → Add block → Eco Packaging
            </div>
          </div>
        </div>

        <div style={styles.step}>
          <div style={styles.stepNumber}>2</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>Configure your settings</div>
            <div style={styles.stepDescription}>
              Set your discount percentage and estimated packaging cost in the Settings page
            </div>
          </div>
        </div>

        <div style={styles.step}>
          <div style={styles.stepNumber}>3</div>
          <div style={styles.stepContent}>
            <div style={styles.stepTitle}>Start saving!</div>
            <div style={styles.stepDescription}>
              Watch your dashboard as customers choose eco packaging and you save on materials
            </div>
          </div>
        </div>
      </div>

      {/* FAQ */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>💬 Frequently Asked Questions</h2>
        
        {faqs.map((faq, index) => (
          <div key={index} style={index < faqs.length - 1 ? styles.faqItem : {}}>
            <div 
              style={styles.faqQuestion}
              onClick={() => setOpenFaq(openFaq === index ? null : index)}
            >
              <span>{faq.question}</span>
              <span style={{ color: "#5f6368", fontSize: "20px" }}>
                {openFaq === index ? "−" : "+"}
              </span>
            </div>
            {openFaq === index && (
              <div style={styles.faqAnswer}>{faq.answer}</div>
            )}
          </div>
        ))}
      </div>

      {/* Contact */}
      <div style={styles.contactCard}>
        <p style={{ fontSize: "24px", margin: "0 0 12px 0" }}>📧</p>
        <p style={{ fontSize: "16px", fontWeight: "600", color: "#202124", margin: "0 0 8px 0" }}>
          Need more help?
        </p>
        <p style={{ fontSize: "14px", color: "#5f6368", margin: 0 }}>
          Contact us at support@minimora.app
        </p>
      </div>
    </div>
  );
}
