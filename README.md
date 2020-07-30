# evan-form
uniapp表单验证组件，用法基本与element ui中的el-form一致，实现了el-form中比较常用的方法   
**测试过微信小程序**、**app（非nvue模式）**、**h5**、**支付宝小程序**

### 依赖于[async-validator](https://github.com/yiminghe/async-validator)
```
npm install async-validator --save
```
### 用法
参考[github demo](https://github.com/EvanMaFYH/evan-form)中的用法及注意点

### 特别注意点

#### 1. 由于小程序等的限制，不能传递function（会变成一个空对象），如果使用到了自定义校验validator，rules不通过props的方式传递，而是通过调用实例方法的方式传递，并且调用方法需放在mounted生命周期中，不然在h5以及支付宝小程序等下会报错，如果没有使用到了自定义校验validator，则依然可以通过prop的方式传递`（v2.1.0开始支持）`
```
mounted() {
    ﻿// 这里必须放在mounted中，不然h5，支付宝小程序等会找不到this.$refs.form
    this.$nextTick(() => {
        this.$refs.form.setRules(this.rules)
    })
}
```
#### 2. 由于小程序等的限制，不能传递正则表达式，所以如果通过prop方式传递rules，并且使用到pattern正则校验的时候需要通过string方式传递，需要将两边的斜杠去除，并且内部的斜杠需要变成双斜杠，具体可以参考demo中的正则校验
```
	{
		pattern: '^1\\d{10}$',
		message: '手机号格式不正确'
	}
```
#### 3. rules中在validator方法中调用当前methods下的方法会报错，可提前将方法注入，或者validator直接调用methods中的方法
```
data(){
    return{
        rules:{
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
            }]
        }
    }
}
```
```
data(){
    return{
        rules:{
            phone: [{
                required: true,
                message: '请输入手机号'
            },
            {
                validator: this.isMobilePhone
            }]
        }
    }
},
methods:{
    isMobilePhone(rule,value,callback){
        if (this.$utils.isMobilePhone(value)) {
            callback()
        } else {
            callback(new Error('手机号格式不正确'))
        }
    }
}
```
#### 4. 表单的内容需要初始化
错误
```
data(){
    return{
        info:{}
    }
}
```
正确
```
data(){
    return{
        info:﻿{
            name: '',
            email: '',
            desc: '',
            phone: ''
        }
    }
}
```

#### 5. 支付宝小程序中会出现警告但是不影响使用，该警告只在支付宝小程序中出现，不确定是否由于组件代码造成，参考[这里](https://ask.dcloud.net.cn/question/71966)
`Avoid mutating a prop directly since the value will be overwritten whenever the parent component re-renders. Instead, use a data or computed property based on the prop's value. Prop being mutated: "model"`

#### 6. 如果组件的表单样式无论如何都无法满足需求，可以直接通过utils中的方法对自己的表单进行验证

#### 7. 嵌套在例如uniPopup等自定义组件中使用的时候在支付宝小程序会导致evanFormItem组件找不到父组件从而导致出错，建议这种情况下直接使用utils中的方法

### evan-form props
| 参数           | 说明            | 类型    | 可选值     | 默认值  |    
| :----------------------- | :------------------------------------------ | :------ | :----- | :----- |  
| model | 表单的数据对象 | object | - | - |
| label-style | label的样式 | object | - | - |
| hide-required-asterisk | 是否隐藏必填的*号 | boolean | - | false |
| show-message | 是否显示错误信息，如果为false则由用户通过回调函数中的error信息自定义错误信息 | boolean | - | true |
| label-position | 整个表单label的位置，会被evan-form-item中的该属性覆盖 | string | left/top | left |
| rules | 校验规则 | object | - | - |

### evan-form methods
| 方法名   | 说明       | 参数     |   
| :--------------- | :------------------------------------ | :-------|
| validate | 对整个表单的校验方法，参数为一个回调函数，传入两个参数，第一个表示校验是否通过，第二个为校验不同的字段及错误信息，如果没有传入回调函数，将返回一个promise | Function(callback: Function(boolean,errors:array)) |
| validateFiled | 对表单中指定字段进行的校验方法，第一个参数为需要校验字段的prop值，可以一个也可以多个，多个用数组指定，第二个参数为一个回调函数，传入两个参数，第一个表示校验是否通过，第二个为校验不同的字段及错误信息，如果没有传入回调函数，将返回一个promise | Function(props:array ｜ string, callback: Function(boolean, errors:array)) |
| setRules | 设置表单的校验规则，参数为需要传入的校验规则 | rules:array，rules配置规则参考[async-validator](https://github.com/yiminghe/async-validator) |

### evan-form-item props   
| 参数           | 说明            | 类型    | 可选值     | 默认值  |    
| :------------- | :------------------------------ | :------ | :----- | :----- |  
| prop | 表单域 model 字段 | string | 传入 Form 组件的 model 中的字段 | - |
| label-style | label的样式 | object | - | - |
| label | 标签文本 | string | - | -
| content-style | label右侧内容的样式 | object| - | - |
| label-position | label的位置，如果不设置则以evan-form中的该属性为准 | string | left/top | - |
| required | 是否必填 | boolean | - | false |
| message | 配合required使用，当required为true时提示的校验错误信息 | string | - | ${label}必填 |
| rules | form-item的校验规则 | object/array | - | - |

### evan-form-item slot
| name | 说明 |
| :--------- | :---------------- |
| formItem | form-item自定义内容，如果用到这个slot，则代表完全自定义form-item内容，组件将不会处理label，必填*号等 |

### utils methods
| 方法名   | 说明       | 参数     |   
| :--------------- | :------------------------------------ | :-------|
| validate | 对整个表单的校验方法，第一个参数是表单的对象，第二个参数是校验规则，第三个参数为一个回调函数，传入两个参数，第一个表示校验是否通过，第二个为校验不同的字段及错误信息，第四个参数为配置，配置内容见下面options内容，如果没有传入回调函数，将返回一个promise | Function(model: object, rules: object, callback: Function(boolean,errors:array), options: object) |
| validateFiled | 对表单中指定字段进行的校验方法，第一个参数是表单的对象，第二个参数是校验规则，第三个参数为需要校验字段的prop值，可以一个也可以多个，多个用数组指定，第四个参数为一个回调函数，传入两个参数，第一个表示校验是否通过，第二个为校验不同的字段及错误信息，第五个参数为配置，配置内容见下面options内容，如果没有传入回调函数，将返回一个promise | Function(model: object, rules: object, props:array ｜ string, callback: Function(boolean, errors:array), options:object) |

### validate options
| 参数           | 说明            | 类型    | 可选值     | 默认值  |    
| :----------------------- | :------------------------------------------ | :------ | :----- | :----- |  
| showMessage | 是否显示错误信息，如果为false则由用户通过回调函数中的error信息自定义错误信息 | boolean | - | true |
