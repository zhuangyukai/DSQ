<template>
    <div class="form">
        <el-form
                v-loading="updateModuleFormLoading"
                ref="updateModuleForm"
                :model="updateModuleForm"
                style="margin:10px;width:auto;"
        >

            <el-form-item prop='MODULE_NAME_' label="模块名称:" label-width="24.5%"
                          :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateModuleForm.MODULE_NAME_" style="width: 75%"></el-input>
            </el-form-item>

            <el-form-item prop='START_DATE_' label="开始时间:" label-width="24.5%"  :rules="[{ required: true, message: '日期不能为空' ,trigger: 'blur' }]">
                <el-date-picker
                        v-model="updateModuleForm.START_DATE_"
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
                        v-model="updateModuleForm.END_DATE_"
                        type="date"
                        placeholder="选择完成日期"
                        style="width: 75%"
                        @change="endTimeStatus"
                        :picker-options="pickerOptionsEnd"
                >
                </el-date-picker>
            </el-form-item>

            <el-form-item prop='ORDER_' label="排序:" label-width="24.5%">
                <el-input-number v-model="updateModuleForm.ORDER_" label="排序:" :precision="0" :step="1">
                </el-input-number>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_updateModule("updateModuleForm")'>保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'

	export default {
		data() {
			return {
				preUpdateModuleForm: {
					MODULE_ID_: ''
				},
				updateModuleFormLoading: false,
				updateModuleForm: {
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
				},
                //设置人员的时间
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
			//进页面加载数据
			setUpdateModule(){
				this.updateModuleFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadModule.do?MODULE_ID_=' + that.preUpdateModuleForm.MODULE_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let module = res.data.module;

						that.updateModuleForm.MODULE_NAME_ = module.MODULE_NAME_;
						that.updateModuleForm.START_DATE_ = module.START_DATE_;
						that.updateModuleForm.END_DATE_ = module.END_DATE_;
						that.updateModuleForm.ORDER_ = module.ORDER_;
						that.updateModuleFormLoading = false;
					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateModuleFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateModuleFormLoading = false;
				});
            },
            //修改
			_updateModule(updateModuleForm){
				this.$refs[updateModuleForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateModuleForm];
						let that = this;

						let START_DATE_ = this.updateModuleForm.START_DATE_;
						let END_DATE_ = this.updateModuleForm.END_DATE_;

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
							url: this.baseUrl + 'updateModule.do',
							data: {
								MODULE_ID_ : that.preUpdateModuleForm.MODULE_ID_,
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
								that.$message.success('修改成功');
								let returnValue = res.data.module;

								that.$emit('updateModuleListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试');
						})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>
