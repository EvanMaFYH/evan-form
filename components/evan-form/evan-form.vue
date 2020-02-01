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
				default: () => {
					return {}
				}
			},
			model: Object,
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
		data() {
			return {
				rules: []
			}
		},
		methods: {
			setRules(rules) {
				this.rules = rules || []
			},
			validate(callback) {
				utils.validate(this.model, this.rules, callback, {
					showMessage: this.showMessage
				})
			},
			validateField(props, callback) {
				utils.validateField(this.model, this.rules, props, callback, {
					showMessage: this.showMessage
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-form-container {}
</style>
