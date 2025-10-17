const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:8000/api";

async function handleResponse(res) {
  const contentType = res.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");
  const data = isJson ? await res.json() : await res.text();
  if (!res.ok) {
    const message =
      (isJson && data && (data.detail || data.error)) || res.statusText;
    throw new Error(message || "Request failed");
  }
  return data;
}

export const api = {
  async listTransactions() {
    const res = await fetch(`${API_BASE}/transactions/`);
    return handleResponse(res);
  },

  async createTransaction(tx) {
    const res = await fetch(`${API_BASE}/transactions/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    return handleResponse(res);
  },

  async updateTransaction(id, tx) {
    const res = await fetch(`${API_BASE}/transactions/${id}/`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(tx),
    });
    return handleResponse(res);
  },

  async deleteTransaction(id) {
    const res = await fetch(`${API_BASE}/transactions/${id}/`, {
      method: "DELETE",
    });
    if (!res.ok) throw new Error("Failed to delete");
    return true;
  },

  async getDailyBalances({ start, end, startingBalance = 0 }) {
    const params = new URLSearchParams({
      start,
      end,
      startingBalance: String(startingBalance),
    });
    const res = await fetch(`${API_BASE}/balances/daily/?${params.toString()}`);
    return handleResponse(res);
  },
};
