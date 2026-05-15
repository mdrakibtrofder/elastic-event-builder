'use client';

import { useEffect, useState } from 'react';

type Props = {
  date: Date | string | number;
  options?: Intl.DateTimeFormatOptions;
  mode?: 'date' | 'time' | 'both';
};

export function FormattedDate({ date, options, mode = 'date' }: Props) {
  const [formatted, setFormatted] = useState<string>('');

  useEffect(() => {
    const d = new Date(date);
    if (isNaN(d.getTime())) {
      setFormatted('Invalid Date');
      return;
    }

    if (mode === 'both') {
      setFormatted(`${d.toLocaleDateString(undefined, options)} ${d.toLocaleTimeString(undefined, options)}`);
    } else if (mode === 'time') {
      setFormatted(d.toLocaleTimeString(undefined, options));
    } else {
      setFormatted(d.toLocaleDateString(undefined, options));
    }
  }, [date, options, mode]);

  // Return empty string or a placeholder during SSR to avoid mismatch
  if (!formatted) return <span className="invisible">...</span>;

  return <span>{formatted}</span>;
}
