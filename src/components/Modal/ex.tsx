import FloatingBackButton from '@/views/FloatingBackButton';
import { Icon } from '@iconify/react';
import React, { useCallback, useMemo, useState } from 'react';
import { modalPosition } from './const';
import './ex.scss';
import Modal from './index';
import type { ModalPosition } from './types';

const ModalExample: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [showFullscreenModal, setShowFullscreenModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [position, setPosition] = useState<ModalPosition>(modalPosition.popup);

  const modalTitle = useMemo(() => {
    const titles: Record<ModalPosition, string> = {
      popup: '팝업 모달',
      right: '우측 모달',
      left: '좌측 모달',
      bottom: '하단 모달',
    };
    return titles[position];
  }, [position]);

  const modalWidth = useMemo(() => {
    return ['left', 'right', 'bottom'].includes(position) ? '400px' : '500px';
  }, [position]);

  const openModal = useCallback((pos: ModalPosition) => {
    setPosition(pos);
    setShowModal(true);
  }, []);

  const openFullscreenModal = useCallback(() => {
    setShowFullscreenModal(true);
  }, []);

  const openConfirmModal = useCallback(() => {
    setShowConfirmModal(true);
  }, []);

  const handleConfirm = useCallback((close: () => void) => {
    console.log('모달 확인됨');
    close();
  }, []);

  const handleDelete = useCallback((close: () => void) => {
    console.log('삭제 작업 수행');
    close();
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>Modal Component Examples</h1>
          <p>React + TypeScript로 개발된 모달 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 사용법 */}
          <section className="example-section">
            <h2>기본 사용법</h2>
            <div className="example-item">
              <div className="info">
                <p>다양한 위치의 모달을 확인해보세요.</p>
              </div>
              <div className="button-group">
                <button onClick={() => openModal('popup')} className="demo-button">
                  팝업 모달
                </button>
              </div>
            </div>
          </section>
          {/* 위치별 모달 */}
          <section className="example-section">
            <h2>위치별 모달</h2>
            <div className="example-item">
              <div className="info">
                <p>모달의 위치를 변경하여 다양한 레이아웃을 확인할 수 있습니다.</p>
              </div>
              <div className="button-group">
                <button onClick={() => openModal('bottom')} className="demo-button">
                  하단 모달
                </button>
                <button onClick={() => openModal('left')} className="demo-button">
                  좌측 모달
                </button>
                <button onClick={() => openModal('right')} className="demo-button">
                  우측 모달
                </button>
              </div>
            </div>
          </section>
          {/* 고급 기능 */}
          <section className="example-section">
            <h2>고급 기능</h2>
            <div className="example-item">
              <div className="info">
                <p>전체 화면, 확인 모달 등 고급 기능을 확인해보세요.</p>
              </div>
              <div className="button-group">
                <button onClick={openFullscreenModal} className="demo-button">
                  전체 화면 모달
                </button>
                <button onClick={openConfirmModal} className="demo-button demo-button-danger">
                  확인 모달
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>

      {/* 기본 모달 */}
      <Modal
        open={showModal}
        onClose={() => setShowModal(false)}
        title={modalTitle}
        position={position}
        width={modalWidth}
        escClose
        body={
          <div className="modal-content">
            <p>
              이것은 <strong>{position}</strong> 위치의 모달입니다.
            </p>
            <p>ESC 키를 눌러서 닫을 수 있습니다.</p>
            <div className="content-demo">
              <h3>모달 내용 예제</h3>
              <p>
                여기에 실제 모달 내용이 들어갑니다. 폼, 리스트, 이미지 등 다양한 콘텐츠를 포함할 수
                있습니다.
              </p>
              <ul>
                <li>첫 번째 항목</li>
                <li>두 번째 항목</li>
                <li>세 번째 항목</li>
              </ul>
            </div>
          </div>
        }
        action={close => (
          <>
            <button onClick={close} className="demo-button">
              취소
            </button>
            <button onClick={() => handleConfirm(close)} className="demo-button">
              확인
            </button>
          </>
        )}
      />

      {/* 전체 화면 모달 */}
      <Modal
        open={showFullscreenModal}
        onClose={() => setShowFullscreenModal(false)}
        title="전체 화면 모달"
        fullscreen
        escClose
        body={
          <div className="fullscreen-content">
            <h1>전체 화면 모달</h1>
            <p>
              화면을 완전히 덮는 모달입니다. 주로 중요한 알림이나 전체 화면 콘텐츠에 사용됩니다.
            </p>
            <div className="fullscreen-demo">
              <div className="demo-card">
                <h3>카드 1</h3>
                <p>전체 화면 모달 내부의 카드 예제입니다.</p>
              </div>
              <div className="demo-card">
                <h3>카드 2</h3>
                <p>여러 개의 카드를 배치할 수 있습니다.</p>
              </div>
              <div className="demo-card">
                <h3>카드 3</h3>
                <p>반응형 레이아웃으로 구성됩니다.</p>
              </div>
            </div>
          </div>
        }
        action={close => (
          <button onClick={close} className="demo-button">
            닫기
          </button>
        )}
      />

      {/* 확인 모달 */}
      <Modal
        open={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        title="확인"
        width="400px"
        escClose
        body={
          <div className="confirm-content">
            <Icon icon="mdi:alert-circle" width={48} height={48} className="confirm-icon" />
            <p>정말로 이 작업을 수행하시겠습니까?</p>
            <p className="confirm-detail">이 작업은 되돌릴 수 없습니다.</p>
          </div>
        }
        action={close => (
          <>
            <button onClick={close} className="demo-button">
              취소
            </button>
            <button onClick={() => handleDelete(close)} className="demo-button demo-button-danger">
              삭제
            </button>
          </>
        )}
      />

      {/* Floating Back Button */}
      <FloatingBackButton />
    </div>
  );
};

export default ModalExample;
