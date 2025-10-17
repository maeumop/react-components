import React from 'react';
import { CircularProgress } from '@mui/material';

/**
 * TableSpinner 컴포넌트 (로딩 스피너)
 */
const TableSpinner: React.FC = () => {
  return (
    <div className="spinner-wrap">
      <div className="spinner">
        <CircularProgress sx={{ fontSize: 36 }} />
      </div>
    </div>
  );
};

export default React.memo(TableSpinner);
