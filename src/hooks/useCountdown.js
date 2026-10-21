import { useState, useEffect } from 'react';
import { getTimeRemaining } from '../utils/offerUtils';

/**
 * Custom hook to calculate live countdown timer until target date
 * @param {string|Date} targetDate
 * @returns {{ hours: number, minutes: number, seconds: number, formatted: string, isExpired: boolean }}
 */
export function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState(() => getTimeRemaining(targetDate));

  useEffect(() => {
    if (!targetDate) return;

    // Initial check
    setTimeLeft(getTimeRemaining(targetDate));

    const interval = setInterval(() => {
      const remaining = getTimeRemaining(targetDate);
      setTimeLeft(remaining);

      if (remaining.isExpired) {
        clearInterval(interval);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

export default useCountdown;
