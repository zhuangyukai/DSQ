<template>
    <div>
        <div>
            <el-form
                    ref="insertRootModuleForm"
                    :model="insertRootModuleForm"
                    style="margin:10px;width:auto;"
            >
                <el-form-item prop='MODULE_NAME_' label="模块名称:" label-width="24.5%"
                              :rules="[{ required: true, message: '模块名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                    <el-input v-model="insertRootModuleForm.MODULE_NAME_" style="width: 75%"></el-input>
                </el-form-item>

                <el-form-item prop='START_DATE_' label="开始时间:" label-width="24.5%"  :rules="[{ required: true, message: '日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="insertRootModuleForm.START_DATE_"
                            type="date"
                            placeholder="选择开发日期"
                            style="width: 75%"
                            @change="startTimeStatus"
                            :picker-options="pickerOptionsStart"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop='END_DATE_' label="完成时间:" label-width="24.5%"  :rules="[{ required: true, message: '日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="insertRootModuleForm.END_DATE_"
                            type="date"
                            placeholder="选择完成日期"
                            style="width: 75%"
                            @change="endTimeStatus"
                            :picker-options="pickerOptionsEnd"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop='ORDER_' label="排序:" label-width="24.5%">
                    <el-input-number v-model="insertRootModuleForm.ORDER_" label="排序:" :precision="0" :step="1">
                    </el-input-number>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertRootModule("insertRootModuleForm")'>保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'

	export default {
		data(){
			return{
				preInsertRootModuleForm: {
					PROJECT_ID_: ''
				},
				insertRootModuleForm: {
					MODULE_NAME_: '',
					START_DATE_ : '',
					END_DATE_ : '',
					ORDER_: ''
				},
                module:{
					tempDate: {
						START_DATE_: '',
						END_DATE_: ''
					},
                }
                ,//设置人员的时间
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.module.tempDate.END_DATE_;
						if (endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.module.tempDate.START_DATE_;
						if (beginDateVal) {
							return (
								time.getTime() < new Date(beginDateVal).getTime()
							);
						}
					},
				},
            }

        },

        methods: {
			// 时间开始选择器
			startTimeStatus:function(value){
				this.module.tempDate.START_DATE_ = value
			},
			// 时间结束选择器
			endTimeStatus:function(value){
				this.module.tempDate.END_DATE_ = value
			},
			//进页面赋空值
			setInsertRootModule(){
				this.insertRootModuleForm.MODULE_NAME_ = '';
				this.insertRootModuleForm.ORDER_ = '';
			},
            //点击保存按钮
			_insertRootModule(insertRootModuleForm){
				this.$refs[insertRootModuleForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertRootModuleForm];
						let that = this;

						let START_DATE_ = this.insertRootModuleForm.START_DATE_;
						let END_DATE_ = this.insertRootModuleForm.END_DATE_;

						if (mutils.isEmpty(START_DATE_)) {
							START_DATE_ = "";
						} else {
							START_DATE_ = mutils.formatDate(new Date(START_DATE_)); // 毫秒数，时间戳
						}
						if (mutils.isEmpty(END_DATE_)) {
							END_DATE_ = "";
						} else {
							END_DATE_ = mutils.formatDate(new Date(END_DATE_));
						}
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertModule.do',
							data: {
								PROJECT_ID_: that.preInsertRootModuleForm.PROJECT_ID_,
								MODULE_NAME_: formData['MODULE_NAME_'],
								START_DATE_ : START_DATE_,
								END_DATE_ : END_DATE_,
								ORDER_: formData['ORDER_']
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
								that.$message.success('新增成功');
								let returnValue = res.data.module;

								that.$emit('insertRootModuleListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>
