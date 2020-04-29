<template>
    <div class="fillcontain">
        <div class="table_container">
            <el-table
                    v-loading="taskloading"
                    :data="taskList"
                    :style="taskGridStyle"
            >
                <el-table-column
                        prop="TASK_NAME_"
                        label="任务名称"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="TASK_LEVEL_"
                        label="任务等级"
                        width="80"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.TASK_LEVEL_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="80">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                size="mini"
                                @click='_chooseTask(scope.row)'
                        >选择
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	export default {
		data(){
		    return{
		    	preChooseTask: {
		    	    MODULE_ID_: ''
                },
				taskList: [],
				//任务grid的style
				taskGridStyle: {
					width: '100%',
				},
				taskloading: false,
				TASK_LEVEL_LIST: [],
				taskLevelCodeMapList:{}
            }
        },
		created() {
			this.doSyncMethod();
		},
		methods : {
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
								that.TASK_LEVEL_LIST.push(that.CODE_LIST[i]);
								that.taskLevelCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
            selectTask(){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTask.do',
					data: {
						MODULE_ID_: that.preChooseTask.MODULE_ID_
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
						that.taskList = [];
						let taskList = res.data.taskList;

						for (let i = 0; i < taskList.length; i++) {
							const tableItem = {
								TASK_ID_: taskList[i].TASK_ID_,
								MODULE_ID_: taskList[i].MODULE_ID_,
								TASK_NAME_: taskList[i].TASK_NAME_,
								TASK_LEVEL_: taskList[i].TASK_LEVEL_,
								DRAFTOR_ID_: taskList[i].DRAFTOR_ID_,
								DRAFT_DATE_: taskList[i].DRAFT_DATE_,
								TASK_LEVEL_: that.taskLevelCodeMapList[taskList[i].TASK_LEVEL_]
							};
							that.taskList.push(tableItem);
						}
						that.taskGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.taskGridLoading = false;
				})
            },
            //点击选择
			_chooseTask(row){
				let returnValue = row;
				this.$emit('preChooseTasklisteners', returnValue);
            }
		}
	}
</script>

<style scoped>

</style>