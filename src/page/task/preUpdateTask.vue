<template>
    <div class="form">
        <el-form
                ref="updateTaskForm"
                v-loading= "mainLoading"
                :model="updateTaskForm"
                style="margin:10px;width:auto;"
        >

            <el-form-item prop='TASK_NAME_' label="项目名称:"
                          :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateTaskForm.TASK_NAME_" style="width: 75%"></el-input>
            </el-form-item>

            <el-form-item prop='TASK_LEVEL_' label="项目类型:"
                          :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                <el-select v-model="updateTaskForm.TASK_LEVEL_" placeholder="请选择">
                    <el-option
                            v-for="item in taskLevelList"
                            :key="item.CODE_"
                            :label="item.NAME_"
                            :value="item.CODE_">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_updateTask("updateTaskForm")'>保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		data() {
			return {
				preUpdateTaskForm: {
					TASK_ID_: ''
				},
				updateTaskForm: {
					TASK_NAME_: '',
					TASK_LEVEL_: ''
				},
				taskLevelList: [],
				mainLoading : false
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectCode();
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
							if(that.CODE_LIST[i].CATEGORY_ == 'TASK_LEVEL'){
								that.taskLevelList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
            //进页面加载数据
			_loadTask(){
				this.mainLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadTask.do?TASK_ID_=' + that.preUpdateTaskForm.TASK_ID_ + ''
				).then(function (res) {
					if (res.data.success) {
						let task = res.data.task;

						that.updateTaskForm.TASK_NAME_ = task.TASK_NAME_;
						that.updateTaskForm.TASK_LEVEL_ = task.TASK_LEVEL_;
						that.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
						that.mainLoading = false;
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.mainLoading = false;
				});
            },
            //修改任务
			_updateTask(updateTaskForm){
				this.$refs[updateTaskForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateTaskForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateTask.do',
							data: {
								TASK_ID_ : that.preUpdateTaskForm.TASK_ID_,
								TASK_NAME_: formData['TASK_NAME_'],
								TASK_LEVEL_: formData['TASK_LEVEL_']
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
								let returnValue = res.data.task;

								that.$emit('updateTaskListeners', returnValue);
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
