// Analytics Service for FindWorkAI
// Tracks user interactions and conversion funnel

interface AnalyticsEvent {
  event: string
  properties?: Record<string, any>
  timestamp: string
  sessionId?: string
  userId?: string
}

interface ConversionFunnelStep {
  step: string
  timestamp: string
  properties?: Record<string, any>
}

class AnalyticsService {
  private sessionId: string
  private userId: string | null = null
  private funnelSteps: ConversionFunnelStep[] = []
  private eventQueue: AnalyticsEvent[] = []
  
  constructor() {
    this.sessionId = this.generateSessionId()
    this.loadStoredData()
    this.setupPageTracking()
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private loadStoredData() {
    if (typeof window === 'undefined') return
    
    // Load user ID if exists
    const storedUserId = localStorage.getItem('findworkai_user_id')
    if (storedUserId) {
      this.userId = storedUserId
    } else {
      this.userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      localStorage.setItem('findworkai_user_id', this.userId)
    }
    
    // Load previous events
    const storedEvents = localStorage.getItem('findworkai_analytics_events')
    if (storedEvents) {
      try {
        this.eventQueue = JSON.parse(storedEvents)
      } catch (e) {
        console.error('Failed to load analytics events:', e)
      }
    }
  }

  private setupPageTracking() {
    if (typeof window === 'undefined') return
    
    // Track page views
    this.track('page_view', {
      url: window.location.href,
      referrer: document.referrer,
      title: document.title
    })
    
    // Track session duration
    window.addEventListener('beforeunload', () => {
      this.track('session_end', {
        duration: Date.now() - parseInt(this.sessionId.split('_')[1])
      })
      this.flushEvents()
    })
  }

  // Main tracking method
  track(event: string, properties?: Record<string, any>) {
    const analyticsEvent: AnalyticsEvent = {
      event,
      properties: {
        ...properties,
        timestamp_readable: new Date().toLocaleString()
      },
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      userId: this.userId
    }
    
    this.eventQueue.push(analyticsEvent)
    
    // Store locally
    this.saveToLocalStorage()
    
    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalyticsService(analyticsEvent)
    } else {
      console.log('📊 Analytics Event:', event, properties)
    }
    
    // Update funnel if applicable
    this.updateConversionFunnel(event, properties)
  }

  // Conversion funnel tracking
  private updateConversionFunnel(event: string, properties?: Record<string, any>) {
    const funnelEvents = {
      'search_performed': 'discovery',
      'business_analyzed': 'analysis',
      'contact_initiated': 'outreach',
      'email_sent': 'contacted',
      'response_received': 'engaged',
      'deal_closed': 'converted'
    }
    
    if (funnelEvents[event as keyof typeof funnelEvents]) {
      this.funnelSteps.push({
        step: funnelEvents[event as keyof typeof funnelEvents],
        timestamp: new Date().toISOString(),
        properties
      })
      
      // Calculate conversion metrics
      this.calculateConversionMetrics()
    }
  }

  // Calculate conversion metrics
  private calculateConversionMetrics() {
    const metrics = {
      discoveryToAnalysis: 0,
      analysisToOutreach: 0,
      outreachToContact: 0,
      contactToEngagement: 0,
      engagementToConversion: 0,
      overallConversion: 0
    }
    
    // Count steps
    const stepCounts = this.funnelSteps.reduce((acc, step) => {
      acc[step.step] = (acc[step.step] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate conversion rates
    if (stepCounts.discovery > 0) {
      metrics.discoveryToAnalysis = (stepCounts.analysis || 0) / stepCounts.discovery * 100
    }
    if (stepCounts.analysis > 0) {
      metrics.analysisToOutreach = (stepCounts.outreach || 0) / stepCounts.analysis * 100
    }
    if (stepCounts.outreach > 0) {
      metrics.outreachToContact = (stepCounts.contacted || 0) / stepCounts.outreach * 100
    }
    if (stepCounts.contacted > 0) {
      metrics.contactToEngagement = (stepCounts.engaged || 0) / stepCounts.contacted * 100
    }
    if (stepCounts.engaged > 0) {
      metrics.engagementToConversion = (stepCounts.converted || 0) / stepCounts.engaged * 100
    }
    if (stepCounts.discovery > 0) {
      metrics.overallConversion = (stepCounts.converted || 0) / stepCounts.discovery * 100
    }
    
    // Track metrics
    this.track('funnel_metrics_calculated', metrics)
    
    return metrics
  }

  // Get analytics summary
  getAnalyticsSummary() {
    const events = this.eventQueue
    const recentEvents = events.slice(-100) // Last 100 events
    
    // Calculate time-based metrics
    const now = new Date()
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    
    const todayEvents = events.filter(e => new Date(e.timestamp) > oneDayAgo)
    const weekEvents = events.filter(e => new Date(e.timestamp) > oneWeekAgo)
    
    // Count event types
    const eventCounts = events.reduce((acc, e) => {
      acc[e.event] = (acc[e.event] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    // Calculate engagement metrics
    const searchCount = eventCounts.search_performed || 0
    const analysisCount = eventCounts.business_analyzed || 0
    const contactCount = eventCounts.email_sent || 0
    
    return {
      totalEvents: events.length,
      todayEvents: todayEvents.length,
      weekEvents: weekEvents.length,
      uniqueSessions: new Set(events.map(e => e.sessionId)).size,
      eventTypes: eventCounts,
      engagement: {
        searchToAnalysis: searchCount > 0 ? (analysisCount / searchCount * 100).toFixed(1) : 0,
        analysisToContact: analysisCount > 0 ? (contactCount / analysisCount * 100).toFixed(1) : 0,
        overallConversion: searchCount > 0 ? (contactCount / searchCount * 100).toFixed(1) : 0
      },
      recentActivity: recentEvents.map(e => ({
        event: e.event,
        time: new Date(e.timestamp).toLocaleTimeString(),
        properties: e.properties
      }))
    }
  }

  // Track specific user actions
  trackSearch(query: string, location: string, resultsCount: number) {
    this.track('search_performed', {
      query,
      location,
      results_count: resultsCount,
      has_results: resultsCount > 0,
      search_type: 'business_discovery'
    })
  }

  trackAnalysis(businessId: string, opportunityScore: number, hasWebsite: boolean) {
    this.track('business_analyzed', {
      business_id: businessId,
      opportunity_score: opportunityScore,
      has_website: hasWebsite,
      opportunity_level: opportunityScore >= 70 ? 'high' : opportunityScore >= 40 ? 'medium' : 'low'
    })
  }

  trackContact(businessId: string, contactMethod: string) {
    this.track('contact_initiated', {
      business_id: businessId,
      contact_method: contactMethod,
      timestamp: new Date().toISOString()
    })
  }

  trackError(error: string, context?: Record<string, any>) {
    this.track('error_occurred', {
      error_message: error,
      context,
      url: window.location.href
    })
  }

  // Save to localStorage
  private saveToLocalStorage() {
    if (typeof window === 'undefined') return
    
    try {
      // Keep only last 1000 events
      const eventsToStore = this.eventQueue.slice(-1000)
      localStorage.setItem('findworkai_analytics_events', JSON.stringify(eventsToStore))
      
      // Store funnel steps separately
      localStorage.setItem('findworkai_funnel_steps', JSON.stringify(this.funnelSteps))
    } catch (e) {
      console.error('Failed to save analytics:', e)
    }
  }

  // Send to external analytics service (placeholder)
  private sendToAnalyticsService(event: AnalyticsEvent) {
    // In production, this would send to services like:
    // - Google Analytics
    // - Mixpanel
    // - Amplitude
    // - Custom analytics endpoint
    
    // Example:
    // fetch('/api/analytics', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(event)
    // })
  }

  // Flush pending events
  private flushEvents() {
    this.saveToLocalStorage()
    
    if (process.env.NODE_ENV === 'production' && this.eventQueue.length > 0) {
      // Batch send to analytics service
      // this.sendBatchToAnalytics(this.eventQueue)
    }
  }

  // Get conversion funnel data for visualization
  getConversionFunnelData() {
    const steps = ['discovery', 'analysis', 'outreach', 'contacted', 'engaged', 'converted']
    const stepCounts = this.funnelSteps.reduce((acc, step) => {
      acc[step.step] = (acc[step.step] || 0) + 1
      return acc
    }, {} as Record<string, number>)
    
    return steps.map((step, index) => {
      const count = stepCounts[step] || 0
      const previousCount = index > 0 ? (stepCounts[steps[index - 1]] || 0) : count
      const conversionRate = previousCount > 0 ? (count / previousCount * 100).toFixed(1) : '0'
      
      return {
        step,
        count,
        conversionRate: `${conversionRate}%`,
        dropoff: previousCount - count
      }
    })
  }
}

// Create singleton instance
const analytics = new AnalyticsService()

export default analytics
export { AnalyticsService, type AnalyticsEvent, type ConversionFunnelStep }
