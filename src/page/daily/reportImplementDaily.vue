<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='implementDailyQueryForm'
                    ref="implementDailyQueryForm"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="implementDailyQueryForm.DAILY_DATE_"
                            @change="selectDaily()"
                            type="date"
                            placeholder="填报日期">
                    </el-date-picker>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='_preInsertDaily()'>新增
                    </el-button>
                    <el-button type="primary" size="mini" @click='_preImportDaily()'>导入任务
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    class="template-list"
                    :data="implementDailyGrid.implementDailyList"
                    v-loading="implementDailyGrid.implementDailyGridLoading"
                    :style="implementDailyGrid.gridTableStyle"
                    :height="implementDailyGrid.gridTableStyle.height">
                <el-table-column
                        v-if="idFlag"
                        prop="DAILY_ID_"
                        label="日报ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="PROJECT_ID_"
                        label="项目ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="350">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.PROJECT_NAME_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.PROJECT_NAME_" readonly
                                      @focus="_preChooseProject(scope.$index, scope.row)"
                                      placeholder="请选择项目"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="完成内容"
                        align='center'
                        min-width="250">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.FINISHED_WORK_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.FINISHED_WORK_"
                                      placeholder="请录入完成工作内容"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="未完成内容"
                        min-width="200">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.UNFINISHED_WORK_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.UNFINISHED_WORK_"
                                      placeholder="请录入未完成工作内容"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="问题反馈"
                        align='center'
                        min-width="250">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.MEMO_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.MEMO_"
                                      placeholder="请录入问题反馈"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="工时"
                        width="150">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.WORKING_HOURS_ }}</span>
                        </div>
                        <div v-else>
                            <el-input-number v-model="scope.row.WORKING_HOURS_" :precision="1"
                                             :step="1"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="DAILY_DATE_"
                        label="填报日期"
                        align='center'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="230px"
                >
                    <template slot-scope="scope">
                        <div class="operate-groups">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-edit-outline"
                                    @click="_preUpdateDaily(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.editing"
                                    icon="el-icon-success"
                                    @click="_insertDaily(scope.$index, scope.row)">保存
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-delete"
                                    @click="_deleteDaily(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.editing"
                                    icon="el-icon-warning"
                                    @click="_cancelDaily(scope.$index, scope.row)">取消
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='implementDailyGrid.pagination.total > 0'
                                :page-sizes="implementDailyGrid.pagination.page_sizes"
                                :page-size="implementDailyGrid.pagination.page_size"
                                :layout="implementDailyGrid.pagination.layout"
                                :total="implementDailyGrid.pagination.total"
                                :current-page='implementDailyGrid.pagination.page_index'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>

        <el-dialog
                :title="preChooseProject.title"
                :visible.sync="preChooseProject.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                @closed="_closedPreChooseProject"
        >
            <template>
                <div>
                    <preChooseProject ref="preChooseProjectRef" v-if="preChooseProject.dialogVisible"
                                      :_closePreChooseProjectDialog="_closePreChooseProjectDialog"
                                      @listeners="_completeChooseProject">
                    </preChooseProject>
                </div>
            </template>
        </el-dialog>

    </div>
</template>

<script>
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	import preChooseProject from '../project/preChooseProject.vue';
	export default {
		components: {preChooseProject},
		name: "reportImplementDaily",
        data(){
		    return{
				idFlag: false,
				implementDailyQueryForm: {
					DAILY_DATE_: new Date()
				},
				implementDailyGrid: {
					sortNum: 0,
					implementDailyList: [],
					implementDailyGridLoading: false,
					gridTableStyle: {
						width: '100%',
						height: window.screen.height / 2 + 200
					},
					pagination: {
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
						FINISHED_WORK_: '',
						UNFINISHED_WORK_: '',
						WORKING_HOURS_: '',
                        MEMO_: ''
					}
				},
				preChooseProject: {
					show: false,
					title: '选择项目',
					width: '480px',
					editEnable: true,
					dialogVisible: true,
					style: {
						height: '500px'
					}
				},
				CODE_LIST: [],
				implementWorkList: [],
				implementWorkTypeList: []
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this._selectCode();
				this.getDailyList();
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
							if(that.CODE_LIST[i].CATEGORY_ == 'IMPLEMENT_WORK'){
								that.implementWorkList.push(that.CODE_LIST[i]);
								that.implementWorkTypeList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
            //点击查询按钮
			selectDaily(){
				this.getDailyList();
			},
            //查询方法
			getDailyList(){
				this.implementDailyGrid.implementDailyGridLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectDaily.do',
					data: {
						DAILY_DATE_ : mutils.formatDate(new Date(that.implementDailyQueryForm.DAILY_DATE_)),
						DRAFTOR_ID_ : mutils.getStore('userinfo').empId,
						DAILY_TYPE_: 'ss'
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
						that.implementDailyGrid.implementDailyList = [];
						let dailyList = res.data.dailyList;

						for (let i = 0; i < dailyList.length; i++) {
							const tableItem = {
								DAILY_ID_: dailyList[i].DAILY_ID_,
								PROJECT_ID_: dailyList[i].PROJECT_ID_,
								PROJECT_NAME_: dailyList[i].PROJECT_NAME_,
								FINISHED_WORK_: dailyList[i].FINISHED_WORK_,
								UNFINISHED_WORK_: dailyList[i].UNFINISHED_WORK_,
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								DAILY_DATE_: dailyList[i].DAILY_DATE_,
                                MEMO_: dailyList[i].MEMO_,
							}
							that.implementDailyGrid.implementDailyList.push(tableItem);
						}

						that.implementDailyGrid.implementDailyGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
				})
			},
            //点击新增按钮
			_preInsertDaily(){
				if(this.implementDailyQueryForm.DAILY_DATE_ == null || this.implementDailyQueryForm.DAILY_DATE_ == "" || this.implementDailyQueryForm.DAILY_DATE_ == undefined){
					this.$message.warning('请填报日期');
					return;
				}
				var project_name_;
				var project_id_;
				var implement_work_;
				this.implementDailyGrid.implementDailyList.length == 0 ? project_name_=  '': project_name_=  this.implementDailyGrid.implementDailyList[this.implementDailyGrid.implementDailyList.length-1].PROJECT_NAME_;
				this.implementDailyGrid.implementDailyList.length == 0 ? project_id_=  '': project_id_=  this.implementDailyGrid.implementDailyList[this.implementDailyGrid.implementDailyList.length-1].PROJECT_ID_;
				this.implementDailyGrid.implementDailyList.push({
					DAILY_ID_: "",
					PROJECT_ID_: project_id_,
					PROJECT_NAME_: project_name_,
					FINISHED_WORK_: "",
					UNFINISHED_WORK_: "",
					MEMO_: "",
					WORKING_HOURS_: "",
					DAILY_DATE_: /\d{4}-\d{1,2}-\d{1,2}/g.exec(mutils.formatDate(new Date(this.implementDailyQueryForm.DAILY_DATE_))),
					editing: true
				});
            },
            //点击项目名称，选择项目
			_preChooseProject(index, row) {
				this.preChooseProject.show = true;
				this.preChooseProject.dialogVisible = true;
				this.implementDailyGrid.tempIndex = index;
			},
			_closedPreChooseProject() {
				this.preChooseProject.dialogVisible = false;
			},
			_closePreChooseProjectDialog() {
				this.preChooseProject.show = false;
			},
			_completeChooseProject(returnValue) {
				this._closePreChooseProjectDialog();
				this.implementDailyGrid.implementDailyList[this.implementDailyGrid.tempIndex].PROJECT_ID_ = returnValue.PROJECT_ID_;
				this.implementDailyGrid.implementDailyList[this.implementDailyGrid.tempIndex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
			},
            //点击编辑
			_preUpdateDaily(index, row){
				this.$set(this.implementDailyGrid.implementDailyList[index], 'editing', true);
				this.implementDailyGrid.tempDate.PROJECT_ID_ = row.PROJECT_ID_;
				this.implementDailyGrid.tempDate.PROJECT_NAME_ = row.PROJECT_NAME_;
                this.implementDailyGrid.tempDate.FINISHED_WORK_ = row.FINISHED_WORK_;
				this.implementDailyGrid.tempDate.UNFINISHED_WORK_ = row.UNFINISHED_WORK_;
				this.implementDailyGrid.tempDate.WORKING_HOURS_ = row.WORKING_HOURS_;
				this.implementDailyGrid.tempDate.MEMO_ = row.MEMO_;
            },
            //点击保存
			_insertDaily(index, row){
				if (row.PROJECT_ID_ == '') {
					this.$message.warning('项目不能为空');
					return;
				}
				if(row.DAILY_ID_ == ''|| row.DAILY_ID_ == null){
					let that = this;
					that.implementDailyGrid.implementDailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertDaily.do',
						data: {
							PROJECT_ID_: row.PROJECT_ID_,
							FINISHED_WORK_: row.FINISHED_WORK_,
							UNFINISHED_WORK_: row.UNFINISHED_WORK_,
							MEMO_: row.MEMO_,
							WORKING_HOURS_: row.WORKING_HOURS_,
							DAILY_DATE_: mutils.formatDate(new Date(this.implementDailyQueryForm.DAILY_DATE_)),
							DAILY_TYPE_: 'ss'
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
							let daily = res.data.daily;
							for (let key in daily) {//装载被修改数据到页面
								that.$set(that.implementDailyGrid.implementDailyList[index], key, daily[key]);
							}
							that.$set(that.implementDailyGrid.implementDailyList[index], 'editing', false);
							that.implementDailyGrid.implementDailyGridLoading = false;
							that.$message.success("添加成功");
						} else {
							that.$message.error(res.data.message);
							that.implementDailyGrid.implementDailyGridLoading = false;
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
						that.implementDailyGrid.implementDailyGridLoading = false;
					})
                }else{
					let that = this;
					that.implementDailyGrid.implementDailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'updateDaily.do',
						data: {
							DAILY_ID_: row.DAILY_ID_,
							PROJECT_ID_: row.PROJECT_ID_,
							FINISHED_WORK_: row.FINISHED_WORK_,
							UNFINISHED_WORK_: row.UNFINISHED_WORK_,
							MEMO_: row.MEMO_,
							WORKING_HOURS_: row.WORKING_HOURS_
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
							let daily = res.data.daily;
							for (let key in daily) {//装载被修改数据到页面
								that.$set(that.implementDailyGrid.implementDailyList[index], key, daily[key]);
							}
							that.$set(that.implementDailyGrid.implementDailyList[index], 'editing', false);
							that.implementDailyGrid.implementDailyGridLoading = false;
							that.$message.success("修改成功");
						} else {
							that.$message.error(res.data.message);
							that.implementDailyGrid.implementDailyGridLoading = false;
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试');
						that.implementDailyGrid.implementDailyGridLoading = false;
					})
                }
            },
            //点击删除
			_deleteDaily(index, row){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					that.implementDailyGrid.implementDailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDaily.do',
						data: {
							DAILY_ID_: row.DAILY_ID_
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
							that.$message.success('删除成功');
							that.implementDailyGrid.implementDailyList.splice(index, 1);
							that.implementDailyGrid.implementDailyGridLoading = false;
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.implementDailyGrid.implementDailyGridLoading = false;
					})
				});
            },
            //点击取消
			_cancelDaily(index, row){
				this.$set(this.implementDailyGrid.implementDailyList[index], 'editing', false);
				if (row.DAILY_ID_ == '') {
					this.implementDailyGrid.implementDailyList.splice(index, 1);
				} else {
					this.implementDailyGrid.implementDailyList[index].PROJECT_ID_ = this.implementDailyGrid.tempDate.PROJECT_ID_;
					this.implementDailyGrid.implementDailyList[index].PROJECT_NAME_ = this.implementDailyGrid.tempDate.PROJECT_NAME_;
					this.implementDailyGrid.implementDailyList[index].FINISHED_WORK_ = this.implementDailyGrid.tempDate.FINISHED_WORK_;
					this.implementDailyGrid.implementDailyList[index].UNFINISHED_WORK_ = this.implementDailyGrid.tempDate.UNFINISHED_WORK_;
					this.implementDailyGrid.implementDailyList[index].WORKING_HOURS_ = this.implementDailyGrid.tempDate.WORKING_HOURS_;
					this.implementDailyGrid.implementDailyList[index].MEMO_ = this.implementDailyGrid.tempDate.MEMO_;
				}
            },
            //点击导入任务
			_preImportDaily(){
				let that = this;
				that.implementDailyGrid.implementDailyGridLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTaskPerson.do',
					data: {
						EMP_ID_ : mutils.getStore('userinfo').empId,
						TASK_PERSON_STATUS_ : `9`,
						STATUS_ : '9',
						FINISH_DATE_: mutils.formatDate(new Date(that.implementDailyQueryForm.DAILY_DATE_))
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
						let taskPersonList = res.data.taskPersonList;
						for (let i = 0; i < taskPersonList.length; i++) {
							const tableItem = {
								DAILY_ID_: '',
								PROJECT_ID_: taskPersonList[i].PROJECT_ID_,
								PROJECT_NAME_: taskPersonList[i].PROJECT_NAME_,
								FINISHED_WORK_: taskPersonList[i].TASK_NAME_,
								UNFINISHED_WORK_: '',
								WORKING_HOURS_: taskPersonList[i].ACTUAL_WORKING_HOURS_,
								DAILY_DATE_: /\d{4}-\d{1,2}-\d{1,2}/g.exec(mutils.formatDate(new Date(that.implementDailyQueryForm.DAILY_DATE_))),
								editing: true
							}
							that.implementDailyGrid.implementDailyList.push(tableItem);
						}

						that.implementDailyGrid.implementDailyGridLoading = false;
					} else {
						that.$message.error(res.data.message);
						that.implementDailyGrid.implementDailyGridLoading = false;
					}

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员');
					that.implementDailyGrid.implementDailyGridLoading = false;
				})
            }
        }
	}
</script>

<style scoped>

</style>
