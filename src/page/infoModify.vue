<template>
    <div class="info_container">
        <el-row class="info_row row" :gutter="20">
            <el-col :span="8">
                <div class="area">
                    <p class="title"><i class="fa fa-edit"></i>修改信息</p>
                    <el-form class="form"  :model="infoForm" :rules="infoRules" ref="infoForm" label-width="80px">
                        <el-form-item label="姓名">
                            <el-input v-model="infoForm.EMP_NAME_"  size="mini"  placeholder="请输入姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="编码">
                            <el-input v-model="infoForm.EMP_CODE_"  size="mini"  placeholder="请输入编码"></el-input>
                        </el-form-item>
                        <el-form-item label="性别" prop="GENDER_">
                            <el-select v-model="infoForm.GENDER_" size="mini" placeholder="请选择性别" >
                                <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        v-model="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="出生日期" prop="BIRTH_DATE_">
                            <el-date-picker
                                    v-model="infoForm.BIRTH_DATE_"
                                    type="date">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="绑定邮箱" prop="EMAIL_">
                            <el-input v-model="infoForm.EMAIL_" size="mini" placeholder="请输入绑定邮箱"></el-input>
                        </el-form-item>
                        <el-form-item label="绑定手机" prop="TEL_">
                            <el-input v-model="infoForm.TEL_" size="mini" placeholder="请输入绑定手机"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submitForm('infoForm')">提交</el-button>
                            <el-button @click="resetForm('infoForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </el-col>

            <el-col :span="8">
                <div class="area">
                    <div class="pwdarea">
                        <p class="title"><i class="fa fa-edit"></i>修改密码</p>
                        <el-form class="form"  :model="pwdForm" :rules="pwdRules" ref="pwdForm" label-width="100px">
                            <el-form-item label="原密码" prop="password">
                                <el-input type="password" v-model="pwdForm.password" auto-complete="off" size="mini" placeholder="请输入原密码"></el-input>
                            </el-form-item>
                            <el-form-item label="新密码" prop="newpassword">
                                <el-input type="password" v-model="pwdForm.newpassword" auto-complete="off" size="mini" placeholder="请输入新密码"></el-input>
                            </el-form-item>
                            <el-form-item label="确认新密码" prop="surepassword">
                                <el-input type="password" v-model="pwdForm.surepassword" auto-complete="off" size="mini" placeholder="请输入确认新密码"></el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" @click="submitForm('pwdForm')">提交</el-button>
                                <el-button @click="resetForm('pwdForm')">重置</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                </div>
            </el-col>


        </el-row>



    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	//import {axios} from 'utils/'
	import axios from 'axios';

	export default {
		data(){
			// 附带callback(),是在明确通过验证的情况下去掉输入框上的loading
			let validateEmail = (rule, value, callback) => {
				let emailRegex = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
				if (!emailRegex.test(value)) {
					callback(new Error('邮箱格式不正确！'))
				} else {
					callback();
				}
			};
			let validatePhone = (rule, value, callback) => {
				{
					let phoneRegex = /^1[34578]\d{9}$/;
					if (!phoneRegex.test(value)) {
						callback(new Error('手机号码格式不正确！'))
					} else {
						callback();
					}
				}
			};
			// validateField:对部分表单字段进行校验的方法
			let validateNewpassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入新密码'));
				} else {
					if (this.pwdForm.surepassword !== '') {
						this.$refs.pwdForm.validateField('surepassword');
					}
					callback();
				}
			};
			let validateSurepassword = (rule, value, callback) => {
				if (value === '') {
					callback(new Error('请输入确认密码'));
				} else if (value !== this.pwdForm.newpassword) {
					callback(new Error('两次输入密码不一致!'));
				} else {
					callback();
				}
			};
			return {
				infoForm:{
					EMP_NAME_:'',
					EMP_CODE_:'',
					GENDER_:'',
					BIRTH_DATE_:'',
					EMAIL_:'',
					TEL_:''
				},
				pwdForm:{
					password:'',
					newpassword:'',
					surepassword:''
				},
				infoRules: {
					GENDER_: [
						{ message: '请选择性别', trigger: 'change' }
					],
					/*EMAIL_: [
                        {required: false,validator: validateEmail,trigger: 'blur'}
                    ],
                    TEL_: [
                        {required: false,validator: validatePhone, trigger: 'blur' },
                    ] */
				},
				pwdRules: {
					password: [
						{ required: true, message: '请输入原密码', trigger: 'blur' },
					],
					newpassword: [
						{ required: true, validator:validateNewpassword, trigger: 'blur' },
					],
					surepassword: [
						{ required: true, validator:validateSurepassword, trigger: 'blur' },
					],
				},
				options: [{
					value: '1',
					label: '男'
				}, {
					value: '2',
					label: '女'
				}]
			};


		},
		created(){
			this.showUsername();
			this.getInfoByUsername();
		},
		methods: {
			showMessage(type,message){
				this.$message({
					type: type,
					message: message
				});
			},
			showUsername(){
				let userinfo = mutils.getStore('userinfo');
				this.infoForm.EMP_NAME_ = userinfo.username;

			},

			//修改信息
			submitForm(formName) {
				let userinfo = mutils.getStore('userinfo');
				let EMP_ID_ = userinfo.empId;
				this.$refs[formName].validate((valid) => {
					if (valid){
						if (formName == 'infoForm' ){
							let formDate = this[formName];
							let data = {};
							for (var i in formDate){
								data.EMP_ID_ = EMP_ID_;
								data.EMP_CODE_ = formDate['EMP_CODE_'];
								data.EMP_NAME_ = formDate['EMP_NAME_']
								data.GENDER_ = formDate['GENDER_'];
								data.BIRTH_DATE_ = formDate['BIRTH_DATE_'];
								data.EMAIL_ = formDate['EMAIL_'] == null ? '' : formDate['EMAIL_'];
								data.TEL_ = formDate['TEL_'] == null ? '' : formDate['TEL_'];
							}
							this.editInfoForm(data);
						} else{
							let formDate = this[formName];
							let data = {};
							for (var i in formDate){
								data.EMP_ID_ = EMP_ID_;
								data.OLD_PASSWORD_ = formDate['password'];
								data.NEW_PASSWORD_= formDate['newpassword'];
							}
							this.editPwdForm(data);
						}


					}

				})
			},
			//修改信息
			editInfoForm(data) {
				let BIRTH_DATE_ = '';
				if (mutils.isEmpty(data.BIRTH_DATE_)) {
					BIRTH_DATE_ = '';
				} else {
					BIRTH_DATE_ = mutils.formatDate(new Date(data.BIRTH_DATE_)); // 毫秒数，时间戳
				}


				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateEmpNew.do',
					data: {
						EMP_ID_ : data.EMP_ID_,
						EMP_CODE_ : data.EMP_CODE_,
						EMP_NAME_ : data.EMP_NAME_,
						GENDER_ : data.GENDER_,
						BIRTH_DATE_ : BIRTH_DATE_,
						EMAIL_ : data.EMAIL_,
						TEL_ : data.TEL_
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					that.$message.success('修改成功');
					that.getInfoByUsername();

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('修改失败请重试')
				})

			},

			// 修改密码
			editPwdForm(data){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateEmpPasswordNew.do',
					data: {
						EMP_ID_ : data.EMP_ID_,
						OLD_PASSWORD_ : that.$md5(data.OLD_PASSWORD_),
						NEW_PASSWORD_ : that.$md5(data.NEW_PASSWORD_)
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					that.$message.success('修改成功');

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('修改失败请重试')
				})
			},

			//重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},

			getInfoByUsername(){
                let that = this;
				const formdata = this.infoForm;
				let userinfo = mutils.getStore('userinfo');
				let EMP_NAME_ = userinfo.username;
				let EMP_CODE_ = userinfo.userCode;

				axios({
					method: 'POST',
					url:this.baseUrl +  'selectEmp.do',
					data: {
						EMP_CODE_:EMP_CODE_,
						EMP_NAME_ :EMP_NAME_
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				})
					.then(function (res) {
						formdata.EMP_CODE_ = res.data.empList[0].EMP_CODE_;
						formdata.GENDER_ = res.data.empList[0].GENDER_;
						formdata.BIRTH_DATE_ = res.data.empList[0].BIRTH_DATE_;
						formdata.EMAIL_ = res.data.empList[0].EMAIL_;
						formdata.TEL_ = res.data.empList[0].TEL_;
						that.pwdForm.password = '';
						that.pwdForm.newpassword = '';
						that.pwdForm.surepassword = '';
					})
					.catch(function (res) {
					})
			}


		}
	}
</script>

<style lang="less" scoped>
    .info_container{
        padding: 10px;
        margin: 0 10px;
        overflow: auto;
    }
    .title{
        text-align:center;
        width:100%;
        height:30px;
        line-height:30px;
        cursor: pointer;
        background-color: #3bc5ff;
        border:1px solid #3bc5ff;
        color: white;
        display: block;
        .fa{
            margin-right:5px;
        }
    }
    .info_row{
        .area{
            border:1px solid #dfdfdf;
            height:100%;
            font-size:14px;
            padding:10px;
            position: relative;
            left:250px;
            .form{
                width:90%;
                margin-top:20px;
            }
        }

    }
</style>


