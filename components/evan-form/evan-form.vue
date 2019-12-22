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
				let valid = true;

				// 如果需要验证的fields为空，调用验证时立刻返回callback
				if (this.fields.length === 0 && callback) {
					callback(true);
				}

				for (let i in this.fields) {
					const field = this.fields[i]
					field.validate(errors => {
						if (errors) {
							if (errors[0]) {
								uni.showToast({
									title: errors[0].message,
									icon: 'none'
								})
							}
							valid = false
							callback(false)
						}
					})
					if (!valid) {
						return false
					}
				}
				callback(true);
			},
			addField(field) {
				this.fields.push(field);
			}
		}
	}
</script>

<style lang="scss" scoped>
	.evan-form-container {}
</style>
