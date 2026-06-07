/**
 * n8n Code Node – Mock Order Database
 *
 * Paste this into an n8n "Code" node.
 * It reads `order_id` from the incoming item and returns
 * a fake shipping status with an estimated delivery date.
 */

// ── Mock data store ────────────────────────────────
const orders = {
  "ORD-001": {
    order_id: "ORD-001",
    customer_name: "Alice Johnson",
    item: "Wireless Headphones",
    status: "shipped",
    shipping_carrier: "FedEx",
    tracking_number: "FX-8843921057",
    estimated_delivery: "2026-05-02",
  },
  "ORD-002": {
    order_id: "ORD-002",
    customer_name: "Bob Smith",
    item: "Mechanical Keyboard",
    status: "processing",
    shipping_carrier: null,
    tracking_number: null,
    estimated_delivery: "2026-05-06",
  },
  "ORD-003": {
    order_id: "ORD-003",
    customer_name: "Carol Davis",
    item: "USB-C Monitor",
    status: "delivered",
    shipping_carrier: "DHL",
    tracking_number: "DHL-5567234891",
    estimated_delivery: "2026-04-25",
    delivered_on: "2026-04-24",
  },
  "ORD-004": {
    order_id: "ORD-004",
    customer_name: "David Lee",
    item: "Standing Desk",
    status: "out_for_delivery",
    shipping_carrier: "UPS",
    tracking_number: "1Z999AA10123456784",
    estimated_delivery: "2026-04-28",
  },
  "ORD-005": {
    order_id: "ORD-005",
    customer_name: "Eve Martinez",
    item: "Ergonomic Chair",
    status: "cancelled",
    shipping_carrier: null,
    tracking_number: null,
    estimated_delivery: null,
    cancellation_reason: "Customer requested cancellation",
  },
};

// ── Lookup logic ───────────────────────────────────
const inputData = $input.all();
const results = [];

for (const item of inputData) {
  const orderId = item.json.order_id;

  if (!orderId) {
    results.push({
      json: {
        error: true,
        message: "Missing required parameter: order_id",
      },
    });
    continue;
  }

  const order = orders[orderId.toUpperCase()] || orders[orderId];

  if (order) {
    results.push({
      json: {
        error: false,
        ...order,
      },
    });
  } else {
    // Generate a deterministic fake response for any unknown order ID
    // so demos always return something useful
    const hash = orderId
      .split("")
      .reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const statuses = ["processing", "shipped", "out_for_delivery"];
    const carriers = ["FedEx", "DHL", "UPS"];
    const status = statuses[hash % statuses.length];
    const carrier = status !== "processing" ? carriers[hash % carriers.length] : null;

    // Delivery date 3–9 days from today
    const daysOut = 3 + (hash % 7);
    const delivery = new Date();
    delivery.setDate(delivery.getDate() + daysOut);

    results.push({
      json: {
        error: false,
        order_id: orderId,
        customer_name: "Valued Customer",
        item: "Order Item",
        status,
        shipping_carrier: carrier,
        tracking_number: carrier
          ? `${carrier.toUpperCase().slice(0, 3)}-${hash}${Date.now().toString().slice(-6)}`
          : null,
        estimated_delivery: delivery.toISOString().split("T")[0],
      },
    });
  }
}

return results;
