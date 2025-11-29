import React from 'react';
import clsx from 'clsx';
import { getStatusConfig } from '../utils/helpers';

const StatusBadge = ({ status }) => {
  const config = getStatusConfig(status);

  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium',
        config.color
      )}
      data-testid={`status-badge-${status}`}
    >
      <span className={clsx('w-2 h-2 rounded-full', config.dotColor)}></span>
      {config.label}
    </span>
  );
};

export default StatusBadge;
