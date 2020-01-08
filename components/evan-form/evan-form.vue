<template>
	<view class="evan-form-container">
		<slot></slot>
	</view>
</template>

<script>
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
				fields: [],
				rules: []
			}
		},
		methods: {
			setRules(rules) {
				this.rules = rules || []
			},
			validate(callback) {
				// 如果需要验证的fields为空，调用验证时立刻返回callback
				if (this.fields.length === 0 && callback) {
					callback(true, null);
				}
				let errors = []
				for (let i in this.fields) {
					const field = this.fields[i]
					field.validate(err => {
						if (err && err.length > 0) {
							errors = errors.concat(err)
						}
					})
				}
				if (errors.length > 0) {
					if (this.showMessage) {
						this.showToast(errors[0].message)
					}
					callback(false, errors)
				} else {
					callback(true, null)
				}
			},
			validateField(props, callback) {
				props = [].concat(props)
				const fields = this.fields.filter(field => props.indexOf(field.prop) !== -1)
				if (!fields || fields.length === 0) {
					return
				}
				let errors = []
				for (let i in fields) {
					const field = fields[i]
					field.validate((err) => {
						if (err && err.length > 0) {
							errors = errors.concat(err)
						}
					})
				}
				if (errors.length > 0) {
					if (this.showMessage) {
						this.showToast(errors[0].message)
					}
					callback(false, errors)
				} else {
					callback(true, null)
				}
			},
			addField(field) {
				this.fields.push(field)
			},
			showToast(message) {
				uni.showToast({
					title: message,
					icon: 'none'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-form-container {}
</style>
