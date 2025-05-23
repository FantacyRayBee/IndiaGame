
const { ccclass, property } = cc._decorator;

var REGEXP_NUM_OR_STR = /(%d)|(%s)/;
var REGEXP_STR = /%s/;

@ccclass
export default class logger {
	static logLevel = 4

	private static origin_console_log = console.log;
	private static origin_console_warn = console.warn;

	private static _green(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: green;');
	}

	private static _blue(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: blue;');
	}

	private static _purple(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: purple;');
	}

	private static _red(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: red;');
	}

	private static _yellow(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: yellow;');
	}

	private static _pink(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: pink;');
	}

	private static _orange(msg: any, ...subst: any[]) {
		if (logger.logLevel < 2) { return }
		let s = this.formatStr(msg, ...subst);
		logger.log('%c' + logger.timeFormat() + s, 'color: orange;');
	}

	//-------------------------------------------------------------------------------

	static log = console.log;

	static warn = console.warn;
	static error = console.error;

	static green(msg: any, ...subst: any[]) { }
	static blue(msg: any, ...subst: any[]) { }
	static purple(msg: any, ...subst: any[]) { }
	static red(msg: any, ...subst: any[]) { }
	static yellow(msg: any, ...subst: any[]) { }
	static pink(msg: any, ...subst: any[]) { }
	static orange(msg: any, ...subst: any[]) { }

	static enableLogger(bEnable: boolean) {
		this.log = this.origin_console_log;
		this.warn = this.origin_console_warn;
		console.log = this.origin_console_log;
		console.warn = this.origin_console_warn;
		this.green = this._green
		this.blue = this._blue
		this.purple = this._purple
		this.red = this._red
		this.yellow = this._yellow
		this.pink = this._pink
		this.orange = this._orange
	}

	public static formatStr(...args: any[]): string {
		var argLen = arguments.length;
		if (argLen === 0) {
			return '';
		}
		var msg = arguments[0];
		if (argLen === 1) {
			return '' + msg;
		}

		var hasSubstitution = typeof msg === 'string' && REGEXP_NUM_OR_STR.test(msg);
		if (hasSubstitution) {
			for (let i = 1; i < argLen; ++i) {
				var arg = arguments[i];
				var regExpToTest = typeof arg === 'number' ? REGEXP_NUM_OR_STR : REGEXP_STR;
				if (regExpToTest.test(msg))
					msg = msg.replace(regExpToTest, arg);
				else
					msg += ' ' + arg;
			}
		}
		else {
			for (let i = 1; i < argLen; ++i) {
				msg += ' ' + arguments[i];
			}
		}
		return msg;
	};

	public static timeFormat() {
		const date = new Date();

		const year = date.getFullYear();
		const month = date.getMonth() + 1;
		const day = date.getDate();
		const hour = date.getHours();
		const minute = date.getMinutes();
		const second = date.getSeconds();
		const millsecond = date.getMilliseconds();

		const padding = (value: number, maxLength?: number) => `${value}`.padStart(maxLength ?? 2, "0");
		return `${padding(year)}/${padding(month)}/${padding(day)} ${padding(hour)}:${padding(minute)}:${padding(second)}.${padding(millsecond, 3)}`;
	}
}
