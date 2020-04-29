<template>
    <div>
        <div>
            <el-form
                    ref="insertTaskForm"
                    :model="insertTaskForm"
                    style="margin:10px;width:auto;"
            >
                <el-form-item prop='TASK_NAME_' label="任务名称:"
                              :rules="[{ required: true, message: '任务名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                    <el-input v-model="insertTaskForm.TASK_NAME_" style="width: 75%"></el-input>
                </el-form-item>

                <el-form-item prop='TASK_LEVEL_' label="任务等级:"
                              :rules="[{ required: true, message: '任务等级不能为空' ,trigger: 'blur' }]">
                    <el-select v-model="insertTaskForm.TASK_LEVEL_" placeholder="请选择">
                        <el-option
                                v-for="item in taskLevelList"
                                :key="item.CODE_"
                                :label="item.NAME_"
                                :value="item.CODE_">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertTask("insertTaskForm")'>保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				preInsertTaskForm: {
					MODULE_ID_: ''
				},
				insertTaskForm: {
					TASK_NAME_: '',
					TASK_LEVEL_: ''
				},
				taskLevelList: [],
			}
		},
		created() {
			this.doSyncMethod();
		},
		methods: {
			async doSyncMethod() {
				await this._selectCode();
			},
			async _selectCode() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
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
						that.CODE_LIST = res.data.codeList;
						for (let i = 0; i < that.CODE_LIST.length; i++) {
							if (that.CODE_LIST[i].CATEGORY_ == 'TASK_LEVEL') {
								that.taskLevelList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//进页面赋空值
			setInsertTaskFormNull() {
				this.insertTaskForm.TASK_NAME_ = '';
				this.insertTaskForm.TASK_LEVEL_ = '0';
			},
			//点击保存按钮
			_insertTask(insertTaskForm) {
				this.$refs[insertTaskForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertTaskForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertTask.do',
							data: {
								MODULE_ID_: that.preInsertTaskForm.MODULE_ID_,
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
								that.$message.success('新增成功');
								let returnValue = res.data.task;

								that.$emit('insertTaskListeners', returnValue);
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