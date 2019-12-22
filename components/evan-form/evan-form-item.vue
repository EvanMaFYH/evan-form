<template>
	<view class="evan-form-item-container" :style="{borderWidth:border?'1rpx':0}">
		<view v-if="label" class="evan-form-item-container__label" :class="{showAsteriskRect:hasRequiredAsterisk,isRequired:showRequiredAsterisk}"
		 :style="mLabelStyle">{{label}}</view>
		<view class="evan-form-item-container__main" :style="contentStyle">
			<slot></slot>
		</view>
	</view>
</template>

<script>
	import AsyncValidator from 'async-validator'
	export default {
		name: 'EvanFormItem',
		props: {
			labelStyle: Object,
			label: String,
			contentStyle: {
				type: Object,
				default: () => {
					return {}
				}
			},
			prop: String,
			border: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			mLabelStyle() {
				let labelStyle = Object.assign({}, (this.getParent().labelStyle || {}), (this.labelStyle || {}))
				let arr = Object.keys(labelStyle).map((key) => `${key}:${labelStyle[key]}`)
				return arr.join(';')
			},
			// 整个表单是否有*号
			hasRequiredAsterisk() {
				const parent = this.getParent()
				if (parent) {
					return parent.hasRequiredAsterisk
				}
				return false
			},
			// 当前formItem是否显示*号
			showRequiredAsterisk() {
				const parent = this.getParent()
				if (parent && parent.hideRequiredAsterisk) {
					return false
				}
				const rules = this.getRules()
				if (rules && rules.length > 0) {
					if (rules.find((rule) => rule.required === true)) {
						return true
					}
				}
				return false
			}
		},
		methods: {
			// 获取EvanForm组件
			getParent() {
				let parent = this.$parent
				let parentName = parent.$options.name
				while (parentName !== 'EvanForm') {
					parent = parent.$parent
					parentName = parent.$options.name
				}
				return parent
			},
			// 获取prop绑定的值
			getFieldValue() {
				const form = this.getParent()
				const model = form.model
				if (!model || !this.prop) {
					return ''
				}
				return this.getValueByProp(model, this.prop)
			},
			// 根据rule验证字段
			validate(cb) {
				const rules = this.getRules();
				if (!rules || rules.length === 0) {
					if (cb instanceof Function) {
						cb();
					}
					return true;
				}
				const descriptor = {
					[this.prop]: rules
				};
				const validator = new AsyncValidator(descriptor);
				const model = {
					[this.prop]: this.getFieldValue()
				};
				validator.validate(model, {
					firstFields: true
				}, (errors) => {
					cb(errors);
				});
			},
			getRules() {
				let form = this.getParent()
				let formRules = form.rules;
				formRules = formRules ? formRules[this.prop] : [];
				return [].concat(formRules || []);
			},
			getValueByProp(obj, prop) {
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
			}
		},
		mounted() {
			const form = this.getParent()
			if (form) {
				form.addField({
					validate: this.validate
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-form-item-container {
		display: flex;
		flex-direction: row;
		align-items: flex-start;
		padding: 30rpx 0;
		border-bottom: 1rpx solid #eee;

		&__label {
			font-size: 28rpx;
			color: #666;

			&.showAsteriskRect::before {
				content: '';
				color: #F56C6C;
				width: 30rpx;
				display: inline-block;
			}

			&.isRequired::before {
				content: '*';
			}
		}

		&__main {
			flex: 1;
		}
	}
</style>
