import { Icon } from '@iconify/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './homeButton.module.scss';

const HomeButton: React.FC = () => {
  const navigate = useNavigate();
  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={styles['floating-back-button']} onClick={goBack}>
      <Icon icon="mdi:arrow-left" width={24} height={24} />
      <span className={styles['button-text']}>목록으로</span>
    </div>
  );
};

export default HomeButton;
