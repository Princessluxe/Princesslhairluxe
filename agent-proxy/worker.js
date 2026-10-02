// Cloudflare Worker: forwards the chat widget's requests to Anthropic so your API key
// never appears in the website's code.
//
// Settings (Worker -> Settings -> Variables and Secrets):
//   ANTHROPIC_API_KEY  (secret)  your Anthropic API key
//   ALLOWED_ORIGIN     (text)    your site's origin, e.g. https://YOUR-USERNAME.github.io
//   MODEL              (text, optional) defaults to claude-sonnet-4-6
export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin") || "";
    const allowed = (env.ALLOWED_ORIGIN || "").split(",").map((s) => s.trim()).filter(Boolean);
    const cors = {
      "Access-Control-Allow-Origin": allowed.includes(origin) ? origin : (allowed[0] || ""),
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      Vary: "Origin",
    };

    if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
    if (request.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });
    if (!allowed.includes(origin)) return new Response("Forbidden", { status: 403, headers: cors });

    let body;
    try { body = await request.json(); } catch (e) { return new Response("Bad request", { status: 400, headers: cors }); }
    if (!Array.isArray(body.messages) || body.messages.length === 0 || body.messages.length > 60) {
      return new Response("Bad request", { status: 400, headers: cors });
    }

    const payload = {
      model: env.MODEL || "claude-sonnet-4-6",
      max_tokens: Math.min(Number(body.max_tokens) || 1000, 1000),
      system: body.system,
      tools: body.tools,
      messages: body.messages,
    };

    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify(payload),
    });
    return new Response(upstream.body, { status: upstream.status, headers: { ...cors, "Content-Type": "application/json" } });
  },
};
