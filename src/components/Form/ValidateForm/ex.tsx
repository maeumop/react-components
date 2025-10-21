import React, { useRef, useState } from 'react';
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
  ];

  // 성별 옵션
  const genderOptions = [
    { value: 'male', text: '남성' },
    { value: 'female', text: '여성' },
  ];

  // 폼 검증
  const validateFormAction = (): void => {
    const isValid = validateFormRef.current?.validate();

    if (isValid) {
      alert(
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
      alert('검증에 실패했습니다. 오류 메시지를 확인해주세요.');
    }
  };

  // 취미 토글 함수
  const toggleHobby = (hobbyValue: string): void => {
    const index = hobbies.indexOf(hobbyValue);
    if (index > -1) {
      setHobbies(hobbies.filter(h => h !== hobbyValue));
    } else {
      if (hobbies.length < 4) {
        setHobbies([...hobbies, hobbyValue]);
      }
    }
  };

  // 폼 초기화
  const resetForm = (): void => {
    validateFormRef.current?.resetForm();
    setName('');
    setPhone('');
    setBirthDate('');
    setGender('');
    setAmount(0);
    setRegion('');
    setHobbies([]);
  };

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
                      validate={[requiredRule]}
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
                      validate={[requiredRule, phoneRule]}
                      label="전화번호"
                      placeholder="010-1234-5678"
                      required
                      block
                    />
                  </div>

                  {/* 생년월일 */}
                  {/* <div className="form-row">
                    <DatePicker
                      value={birthDate}
                      onChange={v => setBirthDate(v as string)}
                      onUpdateSet={v => setBirthDate(v as string)}
                      validate={[requiredRule]}
                      label="생년월일"
                      placeholder="생년월일을 선택하세요"
                      required
                      block
                    />
                  </div> */}

                  {/* 성별 */}
                  <div className="form-row">
                    <CheckButton
                      value={gender}
                      onChange={v => setGender(v as string)}
                      items={genderOptions}
                      name="gender"
                      validate={[requiredRule]}
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
                      validate={[requiredRule, numberRangeRule(1000000, 100000000)]}
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
                      onChange={v => setRegion(v as string)}
                      options={regionOptions}
                      validate={[requiredRule]}
                      label="거주 지역"
                      required
                      block
                    />
                  </div>

                  {/* 취미 */}
                  <div className="form-row">
                    <ValidateWrap
                      checkValue={hobbies.join(',')}
                      validate={[requiredRule]}
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
                <button type="button" className="btn-secondary" onClick={resetForm}>
                  취소
                </button>
                <button type="button" className="btn-primary" onClick={validateFormAction}>
                  등록
                </button>
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ValidateFormExample;
