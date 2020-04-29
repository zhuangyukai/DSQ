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
                    <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click='updateStatus()' :disabled="BUTTON_STATUS.updateStatusButton"
                    >已完成</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="mainloading"
                    highlight-current-row
                    :data="tableData"
                    align='center'
                    :style="gridTableStyle"
                    :height="gridTableStyle.height"
                    ref="toDoTasksGrid"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow">
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column
                        prop="EMP_NAME_"
                        label="人员名称"
                        align='center'
                        width="160"
                        sortable
                >
                </el-table-column>
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
                        width="150"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="TASK_NAME_"
                        label="任务名称"
                        align='center'
                        width="150"
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
                        prop="TASK_PERSON_TYPE_"
                        label="人员类型"
                        align='center'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row._async_label }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="START_DATE_"
                        label="开始时间"
                        align='center'
                        width="200"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="END_DATE_"
                        label="结束时间"
                        align='center'
                        width="200"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.END_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WORKING_HOURS_"
                        label="预计工时"
                        width="150"
                        sortable>
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
            </el-table>
            <el-row><!--分页-->
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='paginations.total > 0'
                                :page-sizes="paginations.page_sizes"
                                :page-size="paginations.page_size"
                                :layout="paginations.layout"
                                :total="paginations.total"
                                :current-page='paginations.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>

            <!--实际完成时间-->
            <el-dialog
                    :title="finishTaskDialog.title"
                    :visible.sync="finishTaskDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="finishTaskDialog.style"
                    :width="finishTaskDialog.width"
                    @close="closeFinishTaskDialog"
            >
                <template>
                    <finishTaskCom ref="finish_task_ref" v-if="finishTaskDialog.dialogVisible"
                                   @finishTaskListeners="_completeFinishTask"></finishTaskCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	//import {axios} from 'utils/'
	import axios from 'axios';
	import finishTaskCom from "../personCenter/finishTask.vue"

	export default {
		components: {finishTaskCom},
		data() {
			return {
				multipleSelection: [],//checkbox
				numbers: [],
				tableData: [],
				toDoTaskLevelCodeMapList: {},
				toDoTaskTypeCodeMapList: {},
				toDoTaskStatusCodeMapList:{},
				toDoTask_Query_Date: {
					PROJECT_NAME_: ''
				},
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				mainloading: false,
				//tableHeight: '',
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				CODE_LIST : [],
                //设置按钮是否可用
				BUTTON_STATUS: {
					updateStatusButton: true,//已完成按钮
				},
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				//已完成的弹窗
				finishTaskDialog:{
					show: false,
					title: '完成日期',
					finishTaskDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '400px'
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

				this.mainloading = true;/*启动加载限制*/
				this.multipleSelection = [];
				//  this.BUTTON_STATUS.updateStatusButton = true;//设置已完成按钮不可用
                /*获取登录人ID*/
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId
				/*分页*/
				var query = this.$route.query;
				this.paginations.page_index = page || parseInt(query.page) || 1;
				this.paginations.page_size = page_size || parseInt(query.page_size) || this.paginations.page_size;
				var data = {
					pageIndex: this.paginations.page_index,
					pageSize: this.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectToDoTaskPerson.do',
					data: {
						TASK_PERSON_STATUS_: 2,
						EMP_ID_: EMP_ID_,
						PROJECT_NAME_: this.toDoTask_Query_Date.PROJECT_NAME_,
						limit: this.paginations.page_size,
						page: this.paginations.page_index
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
						that.paginations.total = res.data.total;
						that.tableData = [];
						let modulePersonList = res.data.modulePersonList;
						for (let i = 0; i < modulePersonList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								TASK_PERSON_ID_: modulePersonList[i].TASK_PERSON_ID_,
								MODULE_ID_: modulePersonList[i].MODULE_ID_,
								EMP_ID_: modulePersonList[i].EMP_ID_,
								EMP_NAME_: modulePersonList[i].EMP_NAME_,
								PROJECT_NAME_: modulePersonList[i].PROJECT_NAME_,
								TASK_NAME_: modulePersonList[i].TASK_NAME_,
								TASK_LEVEL_: modulePersonList[i].TASK_LEVEL_,
								MODULE_NAME_: modulePersonList[i].MODULE_NAME_,
								TASK_PERSON_TYPE_: modulePersonList[i].TASK_PERSON_TYPE_,
								START_DATE_: dtime(modulePersonList[i].START_DATE_).format('YYYY-MM-DD '),
								END_DATE_: dtime(modulePersonList[i].END_DATE_).format('YYYY-MM-DD '),
								WORKING_HOURS_: modulePersonList[i].WORKING_HOURS_,
								TASK_PERSON_STATUS_: modulePersonList[i].TASK_PERSON_STATUS_,
								_task_level : that.toDoTaskLevelCodeMapList[modulePersonList[i].TASK_LEVEL_],
								STATUS_DESC_ : that.toDoTaskTypeCodeMapList[modulePersonList[i].TASK_PERSON_STATUS_],
								_async_label: that.toDoTaskStatusCodeMapList[modulePersonList[i].TASK_PERSON_TYPE_]
							}
							that.tableData.push(tableItem);
						}
						that.mainloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.mainloading = false;
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
				this.sortnum = this.paginations.page_size * (page - 1);
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
			handleSelection(selection, row) {
				// 表单绑定的数据
				this.tableData.forEach((item, i) => {
					if (item.TASK_PERSON_ID_ == row.TASK_PERSON_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
						}
					}
				});

			},
			handleSelectionAll(selection) {
				this.multipleSelection = selection;
				this.numbers = [];
				if (this.multipleSelection.length != 0) {
					for (let i = 0; i < this.tableData.length; i++) {
						this.numbers.push(i);
					}
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this._setButtonStatus();//调用改变安装状态的方法
			},
			clickRow(row) {
				this.$refs.toDoTasksGrid.toggleRowSelection(row, true);

				this.tableData.forEach((r, i) => {
					if (r.TASK_PERSON_ID_ == row.TASK_PERSON_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.toDoTasksGrid.toggleRowSelection(row, false);
						}
					}
				});
			},
            //点击已完成按钮
			updateStatus(){
				let that = this;
				this.finishTaskDialog.show = true;
				this.finishTaskDialog.dialogVisible = true;
				this.$nextTick(_ => {
					for(let i = 0; i<this.multipleSelection.length; i++){
						this.$refs.finish_task_ref.TASK_PERSON_ID_LIST.push(that.multipleSelection[i].TASK_PERSON_ID_);
					}
					this.$refs.finish_task_ref.setFinishTask();
				})
            },
            //保存之后的操作
			_completeFinishTask(){
				this.finishTaskDialog.show = false;
				this.getList();
            },
            //关闭监听
			closeFinishTaskDialog(){
				this.finishTaskDialog.dialogVisible = false;
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
            //按钮状态
            _setButtonStatus() {
				if(this.multipleSelection.length >0){
					this.BUTTON_STATUS.updateStatusButton = false;
                }else{
					this.BUTTON_STATUS.updateStatusButton = true;
                }
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


