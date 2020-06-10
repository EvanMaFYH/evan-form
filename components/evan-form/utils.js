import AsyncValidator from 'async-validator'
const utils = {
	validate: (model, rules, callback, options) => {
		const initOptions = {
			showMessage: true
		}
		options = Object.assign({}, initOptions, options || {})
		let promise = null;
		if (typeof callback !== 'function') {
			promise = new Promise((resolve, reject) => {
				callback = function(valid) {
					valid ? resolve(valid) : reject(valid)
				}
			})
		}
		// 如果需要验证的fields为空，调用验证时立刻返回callback
		if ((!rules || rules.length === 0) && callback) {
			callback(true, null);
			return true
		}
		let errors = []
		const props = Object.keys(rules)
		let count = 0
		for (let i in props) {
			const prop = props[i]
			const value = utils.getValueByProp(model, prop)
			utils.validateItem(rules, prop, value, (err) => {
				if (err && err.length > 0) {
					errors = errors.concat(err)
				}
				// 处理异步校验，等所有校验都结束时再callback
				count++
				if (count === props.length) {
					if (errors.length > 0) {
						if (options.showMessage) {
							utils.showToast(errors[0].message)
						}
						callback(false, errors)
					} else {
						callback(true, null)
					}
				}
			})
		}
		if (promise) {
			return promise
		}
	},
	validateField: (model, rules, props, callback, options) => {
		const initOptions = {
			showMessage: true
		}
		options = Object.assign({}, initOptions, options || {})
		let promise = null;
		if (typeof callback !== 'function') {
			promise = new Promise((resolve, reject) => {
				callback = function(valid) {
					valid ? resolve(valid) : reject(valid)
				}
			})
		}
		props = [].concat(props)
		if (props.length === 0) {
			return
		}
		let errors = []
		let count = 0
		for (let i in props) {
			const prop = props[i]
			const value = utils.getValueByProp(model, prop)
			utils.validateItem(rules, prop, value, (err) => {
				if (err && err.length > 0) {
					errors = errors.concat(err)
				}
				// 处理异步校验，等所有校验都结束时再callback
				count++
				if (count === props.length) {
					if (errors.length > 0) {
						if (options.showMessage) {
							utils.showToast(errors[0].message)
						}
						callback(false, errors)
					} else {
						callback(true, null)
					}
				}
			})
		}
		if (promise) {
			return promise
		}
	},
	validateItem(rules, prop, value, callback) {
		if (!rules || JSON.stringify(rules) === '{}') {
			if (callback instanceof Function) {
				callback();
			}
			return true;
		}
		const propRules = [].concat(rules[prop] || []);
		propRules.forEach((rule) => {
			if (rule.pattern) {
				rule.pattern = new RegExp(rule.pattern)
			}
		})
		const descriptor = {
			[prop]: propRules
		};
		const validator = new AsyncValidator(descriptor);
		const model = {
			[prop]: value
		};
		validator.validate(model, {
			firstFields: true
		}, (errors) => {
			callback(errors);
		});
	},
	getValueByProp: (obj, prop) => {
		let tempObj = obj;
		prop = prop.replace(/\[(\w+)\]/g, '.$1').replace(/^\./, '');
		let keyArr = prop.split('.');
		let i = 0;
		for (let len = keyArr.length; i < len - 1; ++i) {
			if (!tempObj) break;
			let key = keyArr[i];
			if (key in tempObj) {
				tempObj = tempObj[key];
			} else {
				break;
			}
		}
		return tempObj ? (typeof tempObj[keyArr[i]] === 'string' ? tempObj[keyArr[i]].trim() : tempObj[keyArr[i]]) :
			null
	},
	showToast: (message) => {
		uni.showToast({
			title: message,
			icon: 'none'
		})
	}
}

export default utils
