import React, { useCallback, useMemo, useRef, useState } from 'react';
import type { RuleFunc } from '../types';
import CheckButton from '../CheckButton/index';
import DatePicker from '../DatePicker';
import NumberFormat from '../NumberFormat/index';
import SelectBox from '../SelectBox/index';
import TextField from '../TextField/index';
import ValidateWrap from '../ValidateWrap';
import { ValidateForm } from './index';
import type { ValidateFormRef } from './types';
import './ex.scss';
import FloatingBackButton from '@/views/FloatingBackButton';
import StyledButton from '@/components/StyledButton';

const ValidateFormExample: React.FC = () => {
  // 폼 데이터
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [gender, setGender] = useState('');
  const [amount, setAmount] = useState<number>(0);
  const [region, setRegion] = useState('');
  const [hobbies, setHobbies] = useState<string[]>([]);

  // 폼 참조
  const validateFormRef = useRef<ValidateFormRef>(null);

  // 유효성 검사 함수들 - useCallback으로 메모이제이션
  const requiredRule: RuleFunc = useCallback((value: unknown): boolean | string => {
    if (
      !value ||
      (typeof value === 'string' && value.trim() === '') ||
      (Array.isArray(value) && value.length === 0)
    ) {
      return '필수 입력 항목입니다.';
    }

    return true;
  }, []);

  const phoneRule: RuleFunc = useCallback((value: unknown): boolean | string => {
    if (typeof value === 'string' && value) {
      const phoneRegex = /^[0-9]{2,3}-[0-9]{3,4}-[0-9]{4}$/;

      if (!phoneRegex.test(value)) {
        return '올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)';
      }
    }

    return true;
  }, []);

  const numberRangeRule = useCallback((min: number, max: number): RuleFunc => {
    return (value: unknown): boolean | string => {
      if (typeof value === 'string' && value) {
        const numValue = Number(value.replace(/,/g, ''));

        if (isNaN(numValue) || numValue < min || numValue > max) {
          return `${min.toLocaleString()}-${max.toLocaleString()} 사이의 금액을 입력해주세요.`;
        }
      }

      return true;
    };
  }, []);

  // 옵션들 - useMemo로 메모이제이션하여 재생성 방지
  const regionOptions = useMemo(
    () => [
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
    ],
    [],
  );

  const hobbyOptions = useMemo(
    () => [
      { value: 'reading', text: '독서' },
      { value: 'sports', text: '운동' },
      { value: 'music', text: '음악 감상' },
      { value: 'travel', text: '여행' },
      { value: 'cooking', text: '요리' },
      { value: 'gaming', text: '게임' },
      { value: 'photography', text: '사진 촬영' },
      { value: 'painting', text: '그림 그리기' },
      { value: 'dancing', text: '춤' },
      { value: 'fishing', text: '낚시' },
    ],
    [],
  );

  const genderOptions = useMemo(
    () => [
      { value: 'male', text: '남성' },
      { value: 'female', text: '여성' },
    ],
    [],
  );

  // 폼 검증 - useCallback으로 메모이제이션
  const validateFormAction = useCallback((): void => {
    validateFormRef.current?.validate();
    return;

    const isValid = validateFormRef.current?.validate();

    if (isValid) {
      console.log(
        '모든 검증을 통과했습니다!\n\n입력된 정보:\n' +
          `이름: ${name}\n` +
          `전화번호: ${phone}\n` +
          `생년월일: ${birthDate}\n` +
          `성별: ${genderOptions.find(g => g.value === gender)?.text}\n` +
          `보유 금액: ${amount}원\n` +
          `거주 지역: ${regionOptions.find(r => r.value === region)?.text}\n` +
          `취미: ${hobbies.map(h => hobbyOptions.find(ho => ho.value === h)?.text).join(', ')}`,
      );
    } else {
      console.log('검증에 실패했습니다. 오류 메시지를 확인해주세요.');
    }
  }, [
    name,
    phone,
    birthDate,
    gender,
    amount,
    region,
    hobbies,
    genderOptions,
    regionOptions,
    hobbyOptions,
  ]);

  // 취미 토글 함수 - useCallback으로 메모이제이션
  const toggleHobby = useCallback((hobbyValue: string): void => {
    setHobbies(prev => {
      const index = prev.indexOf(hobbyValue);

      if (index > -1) {
        return prev.filter(h => h !== hobbyValue);
      } else if (prev.length < 4) {
        return [...prev, hobbyValue];
      }

      return prev;
    });
  }, []);

  // 폼 초기화 - useCallback으로 메모이제이션
  const resetForm = useCallback((): void => {
    validateFormRef.current?.resetForm();
  }, []);

  const resetValidate = useCallback((): void => {
    validateFormRef.current?.resetValidate();
  }, []);

  // validate 배열들을 useMemo로 메모이제이션
  const nameValidate = useMemo(() => [requiredRule], [requiredRule]);
  const phoneValidate = useMemo(() => [requiredRule, phoneRule], [requiredRule, phoneRule]);
  const birthDateValidate = useMemo(() => [requiredRule], [requiredRule]);
  const genderValidate = useMemo(() => [requiredRule], [requiredRule]);
  const amountValidate = useMemo(
    () => [requiredRule, numberRangeRule(1000000, 100000000)],
    [requiredRule, numberRangeRule],
  );
  const regionValidate = useMemo(() => [requiredRule], [requiredRule]);
  const hobbiesValidate = useMemo(() => [requiredRule], [requiredRule]);

  // DatePicker onChange 핸들러 메모이제이션
  const handleBirthDateChange = useCallback((v: string | string[]) => {
    setBirthDate(v as string);
  }, []);

  const handleGenderChange = useCallback((v: string | string[]) => {
    setGender(v as string);
  }, []);

  const handleRegionChange = useCallback((v: string | string[]) => {
    setRegion(v as string);
  }, []);

  // hobbies checkValue 메모이제이션
  const hobbiesCheckValue = useMemo(() => hobbies.join(','), [hobbies]);

  return (
    <div id="app">
      <header className="app-header">
        <div className="container">
          <h1>ValidateForm Component Examples</h1>
          <p>React + TypeScript로 개발된 폼 유효성 검사 컨테이너 컴포넌트</p>
        </div>
      </header>

      <main className="main-content">
        <div className="container">
          <section className="example-section">
            <h2>회원 정보 등록 폼</h2>
            <div className="form-container">
              <ValidateForm ref={validateFormRef}>
                <div className="form-content">
                  {/* 이름 */}
                  <div className="form-row">
                    <TextField
                      value={name}
                      onChange={setName}
                      validate={nameValidate}
                      label="이름"
                      placeholder="이름을 입력하세요"
                      required
                      block
                    />
                  </div>

                  {/* 전화번호 */}
                  <div className="form-row">
                    <TextField
                      value={phone}
                      onChange={setPhone}
                      validate={phoneValidate}
                      label="전화번호"
                      placeholder="010-1234-5678"
                      required
                      block
                    />
                  </div>

                  {/* 생년월일 */}
                  <div className="form-row">
                    <DatePicker
                      value={birthDate}
                      onChange={handleBirthDateChange}
                      validate={birthDateValidate}
                      label="생년월일"
                      placeholder="생년월일을 선택하세요"
                      required
                      block
                    />
                  </div>

                  {/* 성별 */}
                  <div className="form-row">
                    <CheckButton
                      value={gender}
                      onChange={handleGenderChange}
                      items={genderOptions}
                      name="gender"
                      validate={genderValidate}
                      label="성별"
                      required
                      type="radio"
                    />
                  </div>

                  {/* 보유 금액 */}
                  <div className="form-row">
                    <NumberFormat
                      value={amount}
                      onChange={setAmount}
                      validate={amountValidate}
                      label="보유 금액"
                      placeholder="1,000,000 - 100,000,000"
                      required
                      block
                    />
                  </div>

                  {/* 거주 지역 */}
                  <div className="form-row">
                    <SelectBox
                      value={region}
                      onChange={handleRegionChange}
                      options={regionOptions}
                      validate={regionValidate}
                      label="거주 지역"
                      required
                      block
                    />
                  </div>

                  {/* 취미 */}
                  <div className="form-row">
                    <ValidateWrap
                      checkValue={hobbiesCheckValue}
                      validate={hobbiesValidate}
                      label="취미 (2~4개 선택)"
                      required
                    >
                      {({ onBlur }) => (
                        <div className="hobby-selector">
                          {hobbyOptions.map(hobby => (
                            <div
                              key={hobby.value}
                              className={`hobby-item ${hobbies.includes(hobby.value) ? 'selected' : ''}`}
                              onClick={() => toggleHobby(hobby.value)}
                              onBlur={onBlur}
                              tabIndex={0}
                            >
                              {hobby.text}
                            </div>
                          ))}
                        </div>
                      )}
                    </ValidateWrap>
                  </div>
                </div>
              </ValidateForm>

              {/* 폼 액션 */}
              <div className="form-actions">
                <StyledButton large color="error" onClick={resetForm}>
                  폼 전체 완전 초기화
                </StyledButton>
                <StyledButton large color="warning" onClick={resetValidate}>
                  오류 초기화
                </StyledButton>
                <StyledButton large color="primary" onClick={validateFormAction}>
                  등록
                </StyledButton>
              </div>
            </div>
          </section>
        </div>
      </main>

      <FloatingBackButton />
    </div>
  );
};

export default ValidateFormExample;
