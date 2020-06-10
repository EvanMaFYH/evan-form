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
			},
			labelPosition: {
				validator: function(value) {
					return ['top', 'left'].indexOf(value) !== -1
				},
				default: 'left'
			},
			rules: {
				type: Object,
				default: () => {
					return {}
				}
			}
		},
		computed: {
			// 整个form是否有*号，为了保证label对齐，而不是和*号对齐
			hasRequiredAsterisk() {
				if (this.hideRequiredAsterisk) {
					return false
				}
				if (this.mRules) {
					const values = Object.values(this.mRules)
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
		watch: {
			rules: {
				immediate: true,
				deep: true,
				handler(value) {
					this.mRules = value || {}
				}
			}
		},
		data() {
			return {
				mRules: {}
			}
		},
		methods: {
			setRules(rules) {
				this.mRules = rules || {}
			},
			async validate(callback) {
				if (typeof callback === 'function') {
					utils.validate(this.model, this.mRules, callback, {
						showMessage: this.showMessage
					})
				} else {
					return await utils.validate(this.model, this.mRules, callback, {
						showMessage: this.showMessage
					})
				}
			},
			async validateField(props, callback) {
				if (typeof callback === 'function') {
					utils.validateField(this.model, this.mRules, props, callback, {
						showMessage: this.showMessage
					})
				} else {
					return await utils.validateField(this.model, this.mRules, props, callback, {
						showMessage: this.showMessage
					})
				}
			}
		}
	}
</script>

<style lang="scss">
	.evan-form-container {}
</style>
