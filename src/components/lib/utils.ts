import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

/**
 * Format currency based on the currency type
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'IDR')
 * @returns Formatted currency string
 * 
 * Usage examples:
 * formatCurrency(100000) -> "Rp 100.000"
 * formatCurrency(100000, 'IDR') -> "Rp 100.000"
 * formatCurrency(100.50, 'USD') -> "$100.50"
 * formatCurrency(100.50, 'EUR') -> "€100.50"
 */
export function formatCurrency(amount: number, currency: string = 'IDR'): string {
  if (currency === 'IDR') {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  }
  
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2
  }).format(amount);
}

/**
 * Format number with thousands separator
 * @param value - The number to format
 * @param locale - The locale to use (default: 'id-ID')
 * @returns Formatted number string
 */
export function formatNumber(value: number, locale: string = 'id-ID'): string {
  return new Intl.NumberFormat(locale).format(value);
}
