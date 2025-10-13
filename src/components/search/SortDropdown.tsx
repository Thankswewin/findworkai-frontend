import React from 'react'
import { ChevronDown, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'

interface SortDropdownProps {
  value: string
  order: string
  onChange: (sortBy: string, order: string) => void
}

const sortOptions = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'rating', label: 'Rating' },
  { value: 'reviews', label: 'Review Count' },
  { value: 'distance', label: 'Distance' },
]

export default function SortDropdown({ value, order, onChange }: SortDropdownProps) {
  const currentOption = sortOptions.find(opt => opt.value === value) || sortOptions[0]
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="min-w-[140px]">
          <ArrowUpDown className="h-4 w-4 mr-2" />
          {currentOption.label}
          {order === 'asc' ? (
            <ArrowUp className="h-3 w-3 ml-auto" />
          ) : (
            <ArrowDown className="h-3 w-3 ml-auto" />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {sortOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => {
              if (option.value === value) {
                // Toggle order if same option
                onChange(option.value, order === 'asc' ? 'desc' : 'asc')
              } else {
                // Default to desc for new option
                onChange(option.value, 'desc')
              }
            }}
            className="flex items-center justify-between"
          >
            <span>{option.label}</span>
            {option.value === value && (
              order === 'asc' ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
