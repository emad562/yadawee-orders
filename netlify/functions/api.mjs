import { getStore } from "@netlify/blobs";

const DEFAULT_USERS = [
  { username: "manager", password: "yadawee123", role: "manager" },
  { username: "sara", password: "staff123", role: "staff" },
  { username: "ahmed", password: "staff123", role: "staff" },
];

const DEFAULT_ORDERS = [
  { id: "YDW-001", date: "2026-03-01", client: "Noon Egypt", products: "Woven basket x20, Tote bag x15", total: 12400, currency: "EGP", payment: "Paid", delivery: "Delivered", dueDate: "2026-03-15", followUp: "", notes: "Repeat client.", addedBy: "manager" },
  { id: "YDW-002", date: "2026-03-10", client: "Cairo Bazaar Co.", products: "Ceramic mug x30", total: 380, currency: "USD", payment: "Partial", delivery: "Shipped", dueDate: "2026-03-28", followUp: "", notes: "50% paid.", addedBy: "sara" },
  { id: "YDW-003", date: "2026-03-18", client: "Heritage Gifts LLC", products: "Embroidered pouch x50", total: 9800, currency: "EGP", payment: "Unpaid", delivery: "Confirmed", dueDate: "2026-04-05", followUp: "2026-04-01", notes: "New client.", addedBy: "ahmed" },
];

function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace("/api/", "");
  const store = getStore({ name: "yadawee", consistency: "strong" });

  // GET users
  if (req.method === "GET" && path === "users") {
    let users = await store.get("users", { type: "json" });
    if (!users) {
      users = DEFAULT_USERS;
      await store.setJSON("users", users);
    }
    return json(users);
  }

  // GET orders
  if (req.method === "GET" && path === "orders") {
    let orders = await store.get("orders", { type: "json" });
    if (!orders) {
      orders = DEFAULT_ORDERS;
      await store.setJSON("orders", orders);
    }
    return json(orders);
  }

  // POST save orders
  if (req.method === "POST" && path === "orders") {
    const orders = await req.json();
    await store.setJSON("orders", orders);
    return json({ ok: true });
  }

  // POST save users
  if (req.method === "POST" && path === "users") {
    const users = await req.json();
    await store.setJSON("users", users);
    return json({ ok: true });
  }

  return json({ error: "Not found" }, 404);
};

export const config = { path: "/api/*" };
