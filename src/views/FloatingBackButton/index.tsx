import { Icon } from '@iconify/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.scss';

// FloatingBackButton 컴포넌트
const FloatingBackButton: React.FC = () => {
  // 라우터 이동 함수
  const navigate = useNavigate();

  // 클릭 시 메인(/)으로 이동
  const goBack = () => {
    navigate('/');
  };

  return (
    <div className="floating-back-button" onClick={goBack}>
      <Icon icon="mdi:arrow-left" width={24} height={24} />
      <span className="button-text">목록으로</span>
    </div>
  );
};

export default React.memo(FloatingBackButton);
