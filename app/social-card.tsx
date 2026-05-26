export function SocialCard() {
  return (
    <div
      style={{
        alignItems: "stretch",
        background: "#f0fdfa",
        color: "#0f172a",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Arial, Helvetica, sans-serif",
        height: "100%",
        justifyContent: "space-between",
        padding: 72,
        width: "100%"
      }}
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            color: "#0f766e",
            fontSize: 28,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase"
          }}
        >
          SpendPilot AI
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 78,
            fontWeight: 800,
            letterSpacing: -2,
            lineHeight: 1.02,
            maxWidth: 940
          }}
        >
          Your AI Stack Is Probably Overpriced.
        </div>
        <div
          style={{
            color: "#334155",
            display: "flex",
            fontSize: 32,
            lineHeight: 1.35,
            maxWidth: 900
          }}
        >
          Deterministic audit math for AI plans, seats, API spend, and Credex credit opportunities.
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: 24
        }}
      >
        {["Plan traps", "API caps", "Shareable report"].map((label) => (
          <div
            key={label}
            style={{
              background: "#ffffff",
              border: "2px solid #99f6e4",
              borderRadius: 16,
              color: "#115e59",
              fontSize: 28,
              fontWeight: 700,
              padding: "20px 26px"
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
