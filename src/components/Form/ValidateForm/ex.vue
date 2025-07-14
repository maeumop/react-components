<script setup lang="ts">
import FloatingBackButton from '@/views/FloatingBackButton/index.vue';
import { inject, ref } from 'vue';
import { MessageBoxModel } from '../../MessageBox/types';
import StyledButton from '../../StyledButton/index.vue';
import type { RuleFunc } from '../../types';
import CheckButton from '../CheckButton/index.vue';
import DatePicker from '../DatePicker/index.vue';
import NumberFormat from '../NumberFormat/index.vue';
import SelectBox from '../SelectBox/index.vue';
import SwitchButton from '../SwitchButton/index.vue';
import TextField from '../TextField/index.vue';
import ValidateWrap from '../ValidateWrap/index.vue';
import ValidateForm from './index.vue';

// 폼 데이터
const name = ref('');
const phone = ref('');
const birthDate = ref('');
const gender = ref('');
const amount = ref('');
const region = ref('');
const hobbies = ref<string[]>([]);
const agreeTerms = ref(false);

// 폼 참조
const validateFormRef = ref();

const messageBox = inject('messageBox') as MessageBoxModel;

// 유효성 검사 함수들
const requiredRule: RuleFunc = (value: unknown): boolean | string => {
  if (
    !value ||
    (typeof value === 'string' && value.trim() === '') ||
    (Array.isArray(value) && value.length === 0)
  ) {
    return '필수 입력 항목입니다.';
  }
  return true;
};

const phoneRule: RuleFunc = (value: unknown): boolean | string => {
  if (typeof value === 'string' && value) {
    const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;
    if (!phoneRegex.test(value)) {
      return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
    }
  }
  return true;
};

const numberRangeRule = (min: number, max: number): RuleFunc => {
  return (value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const numValue = Number(value.replace(/,/g, ''));
      if (isNaN(numValue) || numValue < min || numValue > max) {
        return `${min.toLocaleString()}-${max.toLocaleString()} 사이의 금액을 입력해주세요.`;
      }
    }
    return true;
  };
};

// 지역 옵션
const regionOptions = [
  { value: '', text: '선택하세요' },
  { value: 'seoul', text: '서울특별시' },
  { value: 'busan', text: '부산광역시' },
  { value: 'daegu', text: '대구광역시' },
  { value: 'incheon', text: '인천광역시' },
  { value: 'gwangju', text: '광주광역시' },
  { value: 'daejeon', text: '대전광역시' },
  { value: 'ulsan', text: '울산광역시' },
  { value: 'gyeonggi', text: '경기도' },
  { value: 'gangwon', text: '강원도' },
  { value: 'chungbuk', text: '충청북도' },
  { value: 'chungnam', text: '충청남도' },
  { value: 'jeonbuk', text: '전라북도' },
  { value: 'jeonnam', text: '전라남도' },
  { value: 'gyeongbuk', text: '경상북도' },
  { value: 'gyeongnam', text: '경상남도' },
  { value: 'jeju', text: '제주특별자치도' },
];

// 취미 옵션
const hobbyOptions = [
  { value: 'reading', text: '독서', color: 'primary' },
  { value: 'sports', text: '운동', color: 'success' },
  { value: 'music', text: '음악 감상', color: 'warning' },
  { value: 'travel', text: '여행', color: 'info' },
  { value: 'cooking', text: '요리', color: 'danger' },
  { value: 'gaming', text: '게임', color: 'secondary' },
  { value: 'photography', text: '사진 촬영', color: 'primary' },
  { value: 'painting', text: '그림 그리기', color: 'success' },
  { value: 'dancing', text: '춤', color: 'warning' },
  { value: 'fishing', text: '낚시', color: 'info' },
];

// 성별 옵션
const genderOptions = [
  { value: 'male', text: '남성' },
  { value: 'female', text: '여성' },
];

// 폼 검증
const validateForm = (): void => {
  const isValid = validateFormRef.value?.validate();

  if (isValid) {
    messageBox.alert(
      '모든 검증을 통과했습니다!\n\n입력된 정보:\n' +
        `이름: ${name.value}\n` +
        `전화번호: ${phone.value}\n` +
        `생년월일: ${birthDate.value}\n` +
        `성별: ${genderOptions.find(g => g.value === gender.value)?.text}\n` +
        `보유 금액: ${amount.value}원\n` +
        `거주 지역: ${regionOptions.find(r => r.value === region.value)?.text}\n` +
        `취미: ${hobbies.value.map(h => hobbyOptions.find(ho => ho.value === h)?.text).join(', ')}\n` +
        `약관 동의: ${agreeTerms.value ? '동의' : '미동의'}`,
    );
  } else {
    messageBox.alert('검증에 실패했습니다. 오류 메시지를 확인해주세요.');
  }
};

// 취미 토글 함수
const toggleHobby = (hobbyValue: string): void => {
  const index = hobbies.value.indexOf(hobbyValue);
  if (index > -1) {
    hobbies.value.splice(index, 1);
  } else {
    if (hobbies.value.length < 4) {
      hobbies.value.push(hobbyValue);
    }
  }
};

// 폼 초기화
const resetForm = (): void => {
  validateFormRef.value?.resetForm();
};
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="container">
        <h1>ValidateForm Component Examples</h1>
        <p>Vue 3 + TypeScript로 개발된 폼 유효성 검사 컨테이너 컴포넌트</p>
      </div>
    </header>

    <main class="main-content">
      <div class="container">
        <section class="example-section">
          <h2>회원 정보 등록 폼</h2>
          <div class="form-container">
            <ValidateForm ref="validateFormRef">
              <div class="form-content">
                <!-- 이름 -->
                <div class="form-row">
                  <TextField
                    v-model="name"
                    :validate="[requiredRule]"
                    label="이름"
                    placeholder="이름을 입력하세요"
                    required
                    block
                  />
                </div>

                <!-- 전화번호 -->
                <div class="form-row">
                  <TextField
                    v-model="phone"
                    :validate="[requiredRule, phoneRule]"
                    label="전화번호"
                    placeholder="010-1234-5678"
                    required
                    block
                  />
                </div>

                <!-- 생년월일 -->
                <div class="form-row">
                  <DatePicker
                    v-model="birthDate"
                    :validate="[requiredRule]"
                    label="생년월일"
                    placeholder="생년월일을 선택하세요"
                    required
                    block
                  />
                </div>

                <!-- 성별 -->
                <div class="form-row">
                  <CheckButton
                    v-model="gender"
                    :items="genderOptions"
                    name="gender"
                    :validate="[requiredRule]"
                    label="성별"
                    required
                    type="radio"
                  />
                </div>

                <!-- 보유 금액 -->
                <div class="form-row">
                  <NumberFormat
                    v-model="amount"
                    :validate="[requiredRule, numberRangeRule(1000000, 100000000)]"
                    label="보유 금액"
                    placeholder="1,000,000 - 100,000,000"
                    required
                    block
                  />
                </div>

                <!-- 거주 지역 -->
                <div class="form-row">
                  <SelectBox
                    v-model="region"
                    :options="regionOptions"
                    :validate="[requiredRule]"
                    label="거주 지역"
                    required
                    block
                  />
                </div>

                <!-- 취미 -->
                <div class="form-row">
                  <ValidateWrap
                    :check-value="hobbies.join(',')"
                    :validate="[requiredRule]"
                    label="취미 (2~4개 선택)"
                  >
                    <template #default="{ onBlur }">
                      <div class="hobby-selector">
                        <div
                          v-for="hobby in hobbyOptions"
                          :key="hobby.value"
                          class="hobby-item"
                          :class="{ selected: hobbies.includes(hobby.value) }"
                          @click="toggleHobby(hobby.value)"
                          @blur="onBlur"
                        >
                          {{ hobby.text }}
                        </div>
                      </div>
                    </template>
                  </ValidateWrap>
                </div>

                <!-- 약관 동의 -->
                <div class="form-row">
                  <SwitchButton
                    v-model="agreeTerms"
                    validate="이용약관에 동의 하세요."
                    :label="['이용약관 동의 안함', '이용약관 동의 함']"
                    small
                    required
                  />
                </div>
              </div>
            </ValidateForm>

            <!-- 폼 액션 -->

            <div class="form-actions">
              <StyledButton color="secondary" :width="200" @click="resetForm"> 취소 </StyledButton>
              <StyledButton color="primary" :width="200" @click="validateForm"> 등록 </StyledButton>
            </div>
          </div>
        </section>
      </div>
    </main>

    <FloatingBackButton />
  </div>
</template>

<style lang="scss" scoped>
.app-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem 0;
  text-align: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);

  h1 {
    margin: 0 0 0.5rem 0;
    font-size: 2.5rem;
    font-weight: 700;
  }

  p {
    margin: 0;
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.main-content {
  padding: 3rem 0;
  background-color: #f8f9fa;
  min-height: calc(100vh - 200px);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.example-section {
  margin-bottom: 4rem;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);

  h2 {
    margin: 0 0 2rem 0;
    color: #333;
    font-size: 1.5rem;
    font-weight: 600;
    border-bottom: 2px solid #667eea;
    padding-bottom: 0.5rem;
  }
}

.form-container {
  background: white;
  border: 1px solid #e1e5e9;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}

.form-content {
  padding: 2rem;
}

.form-row {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding: 1.5rem 2rem;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.hobby-selector {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hobby-item {
  padding: 0.5rem 1rem;
  border: 1px solid #e9ecef;
  border-radius: 0.375rem;
  background: white;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  font-size: 0.875rem;

  &:hover {
    border-color: #667eea;
    background: #f8f9ff;
  }

  &.selected {
    background: #667eea;
    color: white;
    border-color: #667eea;
  }
}

@media (max-width: 768px) {
  .form-content {
    padding: 1.5rem;
  }

  .app-header h1 {
    font-size: 2rem;
  }

  .form-actions {
    flex-direction: column;
    padding: 1rem 1.5rem;
  }
}
</style>
