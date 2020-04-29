<template>
    <div class="fillcontain">
        <div>
            <el-form
                    :inline="true"
                    class="demo-form-inline search-form">
                <el-form-item>
                    项目名称:
                    <el-input v-model="toDoTask_Query_Date.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectToDoTask()'>筛选</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="completedDoTaskGrid.mainloading"
                    highlight-current-row
                    :data="completedDoTaskGrid.tableData"
                    align='center'
                    :style="completedDoTaskGrid.gridTableStyle"
                    :height="completedDoTaskGrid.gridTableStyle.height">
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="160"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="MODULE_NAME_"
                        label="模块名称"
                        align='center'
                        width="160"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="TASK_NAME_"
                        label="任务名称"
                        align='center'
                        width="160"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="TASK_LEVEL_"
                        label="任务级别"
                        align='center'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row._task_level }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="START_DATE_"
                        label="开始时间"
                        align='center'
                        width="180"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="FINISH_DATE_"
                        label="实际完成时间"
                        align='center'
                        width="220"
                        sortable>
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <el-icon name="time"></el-icon>
                            <span style="margin-left: 10px;color:#66ccff">{{ scope.row.FINISH_DATE_ }}</span>
                        </div>
                        <div v-else>
                            <el-date-picker
                                    v-model="scope.row.FINISH_DATE_"
                                    type="date"
                            style="width: 200px;">
                            </el-date-picker>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WORKING_HOURS_"
                        label="预计工时"
                        width="150"
                        align='center'
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="ACTUAL_WORKING_HOURS_"
                        label="实际工时"
                        width="160"
                        sortable>
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.ACTUAL_WORKING_HOURS_ }}</span>
                        </div>
                        <div v-else>
                            <el-input-number
                                    v-model="scope.row.ACTUAL_WORKING_HOURS_"
                                    :precision="0"
                                    :step="1">
                            </el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="TASK_PERSON_STATUS_"
                        label="任务状态"
                        width="160"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.STATUS_DESC_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                >
                    <template slot-scope="scope">
                        <div class="operate-groups">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-edit-outline"
                                    @click="_updateCompletedTask(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.editing"
                                    icon="el-icon-success"
                                    @click="_insertCompletedTask(scope.$index, scope.row)">保存
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.editing"
                                    icon="el-icon-warning"
                                    @click="_cancelCompletedTask(scope.$index, scope.row)">取消
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-row><!--分页-->
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='completedDoTaskGrid.paginations.total > 0'
                                :page-sizes="completedDoTaskGrid.paginations.page_sizes"
                                :page-size="completedDoTaskGrid.paginations.page_size"
                                :layout="completedDoTaskGrid.paginations.layout"
                                :total="completedDoTaskGrid.paginations.total"
                                :current-page='completedDoTaskGrid.paginations.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	//import {axios} from 'utils/'
	import axios from 'axios';

	export default {
		data() {
			return {
				multipleSelection: [],//checkbox
				numbers: [],
				toDoTaskLevelCodeMapList: {},
				toDoTaskTypeCodeMapList: {},
				toDoTaskStatusCodeMapList:{},
				toDoTask_Query_Date: {
					PROJECT_NAME_: ''
				},
				CODE_LIST : [],
                //设置按钮是否可用
				BUTTON_STATUS: {
					updateStatusButton: true,//已完成按钮
				},

				completedDoTaskGrid: {
					sortNum: 0,
					tableData: [],
					mainloading: false,
					gridTableStyle: {
						width: '100%',
						height: window.screen.height / 2 + 200
					},
					paginations: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
					tempIndex: '',
					tempDate: {
						PROJECT_ID_: "",
						PROJECT_NAME_: '',
						MODULE_ID_: "",
						MODULE_NAME_: '',
					}
				},

			}
		},
		created() {
			this.doSyncMethod();
		},
		methods: {
			async doSyncMethod() {
				await this._selectCode();
				this.getList();
			},
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {

				this.completedDoTaskGrid.mainloading = true;/*启动加载限制*/
                /*获取登录人ID*/
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId
				/*分页*/
				var query = this.$route.query;
				this.completedDoTaskGrid.paginations.page_index = page || parseInt(query.page) || 1;
				this.completedDoTaskGrid.paginations.page_size = page_size || parseInt(query.page_size) || this.completedDoTaskGrid.paginations.page_size;
				var data = {
					pageIndex: this.completedDoTaskGrid.paginations.page_index,
					pageSize: this.completedDoTaskGrid.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectToDoTaskPerson.do',
					data: {
						TASK_PERSON_STATUS_: 9,
						EMP_ID_: EMP_ID_,
						PROJECT_NAME_: this.toDoTask_Query_Date.PROJECT_NAME_,
						limit: this.completedDoTaskGrid.paginations.page_size,
						page: this.completedDoTaskGrid.paginations.page_index
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
						that.completedDoTaskGrid.paginations.total = res.data.total;
						that.completedDoTaskGrid.tableData = [];
						let modulePersonList = res.data.modulePersonList;
						for (let i = 0; i < modulePersonList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								TASK_PERSON_ID_: modulePersonList[i].TASK_PERSON_ID_,
								MODULE_ID_: modulePersonList[i].MODULE_ID_,
								EMP_ID_: modulePersonList[i].EMP_ID_,
								PROJECT_NAME_: modulePersonList[i].PROJECT_NAME_,
								TASK_NAME_: modulePersonList[i].TASK_NAME_,
								TASK_LEVEL_: modulePersonList[i].TASK_LEVEL_,
								MODULE_NAME_: modulePersonList[i].MODULE_NAME_,
								START_DATE_: dtime(modulePersonList[i].START_DATE_).format('YYYY-MM-DD '),
								FINISH_DATE_: modulePersonList[i].FINISH_DATE_,
								WORKING_HOURS_: modulePersonList[i].WORKING_HOURS_,
								ACTUAL_WORKING_HOURS_: modulePersonList[i].ACTUAL_WORKING_HOURS_,
								TASK_PERSON_STATUS_: modulePersonList[i].TASK_PERSON_STATUS_,
								_task_level : that.toDoTaskLevelCodeMapList[modulePersonList[i].TASK_LEVEL_],
								STATUS_DESC_ : that.toDoTaskTypeCodeMapList[modulePersonList[i].TASK_PERSON_STATUS_],
							}
							that.completedDoTaskGrid.tableData.push(tableItem);
						}
						that.completedDoTaskGrid.mainloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.completedDoTaskGrid.mainloading = false;
				})
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.completedDoTaskGrid.paginations.page_size * (page - 1);
				this.getList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			//筛选
			selectToDoTask() {
				this.getList();
			},
            //查询类型
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
								that.toDoTaskLevelCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'REQ_STATUS'){
								that.toDoTaskTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'TASK_PERSON_TYPE'){
								that.toDoTaskStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
				});
			},
            //点击编辑按钮
			_updateCompletedTask(index, row){
				this.$set(this.completedDoTaskGrid.tableData[index], 'editing', true);
            },
            //点击保存按钮
			_insertCompletedTask(index, row){
				let that = this;
				if(row.FINISH_DATE_ == "" ){
					this.$message.warning("请填写实际完成时间");
					return;
				}
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateToDoTaskPersonStatus.do',
					data: {
						TASK_PERSON_ID_LIST: row.TASK_PERSON_ID_,
						FINISH_DATE_: mutils.formatDate(new Date(row.FINISH_DATE_)),
						ACTUAL_WORKING_HOURS_: row.ACTUAL_WORKING_HOURS_

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
						let task = res.data.task;
						that.$set(that.completedDoTaskGrid.tableData[index], 'FINISH_DATE_', task.FINISH_DATE_);
						that.$set(that.completedDoTaskGrid.tableData[index], 'ACTUAL_WORKING_HOURS_', task.ACTUAL_WORKING_HOURS_);
						that.$set(that.completedDoTaskGrid.tableData[index], 'editing', false);
						that.$message.success("修改成功");
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作失败请重试')
				})
            },
            //点击取消按钮
			_cancelCompletedTask(index, row){
				this.$set(this.completedDoTaskGrid.tableData[index], 'editing', false);
            }
		}
	}
</script>

<style lang="less" scoped>
    .btnRight {
        float: right;
        margin-right: 0px !important;
    }

    .search-form {
        width: 100%;
        min-width: 750px;
        .el-form-item {
            margin-bottom: 10px !important;
            .el-date-editor {
                width: 200px;
                .el-input__inner {
                    height: 36px !important;
                }
            }
        }
    }

    .el-dialog--small {
        width: 600px !important;
    }

    .pagination {
        text-align: left;
        margin-top: 10px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

</style>


