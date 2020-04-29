<template>
    <div>
        <div>
            <el-form
                    ref="insertEmpForm"
                    :model="insertEmpForm"
                    style="margin:10px;width:auto;height:330px"
            >
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='EMP_CODE_' label="员工编码:"
                                      :rules="[{ required: true, message: '员工编码不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertEmpForm.EMP_CODE_" style="width: 55%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='EMP_NAME_' label="员工姓名:"
                                      :rules="[{ required: true, message: '员工姓名不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertEmpForm.EMP_NAME_" style="width: 55%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='PASSWORD_' label="密码:" label-width="25%"
                                      :rules="[{ required: true, message: '密码不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertEmpForm.PASSWORD_" style="width: 75%" type="password"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='CONFIRM_PASSWORD_' label="确认密码:"
                                      :rules="[{ required: true, message: '确认不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertEmpForm.CONFIRM_PASSWORD_" style="width: 55%" type="password"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='GENDER_' label="员工性别:" label-width="25.5%">
                            <el-select v-model="insertEmpForm.GENDER_" value="男" style="width: 75%">
                                <el-option
                                        v-for="item in type.gender"
                                        :key="item.CODE_"
                                        :label="item.NAME_"
                                        :value="item.CODE_">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='TEL_' label="联系电话:" label-width="25.5%">
                            <el-input v-model="insertEmpForm.TEL_" style="width: 75%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item prop='BIRTH_DATE_' label="出生日期:" label-width="13%">
                            <el-date-picker
                                    v-model="insertEmpForm.BIRTH_DATE_"
                                    style="width: 89.5%"
                                    type="date"
                                    placeholder="选择日期">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="24">
                        <el-form-item prop='EMAIL_' label="邮箱:" label-width="13%">
                            <el-input v-model="insertEmpForm.EMAIL_"  style="width: 89.5%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                    <el-form-item prop='MEMO_' label="备注:" label-width="13%">
                        <el-input type="textarea" v-model="insertEmpForm.MEMO_"  style="width: 89.5%"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button type="primary" @click='_insertEmp("insertEmpForm")'>保 存</el-button>
                        <el-button @click="_close()">关闭</el-button>
                    </el-form-item>

            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';

	export default {
		data(){
			return{
				insertEmpForm: {
					EMP_CODE_: '',
					EMP_NAME_: '',
					GENDER_: '',
					BIRTH_DATE_: '',
					TEL_: '',
					EMAIL_: '',
					MEMO_: '',
					PASSWORD_: '',
					CONFIRM_PASSWORD_: ''
				},
				ORG_ID_: '',//用来接收上一页传来的ORG_ID_
                type: {
				    gender: [],
                    status: [],
                },
			}
		},
		props: {
			_closeInsertEmpDialog: {
				type: Function,
				default: null
			}
		},
		created() {
			this._selectCode();

		},
		methods: {
			async _selectCode(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
					data: {
					},
					transformRequest: [function (data) {
						let ret = '';
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					if (res.data.success) {
						that.CODE_LIST = res.data.codeList;
						for(let i = 0; i<that.CODE_LIST.length; i++){
							if(that.CODE_LIST[i].CATEGORY_ == 'GENDER'){
								that.type.gender.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//赋空值
			setInsertEmpForm(){
				this.insertEmpForm.EMP_CODE_ = '';
				this.insertEmpForm.EMP_NAME_ = '';
				this.insertEmpForm.GENDER_ = '';
				this.insertEmpForm.BIRTH_DATE_ = '';
				this.insertEmpForm.TEL_ = '';
				this.insertEmpForm.EMAIL_ = '';
				this.insertEmpForm.MEMO_ = '';
				this.insertEmpForm.PASSWORD_= '';
				this.insertEmpForm.CONFIRM_PASSWORD_= '';
			},
			//点击保存按钮
			_insertEmp(insertEmpForm){
				this.$refs[insertEmpForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertEmpForm];
						let BIRTH_DATE_ = formData['BIRTH_DATE_'];
						if (mutils.isEmpty(BIRTH_DATE_)) {
							BIRTH_DATE_ = "";
						} else {
							BIRTH_DATE_ = mutils.formatDate(new Date(formData['BIRTH_DATE_'])); // 毫秒数，时间戳
						}
						let that = this;
						if(formData['CONFIRM_PASSWORD_'] != formData['PASSWORD_']){
							this.$message.warning("密码填写错误");
							return;
                        }
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertEmp.do',
							data: {
								ORG_ID_: that.ORG_ID_,
								EMP_CODE_: formData['EMP_CODE_'],
								EMP_NAME_: formData['EMP_NAME_'],
								PASSWORD_: that.$md5(formData['PASSWORD_']),
								PW_RESET_REQ_: 0,
								GENDER_: formData['GENDER_'],
								BIRTH_DATE_: BIRTH_DATE_,
								TEL_: formData['TEL_'],
								EMAIL_: formData['EMAIL_'],
								MEMO_: formData['MEMO_'],
								STATUS_: 1
							},
							transformRequest: [function (data) {
								let ret = '';
								for (let it in data) {
									ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
								}
								return ret
							}],
							headers: {'Content-Type': "application/x-www-form-urlencoded"}
						}).then(function (res) {
							if (res.data.success) {
								that.$message.success('新增成功');
								that.setInsertEmpForm();
								let returnValue = res.data.emp;
								that.$emit('insertEmpListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
			},
			_close() {
				this._closeInsertEmpDialog();
			}

		}
	}
</script>

<style scoped>

</style>