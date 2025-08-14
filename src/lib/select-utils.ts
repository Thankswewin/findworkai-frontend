/**
 * Utility functions for handling Select component values safely
 * Prevents the "SelectItem must have a value prop that is not an empty string" error
 */

export interface SafeSelectOption {
  value: string
  label: string
}

/**
 * Safely filters and validates select options to prevent empty values
 * @param options - Array of options with value and label properties
 * @returns Filtered options with no empty values
 */
export function safeSelectOptions(options: SafeSelectOption[]): SafeSelectOption[] {
  return options.filter(option => 
    option.value && 
    option.value.trim() !== '' && 
    option.label && 
    option.label.trim() !== ''
  )
}

/**
 * Safely gets a select value, returns undefined if empty
 * @param value - The value to check
 * @returns The value if valid, undefined if empty
 */
export function safeSelectValue(value: string | null | undefined): string | undefined {
  if (!value || value.trim() === '') {
    return undefined
  }
  return value
}

/**
 * Creates a default "none" option for select dropdowns
 * @param label - Label for the default option
 * @returns SafeSelectOption with a default value
 */
export function createDefaultOption(label: string = "Select an option"): SafeSelectOption {
  return {
    value: "__default__",
    label
  }
}

/**
 * Validates that a value is safe to use in SelectItem
 * @param value - Value to validate
 * @returns true if value is safe, false if it would cause an error
 */
export function isValidSelectValue(value: any): boolean {
  return typeof value === 'string' && value.trim() !== ''
}
