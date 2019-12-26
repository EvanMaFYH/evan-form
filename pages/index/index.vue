<template>
	<view class="evan-form-show">
		<evan-form :hideRequiredAsterisk="hideRequiredAsterisk" ref="form" :model="info">
			<evan-form-item label="姓名：" prop="name">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入姓名" />
			</evan-form-item>
			<evan-form-item label="邮箱：" prop="email">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.email" placeholder="请输入邮箱" />
			</evan-form-item>
			<evan-form-item label="简介：" prop="desc">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.desc" placeholder="请输入简介(10-30个字)" />
			</evan-form-item>
			<evan-form-item label="自定义验证(手机号)：" prop="phone">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.phone" placeholder="请输入手机号" />
			</evan-form-item>
			<evan-form-item label="自定义label颜色：" :labelStyle="{color:'blue'}"></evan-form-item>
			<evan-form-item label="自定义宽度默认为auto：" :labelStyle="{width:'190rpx'}"></evan-form-item>
			<evan-form-item label="不显示底部border：" :border="false"></evan-form-item>
		</evan-form>
		<button @click="save" class="evan-form-show__button">保存</button>
		<button @click="hideReqired" class="evan-form-show__button">{{hideRequiredAsterisk?'显示':'隐藏'}}*号</button>
	</view>
</template>

<script>
	import EvanForm from '@/components/evan-form/evan-form.vue'
	import EvanFormItem from '@/components/evan-form/evan-form-item.vue'
	export default {
		components: {
			EvanForm,
			EvanFormItem
		},
		data() {
			return {
				hideRequiredAsterisk: false,
				// 表单的内容必须初始化
				info: {
					name: '',
					email: '',
					desc: '',
					phone: ''
				},
				rules: {
					name: {
						required: true,
						message: '请输入姓名'
					},
					email: [{
						required: true,
						message: '请输入邮箱'
					}, {
						type: 'email',
						message: '邮箱格式不正确'
					}],
					desc: [{
							required: true,
							message: '请输入简介'
						},
						{
							min: 10,
							max: 30,
							message: '简介必须在10到30个字之间'
						}
					],
					phone: [{
							required: true,
							message: '请输入手机号'
						},
						{
							validator: (rule, value, callback) => {
								// 注意这里如果用的是methods里的isMobilePhone将不生效
								if (this.$utils.isMobilePhone(value)) {
									callback()
								} else {
									callback(new Error('手机号格式不正确'))
								}
							}
						},
						// 或者这样也是可以的
						// {
						// 	validator: this.isMobile
						// }
					]
				}
			}
		},
		onLoad() {
			// 这里必须放在$nextTick中，不然h5会找不到this.$refs.form
			this.$nextTick(() => {
				this.$refs.form.setRules(this.rules)
			})
		},
		methods: {
			save() {
				this.$refs.form.validate((res) => {
					if (res) {
						uni.showToast({
							title: '验证通过'
						})
					}
				})
			},
			hideReqired() {
				this.hideRequiredAsterisk = !this.hideRequiredAsterisk
			},
			isMobilePhone() {
				const reg = /^1\d{10}$/
				if (reg.test(value)) {
					return true
				}
				return false
			},
			isMobile(rule, value, callback) {
				if (this.$utils.isMobilePhone(value)) {
					callback()
				} else {
					callback(new Error('手机号格式不正确'))
				}
			}
		}
	}
</script>

<style lang="scss">
	.evan-form-show {
		padding: 0 30rpx;

		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: right;
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999
		}

		&__button {
			width: 100%;
			height: 88rpx;
			border-radius: 8rpx;
			display: flex;
			align-items: center;
			justify-content: center;
			padding: 0;
			font-size: 36rpx;
			color: #fff;
			margin-top: 20rpx;
			background-color: #2D87D5;

			&::before,
			&::after {
				border: none;
			}
		}
	}
</style>
