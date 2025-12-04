export async function jsonFetch<T>(input: RequestInfo, init?: RequestInit) {
    const res = await fetch(input, init)
    const data = await res.json()
    if (!res.ok || data?.success === false) {
    const msg = data?.message || `Request failed (${res.status})`
    throw new Error(msg)
    }
    return data as T
    }