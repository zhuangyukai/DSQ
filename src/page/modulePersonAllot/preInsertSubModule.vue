<template>
    <div>
        <div>
            <el-form
                    ref="insertSubModuleForm"
                    :model="insertSubModuleForm"
                    style="margin:10px;width:auto;"
            >
                <span style="font-size: 11px; color: red">提示:时间范围如果不在上级时间范围内({{preInsertSubModuleForm.PARENT_START_DATE_}}至{{preInsertSubModuleForm.PARENT_END_DATE_}}) 会自动修改上级时间</span>

                <el-form-item prop='MODULE_NAME_' label="模块名称:"
                              :rules="[{ required: true, message: '模块名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                    <el-input v-model="insertSubModuleForm.MODULE_NAME_" style="width: 75%"></el-input>
                </el-form-item>

                <el-form-item prop='START_DATE_' label="开始时间:" label-width="24.5%"  :rules="[{ required: true, message: '日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="insertSubModuleForm.START_DATE_"
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
                            v-model="insertSubModuleForm.END_DATE_"
                            type="date"
                            placeholder="选择完成日期"
                            style="width: 75%"
                            @change="endTimeStatus"
                            :picker-options="pickerOptionsEnd"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop='ORDER_' label="排序:" label-width="24.5%">
                    <el-input-number v-model="insertSubModuleForm.ORDER_" label="排序:" :precision="0" :step="1">
                    </el-input-number>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertSubModule("insertSubModuleForm")'>保 存</el-button>
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
				preInsertSubModuleForm: {
					PROJECT_ID_: '',
					PARENT_MODULE_ID_: '',
                    PARENT_START_DATE_ : '',
                    PARENT_END_DATE_ : ''
				},
				insertSubModuleForm: {
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
			//进页面赋空值
			setInsertSubModule(){
				this.insertSubModuleForm.MODULE_NAME_ = '';
				this.insertSubModuleForm.ORDER_ = '';
			},
			// 时间开始选择器
			startTimeStatus:function(value){
				this.module.tempDate.START_DATE_ = value
			},
			// 时间结束选择器
			endTimeStatus:function(value){
				this.module.tempDate.END_DATE_ = value
			},
            //点击保存按钮
			_insertSubModule(insertSubModuleForm){
				this.$refs[insertSubModuleForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertSubModuleForm];
						let that = this;

						let START_DATE_ = this.insertSubModuleForm.START_DATE_;
						let END_DATE_ = this.insertSubModuleForm.END_DATE_;

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
								PARENT_MODULE_ID_: that.preInsertSubModuleForm.PARENT_MODULE_ID_,
								PROJECT_ID_: that.preInsertSubModuleForm.PROJECT_ID_,
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

								that.$emit('insertSubModuleListeners', returnValue);
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
