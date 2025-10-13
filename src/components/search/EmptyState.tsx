import React from 'react'
import { Search, Filter } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface EmptyStateProps {
  onReset: () => void
  hasFilters: boolean
}

export default function EmptyState({ onReset, hasFilters }: EmptyStateProps) {
  return (
    <div className="text-center py-12">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
        {hasFilters ? (
          <Filter className="h-8 w-8 text-gray-400" />
        ) : (
          <Search className="h-8 w-8 text-gray-400" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        {hasFilters ? 'No businesses match your filters' : 'No businesses found'}
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">
        {hasFilters
          ? 'Try adjusting your filters to find more businesses.'
          : 'Try searching with different keywords or location.'}
      </p>
      {hasFilters && (
        <Button onClick={onReset} variant="outline">
          Clear Filters
        </Button>
      )}
    </div>
  )
}
