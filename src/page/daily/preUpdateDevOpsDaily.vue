<template>
    <div class="fillcontain" >
        <el-form
                v-loading="updateDevOpsDailyFormLoading"
                ref="updateDevOpsDailyForm"
                :model="updateDevOpsDailyForm"
                style="margin:10px;width:auto; "

        >
            <el-form-item prop='DAILY_ID_' label="日报ID:"  label-width="100px" v-if="idFlag"
            :rules="[{ required: true, message: '日报ID代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '代码不能超过60位', trigger: 'blur' }]">
            <el-input v-model="updateDevOpsDailyForm.DAILY_ID_" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item prop='ORG_ID_' label="报修单位ID:"  label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '报修单位ID代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '代码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDailyForm.ORG_ID_" style="width: 200px"></el-input>
            </el-form-item>

            <el-form-item prop='DEPT_ID_' label="作业区ID:"  label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '作业区ID不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '代码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDailyForm.DEPT_ID_" style="width: 200px"></el-input>
            </el-form-item>


            <el-form-item prop='SYSTEM_ID_' label="系统名称ID:"  label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '系统名称ID不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '代码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDailyForm.SYSTEM_ID_" style="width: 200px"></el-input>
            </el-form-item>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop='ORG_NAME_' label="报修单位:"  label-width="100px"
                                  :rules="[{ required: true, message: '报修单位名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过100位', trigger: 'blur' }]">
                        <!--<el-input v-model="updateDevOpsDailyForm.ORG_NAME_" style="width: 100%" readonly="true" @focus="_preChooseOrg"></el-input>-->
                        <el-select v-model="updateDevOpsDailyForm.ORG_NAME_" filterable placeholder="请选择" style="width: 200px" @change="_selectDeptSystemCode()">
                            <el-option
                                    v-for="item in orgNameTypeList"
                                    :key="item.ORG_ID_"
                                    :label="item.ORG_NAME_"
                                    :value="item.ORG_ID_">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='DEPT_NAME_' label="作业区:"  label-width="100px"
                                  :rules="[{ required: true, message: '作业区名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过100位', trigger: 'blur' }]">
                        <!--<el-input v-model="updateDevOpsDailyForm.DEPT_NAME_" style="width: 100%" readonly="true" ></el-input>-->
                        <el-select v-model="updateDevOpsDailyForm.DEPT_NAME_" filterable placeholder="请选择" style="width: 200px" >
                            <el-option
                                    v-for="item in deptNameTypeList"
                                    :key="item.DEPT_ID_"
                                    :label="item.DEPT_NAME_"
                                    :value="item.DEPT_ID_">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop='SYSTEM_NAME_' label="系统名称:"  label-width="100px"
                                  :rules="[{ required: true, message: '系统名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '名称不能超过60位', trigger: 'blur' }]">
                        <!--<el-input v-model="updateDevOpsDailyForm.SYSTEM_NAME_" style="width: 100%" readonly="true" ></el-input>-->
                        <el-select v-model="updateDevOpsDailyForm.SYSTEM_NAME_" placeholder="请选择" filterable style="width: 200px" >
                            <el-option
                                    v-for="item in SYSTEM_LIST"
                                    :key="item.SYSTEM_ID_"
                                    :label="item.SYSTEM_NAME_"
                                    :value="item.SYSTEM_ID_">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='APPLICANT_' label="报修人:"  label-width="100px"
                                  :rules="[{ required: true, message: '报修人不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '名称不能超过60位', trigger: 'blur' }]">
                        <el-input v-model="updateDevOpsDailyForm.APPLICANT_" style="width: 200px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop='TEL_' label="电话:"  label-width="100px">
                        <el-input v-model="updateDevOpsDailyForm.TEL_" style="width: 200px"placeholder="请填写申请人手机号码" ></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='WORKING_HOURS_' label="累计工时:"  label-width="100px">
                        <template slot-scope="scope">
                            <el-input-number v-model="updateDevOpsDailyForm.WORKING_HOURS_" :precision="1"
                                             :step="1"style="width: 200px"></el-input-number>
                        </template>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop='CREATE_DATE_' label="创建日期:"  label-width="100px"
                                  :rules="[{ required: true, message: '创建日期不能为空' ,trigger: 'blur' }]">
                        <el-date-picker
                                v-model="updateDevOpsDailyForm.CREATE_DATE_"
                                type="date"
                                style="width: 200px"
                                placeholder="创建日期"
                                @change="startTimeStatus"
                                :picker-options="pickerOptionsStart"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='FINISH_DATE_' label="完成日期:" label-width="100px"
                                  :rules="[{ required: true, message: '完成日期不能为空' ,trigger: 'blur' }]">
                        <el-date-picker
                                v-model="updateDevOpsDailyForm.FINISH_DATE_"
                                type="date"
                                style="width: 200px"
                                placeholder="完成日期"
                                @change="endTimeStatus"
                                :picker-options="pickerOptionsEnd"
                        >
                        </el-date-picker>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-row>
                <el-col :span="12">
                    <el-form-item prop='WECHAT_' label="是否用微信插入知识库类型:"  label-width="100px"
                                  :rules="[{ required: true, message: '是否用微信插入知识库类型不能为空' ,trigger: 'blur' }]">
                        <el-select v-model="updateDevOpsDailyForm.WECHAT_" placeholder="请选择" style="width: 200px">
                            <el-option
                                    v-for="item in wdCodeMapList"
                                    :key="item.CODE_"
                                    :label="item.NAME_"
                                    :value="item.CODE_">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="12">
                    <el-form-item prop='DEVELOPMENT_' label="是否需要开发:"  label-width="100px"
                                  :rules="[{ required: true, message: '是否需要开发类型不能为空' ,trigger: 'blur' }]">
                        <el-select v-model="updateDevOpsDailyForm.DEVELOPMENT_" placeholder="请选择" style="width: 200px">
                            <el-option
                                    v-for="item in wdCodeMapList"
                                    :key="item.CODE_"
                                    :label="item.NAME_"
                                    :value="item.CODE_">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>

            <el-form-item prop='FAULT_TYPE_' label="故障类型:"  label-width="100px"
                          :rules="[{ required: true, message: '故障类型不能为空' ,trigger: 'blur' }]">
                <el-select v-model="updateDevOpsDailyForm.FAULT_TYPE_" placeholder="请选择" style="width: 200px">
                    <el-option
                            v-for="item in faultTypeList"
                            :key="item.CODE_"
                            :label="item.NAME_"
                            :value="item.CODE_">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item prop='FAULT_PHENOMENON_' label="故障现象:"  label-width="100px"
                          :rules="[{ type: 'string', max: 1000, message: '长度不能超过1000', trigger: 'blur' }]">
                <el-input type="textarea" v-model="updateDevOpsDailyForm.FAULT_PHENOMENON_" style="width: 81%"></el-input>
            </el-form-item>

            <el-form-item prop='SOLUTION_' label="解决方案:"  label-width="100px"
                          :rules="[{ type: 'string', max: 1000, message: '长度不能超过1000', trigger: 'blur' }]">
                <el-input type="textarea" v-model="updateDevOpsDailyForm.SOLUTION_" style="width: 81%"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary":loading="buttonLoading"  @click='_updateDevOpsDaily("updateDevOpsDailyForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

        <!--选择报修单位-->
        <el-dialog
                :title="chooseOrgDialog.title"
                :visible.sync="chooseOrgDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                :style="chooseOrgDialog.style"
                :width="chooseOrgDialog.width"
                @close="closeChooseOrgDialog"
        >
            <template>
                <chooseOrgCom ref="choose_org_ref" v-if="chooseOrgDialog.dialogVisible"
                              @chooseEmpListeners="_completeChooseOrg">
                </chooseOrgCom>
            </template>
        </el-dialog>

    </div>

</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'

	import chooseOrgCom from "../daily/preInsertDevOpsOrg.vue";
	export default {
		components: {chooseOrgCom},
		name: "preUpdateDevOpsDaily",
        data() {
			return {
				buttonLoading: false,
				idFlag: false,

				updateDevOpsDailyFormLoading: false,
				updateDevOpsDailyForm: {
					tempIndex: '',
					DAILY_ID_: '',
					ORG_ID_: '',
					DEPT_ID_: '',
					SYSTEM_ID_: '',
					ORG_NAME_: '',
					DEPT_NAME_: '',
					APPLICANT_: '',
					TEL_: '',
					CREATE_DATE_: '',
					FINISH_DATE_: '',
					SYSTEM_NAME_: '',
					FAULT_PHENOMENON_: '',
					SOLUTION_: '',
					FAULT_TYPE_: '',
					WORKING_HOURS_: '',
					WECHAT_: '',
					DEVELOPMENT_: ''
				},
				//打开报修单位的窗口
				chooseOrgDialog: {
					width: '1300px',
					show: false,
					title: '报修单位',
					dialogVisible: true,
					formLabelWidth: '120px',
					empLoading: false,
				},
				tempDate: {
					CREATE_DATE_: '',
					FINISH_DATE_: ''
				},
				//设置人员的时间
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.tempDate.FINISH_DATE_;
						if (endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.tempDate.CREATE_DATE_;
						if (beginDateVal) {
							return (
								time.getTime() < new Date(beginDateVal).getTime()
							);
						}
					},
				},
				faultTypeList: [],
				wdCodeMapList: [],
				orgNameTypeList: [],
				deptNameTypeList: [],
				SYSTEM_LIST: []

            }
        },

        created () {
			this.doSyncMethod();
        },

        methods : {
			async doSyncMethod() {
				await this._selectCode();
				await this._selectOrgCode();
				await this._selectSystemCode();
			},
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
							if(that.CODE_LIST[i].CATEGORY_ == 'FAULT_TYPE_'){
								that.faultTypeList.push(that.CODE_LIST[i]);
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'BOOLEAN'){
								that.wdCodeMapList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},

			async _selectOrgCode() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectDevOpsOrg.do',
					data: {},
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
						that.ORG_LIST = res.data.orgList;
						for (let i = 0; i < that.ORG_LIST.length; i++) {
							if (that.ORG_LIST[i].STATUS_ == '1') {
								that.orgNameTypeList.push(that.ORG_LIST[i]);
								//that.faultTypeList[that.ORG_LIST[i].CODE_] = that.ORG_LIST[i].NAME_;
							}
						}
						that.updateDevOpsDailyFormLoading= false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.updateDevOpsDailyFormLoading= false;
				});
			},

			//查询系统名称
			async _selectSystemCode() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectYwSystem.do',
					data: {},
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
						that.SystemList = res.data.ywSystemList;
						for (let i = 0; i < that.SystemList.length; i++) {
							that.SYSTEM_LIST.push(that.SystemList[i]);
							//that.faultTypeList[that.SystemList[i].CODE_] = that.SystemList[i].NAME_;
						}
						that.updateDevOpsDailyFormLoading= false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.updateDevOpsDailyFormLoading= false;
				});
			},


			_selectDeptSystemCode() {
				this.updateDevOpsDailyForm.DEPT_NAME_ = '';
				//this.updateDevOpsDailyForm.SYSTEM_NAME_ = '';

				let that = this;
				this.updateDevOpsDailyFormLoading= true;
				 axios({
					method: 'POST',
					url: this.baseUrl + 'selectdevOpsDept.do',
					data: {
						ORG_ID_: that.updateDevOpsDailyForm.ORG_NAME_
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

						that.deptNameTypeList = res.data.deptList;
						//that.SYSTEM_LIST = res.data.systemList;

						that.updateDevOpsDailyFormLoading= false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.updateDevOpsDailyFormLoading= false;
				});
			},

			_selectDeptSystemCodeTwo() {
				let that = this;
				this.updateDevOpsDailyFormLoading= true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectdevOpsDept.do',
					data: {
						ORG_ID_: that.updateDevOpsDailyForm.ORG_NAME_
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

						that.deptNameTypeList = res.data.deptList;
						//that.SYSTEM_LIST = res.data.systemList;

						that.updateDevOpsDailyFormLoading= false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.updateDevOpsDailyFormLoading= false;
				});
			},

			//验证手机号
			checkPhone (rule, value, callback) {
				if (!(/^1[34578]\d{9}$/.test(value))) {
					callback(new Error('请输入正确的手机号码!'));
				}
				else {
					callback();
				}
			},

			// 时间开始选择器
			startTimeStatus: function (value) {
				this.tempDate.CREATE_DATE_ = value
			},
			// 时间结束选择器
			endTimeStatus: function (value) {
				this.tempDate.FINISH_DATE_ = value
			},
			//赋值
			setUpdateDevOpsDailyForm(){
				this.updateDevOpsDailyFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadDaily.do?DAILY_ID_=' + this.updateDevOpsDailyForm.DAILY_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let daily = res.data.daily;

						that.updateDevOpsDailyForm.DAILY_ID_ = daily.DAILY_ID_;
						that.updateDevOpsDailyForm.ORG_ID_ = daily.ORG_ID_;
						that.updateDevOpsDailyForm.DEPT_ID_ = daily.DEPT_ID_;
						that.updateDevOpsDailyForm.SYSTEM_ID_ = daily.SYSTEM_ID_;
						that.updateDevOpsDailyForm.ORG_NAME_ = daily.ORG_ID_;
						that.updateDevOpsDailyForm.DEPT_NAME_ = daily.DEPT_ID_;
						that.updateDevOpsDailyForm.APPLICANT_ = daily.APPLICANT_;
						that.updateDevOpsDailyForm.TEL_ = daily.TEL_;
						that.updateDevOpsDailyForm.CREATE_DATE_ = daily.CREATE_DATE_;
						that.updateDevOpsDailyForm.FINISH_DATE_ = daily.FINISH_DATE_;
						that.updateDevOpsDailyForm.SYSTEM_NAME_ = daily.SYSTEM_ID_;
						that.updateDevOpsDailyForm.FAULT_PHENOMENON_ = daily.FAULT_PHENOMENON_;
						that.updateDevOpsDailyForm.SOLUTION_ = daily.SOLUTION_;
						that.updateDevOpsDailyForm.FAULT_TYPE_ = daily.FAULT_TYPE_;
						that.updateDevOpsDailyForm.WORKING_HOURS_ = daily.WORKING_HOURS_;
						that.updateDevOpsDailyForm.WECHAT_ = daily.WECHAT_;
						that.updateDevOpsDailyForm.DEVELOPMENT_ = daily.DEVELOPMENT_;

						that.updateDevOpsDailyFormLoading = false;

						that._selectDeptSystemCodeTwo()

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateDevOpsDailyFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateDevOpsDailyFormLoading = false;
				});
			},

			//点击保存按钮
			_updateDevOpsDaily(updateDevOpsDailyForm) {
				this.$refs[updateDevOpsDailyForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						this.buttonLoading = true;
						let formData = this[updateDevOpsDailyForm];
						let CREATE_DATE_ = '';
						let FINISH_DATE_ = '';
						if (mutils.isEmpty(formData['CREATE_DATE_'])) {
							CREATE_DATE_ = "";
						} else {
							CREATE_DATE_ = mutils.formatDate(new Date(formData['CREATE_DATE_'])); // 毫秒数，时间戳
						}
						if (mutils.isEmpty(formData['FINISH_DATE_'])) {
							FINISH_DATE_ = "";
						} else {
							FINISH_DATE_ = mutils.formatDate(new Date(formData['FINISH_DATE_']));
						}

						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateDaily.do',//'insertProjectPerson.do',
							data: {
								DAILY_ID_: formData['DAILY_ID_'],
								ORG_ID_: formData['ORG_NAME_'],
								DEPT_ID_: formData['DEPT_NAME_'],
								SYSTEM_ID_: formData['SYSTEM_NAME_'],
								// ORG_NAME_: formData['ORG_ID_'],
								// DEPT_NAME_: formData['DEPT_ID_'],
								// SYSTEM_NAME_: formData['SYSTEM_ID_'],
								APPLICANT_: formData['APPLICANT_'],
								TEL_: formData['TEL_'],
								CREATE_DATE_: CREATE_DATE_,
								FINISH_DATE_: FINISH_DATE_,
								FAULT_PHENOMENON_: formData['FAULT_PHENOMENON_'],
								SOLUTION_: formData['SOLUTION_'],
								FAULT_TYPE_: formData['FAULT_TYPE_'],
								WORKING_HOURS_: formData['WORKING_HOURS_'],
								WECHAT_: formData['WECHAT_'],
								DEVELOPMENT_: formData['DEVELOPMENT_'],
								DAILY_TYPE_: 'yw'

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
								that.$message.success('修改成功');
								let returnValue = res.data.daily;

								that.$emit('updateDevOpsDailyListeners', returnValue);
								that.buttonLoading = false;
							} else {
								that.$message.error(res.data.message);
								that.buttonLoading = false;
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试');
							that.buttonLoading = false;
						})

					}
				})
			},

			//点报修单位
			_preChooseOrg() {
				this.chooseOrgDialog.show = true;
				this.chooseOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_org_ref.selectOrg();
				})
				//this.updateDevOpsDailyForm.tempIndex = index;
			},
			//关闭监听
			closeChooseOrgDialog() {
				this.chooseOrgDialog.dialogVisible = false;
			},
			//赋报修单位、作业区、系统名称
			_completeChooseOrg(returnValue) {
				this.updateDevOpsDailyForm.ORG_ID_ = returnValue.ORG_ID_;
				this.updateDevOpsDailyForm.ORG_NAME_ = returnValue.ORG_NAME_;
				this.updateDevOpsDailyForm.DEPT_ID_ = returnValue.DEPT_ID_;
				this.updateDevOpsDailyForm.DEPT_NAME_ = returnValue.DEPT_NAME_;
				this.updateDevOpsDailyForm.SYSTEM_ID_ = returnValue.SYSTEM_ID_;
				this.updateDevOpsDailyForm.SYSTEM_NAME_ = returnValue.SYSTEM_NAME_;

				this.chooseOrgDialog.show = false;
			},


		}
	}
</script>

<style scoped>

</style>
