// Security Monitoring & Logging Utility
// Tracks suspicious activities and potential security issues

interface SecurityEvent {
  timestamp: string;
  type: 'rate_limit' | 'invalid_input' | 'webhook_fail' | 'stock_manipulation' | 'checkout_fail';
  severity: 'low' | 'medium' | 'high';
  details: string;
  ip?: string;
  userAgent?: string;
}

class SecurityMonitor {
  private events: SecurityEvent[] = [];
  private readonly MAX_EVENTS = 1000; // Keep last 1000 events in memory

  logEvent(event: Omit<SecurityEvent, 'timestamp'>) {
    const fullEvent: SecurityEvent = {
      ...event,
      timestamp: new Date().toISOString()
    };

    this.events.push(fullEvent);

    // Trim to max events
    if (this.events.length > this.MAX_EVENTS) {
      this.events = this.events.slice(-this.MAX_EVENTS);
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      const emoji = event.severity === 'high' ? '🚨' : event.severity === 'medium' ? '⚠️' : 'ℹ️';
      console.log(`${emoji} [SECURITY] ${event.type}: ${event.details}`);
    }

    // In production, you'd send to external logging service
    // e.g., Sentry, LogRocket, Datadog, etc.
    if (process.env.NODE_ENV === 'production' && event.severity === 'high') {
      // Example: Send to external service
      // this.sendToExternalLogger(fullEvent);
      console.error('[SECURITY ALERT]', fullEvent);
    }
  }

  getRecentEvents(count: number = 50): SecurityEvent[] {
    return this.events.slice(-count);
  }

  getEventsByType(type: SecurityEvent['type']): SecurityEvent[] {
    return this.events.filter(e => e.type === type);
  }

  clearEvents() {
    this.events = [];
  }

  // Check for patterns that might indicate an attack
  detectSuspiciousActivity(ip: string, timeWindowMs: number = 60000): boolean {
    const now = Date.now();
    const recentEvents = this.events.filter(e => 
      e.ip === ip && 
      (now - new Date(e.timestamp).getTime()) < timeWindowMs
    );

    // Flag if more than 10 security events from same IP in 1 minute
    return recentEvents.length > 10;
  }

  // Export for admin review (in production, secure this endpoint!)
  exportLog(): SecurityEvent[] {
    return [...this.events];
  }
}

// Singleton instance
export const securityMonitor = new SecurityMonitor();

// Helper functions for common security logging
export function logRateLimit(ip: string, path: string) {
  securityMonitor.logEvent({
    type: 'rate_limit',
    severity: 'medium',
    details: `Rate limit exceeded on ${path}`,
    ip
  });
}

export function logInvalidInput(details: string, ip?: string) {
  securityMonitor.logEvent({
    type: 'invalid_input',
    severity: 'medium',
    details,
    ip
  });
}

export function logWebhookFailure(details: string) {
  securityMonitor.logEvent({
    type: 'webhook_fail',
    severity: 'high',
    details
  });
}

export function logStockManipulation(details: string, ip?: string) {
  securityMonitor.logEvent({
    type: 'stock_manipulation',
    severity: 'high',
    details,
    ip
  });
}

export function logCheckoutFailure(details: string, ip?: string) {
  securityMonitor.logEvent({
    type: 'checkout_fail',
    severity: 'low',
    details,
    ip
  });
}
