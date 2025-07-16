import { Icon } from '@iconify/react';
import React from 'react';

/**
 * TableSpinner 컴포넌트 (로딩 스피너)
 */
const TableSpinner: React.FC = () => {
  return (
    <div className="spinner-wrap">
      <div className="spinner">
        <Icon icon="mdi:loading" width="3.6rem" height="3.6rem" />
      </div>
    </div>
  );
};

export default React.memo(TableSpinner);
