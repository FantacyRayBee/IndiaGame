/*
 * @Author: ls
 * @Date: 2021-03-26 13:32:28
 * @LastEditTime: 2021-04-14 14:06:07
 * @LastEditors: Please set LastEditors
 * @Description: 工具
 * @FilePath: \calendar\assets\Util.ts
 */

// 日历格式
export const CALENDARNAMES = ['yyyy', 'yyyy-mm'];

// 日期类型
export enum DAYTYPE {
	TODAY = 0,
	YESTERDAY = 1,
	TOMORROW = 2,
	NONE = 3,
}

// 日历类型 日、月、年、周
export enum CALENDAR {
	YEAR = 0,
	MONTH = 1,
	DAY = 2,
	WEEK = 3, // 周 暂未使用
}

export class DateUtil {
	/**
	 * 是否闰年
	 * @param year 年份
	 * @returns
	 */
	public static isLeapYear(year: number) {
		var date = new Date(year, 1, 29);
		return date.getDate() === 29;
	}

	/**
	 * 深拷贝时间
	 * @param date
	 * @returns
	 */
	public static cloneDate(date: Date): Date {
		return new Date(date.valueOf());
	}

	/**
	 * 下一日、下一周、下一月、下一年
	 * @param date 待处理时间
	 * @param type 类型
	 * @returns
	 */
	public static nextDate(date: Date, type: CALENDAR = CALENDAR.DAY): Date {
		let year = date.getFullYear();
		let month = date.getMonth();
		let day = date.getDate();

		switch (type) {
			case CALENDAR.YEAR:
				{
					year++;
					date = new Date(year, month + 1, 0);
					if (day <= date.getDate()) {
						date = new Date(year, month, day);
					}
				}
				break;
			case CALENDAR.MONTH:
				{

					month++;
					date = new Date(year, month + 1, 0);

					if (day <= date.getDate()) {
						date = new Date(year, month, day);
					}
				}
				break;
			case CALENDAR.DAY:
				{
					date = new Date(date.setDate(day + 1));
				}
				break;
			case CALENDAR.WEEK:
				{
					date = new Date(date.setDate(day + 7));
				}
				break;

			default:
				break;
		}
		return date;
	}

	/**
	 * 上一日、上一周、上一月、上一年
	 * @param date 待处理时间
	 * @param type 类型
	 * @returns
	 */
	public static lastDate(date: Date, type: CALENDAR = CALENDAR.DAY): Date {
		let year = date.getFullYear();
		let month = date.getMonth();
		let day = date.getDate();

		switch (type) {
			case CALENDAR.YEAR:
				{
					// 1
					// date = new Date(date.setFullYear(year - 1));

					// 2 优化版
					year--;
					date = new Date(year, month + 1, 0);
					if (day <= date.getDate()) {
						date = new Date(year, month, day);
					}
				}
				break;
			case CALENDAR.MONTH:
				{
					month--;
					date = new Date(year, month + 1, 0);

					if (day <= date.getDate()) {
						date = new Date(year, month, day);
					}
				}
				break;
			case CALENDAR.DAY:
				{
					date = new Date(date.setDate(day - 1));
				}
				break;
			case CALENDAR.WEEK:
				{
					date = new Date(date.setDate(day - 7));
				}
				break;

			default:
				break;
		}
		return date;
	}

		/**
	 * 格式化
	 * @param fmt
	 * @returns
	 */
	public static formatDate(date: Date,fmt: string = 'yyyy-mm-dd'): string {
		let _date =date ? date : new Date();;

		var o = {
			'M+': _date.getMonth() + 1, //月份
			'd+': _date.getDate(), //日
			'h+': _date.getHours(), //小时
			'm+': _date.getMinutes(), //分
			's+': _date.getSeconds(), //秒
			'q+': Math.floor((_date.getMonth() + 3) / 3), //季度
			S: _date.getMilliseconds(), //毫秒
		};

		//  获取年份
		// ①
		if (/(y+)/i.test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (_date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}

		for (var k in o) {
			// ②
			if (new RegExp('(' + k + ')', 'i').test(fmt)) {
				fmt = fmt.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
			}
		}
		return fmt;
	}

	public static  formatMinuteSecond(time) {
		let date = new Date(time);
	    let fmt="mm:ss";
		if (/(y+)/.test(fmt)) {
		  fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
		}
		let o = {
		  'M+': date.getMonth() + 1,
		  'd+': date.getDate(),
		  'h+': date.getHours(),
		  'm+': date.getMinutes(),
		  's+': date.getSeconds()
		};
		for (let k in o) {
		  if (new RegExp(`(${k})`).test(fmt)) {
			let str = o[k] + '';
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : ('00' + str).substr(str.length));
		  }
		}
		return fmt;
	  };
	  

	public static  getDiffDay(date_1, date_2){
		// 计算两个日期之间的差值
		let totalDays,diffDate
		let myDate_1 = Date.parse(date_1)
		let myDate_2 = Date.parse(date_2)
		// 将两个日期都转换为毫秒格式，然后做差
		diffDate = Math.abs(myDate_1 - myDate_2) // 取相差毫秒数的绝对值
		totalDays = Math.floor(diffDate / (1000 * 3600 * 24)) // 向下取整
		return totalDays    // 相差的天数
	  }
}
