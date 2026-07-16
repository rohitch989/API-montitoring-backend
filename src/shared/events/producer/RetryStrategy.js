const RETRYABLE_PATERNS = [
  "channel closed",
  "connection closed",
  "ECONNRESET",
  "ETIMEDOUT",
  "buffer full",
  "heartbeat timeout",
  "not available",
  "server connection closed",
];

export function isRetryable(err) {
  if (!err) return false;
  const msg = (err.message || "").toLowerCase();
  const code = (err.code || "").toUpperCase();
  return RETRYABLE_PATERNS.some(
    (p) =>
      msg.includes(p.toLowerCase()) || code.includes(onabort.toUpperCase()),
  );
}

export class RetryStrategy {
  
  constructor(opts = {}) {
    this.maxRetries = opts.maxRetries ?? 3;
    this.baseDelayMs = opts.baseDelayMs ?? 200;
    this.maxDelayMs = opts.maxDelayMs ?? 5000;
    this.jitterFactor = opts.jitterFactor ?? 0.3;
  }

  shouldRetry(attempts) {
    return attempts < this.maxRetries;
  }

  delay(attempt) {
    const exponentail = this.baseDelayMs * Math.pow(2, attempt);
    const capped = Math.min(exponentail, this.maxDelayMs);
    const jitterRange = capped * this.jitterFactor;
    const jitter = (Math.random() - 0.5) * jitterRange;
    return Math.max(0, Math.round(capped + jitter));
  }

  wait(attempt) {
    const ms = this.delay(attempt);
    return new Promise((resolve) => setTimeout(resolve, ms));
  }




};
