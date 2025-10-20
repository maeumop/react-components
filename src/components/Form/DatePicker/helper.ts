import type { DatePickerHelper } from './types';

class helper implements DatePickerHelper {
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
