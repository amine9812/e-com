'use client';

import { SelectHTMLAttributes } from 'react';
import clsx from 'clsx';

type Props = SelectHTMLAttributes<HTMLSelectElement> & {
  label?: string;
};

export default function Select({ label, className, children, ...props }: Props) {
  return (
    <label className="flex flex-col gap-1 text-sm text-slate-700">
      {label && <span className="font-medium">{label}</span>}
      <select
        className={clsx(
          'rounded-md border border-slate-200 px-3 py-2 shadow-sm focus:border-primary-500 focus:ring-primary-500',
          className,
        )}
        {...props}
      >
        {children}
      </select>
    </label>
  );
}
