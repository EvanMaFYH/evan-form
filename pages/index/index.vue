<template>
	<view class="evan-form-show">
		<evan-form :hide-required-asterisk="hideRequiredAsterisk" ref="form" :model="info">
			<evan-form-item label="姓名：" prop="name">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.name" placeholder="请输入姓名" />
			</evan-form-item>
			<evan-form-item label="邮箱：" prop="email">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.email" placeholder="请输入邮箱" />
			</evan-form-item>
			<evan-form-item label="简介：" prop="desc" label-position="top">
				<textarea class="form-input textarea" placeholder-class="form-input-placeholder" v-model="info.desc" placeholder="请输入简介(10-30个字)" />
				</evan-form-item>
			<evan-form-item label="自定义验证(手机号)：" prop="phone">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info.phone" placeholder="请输入手机号" />
			</evan-form-item>
			<evan-form-item label="自定义label颜色：" :label-style="{color:'blue'}"></evan-form-item>
			<evan-form-item label="自定义宽度默认为auto：" :label-style="{width:'190rpx','line-height':'50rpx'}"></evan-form-item>
			<evan-form-item label="不显示底部border：" :border="false"></evan-form-item>
			<evan-form-item prop="sex">
				<template slot="formItem">
					<view class="customize-form-item">
						<view class="customize-form-item__label">完全自定义内容（性别）：</view>
						<radio-group @change="sexChange">
							<label class="customize-form-item__radio" v-for="item in sexes" :key="item.value">
								<view>
									<radio :value="item.value" :checked="item.value === info.sex" />
								</view>
								<view class="customize-form-item__radio__text">{{item.name}}</view>
							</label>
						</radio-group>
					</view>
				</template>
			</evan-form-item>
		</evan-form>
		<view>rules通过prop的方式传递，前提是规则中不存在function</view>
		<evan-form ref="form2" :hide-required-asterisk="hideRequiredAsterisk" :model="info2" :rules="rules2">
			<evan-form-item label="姓名：" prop="name">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info2.name" placeholder="请输入姓名" />
			</evan-form-item>
			<evan-form-item label="邮箱：" prop="email">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info2.email" placeholder="请输入邮箱" />
			</evan-form-item>
			<evan-form-item label="正则手机号：" prop="phone">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="info2.phone" placeholder="请输入手机号" />
			</evan-form-item>
		</evan-form>
		<button @click="save" class="evan-form-show__button">保存</button>
		<button @click="promiseSave" class="evan-form-show__button">promise保存</button>
		<button @click="asyncSave" class="evan-form-show__button">async await保存</button>
		<button @click="utilsSave" class="evan-form-show__button">直接调用utils验证</button>
		<button @click="validateSingle" class="evan-form-show__button">只验证邮箱</button>
		<button @click="validateMultiple" class="evan-form-show__button">只验证邮箱和手机号</button>
		<button @click="saveForm2" class="evan-form-show__button">校验第二个表单</button>
		<button @click="hideReqired" class="evan-form-show__button">{{hideRequiredAsterisk?'显示':'隐藏'}}*号</button>
		
		<view>动态增减表单项验证</view>
		<evan-form ref="dynamicForm" :hide-required-asterisk="hideRequiredAsterisk" :model="dynamicInfo" :rules="dynamicRules">
			<evan-form-item v-if="showRuleParam" label="rule规则字段" prop="test1">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="dynamicInfo.test1" placeholder="请输入rule规则字段" />
			</evan-form-item>
			<evan-form-item v-if="showRequiredParam" label="required字段" prop="test2" required message="请输入required字段">
				<input class="form-input" placeholder-class="form-input-placeholder" v-model="dynamicInfo.test2" placeholder="请输入required字段" />
			</evan-form-item>
			<block v-for="(contact,index) in dynamicInfo.list" :key="index">
				<evan-form-item required :message="`请输入第${index+1}个联系人姓名`" :label="`联系人${index+1}`" :prop="'list.' + index + '.name'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="contact.name" placeholder="请输入姓名" />
				</evan-form-item>
				<evan-form-item :rules="mobileRules" label="手机号：" :prop="'list.' + index + '.phone'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="contact.phone" placeholder="请输入手机号" />
				</evan-form-item>
				<evan-form-item label="职务：" :prop="'list.' + index + '.duty'">
					<input class="form-input" placeholder-class="form-input-placeholder" v-model="contact.duty" placeholder="请输入职务" />
				</evan-form-item>
				<button @click="deleteContact(index)">删除联系人</button>
			</block>
		</evan-form>
		<button @click="addContact" class="evan-form-show__button">新增联系人</button>
		<button @click="toggleRuleParam" class="evan-form-show__button">显示/隐藏rule规则字段</button>
		<button @click="toggleRequiredParam" class="evan-form-show__button">显示/隐藏required字段</button>
		<button @click="dynamicSave" class="evan-form-show__button">表单校验</button>
	</view>
</template>

<script>
	import utils from '@/components/evan-form/utils.js'
	const CONTACT_INFO={
		name:'',
		phone:'',
		duty:''
	}
	export default {
		data() {
			return {
				hideRequiredAsterisk: false,
				sexes: [{
						name: '男',
						value: 'man'
					},
					{
						name: '女',
						value: 'woman'
					}
				],
				// 表单的内容必须初始化
				info: {
					name: '',
					email: '',
					desc: '',
					phone: '',
					sex: '',
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
					],
					sex: {
						required: true,
						message: '请选择性别'
					}
				},
				info2:{
					name:'',
					email:'',
					phone:''
				},
				rules2:{
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
					phone:[{
							required: true,
							message: '请输入手机号'
						},
						{
							pattern:'^1\\d{10}$', // 注意这里由于小程序的缘故正则表达式需要通过string的方式传递并且去除两边的斜杠，中间的斜杠变成两个斜杠
							message:'手机号格式不正确'
						}
					]
				},
				dynamicInfo:{
					test1:'',
					test2:'',
					list:[{...CONTACT_INFO}]
				},
				dynamicRules:{
					test1:[{required:true,message:'请输入rule规则字段'},{min:4,max:8,message:'必须4-8位'}]
				},
				showRuleParam:true,
				showRequiredParam:true,
				mobileRules:[{required:true,message:'请输入手机号'},{pattern:'^1\\d{10}$',message:'手机号格式不正确'}] // 注意这里由于小程序的缘故正则表达式需要通过string的方式传递并且去除两边的斜杠，中间的斜杠变成两个斜杠
			}
		},
		mounted() {
			// 这里必须放在mounted中，不然h5，支付宝小程序等会找不到this.$refs.form
			this.$refs.form.setRules(this.rules)
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
			promiseSave(){
				this.$refs.form.validate().then((res)=>{
					uni.showToast({
						title: '验证通过'
					})
				}).catch(()=>{
				})
			},
			async asyncSave(){
				try{
					const result=await this.$refs.form.validate()
					if(result){
						uni.showToast({
							title: '验证通过'
						})
					}
				} catch(e){
					console.log(e)
				}
			},
			saveForm2(){
				this.$refs.form2.validate((res) => {
					if (res) {
						uni.showToast({
							title: '验证通过'
						})
					}
				})
			},
			utilsSave() {
				utils.validate(this.info, this.rules, (res, errors) => {
					if (res) {
						uni.showToast({
							title: '验证通过'
						})
					}
				})
			},
			validateSingle() {
				this.$refs.form.validateField('email', (res) => {
					if (res) {
						uni.showToast({
							title: '验证通过'
						})
					}
				})
			},
			validateMultiple() {
				this.$refs.form.validateField(['email', 'phone'], (res) => {
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
			},
			sexChange(e) {
				this.info.sex = e.detail.value
			},
			addContact(){
				this.dynamicInfo.list.push({...CONTACT_INFO})
			},
			deleteContact(index){
				this.dynamicInfo.list.splice(index,1)
			},
			toggleRuleParam(){
				this.showRuleParam=!this.showRuleParam
			},
			toggleRequiredParam(){
				this.showRequiredParam=!this.showRequiredParam
			},
			dynamicSave(){
				this.$refs.dynamicForm.validate((res)=>{
					if(res){
						uni.showToast({
							title: '验证通过'
						})
					}
				})
			}
		}
	}
</script>

<style lang="scss">
	.evan-form-show {
		padding: 0 30rpx;
		background-color: #fff;

		.form-input {
			font-size: 28rpx;
			color: #333;
			text-align: right;
			width: 100%;
			box-sizing: border-box;
			height: 60rpx;
			&.textarea{
				height: 240rpx;
				padding: 24rpx 0;
				text-align: left;
			}
		}

		.form-input-placeholder {
			font-size: 28rpx;
			color: #999;
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

		.customize-form-item {
			&__label {
				font-size: 28rpx;
				color: #333;
				margin-bottom: 16rpx;
			}

			&__radio {
				display: flex;
				align-items: center;
				margin-bottom: 16rpx;

				&__text {
					font-size: 28rpx;
					color: #333;
				}
			}
		}
	}
</style>
