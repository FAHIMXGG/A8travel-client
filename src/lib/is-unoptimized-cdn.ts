// Simple helper to skip Next's image optimizer for flaky CDNs
export const isUnoptimizedCdn = (url?: string) =>
    !!url && /(^https?:\/\/[^/]*\.ufs\.sh\/)|(^https?:\/\/utfs\.io\/)/i.test(url || "");
  