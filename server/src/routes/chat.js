const express = require("express");
const config = require("../config");
const { AppError } = require("../utils/errors");

const router = express.Router();

function normalizeBaseUrl(baseUrl) {
  return String(baseUrl || "").replace(/\/+$/, "");
}

router.post("/", express.json(), async (req, res, next) => {
  try {
    if (!config.platoApiKey) {
      throw new AppError(
        "PLATO_API_KEY is not configured on the server. Please set PLATO_API_KEY in the backend .env file.",
        503,
        { provider: "plato" },
        "PLATO_NOT_CONFIGURED"
      );
    }

    const {
      model,
      messages,
      temperature,
      top_p,
      max_tokens,
      frequency_penalty,
      presence_penalty,
      stop,
      response_format,
      seed,
      top_k,
    } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      throw new AppError("messages array is required.", 400, {}, "CHAT_INVALID_PAYLOAD");
    }

    const apiRoot = normalizeBaseUrl(config.platoBaseUrl);
    const endpoint = `${apiRoot}/chat/completions`;

    const body = {
      model: model || config.platoModel || "gpt-5.4",
      messages,
      temperature: temperature ?? 0.7,
      top_p: top_p ?? 0.92,
      max_tokens: max_tokens ?? 2048,
      ...(frequency_penalty !== undefined && { frequency_penalty }),
      ...(presence_penalty !== undefined && { presence_penalty }),
      ...(stop && { stop }),
      ...(response_format && { response_format }),
      ...(seed !== undefined && { seed }),
      ...(top_k !== undefined && { top_k }),
    };

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.platoApiKey}`,
      },
      body: JSON.stringify(body),
      signal: AbortSignal.timeout(config.platoTimeoutMs),
    });

    const responseText = await response.text();
    let data;
    try {
      data = responseText ? JSON.parse(responseText) : {};
    } catch {
      data = { error: { message: `Upstream returned non-JSON (status ${response.status}): ${responseText.slice(0, 200)}` } };
    }

    if (!response.ok) {
      throw new AppError(
        data.error?.message || `Chat request failed with status ${response.status}`,
        502,
        { provider: "plato", status: response.status, model: body.model },
        "CHAT_REQUEST_FAILED"
      );
    }

    res.json({ success: true, ...data });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
