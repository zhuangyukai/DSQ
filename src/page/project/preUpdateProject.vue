<template>
    <div class="fillcontain">
        <el-form
                v-loading="updateProjectFormLoading"
                ref="updateProjectForm"
                :model="updateProjectForm"
                style="margin:10px;width:auto;"
        >
            <el-form-item prop='PROJECT_CODE_' label="项目编码:" label-width="100px"
                          :rules="[{ required: true, message: '项目编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateProjectForm.PROJECT_CODE_" ></el-input>
            </el-form-item>

            <el-form-item prop='PROJECT_NAME_' label="项目名称:" label-width="100px"
                          :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateProjectForm.PROJECT_NAME_"></el-input>
            </el-form-item>

            <el-form-item prop='MANAGER_ID_' label="项目负责人编码:" label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '项目负责人编码' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateProjectForm.MANAGER_ID_" ></el-input>
            </el-form-item>

            <el-form-item prop='MANAGER_NAME_' label="项目负责人:" label-width="100px"
                          :rules="[{ required: true, message: '项目负责人' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateProjectForm.MANAGER_NAME_" :readonly="true" @focus="_preChooseEmp"></el-input>
            </el-form-item>

            <el-form-item prop='PROJECT_TYPE_CODE_' label="项目类型:" label-width="100px"
                          :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                <el-cascader v-model="updateProjectForm.PROJECT_TYPE_CODE_" clearable collapse-tags
                             placeholder="请选择项目类型"
                             :options="projectTypeList"
                             :props="{
                                  value: 'CODE_',
                                  label: 'NAME_',
                                  children: 'children'
                             }"
                             clearable>
                </el-cascader>
            </el-form-item>

            <el-form-item prop='START_DATE_' label="预计开始:"label-width="100px"
                          :rules="[{ required: true, message: '预计起始日期不能为空' ,trigger: 'blur' }]">
                <el-date-picker
                        v-model="updateProjectForm.START_DATE_"
                        type="date"
                        placeholder="预计开始时间"
                        @change="startTimeStatus"
                        :picker-options="pickerOptionsStart"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item prop='END_DATE_' label="预计结束:"label-width="100px"
                          :rules="[{ required: true, message: '预计结束日期不能为空' ,trigger: 'blur' }]">
                <el-date-picker
                        v-model="updateProjectForm.END_DATE_"
                        type="date"
                        placeholder="预计结束时间"
                        @change="endTimeStatus"
                        :picker-options="pickerOptionsEnd"

                >
                </el-date-picker>
            </el-form-item>


            <el-form-item prop='MEMO_' label="备注:" label-width="100px"
                          :rules="[{ type: 'string', max: 1000, message: '备注长度不能超过1000' ,trigger: 'blur' }]">
                <el-input type="textarea" v-model="updateProjectForm.MEMO_"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_updateProject("updateProjectForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

        <!--选择人员-->
        <el-dialog
                :title="chooseEmpDialog.title"
                :visible.sync="chooseEmpDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseEmpDialog.style"
                :width="chooseEmpDialog.width"
                @close="closeChooseEmpDialog"
        >
            <template>
                <chooseEmpCom ref="choose_emp_ref" v-if="chooseEmpDialog.dialogVisible"
                              @chooseEmpListeners="_completeChooseEmp">
                </chooseEmpCom>
            </template>
        </el-dialog>

    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';

	import chooseEmpCom from '../emp/preChooseEmp.vue';

	export default {
		components: {chooseEmpCom},
		data(){
		    return{
				idFlag: false,
				//打开人员机构的窗口
				chooseEmpDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					dialogVisible : true,
					formLabelWidth: '120px',
					empLoading: false,
				},
				isDisable : false,
				preUpdateProjectForm: {
					PROJECT_ID_: ''
				},
				updateProjectFormLoading: false,
				updateProjectForm: {
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					MANAGER_NAME_: '',
					MANAGER_ID_: '',
					PROJECT_TYPE_CODE_: '',
					MEMO_: '',
					START_DATE_: '',
					END_DATE_ : ''
				},
				projectTypeList: [],
				CODE_LIST : [],
				tempDate : {
					START_DATE_: '',
					END_DATE_: ''
				},
				//设置人员的时间
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.tempDate.END_DATE_;
						if (endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.tempDate.START_DATE_;
						if (beginDateVal) {
							return (
								time.getTime() < new Date(beginDateVal).getTime()
							);
						}
					},
				},
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this.selectByCategory();
			},
			/*async _selectCode(){
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
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_TYPE'){
								that.projectTypeList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},*/
			async selectByCategory() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectByCategory.do',
					data: {
						CATEGORY_: 'PROJECT_TYPE'
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
						that.projectTypeList = res.data.children;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
            //赋值
			setUpdateProjectForm(){
				this.updateProjectFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadProject.do?PROJECT_ID_=' + this.preUpdateProjectForm.PROJECT_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let project = res.data.project;

						that.updateProjectForm.PROJECT_CODE_ = project.PROJECT_CODE_;
						that.updateProjectForm.PROJECT_NAME_ = project.PROJECT_NAME_;
						that.updateProjectForm.MANAGER_NAME_ = project.MANAGER_NAME_;
						that.updateProjectForm.MANAGER_ID_ = project.MANAGER_ID_;
						that.updateProjectForm.PROJECT_TYPE_CODE_ = project.PROJECT_TYPE_CODE_;
						that.updateProjectForm.START_DATE_ = project.START_DATE_;
						that.updateProjectForm.END_DATE_ = project.END_DATE_;
						that.updateProjectForm.MEMO_ = project.MEMO_;

						that.updateProjectFormLoading = false;

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateProjectFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateProjectFormLoading = false;
				});
            },
            //点击保存
			_updateProject(updateProjectForm){
				this.$refs[updateProjectForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateProjectForm];
						let START_DATE_ = '';
						let END_DATE_ = '';
						if (mutils.isEmpty(formData['START_DATE_'])) {
							START_DATE_ = "";
						} else {
							START_DATE_ = mutils.formatDate(new Date(formData['START_DATE_'])); // 毫秒数，时间戳
						}
						if (mutils.isEmpty(formData['END_DATE_'])) {
							END_DATE_ = "";
						} else {
							END_DATE_ = mutils.formatDate(new Date(formData['END_DATE_']));
						}
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateProject.do',
							data: {
								PROJECT_ID_: that.preUpdateProjectForm.PROJECT_ID_,
								PROJECT_CODE_: formData['PROJECT_CODE_'],
								PROJECT_NAME_: formData['PROJECT_NAME_'],
								MANAGER_ID_: formData['MANAGER_ID_'],
								PROJECT_TYPE_CODE_: formData['PROJECT_TYPE_CODE_'][1],
								START_DATE_ : START_DATE_,
								END_DATE_ : END_DATE_,
								MEMO_: formData['MEMO_']
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
							if (res.data.success) {
								that.$message.success('修改成功');
								let returnValue = res.data.project;

								that.$emit('updateProjectListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试');
						})

					}
				})
            },
			// 时间开始选择器
			startTimeStatus:function(value){
				this.tempDate.START_DATE_ = value
			},
			// 时间结束选择器
			endTimeStatus:function(value){
				this.tempDate.END_DATE_ = value
			},

			//点击负责人
			_preChooseEmp(){
				this.chooseEmpDialog.show = true;
				this.chooseEmpDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_emp_ref._selectOrg();
				})
			},
			//关闭监听
			closeChooseEmpDialog(){
				this.chooseEmpDialog.dialogVisible = false;
			},
			//赋人名
			_completeChooseEmp(returnValue){
				this.updateProjectForm.MANAGER_ID_ = returnValue.EMP_ID_;
				this.updateProjectForm.MANAGER_NAME_ = returnValue.EMP_NAME_;
				this.chooseEmpDialog.show = false;
			},
        }
	}
</script>

<style scoped>

</style>
