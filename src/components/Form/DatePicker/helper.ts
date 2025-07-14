import type { DatePickerHelper, LayerPosition } from './types';

class helper implements DatePickerHelper {
  /**
   * 달력 표시 전 처리
   *
   * @param input 달력 요소
   * @param isRange 범위 선택 여부
   * @returns 달력 위치 스타일
   */
  public getLayerPosition(input: HTMLDivElement, isRange: boolean = false): LayerPosition {
    // 달력 표시 전 처리
    const bodyRect: DOMRect = document.body.getBoundingClientRect();
    const rect: DOMRect = input.getBoundingClientRect();
    const windowHeight: number = window.innerHeight;
    const windowWidth: number = window.innerWidth;
    const pickerHeight: number = isRange ? 454 : 280;

    const styles: LayerPosition = {
      top: '',
      bottom: '',
      right: '',
      left: '',
      transformOrigin: '',
    };

    if (rect) {
      // 객체의 위치가 스크린 아래쪽으로 치우쳤다면 위로 나오게 변경한다.
      if (window.innerHeight < rect.bottom + pickerHeight) {
        styles.bottom = `${windowHeight - rect.top + 4}px`;

        if (bodyRect.width / 2 < rect.x) {
          styles.transformOrigin = 'bottom right';
          styles.right = `${windowWidth - rect.right}px`;
        } else {
          styles.transformOrigin = 'bottom left';
          styles.left = `${rect.left}px`;
        }
      } else {
        styles.top = `${rect.top + rect.height + 4}px`;

        if (bodyRect.width / 2 < rect.x) {
          styles.transformOrigin = 'top right';
          styles.right = `${windowWidth - rect.right}px`;
        } else {
          styles.transformOrigin = 'top left';
          styles.left = `${rect.left}px`;
        }
      }
    }

    return styles;
  }

  /**
   * 지정된 포멧에 맞춰서 날짜를 문자열로 변환하여 반환
   * days의 차이에 때라 d 기준 날짜를 가감하여 변환
   *
   * @param d 날짜 객체
   * @param format 변경할 포멧
   * @param days 날짜 가감
   * @returns 날짜 문자열
   */
  public getDateFormat(d: Date, format: string, days?: number) {
    let date = d;

    if (days) {
      const time = date.getTime();
      date = new Date(time + 86400 * days * 1000);
    }

    const year: string = date.getFullYear().toString();
    const month: string = (date.getMonth() + 1).toString();
    const day: string = date.getDate().toString();

    const dYear: string = date.getFullYear().toString();
    let dMonth: string = month.toString();
    let dDay: string = day.toString();

    if (month.length === 1) {
      dMonth = `0${month}`;
    }

    if (day.length === 1) {
      dDay = `0${day}`;
    }

    return format
      .replace('Y', dYear)
      .replace('m', dMonth)
      .replace('d', dDay)
      .replace('y', year)
      .replace('n', month)
      .replace('j', day);
  }

  /**
   * date format string
   *
   * @param year
   * @param month
   * @param day
   * @param s
   * @returns 날짜 문자열
   */
  public getDateString(year: number, month: number, day: number, s: string) {
    let date: string = `${year}${s}`;

    date += month + 1 <= 10 ? `0${month}${s}` : `${month}${s}`;
    date += day < 10 ? `0${day}` : `${day}`;

    return date;
  }

  /**
   * 전달의 마지막 날짜 표시
   *
   * @param year 연도
   * @param month 월
   * @param week 주 0 ~ 6
   * @returns 전달의 마지막 날짜
   */
  public getBeforeDay(year: number, month: number, week: number) {
    const day = new Date(year, month, 0).getDate();
    return day - week + 1;
  }
}

export const useDatePickerHelper = (): DatePickerHelper => {
  return new helper();
};
