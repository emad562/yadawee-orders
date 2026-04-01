import { getStore } from "@netlify/blobs";

const DEFAULT_USERS = [
  { username: "manager", password: "yadawee123", role: "manager" },
  { username: "sara", password: "staff123", role: "staff" },
  { username: "ahmed", password: "staff123", role: "staff" }
];

const DEFAULT_ORDERS = [];
const DEFAULT_ARTISANS = [];

function respond(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}

export default async (req) => {
  const url = new URL(req.url);
  const action = url.searchParams.get("action");
  const store = getStore({ name: "yadawee", consistency: "strong" });

  // LOAD ALL
  if (req.method === "GET" && action === "load") {
    let users = await store.get("users", { type: "json" });
    let orders = await store.get("orders", { type: "json" });
    let artisans = await store.get("artisans", { type: "json" });
    if (!users) { users = DEFAULT_USERS; await store.setJSON("users", users); }
    if (!orders) { orders = DEFAULT_ORDERS; await store.setJSON("orders", orders); }
    if (!artisans) { artisans = DEFAULT_ARTISANS; await store.setJSON("artisans", artisans); }
    return respond({ users, orders, artisans });
  }

  // SAVE ORDERS
  if (req.method === "POST" && action === "save-orders") {
    const { orders } = await req.json();
    await store.setJSON("orders", orders);
    return respond({ ok: true });
  }

  // SAVE USERS
  if (req.method === "POST" && action === "save-users") {
    const { users } = await req.json();
    await store.setJSON("users", users);
    return respond({ ok: true });
  }

  // SAVE ARTISANS
  if (req.method === "POST" && action === "save-artisans") {
    const { artisans } = await req.json();
    await store.setJSON("artisans", artisans);
    return respond({ ok: true });
  }

  // LOAD EXPENSES
  if (req.method === "GET" && action === "load-expenses") {
    const orderId = url.searchParams.get("orderId");
    const expenses = await store.get("expenses-" + orderId, { type: "json" });
    return respond(expenses || []);
  }

  // SAVE EXPENSES
  if (req.method === "POST" && action === "save-expenses") {
    const { orderId, expenses } = await req.json();
    await store.setJSON("expenses-" + orderId, expenses);
    return respond({ ok: true });
  }

  // LOAD COMMENTS
  if (req.method === "GET" && action === "load-comments") {
    const orderId = url.searchParams.get("orderId");
    const comments = await store.get("comments-" + orderId, { type: "json" });
    return respond(comments || []);
  }

  // SAVE COMMENTS
  if (req.method === "POST" && action === "save-comments") {
    const { orderId, comments } = await req.json();
    await store.setJSON("comments-" + orderId, comments);
    return respond({ ok: true });
  }

  // LOAD ACTIVITY LOG
  if (req.method === "GET" && action === "load-activity") {
    const activity = await store.get("activity-log", { type: "json" });
    return respond(activity || []);
  }

  // SAVE ACTIVITY LOG
  if (req.method === "POST" && action === "save-activity") {
    const { log } = await req.json();
    await store.setJSON("activity-log", log);
    return respond({ ok: true });
  }

  return respond({ error: "Not found" }, 404);
};

export const config = { path: "/api/data" };
