<template>
	<view class="evan-form-container">
		<slot></slot>
	</view>
</template>

<script>
	import utils from './utils.js'
	export default {
		name: 'EvanForm',
		props: {
			labelStyle: {
				type: Object,
				default: () => {}
			},
			model: Object,
			rules: Object,
			hideRequiredAsterisk: {
				type: Boolean,
				default: false
			},
			showMessage: {
				type: Boolean,
				default: true
			}
		},
		computed: {
			// 整个form是否有*号，为了保证label对齐，而不是和*号对齐
			hasRequiredAsterisk() {
				if (this.hideRequiredAsterisk) {
					return false
				}
				if (this.rules) {
					const values = Object.values(this.rules)
					if (values && values.length > 0) {
						for (let i = 0; i < values.length; i++) {
							const value = values[i]
							if (Array.isArray(value) && value.length > 0) {
								const requiredItem = value.find((v) => v.required === true)
								if (requiredItem) {
									return true
								}
							} else {
								if (value && value.required) {
									return true
								}
							}
						}
					}
				}
				return false
			}
		},
		methods: {
			getRules(rules) {
				// console.log(this);
				let obj = {};
				let childrenComp = {};
				let propNameList = [];
				
				// 仅出现在 H5 平台下的代码
				// #ifdef H5
				childrenComp = this.$children[0].$children;
				// #endif
				
				// 除了 H5 平台，其它平台均存在的代码
				// #ifndef H5
				childrenComp = this.$children;
				// #endif
				
				propNameList = childrenComp.reduce((arr,item) => {
					item.prop && arr.push(item.prop);
					return arr;
				},[]);
				
				propNameList = Array.from(new Set(propNameList));
				// console.log(propNameList);
				
				propNameList.map(name => {
					for(let k in rules) {
						if(name == k) {
							obj[name] = rules[k];
						}
					}
				})
				
				return obj;
			},
			validate(callback) {
				utils.validate(this.model, this.getRules(this.rules), callback, {
					showMessage: this.showMessage
				})
			},
			validateField(props, callback) {
				utils.validateField(this.model, this.getRules(this.rules), props, callback, {
					showMessage: this.showMessage
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-form-container {}
</style>