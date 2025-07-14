<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { ref } from 'vue';
import ListTable from './index.vue';
import type { ListTableHeader } from './types';

// 사용자 데이터 인터페이스
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
}

// 샘플 데이터
const users = ref<User[]>([
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
]);

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

// 상태별 색상
const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'color: #10b981;';
    case 'inactive':
      return 'color: #ef4444;';
    case 'pending':
      return 'color: #f59e0b;';
    default:
      return 'color: #6b7280;';
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

// 체크 관련 상태
const selectedUsers = ref<User[]>([]);
const selectedUser = ref<User | null>(null);

// 체크박스 이벤트 핸들러
const handleCheck = (_checked: boolean, _index: number, items: User[]): void => {
  selectedUsers.value = items;
  console.log('선택된 사용자들:', items);
};

const handleCheckAll = (checked: boolean): void => {
  console.log('전체 선택:', checked);
};

// 라디오 이벤트 핸들러
const handleRadioCheck = (_checked: boolean, _index: number, items: User[]): void => {
  selectedUser.value = items[0] || null;
  console.log('선택된 사용자:', selectedUser.value);
};

// 무한 스크롤 이벤트
const handleObserve = (): void => {
  console.log('더 많은 데이터 로드...');
  // 실제로는 API 호출하여 데이터 추가
};

// 비활성화 필터 (관리자는 선택 불가)
const disableFilter = (user: User): boolean => {
  return user.role === '관리자';
};

// 사용자 삭제
const deleteUser = (user: User): void => {
  const index = users.value.findIndex(u => u.id === user.id);
  if (index > -1) {
    users.value.splice(index, 1);
  }
};

// 사용자 수정
const editUser = (user: User): void => {
  console.log('사용자 수정:', user);
};

// 로딩 상태
const isLoading = ref<boolean>(false);

// 로딩 토글
const toggleLoading = (): void => {
  isLoading.value = !isLoading.value;
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>ListTable Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 테이블 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <!-- 기본 테이블 -->
        <section class="example-section">
          <h2>기본 테이블</h2>
          <div class="example-item">
            <ListTable :header="headers" :items="users">
              <template #items="{ props }">
                <tr>
                  <td>{{ props.id }}</td>
                  <td>{{ props.name }}</td>
                  <td>{{ props.email }}</td>
                  <td>{{ props.role }}</td>
                  <td :style="getStatusColor(props.status)">
                    {{ getStatusText(props.status) }}
                  </td>
                  <td>{{ props.createdAt }}</td>
                  <td>
                    <button @click="editUser(props)" class="demo-button">수정</button>
                    <button @click="deleteUser(props)" class="demo-button demo-button-danger">
                      삭제
                    </button>
                  </td>
                </tr>
              </template>
            </ListTable>
          </div>
        </section>

        <!-- 체크박스 모드 -->
        <section class="example-section">
          <h2>체크박스 모드</h2>
          <div class="example-item">
            <div class="info">
              <p>선택된 사용자: {{ selectedUsers.length }}명</p>
              <button @click="toggleLoading" class="demo-button">로딩 토글</button>
            </div>
            <ListTable
              :header="headers"
              :items="users"
              check-mode="checkbox"
              :loading="isLoading"
              :disable-filter="disableFilter"
              @checked="handleCheck"
              @checked-all="handleCheckAll"
            >
              <template #items="{ props, disabled }">
                <td>{{ props.id }}</td>
                <td>{{ props.name }}</td>
                <td>{{ props.email }}</td>
                <td>{{ props.role }}</td>
                <td :style="getStatusColor(props.status)">
                  {{ getStatusText(props.status) }}
                </td>
                <td>{{ props.createdAt }}</td>
                <td>
                  <button @click="editUser(props)" class="demo-button" :disabled="disabled">
                    수정
                  </button>
                  <button
                    @click="deleteUser(props)"
                    class="demo-button demo-button-danger"
                    :disabled="disabled"
                  >
                    삭제
                  </button>
                </td>
              </template>
            </ListTable>
          </div>
        </section>

        <!-- 라디오 모드 -->
        <section class="example-section">
          <h2>라디오 모드</h2>
          <div class="example-item">
            <div class="info">
              <p>선택된 사용자: {{ selectedUser ? selectedUser.name : '없음' }}</p>
            </div>
            <ListTable
              :header="headers"
              :items="users"
              check-mode="radio"
              :disable-filter="disableFilter"
              @checked="handleRadioCheck"
            >
              <template #items="{ props, disabled }">
                <td>{{ props.id }}</td>
                <td>{{ props.name }}</td>
                <td>{{ props.email }}</td>
                <td>{{ props.role }}</td>
                <td :style="getStatusColor(props.status)">
                  {{ getStatusText(props.status) }}
                </td>
                <td>{{ props.createdAt }}</td>
                <td>
                  <button @click="editUser(props)" class="demo-button" :disabled="disabled">
                    수정
                  </button>
                  <button
                    @click="deleteUser(props)"
                    class="demo-button demo-button-danger"
                    :disabled="disabled"
                  >
                    삭제
                  </button>
                </td>
              </template>
            </ListTable>
          </div>
        </section>

        <!-- 무한 스크롤 -->
        <section class="example-section">
          <h2>무한 스크롤</h2>
          <div class="example-item">
            <div class="info">
              <p>스크롤을 내려서 더 많은 데이터를 로드합니다.</p>
            </div>
            <ListTable
              :header="headers"
              :items="users"
              :loading="isLoading"
              @observe="handleObserve"
            >
              <template #items="{ props }">
                <tr>
                  <td>{{ props.id }}</td>
                  <td>{{ props.name }}</td>
                  <td>{{ props.email }}</td>
                  <td>{{ props.role }}</td>
                  <td :style="getStatusColor(props.status)">
                    {{ getStatusText(props.status) }}
                  </td>
                  <td>{{ props.createdAt }}</td>
                  <td>
                    <button @click="editUser(props)" class="demo-button">수정</button>
                    <button @click="deleteUser(props)" class="demo-button demo-button-danger">
                      삭제
                    </button>
                  </td>
                </tr>
              </template>
            </ListTable>
          </div>
        </section>

        <!-- 빈 데이터 -->
        <section class="example-section">
          <h2>빈 데이터</h2>
          <div class="example-item">
            <ListTable :header="headers" :items="[]" empty-text="사용자 데이터가 없습니다." />
          </div>
        </section>
      </div>
    </main>

    <!-- Floating Back Button -->
    <FloatingBackButton />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 0;
  text-align: center;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
    font-weight: 600;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
    margin: 0;
  }
}

.main-content {
  padding: 3rem 0;
  background-color: #f8fafc;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.example-section {
  background: white;
  border-radius: 0.5rem;
  padding: 2rem;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1);

  h2 {
    color: #1f2937;
    margin-bottom: 1.5rem;
    font-size: 1.5rem;
    font-weight: 600;
  }
}

.example-item {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info {
  text-align: center;
  margin-bottom: 1rem;

  p {
    margin: 0.5rem 0;
    color: #6b7280;
    font-size: 0.95rem;
  }
}

.demo-button {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 0.25rem;
  cursor: pointer;
  font-size: 0.875rem;
  transition: background-color 0.2s;
  margin-right: 0.5rem;

  &:hover {
    background: #2563eb;
  }

  &:active {
    background: #1d4ed8;
  }

  &:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  &.demo-button-danger {
    background: #ef4444;

    &:hover {
      background: #dc2626;
    }

    &:active {
      background: #b91c1c;
    }

    &:disabled {
      background: #fca5a5;
    }
  }
}

// 반응형 디자인
@media (max-width: 768px) {
  .app-header {
    padding: 2rem 0;

    h1 {
      font-size: 2rem;
    }

    p {
      font-size: 1rem;
    }
  }

  .main-content {
    padding: 2rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .example-section {
    padding: 1.5rem;
  }

  .demo-button {
    display: block;
    width: 100%;
    margin-bottom: 0.5rem;
    margin-right: 0;
  }
}
</style>
