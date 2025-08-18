'use client'

// Force dynamic rendering to avoid static generation timeouts
export const dynamic = 'force-dynamic'
export const revalidate = false

// Re-export the simplified dashboard with reduced cognitive load
export { default } from './simplified-page'
