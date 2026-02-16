/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import { Logger } from "@nestjs/common";

/* eslint-disable @typescript-eslint/no-unsafe-member-access */
export type HttpClient = ReturnType<typeof createHttpClient>;

export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export type HttpClientConfig = {
  baseURL?: string;
  timeoutMs?: number;
  headers?: Record<string, string>;
  fetchImpl?: typeof fetch;
};

export type RequestOptions = {
  headers?: Record<string, string>;
  query?: Record<string, string | number | boolean | null | undefined>;
  signal?: AbortSignal;
  timeoutMs?: number;
  idempotencyKey?: string;
};
export class ApiError extends Error {
  readonly status: number;
  readonly method: HttpMethod;
  readonly url: string;
  readonly body: unknown;
  readonly requestId?: string;

  constructor(args: {
    message: string;
    status: number;
    method: HttpMethod;
    url: string;
    body: unknown;
    requestId?: string;
  }) {
    super(args.message);
    this.name = "ApiError";
    this.status = args.status;
    this.method = args.method;
    this.url = args.url;
    this.body = args.body;
    this.requestId = args.requestId;
  }
}

const bigintReplacer = (_: string, v: unknown) => (typeof v === "bigint" ? v.toString() : v);

function withQuery(url: string, query?: RequestOptions["query"]) {
  if (!query) return url;
  const usp = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === null) continue;
    usp.set(k, String(v));
  }
  return url + (url.includes("?") ? "&" : "?") + usp.toString();
}

function buildSignal(baseSignal?: AbortSignal, timeoutMs?: number): { signal?: AbortSignal; cleanup: () => void } {
  if (!timeoutMs) return { signal: baseSignal, cleanup: () => {} };
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), timeoutMs);
  const onAbort = () => controller.abort();
  baseSignal?.addEventListener("abort", onAbort, { once: true });
  return {
    signal: controller.signal,
    cleanup: () => {
      clearTimeout(t);
      baseSignal?.removeEventListener("abort", onAbort);
    }
  };
}

async function parseResponse(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type")?.toLowerCase() ?? "";
  try {
    if (ct.includes("application/json")) return await res.json();
    if (ct.startsWith("text/")) return await res.text();
    return await res.arrayBuffer();
  } catch {
    try {
      return await res.text();
    } catch {
      return undefined;
    }
  }
}

export function createHttpClient(cfg: HttpClientConfig = {}) {
  const baseURL = cfg.baseURL;
  const defaultHeaders = cfg.headers ?? {};
  const defaultTimeoutMs = cfg.timeoutMs;
  const f = cfg.fetchImpl ?? fetch;

  const resolveURL = (path: string, query?: RequestOptions["query"]) => {
    const abs = path.startsWith("http://") || path.startsWith("https://") ? path : `${baseURL ?? ""}${path}`;
    return withQuery(abs, query);
  };

  async function request(
    method: HttpMethod,
    path: string,
    body?: unknown,
    opts: RequestOptions = {}
  ): Promise<unknown> {
    const url = resolveURL(path, opts.query);
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...defaultHeaders,
      ...opts.headers
    };
    if (opts.idempotencyKey) headers["Idempotency-Key"] = opts.idempotencyKey;

    const { signal, cleanup } = buildSignal(opts.signal, opts.timeoutMs ?? defaultTimeoutMs);

    try {
      const res = await f(url, {
        method,
        headers,
        body:
          body !== undefined && method !== "GET" && method !== "DELETE"
            ? JSON.stringify(body, bigintReplacer)
            : undefined,
        signal
      });

      const data = await parseResponse(res);
      if (!res.ok) {
        throw new ApiError({
          message: `HTTP ${res.status} ${res.statusText}`,
          status: res.status,
          method,
          url,
          body: data,
          requestId:
            res.headers.get("x-request-id") ??
            res.headers.get("x-amzn-requestid") ??
            res.headers.get("x-amz-request-id") ??
            undefined
        });
      }
      return data;
    } catch (e: any) {
      Logger.error(e);
      if (e instanceof ApiError) throw e;
      const isAbort = e?.name === "AbortError" || e?.message?.toLowerCase?.().includes("aborted");
      throw new ApiError({
        message: isAbort ? "Request aborted/timeout" : "Network error",
        status: 0,
        method,
        url,
        body: { cause: e?.message ?? String(e) }
      });
    } finally {
      cleanup();
    }
  }

  return {
    request,
    get: (path: string, opts?: RequestOptions) => request("GET", path, undefined, opts),
    post: (path: string, body?: unknown, opts?: RequestOptions) => request("POST", path, body, opts),
    put: (path: string, body?: unknown, opts?: RequestOptions) => request("PUT", path, body, opts),
    patch: (path: string, body?: unknown, opts?: RequestOptions) => request("PATCH", path, body, opts),
    delete: (path: string, opts?: RequestOptions) => request("DELETE", path, undefined, opts)
  };
}

export const httpClient = createHttpClient();
