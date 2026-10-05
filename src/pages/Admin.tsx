import { useState } from "react";
import { trpc } from "@/providers/trpc";

const STATUS_LABEL: Record<string, string> = {
  new: "New",
  confirmed: "Confirmed",
  shipped: "Shipped",
  cancelled: "Cancelled",
};

const STATUS_COLOR: Record<string, string> = {
  new: "#e8a33d",
  confirmed: "#1fb457",
  shipped: "#1a5fb4",
  cancelled: "#c0392b",
};

export default function Admin() {
  const [key, setKey] = useState(() => sessionStorage.getItem("adminKey") || "");
  const [input, setInput] = useState("");
  const [confirmId, setConfirmId] = useState<number | null>(null);

  const ordersQuery = trpc.orders.list.useQuery(
    { adminKey: key },
    { enabled: !!key, retry: false, refetchInterval: 15000 },
  );
  const setStatus = trpc.orders.setStatus.useMutation({
    onSuccess: () => ordersQuery.refetch(),
  });
  const deleteOrder = trpc.orders.delete.useMutation({
    onSuccess: () => {
      setConfirmId(null);
      ordersQuery.refetch();
    },
  });

  const wrongKey = ordersQuery.isError;

  if (!key || wrongKey) {
    return (
      <div style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#0a0a0a", fontFamily: "system-ui, sans-serif" }}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            sessionStorage.setItem("adminKey", input);
            setKey(input);
          }}
          style={{ background: "#141414", border: "1px solid #2a2a2a", borderRadius: 12, padding: 40, width: "min(380px, 90vw)", textAlign: "center" }}
        >
          <h1 style={{ color: "#fff", fontSize: 22, marginBottom: 6 }}>Orders Dashboard</h1>
          <p style={{ color: "#888", fontSize: 13, marginBottom: 24 }}>Enter your password to view orders</p>
          <input
            type="password"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Password"
            style={{ width: "100%", padding: "13px 16px", borderRadius: 8, border: "1px solid #333", background: "#0a0a0a", color: "#fff", fontSize: 15, boxSizing: "border-box" }}
          />
          {wrongKey && key && (
            <p style={{ color: "#e74c3c", fontSize: 13, margin: "10px 0 0" }}>Wrong password, try again.</p>
          )}
          <button
            type="submit"
            style={{ width: "100%", marginTop: 16, padding: 14, borderRadius: 8, border: "none", background: "#25D366", color: "#fff", fontWeight: 800, fontSize: 15, cursor: "pointer" }}
          >
            Sign in
          </button>
        </form>
      </div>
    );
  }

  const orders = ordersQuery.data || [];
  const newCount = orders.filter((o) => o.status === "new").length;

  return (
    <div dir="ltr" style={{ minHeight: "100vh", background: "#0a0a0a", fontFamily: "system-ui, sans-serif", color: "#fff", padding: "32px 20px" }}>
      <div style={{ maxWidth: 1000, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
          <div>
            <h1 style={{ fontSize: 26 }}>Estilo-Co Orders</h1>
            <p style={{ color: "#888", fontSize: 13, marginTop: 4 }}>
              Total: {orders.length} · New: {newCount} · Auto-refresh every 15s
            </p>
          </div>
          <button
            onClick={() => { sessionStorage.removeItem("adminKey"); setKey(""); }}
            style={{ background: "none", border: "1px solid #333", color: "#888", padding: "8px 16px", borderRadius: 8, cursor: "pointer", fontSize: 13 }}
          >
            Sign out
          </button>
        </div>

        {ordersQuery.isLoading && <p style={{ color: "#888" }}>Loading orders…</p>}

        {!ordersQuery.isLoading && orders.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0", color: "#666" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>📦</div>
            No orders yet. New orders will show up here.
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {orders.map((o) => (
            <div
              key={o.id}
              style={{
                background: "#141414",
                border: "1px solid " + (o.status === "new" ? "#e8a33d55" : "#262626"),
                borderRadius: 12,
                padding: "18px 20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontWeight: 800, fontSize: 17 }}>#{o.id}</span>
                  <span
                    style={{
                      background: STATUS_COLOR[o.status] + "22",
                      color: STATUS_COLOR[o.status],
                      fontSize: 12,
                      fontWeight: 700,
                      padding: "4px 12px",
                      borderRadius: 999,
                    }}
                  >
                    {STATUS_LABEL[o.status]}
                  </span>
                </div>
                <span style={{ color: "#666", fontSize: 12 }}>
                  {new Date(o.createdAt).toLocaleString()}
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "8px 20px", fontSize: 14, marginBottom: 14 }}>
                <div><span style={{ color: "#666" }}>Name: </span>{o.name}</div>
                <div>
                  <span style={{ color: "#666" }}>Phone: </span>
                  <a href={"tel:" + o.phone} style={{ color: "#25D366" }}>{o.phone}</a>
                </div>
                <div><span style={{ color: "#666" }}>City: </span>{o.city}</div>
                <div><span style={{ color: "#666" }}>Address: </span>{o.address}</div>
                <div><span style={{ color: "#666" }}>Color: </span>{o.color}</div>
                <div>
                  <span style={{ color: "#666" }}>Order: </span>
                  <b>{o.qty} × watch</b> — <b style={{ color: "#f6dcc9" }}>{o.total} MAD</b>
                </div>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                {(["confirmed", "shipped", "cancelled"] as const).map((s) => (
                  <button
                    key={s}
                    disabled={o.status === s || setStatus.isPending}
                    onClick={() => setStatus.mutate({ adminKey: key, id: o.id, status: s })}
                    style={{
                      background: o.status === s ? STATUS_COLOR[s] : "transparent",
                      border: "1px solid " + STATUS_COLOR[s],
                      color: o.status === s ? "#fff" : STATUS_COLOR[s],
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                      opacity: setStatus.isPending ? 0.6 : 1,
                    }}
                  >
                    {STATUS_LABEL[s]}
                  </button>
                ))}

                {confirmId === o.id ? (
                  <>
                    <button
                      disabled={deleteOrder.isPending}
                      onClick={() => deleteOrder.mutate({ adminKey: key, id: o.id })}
                      style={{
                        marginLeft: "auto",
                        background: "#c0392b",
                        border: "1px solid #c0392b",
                        color: "#fff",
                        padding: "7px 16px",
                        borderRadius: 999,
                        fontSize: 13,
                        fontWeight: 700,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      {deleteOrder.isPending ? "Deleting…" : "Confirm delete"}
                    </button>
                    <button
                      onClick={() => setConfirmId(null)}
                      style={{
                        background: "transparent",
                        border: "1px solid #555",
                        color: "#999",
                        padding: "7px 16px",
                        borderRadius: 999,
                        fontSize: 13,
                        cursor: "pointer",
                        fontFamily: "inherit",
                      }}
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => setConfirmId(o.id)}
                    style={{
                      marginLeft: "auto",
                      background: "transparent",
                      border: "1px solid #c0392b",
                      color: "#c0392b",
                      padding: "7px 16px",
                      borderRadius: 999,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      fontFamily: "inherit",
                    }}
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
