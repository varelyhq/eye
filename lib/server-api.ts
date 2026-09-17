import { API_URL } from "./api-url"

type ApiResult<T> =
    | { data: T; error: undefined }
    | { data: undefined; error: Error }

async function callServerApi<T = unknown>(
    path: string,
    init?: RequestInit
): Promise<ApiResult<T>> {
    try {
        const res = await fetch(`${API_URL}${path}`, init)

        if (!res.ok) {
            return {
                data: undefined,
                error: new Error(`Request failed: ${res.status} ${res.statusText}`),
            }
        }

        if (res.status === 204 || res.headers.get("content-length") === "0") {
            return { data: {} as T, error: undefined }
        }

        const text = await res.text()
        if (!text) {
            return { data: {} as T, error: undefined }
        }

        const data = JSON.parse(text).data
        return { data, error: undefined }
    } catch (err) {
        const error = err instanceof Error ? err : new Error(String(err))
        return { data: undefined, error }
    }
}

export const serverApi = {
    get: <T = unknown>(path: string, init?: RequestInit) =>
        callServerApi<T>(path, { ...init, method: "GET" }),

    post: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
        callServerApi<T>(path, {
            ...init,
            method: "POST",
            headers: { "Content-Type": "application/json", ...init?.headers },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),

    put: <T = unknown>(path: string, body?: unknown, init?: RequestInit) =>
        callServerApi<T>(path, {
            ...init,
            method: "PUT",
            headers: { "Content-Type": "application/json", ...init?.headers },
            body: body !== undefined ? JSON.stringify(body) : undefined,
        }),

    delete: <T = unknown>(path: string, init?: RequestInit) =>
        callServerApi<T>(path, { ...init, method: "DELETE" }),
}
