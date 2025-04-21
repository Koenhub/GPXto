/**
 * Sends an event to Google Tag Manager
 * This is a lightweight way to track user interactions without additional HTTP requests
 */
export function trackEvent(eventName: string, eventData?: Record<string, any>) {
  // Only run on client side and if dataLayer exists
  if (typeof window !== "undefined" && window.dataLayer) {
    window.dataLayer.push({
      event: eventName,
      ...eventData,
    })
  }
}

// Predefined events for consistency
export const ANALYTICS_EVENTS = {
  STEP_REACHED: "step_reached",
  DOWNLOAD_CLICKED: "download_clicked",
  CONVERSION_COMPLETED: "conversion_completed",
}
