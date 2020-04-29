<template>
    <div class="fillcontain">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="search_container">
                    <el-form
                            :inline="true"
                            :model='viewOrgForm'
                            ref="viewOrgForm"
                            class="demo-form-inline search-form"
                    >
                        <el-form-item>
                            人员姓名:
                            <el-input v-model="viewOrgForm.EMP_NAME_" style="width: 200px" placeholder="请输入人员姓名"
                                      clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button circle type="success" size="medium" icon="el-icon-search"
                                       @click='_selectEmpByButton()'>
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);">
                    <el-col :span="12">
                        <el-tree
                                v-loading="mainloading"
                                :data="orgList"
                                :expand-on-click-node="false"
                                default-expand-all
                                ref="tree"
                                highlight-current
                                :props="defaultOrgProps"
                                @node-click="_orgOnClick">
                        </el-tree>
                    </el-col>

                    <el-col :span="12" style="height: 730px">
                        <el-table
                                highlight-current-row
                                v-loading="empLoading"
                                :data="empList"
                                :style="empTableStyle"
                                :height="empTableStyle.height"
                                align='center'
                                ref="empGridRef"
                                :max-height="tableHeight"
                                @select="handleSelection"
                                @select-all="handleSelectionAll"
                                @selection-change="handleSelectionChange"
                                @row-click="clickRow"
                        >
                            <el-table-column type="selection" width="40">
                            </el-table-column>
                            <el-table-column
                                    v-if="idFlag"
                                    prop="EMP_ID_"
                                    label="人员ID"
                                    align='center'
                                    width="220">
                            </el-table-column>
                            <el-table-column
                                    prop="EMP_NAME_"
                                    label="人员名称"
                                    align='left'
                                    width="100"
                                    sortable>
                            </el-table-column>
                        </el-table>
                    </el-col>


                </div>
            </el-col>

            <el-col :span="18">
                <div class="search_container">
                    <el-form
                            :inline="true"
                            :model='viewTaskForm'
                            ref="viewTaskForm"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-date-picker
                                    v-model="viewTaskForm.FROM_TASK_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <span>-</span>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                    v-model="viewTaskForm.TO_TASK_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item style="display: none">
                            <el-input
                                    clearable
                                    v-model="viewTaskForm.PROJECT_ID_"
                                    style="width: 200px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            项目名称
                            <el-input
                                    clearable
                                    v-model="viewTaskForm.PROJECT_NAME_"
                                    @focus="_preChooseProject()"
                                    placeholder="请填写项目" style="width: 200px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            任务类别
                            <el-select v-model="viewTaskForm.TASK_TYPE_" placeholder="请选择汇报情况">
                                <el-option
                                        v-for="item in taskTypeList"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                            </el-select>

                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_selectViewTask()'>筛选
                            </el-button>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="table_container"
                     style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
                    <el-table
                            :data="taskGrid.taskList"
                            style="width: 100%"
                            align='center'
                            :height="taskGrid.style.height"
                            v-loading="taskGrid.mainLoading">
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
                        </el-table-column>
                        <el-table-column
                                v-if="column.isEndDateFlag"
                                prop="END_DATE_"
                                label="结束时间"
                                align='center'
                                width="200"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                v-if="column.isFinishDateFlag"
                                prop="FINISH_DATE_"
                                label="实际完成时间"
                                align='center'
                                width="220"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="WORKING_HOURS_"
                                label="预计工时"
                                width="150"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                v-if="column.isActualWorkingHoursFlag"
                                prop="ACTUAL_WORKING_HOURS_"
                                label="实际工时"
                                width="160"
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
                    <el-row>
                        <el-col :span="24">
                            <div class="pagination" style="height: 40px">
                                <el-pagination
                                        v-if='taskGrid.paginations.total > 0'
                                        :page-sizes="taskGrid.paginations.page_sizes"
                                        :page-size="taskGrid.paginations.page_size"
                                        :layout="taskGrid.paginations.layout"
                                        :total="taskGrid.paginations.total"
                                        :current-page='taskGrid.paginations.page_index'
                                        @current-change='handleCurrentChangeTaskGrid'
                                        @size-change='handleSizeChangeTaskGrid'>
                                </el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>

        <!--选择项目DIALOG-->
        <el-dialog
                :title="preMultiSelectProject.title"
                :visible.sync="preMultiSelectProject.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                @closed="_closedPreMultiSelectProject"
        >
            <template>
                <div>
                    <preMultiSelectProject ref="preMultiSelectProjectRef" v-if="preMultiSelectProject.dialogVisible"
                                           :_closePreMultiSelectProjectDialog="_closePreMultiSelectProjectDialog"
                                           @multiProjectListeners="_completeMultiProject">
                    </preMultiSelectProject>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	import preMultiSelectProject from '../project/preMultiSelectProject.vue';

	export default {
		components: {preMultiSelectProject},
		data() {
			return {
				viewOrgForm: {
					EMP_NAME_: ''
				},
				mainloading: false,
				orgList: [],
				defaultOrgProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
				empLoading: false,
				empList: [],
				empTableStyle: {
					width: '100%',
					height: '770px',
					borderLeft: '3px solid #BBFFFF'
				},
				tableHeight: '',
				idFlag: false,
				viewTaskForm: {
					FROM_TASK_DATE_: '',
					TO_TASK_DATE_: '',
					PROJECT_ID_: '',
					PROJECT_NAME_: '',
					TASK_TYPE_: ''
				},
				numbers: [],
				multipleSelection: [],
				CODE_LIST: [],
				toDoTaskLevelCodeMapList: {},
				toDoTaskTypeCodeMapList: {},
				toDoTaskStatusCodeMapList:{},
				taskTypeList : [{
					value : 2,
					label : '待办任务'
				}, {
					value : 9,
					label : '已办任务'
				} ],
				taskGrid: {
					sortnum: 0,
					style: {
						width: '100%',
						height: window.screen.height / 2 + 190
					},
					mainLoading: false,
					taskList: [],
					paginations: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
				preMultiSelectProject: {
					show: false,
					title: '选择项目',
					width: '480px',
					editEnable: true,
					dialogVisible: true,
					style: {
						height: '500px'
					}
				},
				column: {
					isEndDateFlag: false,
					isFinishDateFlag: false,
					isActualWorkingHoursFlag: false
				},
			}
		},
		created() {
			this.doSyncMethod();
			this.viewTaskForm.TASK_TYPE_  = 2;
		},
		methods: {
			async doSyncMethod() {
				await this._selectOrg();
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
			async _selectOrg() {
				this.mainloading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectOrg.do',
					data: {},
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
						that.orgList = res.data.children;
						that.mainloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.mainloading = false;
				})
			},
			//查询人员
			_selectEmpByButton() {
				this.empLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						EMP_NAME_: this.viewOrgForm.EMP_NAME_
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
						that.empList = res.data.empList;
						that.empLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			//点击部门树
			_orgOnClick(data) {
				let that = this;
				that.empLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpNew.do',
					data: {
						ORG_ID_: data.ORG_ID_
					},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret;
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					if (res.data.success) {
						that.empList = res.data.empList;
						that.empLoading = false;
						that.$refs.empGridRef.toggleAllSelection();
						that.handleSelectionAll(that.empList);
						that._selectViewTask();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},

			handleSelection(selection, row) {
				// 表单绑定的数据
				this.empList.forEach((item, i) => {
					if (item.EMP_ID_ == row.EMP_ID_) {
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
					for (let i = 0; i < this.empList.length; i++) {
						this.numbers.push(i);
					}
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this._selectViewTask();
			},
			clickRow(row) {
				this.$refs.empGridRef.toggleRowSelection(row, true);

				this.empList.forEach((r, i) => {
					if (r.EMP_ID_ == row.EMP_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.empGridRef.toggleRowSelection(row, false);
						}
					}
				});
			},

			_selectViewTask({
								page,
								page_size,
								where,
								fun
							} = {}){
				this.taskGrid.mainLoading = true;
				var query = this.$route.query;
				this.taskGrid.paginations.page_index = page || parseInt(query.page) || 1;
				this.taskGrid.paginations.page_size = page_size || parseInt(query.page_size) || this.taskGrid.paginations.page_size;
				var data = {
					pageIndex: this.taskGrid.paginations.page_index,
					pageSize: this.taskGrid.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}
				let that = this;
				let PROJECT_ID_LIST = [];
				let EMP_ID_LIST = [];
				let TASK_TYPE_;
				let TO_TASK_DATE_;
				let FROM_TASK_DATE_;
				if (mutils.isEmpty(this.viewTaskForm.FROM_TASK_DATE_)) {
					FROM_TASK_DATE_ = "";
				} else {
					FROM_TASK_DATE_ = mutils.formatDate(new Date(this.viewTaskForm.FROM_TASK_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(this.viewTaskForm.TO_TASK_DATE_)) {
					TO_TASK_DATE_ = "";
				} else {
					TO_TASK_DATE_ = mutils.formatDate(new Date(this.viewTaskForm.TO_TASK_DATE_)); // 毫秒数，时间戳
				}
				if (this.viewTaskForm.PROJECT_ID_ == "" || this.viewTaskForm.PROJECT_ID_ == null || this.viewTaskForm.PROJECT_ID_ == undefined) {
					PROJECT_ID_LIST = [];
				} else {
					PROJECT_ID_LIST = this.viewTaskForm.PROJECT_ID_;
				}
				if (this.viewTaskForm.PROJECT_NAME_ == "" || this.viewTaskForm.PROJECT_NAME_ == null || this.viewTaskForm.PROJECT_NAME_ == undefined) {
					PROJECT_ID_LIST = [];
				}
				/*if(that.multipleSelection.length != 0){

                }else{
					EMP_ID_LIST = ['.'];
                }*/
				for (let j = 0; j < that.multipleSelection.length; j++) {
					EMP_ID_LIST.push(that.multipleSelection[j].EMP_ID_)
				}
				if (this.viewTaskForm.TASK_TYPE_ == "" || this.viewTaskForm.TASK_TYPE_ == null || this.viewTaskForm.TASK_TYPE_ == undefined) {
					TASK_TYPE_ = '';
				} else {
					TASK_TYPE_ = this.viewTaskForm.TASK_TYPE_;
				}
				this._setColumn(TASK_TYPE_);
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectViewTask.do',
					data: {
						EMP_ID_LIST: EMP_ID_LIST,
						PROJECT_ID_LIST: PROJECT_ID_LIST,
						TASK_PERSON_STATUS_: TASK_TYPE_,
						FROM_TASK_DATE_: FROM_TASK_DATE_,
						TO_TASK_DATE_: TO_TASK_DATE_,
						limit: this.taskGrid.paginations.page_size,
						page: this.taskGrid.paginations.page_index
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
						that.taskGrid.paginations.total = res.data.total;
						that.taskGrid.taskList = [];

						let taskList = res.data.modulePersonList;

						for (let i = 0; i < taskList.length; i++) {
							const tableItem = {
								sortnum: that.taskGrid.sortnum + (i + 1),
								TASK_PERSON_ID_: taskList[i].TASK_PERSON_ID_,
								MODULE_ID_: taskList[i].MODULE_ID_,
								EMP_ID_: taskList[i].EMP_ID_,
								EMP_NAME_: taskList[i].EMP_NAME_,
								PROJECT_NAME_: taskList[i].PROJECT_NAME_,
								TASK_NAME_: taskList[i].TASK_NAME_,
								TASK_LEVEL_: taskList[i].TASK_LEVEL_,
								MODULE_NAME_: taskList[i].MODULE_NAME_,
								TASK_PERSON_TYPE_: taskList[i].TASK_PERSON_TYPE_,
								START_DATE_: dtime(taskList[i].START_DATE_).format('YYYY-MM-DD '),
								END_DATE_: dtime(taskList[i].END_DATE_).format('YYYY-MM-DD '),
								FINISH_DATE_: taskList[i].FINISH_DATE_,
								WORKING_HOURS_: taskList[i].WORKING_HOURS_,
								ACTUAL_WORKING_HOURS_: taskList[i].ACTUAL_WORKING_HOURS_,
								TASK_PERSON_STATUS_: taskList[i].TASK_PERSON_STATUS_,
								_task_level : that.toDoTaskLevelCodeMapList[taskList[i].TASK_LEVEL_],
								STATUS_DESC_ : that.toDoTaskTypeCodeMapList[taskList[i].TASK_PERSON_STATUS_],
								_async_label: that.toDoTaskStatusCodeMapList[taskList[i].TASK_PERSON_TYPE_]
							};
							that.taskGrid.taskList.push(tableItem);
						}
						that.taskGrid.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('操作失败请重试')
					that.taskGrid.mainLoading = false;
				})

            },
            _setColumn(value){
				if(value == '2'){
					this.column.isEndDateFlag = true;
					this.column.isFinishDateFlag = false;
					this.column.isActualWorkingHoursFlag = false;
                }else{
					this.column.isEndDateFlag = false;
					this.column.isFinishDateFlag = true;
					this.column.isActualWorkingHoursFlag = true;
                }
            },
			// 日报数据每页多少条切换
			handleSizeChangeTaskGrid(page_size) {
				this._selectViewTask({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 日报数据上下分页
			handleCurrentChangeTaskGrid(page) {
				this.taskGrid.sortnum = this.taskGrid.paginations.page_size * (page - 1);
				this._selectViewTask();({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			setPath(field, value) {
				var path = this.$route.path,
					query = Object.assign({}, this.$route.query);
				if (typeof field === 'object') {
					query = field;
				} else {
					query[field] = value;
				}
				this.$router.push({
					path,
					query
				});
			},
			//点击项目名称
			_preChooseProject() {
				this.preMultiSelectProject.show = true;
				this.preMultiSelectProject.dialogVisible = true;
			},
			_closedPreMultiSelectProject() {
				this.preMultiSelectProject.dialogVisible = false;
			},
			_closePreMultiSelectProjectDialog() {
				this.preMultiSelectProject.show = false;
			},
			_completeMultiProject(returnValue) {
				this._closePreMultiSelectProjectDialog();
				let that = this;
				for (let i = 0; i < returnValue.length; i++) {
					if (i == 0) {
						that.viewTaskForm.PROJECT_NAME_ += returnValue[i].PROJECT_NAME_;
						that.viewTaskForm.PROJECT_ID_ = returnValue[i].PROJECT_ID_;
					} else {
						that.viewTaskForm.PROJECT_NAME_ += ',' + returnValue[i].PROJECT_NAME_;
						that.viewTaskForm.PROJECT_ID_ += ',' + returnValue[i].PROJECT_ID_;
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>
