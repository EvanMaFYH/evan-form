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
		provide() {
			return {
				evanForm: this
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
				return this.childHasRequired
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
				mRules: {},
				fields: [],
				childHasRequired: false
			}
		},
		methods: {
			setRules(rules) {
				this.mRules = rules || {}
			},
			async validate(callback) {
				const rules = this.getRules()
				if (typeof callback === 'function') {
					utils.validate(this.model, rules, callback, {
						showMessage: this.showMessage
					})
				} else {
					return await utils.validate(this.model, rules, callback, {
						showMessage: this.showMessage
					})
				}
			},
			async validateField(props, callback) {
				const rules = this.getRules()
				if (typeof callback === 'function') {
					utils.validateField(this.model, rules, props, callback, {
						showMessage: this.showMessage
					})
				} else {
					return await utils.validateField(this.model, rules, props, callback, {
						showMessage: this.showMessage
					})
				}
			},
			getRules() {
				const rules = {}
				this.fields.forEach((field) => {
					if (field.prop) {
						const requiredRules = field.required ? {
							required: true,
							message: field.message || `${field.label}必填`
						} : []
						const formRules = this.mRules && this.mRules[field.prop] ? this.mRules[field.prop] : []
						rules[field.prop] = [].concat(field.rules || formRules || []).concat(requiredRules)
					}
				})
				return rules
			}
		},
		created() {
			this.$on('evan.form.addField', (field) => {
				// 小程序中直接push field报错
				if (field.prop) {
					this.fields.push({
						rules: field.rules,
						prop: field.prop,
						required: field.required,
						label: field.label,
						message: field.message,
						_uid: field._uid
					})
					if (!this.childHasRequired) {
						if (field.required) {
							this.childHasRequired = field.required
							return
						}
						if (field.rules) {
							const fieldRules = [].concat(field.rules)
							fieldRules.forEach((item) => {
								if (item.required) {
									this.childHasRequired = true
								}
							})
						}
					}
				}
			})
			this.$on('evan.form.removeField', (field) => {
				this.fields.splice(this.fields.findIndex((item) => item._uid === field._uid), 1)
			})
		}
	}
</script>

<style lang="scss">
	.evan-form-container {}
</style>
