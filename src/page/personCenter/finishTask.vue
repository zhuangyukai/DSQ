<template>
    <div>
        <div>
            <el-form
                    ref="finishTaskForm"
                    :model="finishTaskForm"
                    style="margin:10px;width:auto;"
            >
                <el-form-item prop='FINISH_DATE_' label="完成时间:"
                              :rules="[{ required: true, message: '完成时间不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="finishTaskForm.FINISH_DATE_"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop='ACTUAL_WORKING_HOURS_' label="实际工时:" label-width="24.5%">
                    <el-input-number v-model="finishTaskForm.ACTUAL_WORKING_HOURS_" :precision="0" :step="1">
                    </el-input-number>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='finishTask("finishTaskForm")'>保 存</el-button>
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
				finishTaskForm: {
					FINISH_DATE_: '',
					ACTUAL_WORKING_HOURS_: ''
                },
				TASK_PERSON_ID_LIST: [],
            }
        },
        methods: {
			//进页面赋空值
			setFinishTask(){
				this.finishTaskForm.FINISH_DATE_ = '';
			},
            //点击完成
			finishTask(finishTaskForm){
				this.$refs[finishTaskForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
							let that = this;
							axios({
								method: 'POST',
								url: this.baseUrl + 'updateToDoTaskPersonStatus.do',
								data: {
									TASK_PERSON_ID_LIST: that.TASK_PERSON_ID_LIST,
									FINISH_DATE_: mutils.formatDate(new Date(that.finishTaskForm.FINISH_DATE_)),
									ACTUAL_WORKING_HOURS_: that.finishTaskForm.ACTUAL_WORKING_HOURS_
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
									that.$message.success('操作成功');
									that.$emit('finishTaskListeners');
								} else {
									that.$message.error(res.data.message);
								}
							}).catch(function (err) {
								/*请求失败*/
								that.$message.error('系统错误请联系管理员')
							})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>