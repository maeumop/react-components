import StyledButton from '@/components/StyledButton';
import React, { useCallback, useState } from 'react';
import FloatingBackButton from '../../views/FloatingBackButton';
import './ex.scss';
import ListTable from './index';
import type { ListTableHeader, ListTableItem } from './types';

// 사용자 데이터 타입
interface User extends ListTableItem {
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// 샘플 데이터
const initialUsers: User[] = [
  {
    id: 1,
    name: '홍길동',
    email: 'hong@example.com',
    role: '관리자',
    status: 'active',
    createdAt: '2024-01-15',
  },
  {
    id: 2,
    name: '김철수',
    email: 'kim@example.com',
    role: '사용자',
    status: 'active',
    createdAt: '2024-01-16',
  },
  {
    id: 3,
    name: '이영희',
    email: 'lee@example.com',
    role: '사용자',
    status: 'inactive',
    createdAt: '2024-01-17',
  },
  {
    id: 4,
    name: '박민수',
    email: 'park@example.com',
    role: '관리자',
    status: 'pending',
    createdAt: '2024-01-18',
  },
  {
    id: 5,
    name: '정수진',
    email: 'jung@example.com',
    role: '사용자',
    status: 'active',
    createdAt: '2024-01-19',
  },
];

// 테이블 헤더
const headers: ListTableHeader[] = [
  { text: 'ID', width: '80px', align: 'center' },
  { text: '이름', width: '120px' },
  { text: '이메일', width: '200px' },
  { text: '역할', width: '100px', align: 'center' },
  { text: '상태', width: '100px', align: 'center' },
  { text: '등록일', width: '120px', align: 'center' },
  { text: '액션', width: '180px', align: 'center' },
];

// 상태별 컬러
const getStatusColor = (status: string): React.CSSProperties => {
  switch (status) {
    case 'active':
      return { color: '#10b981' };
    case 'inactive':
      return { color: '#ef4444' };
    case 'pending':
      return { color: '#f59e0b' };
    default:
      return { color: '#6b7280' };
  }
};

// 상태별 텍스트
const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return '활성';
    case 'inactive':
      return '비활성';
    case 'pending':
      return '대기';
    default:
      return '알 수 없음';
  }
};

const ListTableExample: React.FC = () => {
  // 사용자 데이터
  const [users, setUsers] = useState<User[]>(initialUsers);
  // 체크박스 모드 선택된 사용자
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  // 라디오 모드 선택된 사용자
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  // 로딩 상태
  const [isLoading, setIsLoading] = useState(false);

  // 체크박스 모드 핸들러
  const handleCheck = useCallback((_checked: boolean, _index: number, items: User[]) => {
    setSelectedUsers(items);
    // console.log('선택된 사용자:', items);
  }, []);

  const handleCheckAll = useCallback((checked: boolean) => {
    console.log('전체 선택:', checked);
  }, []);

  // 라디오 모드 핸들러
  const handleRadioCheck = useCallback((_checked: boolean, _index: number, items: User[]) => {
    setSelectedUser(items[0] || null);
    // console.log('선택된 사용자:', items[0]);
  }, []);

  // 무한 스크롤 핸들러
  const handleObserve = useCallback(() => {
    // 실제로는 API 호출 등으로 데이터 추가
    // console.log('더 많은 데이터 로드...');
  }, []);

  // 비활성화 필터 (관리자는 선택 불가)
  const disableFilter = useCallback((user: User) => user.role === '관리자', []);

  // 사용자 삭제
  const deleteUser = useCallback((user: User) => {
    setUsers(prev => prev.filter(u => u.id !== user.id));
  }, []);

  // 사용자 수정(예시)
  const editUser = useCallback((user: User) => {
    console.log('사용자 수정:', user);
  }, []);

  // 로딩 토글
  const toggleLoading = useCallback(() => {
    setIsLoading(v => !v);
  }, []);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>ListTable Component Examples</h1>
          <p>React + TypeScript로 개발된 테이블 컴포넌트</p>
        </div>
      </header>
      <main className="main-content">
        <div className="container">
          {/* 기본 테이블 */}
          <section className="example-section">
            <h2>기본 테이블</h2>
            <div className="example-item">
              <ListTable<User> header={headers} items={users}>
                {({ props }) => (
                  <>
                    <td>{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.email}</td>
                    <td>{props.role}</td>
                    <td style={getStatusColor(props.status)}>{getStatusText(props.status)}</td>
                    <td>{props.createdAt}</td>
                    <td>
                      <StyledButton small onClick={() => editUser(props)}>
                        수정
                      </StyledButton>
                      <StyledButton small color="error" onClick={() => deleteUser(props)}>
                        삭제
                      </StyledButton>
                    </td>
                  </>
                )}
              </ListTable>
            </div>
          </section>
          {/* 체크박스 모드 */}
          <section className="example-section">
            <h2>체크박스 모드</h2>
            <div className="example-item">
              <div className="info">
                <p>선택된 사용자: {selectedUsers.length}명</p>
                <button onClick={toggleLoading} className="demo-button">
                  로딩 토글
                </button>
              </div>
              <ListTable<User>
                header={headers}
                items={users}
                checkMode="checkbox"
                loading={isLoading}
                disableFilter={disableFilter}
                onChecked={handleCheck}
                onCheckedAll={handleCheckAll}
              >
                {({ props, disabled }) => (
                  <>
                    <td>{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.email}</td>
                    <td>{props.role}</td>
                    <td style={getStatusColor(props.status)}>{getStatusText(props.status)}</td>
                    <td>{props.createdAt}</td>
                    <td>
                      <StyledButton small onClick={() => editUser(props)} disabled={disabled}>
                        수정
                      </StyledButton>
                      <StyledButton
                        onClick={() => deleteUser(props)}
                        small
                        color="error"
                        disabled={disabled}
                      >
                        삭제
                      </StyledButton>
                    </td>
                  </>
                )}
              </ListTable>
            </div>
          </section>
          {/* 라디오 모드 */}
          <section className="example-section">
            <h2>라디오 모드</h2>
            <div className="example-item">
              <div className="info">
                <p>선택된 사용자: {selectedUser ? selectedUser.name : '없음'}</p>
              </div>
              <ListTable<User>
                header={headers}
                items={users}
                checkMode="radio"
                disableFilter={disableFilter}
                onChecked={handleRadioCheck}
              >
                {({ props, disabled }) => (
                  <>
                    <td>{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.email}</td>
                    <td>{props.role}</td>
                    <td style={getStatusColor(props.status)}>{getStatusText(props.status)}</td>
                    <td>{props.createdAt}</td>
                    <td>
                      <StyledButton small onClick={() => editUser(props)} disabled={disabled}>
                        수정
                      </StyledButton>
                      <StyledButton
                        small
                        color="error"
                        onClick={() => deleteUser(props)}
                        disabled={disabled}
                      >
                        삭제
                      </StyledButton>
                    </td>
                  </>
                )}
              </ListTable>
            </div>
          </section>
          {/* 무한 스크롤 */}
          <section className="example-section">
            <h2>무한 스크롤</h2>
            <div className="example-item">
              <div className="info">
                <p>스크롤을 내려서 더 많은 데이터를 로드합니다.</p>
              </div>
              <ListTable<User>
                header={headers}
                items={users}
                loading={isLoading}
                onObserve={handleObserve}
              >
                {({ props }) => (
                  <>
                    <td>{props.id}</td>
                    <td>{props.name}</td>
                    <td>{props.email}</td>
                    <td>{props.role}</td>
                    <td style={getStatusColor(props.status)}>{getStatusText(props.status)}</td>
                    <td>{props.createdAt}</td>
                    <td>
                      <StyledButton small onClick={() => editUser(props)}>
                        수정
                      </StyledButton>
                      <StyledButton small color="error" onClick={() => deleteUser(props)}>
                        삭제
                      </StyledButton>
                    </td>
                  </>
                )}
              </ListTable>
            </div>
          </section>
          {/* 빈 데이터 */}
          <section className="example-section">
            <h2>빈 데이터</h2>
            <div className="example-item">
              <ListTable<User> header={headers} items={[]} emptyText="사용자 데이터가 없습니다." />
            </div>
          </section>
        </div>
      </main>
      <FloatingBackButton />
    </div>
  );
};

export default ListTableExample;
