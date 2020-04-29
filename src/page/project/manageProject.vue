<template>
    <div v-loading="divLoading">
        <div>
            <el-form
                    :inline="true"
                    :model='project_Query_Date'
                    ref="project_Query_Date"
                    class="demo-form-inline search-form">
                <el-form-item>
                    项目名称:
                    <el-input v-model="project_Query_Date.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称"
                              clearable>
                    </el-input>
                    项目编码:
                    <el-input v-model="project_Query_Date.PROJECT_CODE_" style="width: 200px" placeholder="请输入项目编码"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectProject()'>筛选
                    </el-button>
                    <el-tooltip class="item" effect="dark" content="此功能只对孙翔羽开放" placement="top-start">
                    <el-button type="primary" size="mini" icon="el-icon-plus" :disabled="BUTTON_STATUS._preInsertProject"
                               @click='preInsertProject()'>添加</el-button>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="此功能只对孙翔羽开放" placement="top-start">
                        <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="BUTTON_STATUS.preUpdateProject"
                                   @click='_preUpdateProject()'>编辑
                        </el-button>
                    </el-tooltip>

                    <el-button type="primary" size="mini" icon="search" :disabled="BUTTON_STATUS.manageProjectReq"
                               @click='_manageProjectReq()'>管理需求
                    </el-button>
                    <el-button type="primary" size="mini" icon="search" :disabled="BUTTON_STATUS.manageProjectDesign"
                               @click='_manageProjectDesign()'>设计文档
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.manageProjectPerson"
                               @click='_manageProjectPerson()'>管理人员
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.manageModule"
                               @click='_manageModulePersonAllot()'>模块任务
                    </el-button>
                    <el-button type="success" size="mini" icon="el-icon-check" :disabled="BUTTON_STATUS.completeProject"
                               @click='_completeProject()'>立项
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="BUTTON_STATUS.deleteProject"
                               @click='_deleteProject()'>删除
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.viewProjectGantt"
                               @click='_viewProjectGantt()'>甘特图
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="currentStyleColor">
            <el-table
                    v-loading="projectloading"
                    :data="projectData"
                    :style="gridTableStyle"
                    :height="gridTableStyle.height"
                    align='center'
                    :max-height="tableHeight"
                    ref="projectGridRef"
                    highlight-current-row
                    @current-change="handCurrentChange"
                    @row-click="clickRow"
                    :row-class-name="taskTableRowClassName"
                    :cell-style="getRowStyle"
            >

                <el-table-column
                        v-if="idFlag"
                        prop="PROJECT_ID_"
                        label="项目ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="PROJECT_CODE_"
                        label="项目编码"
                        align='left'
                        width="220"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='left'
                        width="300"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="MANAGER_NAME_"
                        label="项目负责人"
                        align='left'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_TYPE_CODE_"
                        label="项目类型"
                        align='left'
                        width="100"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row._async_label }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="MEMO_"
                        label="备注"
                        align='left'>
                </el-table-column>
                <el-table-column
                        prop="START_DATE_"
                        label="开始时间"
                        align='left'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="END_DATE_"
                        label="结束时间"
                        align='left'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.END_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="HOURS_"
                        label="累计工时"
                        align='left'
                        width="100"
                        sortable>
                    <template slot-scope="scope">
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.HOURS_ }}小时</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="STATUS_DESC_"
                        label="状态"
                        align='left'
                        width="80"
                        sortable>
                    <template slot-scope="scope">
                        <span v-if="scope.row.STATUS_ == '9'" style="color: #67C23A; ">{{ scope.row.STATUS_DESC_ }}</span>
                        <span v-else style="color: #E6A23C;">{{ scope.row.STATUS_DESC_ }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
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

            <!--添加-->
            <el-dialog
                    :title="insertProjectDialog.title"
                    :visible.sync="insertProjectDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="insertProjectDialog.style"
                    :width="insertProjectDialog.width"
                    @close="closeInsertProjectDialog"
            >
                <template>
                    <insertProjectCom ref="insert_project_ref" v-if="insertProjectDialog.dialogVisible"
                                      @insertProjectListeners="_completeInsertProject"></insertProjectCom>
                </template>
            </el-dialog>

            <!--编辑-->
            <el-dialog
                    :title="updateProjectDialog.title"
                    :visible.sync="updateProjectDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="updateProjectDialog.style"
                    :width="updateProjectDialog.width"
                    @close="closeUpdateProjectDialog"
            >
                <template>
                    <updateProjectCom ref="update_project_ref" v-if="updateProjectDialog.dialogVisible"
                                      @updateProjectListeners="_completeUpdateProject"></updateProjectCom>
                </template>
            </el-dialog>

            <!--管理项目需求 DIALOG-->
            <el-dialog
                    :title="projectReq.title"
                    :visible.sync="projectReq.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :width="projectReq.width"
                    @close="closeProjectReg"
            >
                <template>
                    <projectReqCom ref="project_req_ref" v-if="projectReq.dialogVisible"></projectReqCom>
                </template>
            </el-dialog>

            <!--管理项目设计 DIALOG-->
            <el-dialog
                    :title="projectDesign.title"
                    :visible.sync="projectDesign.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :width="projectDesign.width"
                    @close="closeProjectDesign"
            >
                <template>
                    <riderCom ref="project_design_ref" v-if="projectDesign.dialogVisible"></riderCom>
                </template>
            </el-dialog>

            <!--管理人员-->
            <el-dialog
                    :title="manageProjectPersonDialog.title"
                    :visible.sync="manageProjectPersonDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :width="manageProjectPersonDialog.width"
                    @close="closeProjectPersonDialog"
            >
                <template>
                    <projectPersonCom ref="project_person_ref" v-if="manageProjectPersonDialog.dialogVisible"
                                      @projectPersonListeners="_completeUpdateProjectPerson"></projectPersonCom>
                </template>
            </el-dialog>

            <!--管理任务 DIALOG-->
            <el-dialog
                    :title="projectPersonAllot.title"
                    :visible.sync="projectPersonAllot.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    width="1550px"
                    style="margin-left: 200px"
                    @close="closeProjectPersonAllot"
            >
                <div style="width: 1200px;height: 600px">
                    <template>
                        <projectPersonAllotCom ref="project_person_allot_ref" v-if="projectPersonAllot.dialogVisible"></projectPersonAllotCom>
                    </template>
                </div>
            </el-dialog>

            <!--甘特图 DIALOG-->
            <el-dialog
                    :title="projectGanttDialog.title"
                    :visible.sync="projectGanttDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="projectGanttDialog.style"
                    :width="projectGanttDialog.width"
                    @close="closeProjectGanttDialog"
            >
                <template>
                    <projectGanttCom ref="projectGanttRef" v-if="projectGanttDialog.dialogVisible"></projectGanttCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';

	import insertProjectCom from "../project/preInsertProject.vue";
	import updateProjectCom from "../project/preUpdateProject.vue";
	import projectReqCom from '../projectReq/manageProjectReq.vue';
	import riderCom from '../rider/manageRider.vue';
	import projectPersonCom from '../project/manageProjectPerson.vue';
	import projectPersonAllotCom from '../modulePersonAllot/manageModulePersonAllot.vue';
	import projectGanttCom from "../project/viewProjectGantt.vue";

	export default {
		components: {insertProjectCom, updateProjectCom, projectReqCom, riderCom, projectPersonCom, projectPersonAllotCom, projectGanttCom},
		data(){
			return{
				divLoading: false,
				numbers: [],
				//任务TABLE
				taskTable: {
					taskTableLoading: false,
					//taskStatusCodeMapList: [],
					currentRow : null
				},
				multipleSelection: [],
				project_Query_Date: {
				    PROJECT_CODE_: '',
					PROJECT_NAME_: '',
			    },
				projectloading: false,
				projectData: [],
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				tableHeight: '',
				idFlag: false,
				sortnum: 0,
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				CODE_LIST : [],
				projectTypeCodeMapList: {},
				projectStatusCodeMapList:{},
				//新增窗口
				insertProjectDialog: {
					show: false,
					title: '新增项目',
					insertProjectDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//编辑窗口
				updateProjectDialog: {
					show: false,
					title: '编辑项目',
					updateProjectDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
                //需求窗口
				projectReq: {
					show: false,
					title: '管理项目需求',
					projectReqLoading: false,
					dialogVisible: true,
					params: {
						PROJECT_ID_: ''
					}
				},
                //设计窗口
				projectDesign: {
					show: false,
					title: '管理设计文档',
					loading: false,
					dialogVisible: true,
					params: {
						PROJECT_ID_: ''
					}
				},
				//管理人员窗口
				manageProjectPersonDialog: {
					show: false,
					title: '管理人员',
					manageProjectPersonDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '700px'
				},
				projectGanttDialog :{
					style: {
						height: window.screen.height / 2 + 500,
					},
					show: false,
					title: '查询项目进度(甘特图)',
					projectGanttDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '1200px'
                },
                //管理任务窗口
				projectPersonAllot: {
					style: {
						height: window.screen.height / 2 + 500,
					},
					show: false,
					title: '任务人员分配',
					projectPersonAllotLoading: false,
					dialogVisible : true,
					params: {
						PROJECT_ID_ : ''
					}
				},
                //按钮状态
				BUTTON_STATUS: {
					_preInsertProject: true,
					preUpdateProject: true,
					manageProjectReq: true,
					manageProjectDesign: true,
					manageProjectPerson: true,
					manageModule : true,
					deleteProject: true,
					completeProject: true,
					viewProjectGantt : true
				},
				projectPersonList: []
            }
        },
		created() {
			this.projectloading = true;
			this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this._selectCode();
				this.getProjectList();
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
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_TYPE'){
								that.projectTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_STATUS'){
								that.projectStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			getRowStyle(row, column, rowIndex, columnIndex) {
				if(row.column.label == `状态`){
					if(row.row.STATUS_ == `9`){
						return `font-color : #67C23A`
					}else{
						return `font-color : pink`
					}
				}
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
            //筛选按钮
			selectProject(){
				this.getProjectList();
            },
			getProjectList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.taskTable = [];
				this.numbers = [];

				this._setButtonStatus();

				this.projectloading = true;
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
					url: this.baseUrl + 'selectProject.do',
					data: {
						PROJECT_CODE_: this.project_Query_Date.PROJECT_CODE_,
						PROJECT_NAME_: this.project_Query_Date.PROJECT_NAME_,
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
						that.projectData = [];

						let projectList = res.data.projectList;

						for (let i = 0; i < projectList.length; i++) {
							if(projectList[i].PROJECT_TYPE_CODE_.substring(0, 2) == "WB"){
								const tableItem = {
									sortnum: that.sortnum + (i + 1),
									PROJECT_ID_: projectList[i].PROJECT_ID_,
									PROJECT_CODE_: projectList[i].PROJECT_CODE_,
									PROJECT_NAME_: projectList[i].PROJECT_NAME_,
									MANAGER_NAME_: projectList[i].MANAGER_NAME_,
									MANAGER_ID_: projectList[i].MANAGER_ID_,
									PROJECT_TYPE_CODE_: projectList[i].PROJECT_TYPE_CODE_,
									START_DATE_: projectList[i].START_DATE_,
									END_DATE_: projectList[i].END_DATE_,
									DRAFT_DATE_: dtime(projectList[i].DRAFT_DATE_).format('YYYY-MM-DD '),
									HOURS_ : projectList[i].HOURS_,
									MEMO_: projectList[i].MEMO_,
									STATUS_: projectList[i].STATUS_,
									STATUS_DESC_ : that.projectStatusCodeMapList[projectList[i].STATUS_],
									_async_label: "外部-"+ that.projectTypeCodeMapList[projectList[i].PROJECT_TYPE_CODE_],
									statusBoolean : projectList[i].STATUS_ == '9' ? true : false
								};
								that.projectData.push(tableItem);
                            }else{
								const tableItem = {
									sortnum: that.sortnum + (i + 1),
									PROJECT_ID_: projectList[i].PROJECT_ID_,
									PROJECT_CODE_: projectList[i].PROJECT_CODE_,
									PROJECT_NAME_: projectList[i].PROJECT_NAME_,
									MANAGER_NAME_: projectList[i].MANAGER_NAME_,
									MANAGER_ID_: projectList[i].MANAGER_ID_,
									PROJECT_TYPE_CODE_: projectList[i].PROJECT_TYPE_CODE_,
									START_DATE_: projectList[i].START_DATE_,
									END_DATE_: projectList[i].END_DATE_,
									DRAFT_DATE_: dtime(projectList[i].DRAFT_DATE_).format('YYYY-MM-DD '),
									HOURS_ : projectList[i].HOURS_,
									MEMO_: projectList[i].MEMO_,
									STATUS_: projectList[i].STATUS_,
									STATUS_DESC_ : that.projectStatusCodeMapList[projectList[i].STATUS_],
									_async_label: "内部-"+ that.projectTypeCodeMapList[projectList[i].PROJECT_TYPE_CODE_],
									statusBoolean : projectList[i].STATUS_ == '9' ? true : false
								};
								that.projectData.push(tableItem);
                            }


						}
						that.projectloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.projectloading = false;
				})
			},
			handCurrentChange(val) {
				this.taskTable.currentRow = val;
			},

			clickRow(row, column, event) {
				this.selectProjectPerson(row)
			},
			taskTableRowClassName({row, rowIndex}){
				row.index = rowIndex;
			},

			_setButtonStatus(row){
				if(row == undefined){
					if(mutils.getStore('userinfo').username == '孙翔羽'){
						this.BUTTON_STATUS._preInsertProject = false;
						this.BUTTON_STATUS.preUpdateProject = true;
						this.BUTTON_STATUS.manageProjectReq = true;
						this.BUTTON_STATUS.manageProjectDesign = true;
						this.BUTTON_STATUS.manageProjectPerson = true;
						this.BUTTON_STATUS.manageModule = true;
						this.BUTTON_STATUS.deleteProject = true;
						this.BUTTON_STATUS.completeProject = true;
						this.BUTTON_STATUS.viewProjectGantt = true;
					}else{
						this.BUTTON_STATUS._preInsertProject = true;
						this.BUTTON_STATUS.preUpdateProject = true;
						this.BUTTON_STATUS.manageProjectReq = true;
						this.BUTTON_STATUS.manageProjectDesign = true;
						this.BUTTON_STATUS.manageProjectPerson = true;
						this.BUTTON_STATUS.manageModule = true;
						this.BUTTON_STATUS.deleteProject = true;
						this.BUTTON_STATUS.completeProject = true;
						this.BUTTON_STATUS.viewProjectGantt = true;
					}
                }else{
					if(mutils.getStore('userinfo').username == '孙翔羽' ){
						if(row.STATUS_ == '9'){
							this.BUTTON_STATUS._preInsertProject = false; //新增
							this.BUTTON_STATUS.preUpdateProject = false;    //修改
							this.BUTTON_STATUS.completeProject = true;  //立项
							this.BUTTON_STATUS.deleteProject = true; //删除
							this.BUTTON_STATUS.manageProjectReq = false; //管理需求
							this.BUTTON_STATUS.manageProjectDesign = false; //设计文档
							this.BUTTON_STATUS.manageProjectPerson = false; //管理人员
							this.BUTTON_STATUS.manageModule = false; //模块任务
							this.BUTTON_STATUS.viewProjectGantt = false; //甘特图
						}else{
							this.BUTTON_STATUS._preInsertProject = false; //新增
							this.BUTTON_STATUS.preUpdateProject = false; //修改
							this.BUTTON_STATUS.completeProject = false; //立项
							this.BUTTON_STATUS.deleteProject = false; //删除
							this.BUTTON_STATUS.manageProjectReq = false; //管理需求
							this.BUTTON_STATUS.manageProjectDesign = false; //设计文档
							this.BUTTON_STATUS.manageProjectPerson = false;//管理人员
							this.BUTTON_STATUS.manageModule = false; //模块任务
							this.BUTTON_STATUS.viewProjectGantt = false; //甘特图
						}
					}
					else{
						if(mutils.getStore('userinfo').empId == row.MANAGER_ID_){
							this.BUTTON_STATUS.manageProjectReq = false; //管理需求
							this.BUTTON_STATUS.manageProjectDesign = false; //设计文档
							this.BUTTON_STATUS.manageProjectPerson = false; //管理人员
							this.BUTTON_STATUS.manageModule = false; //模块任务
							this.BUTTON_STATUS.viewProjectGantt = false; //甘特图
							this.BUTTON_STATUS._preInsertProject = true; //新增
							this.BUTTON_STATUS.preUpdateProject = true; //修改
							this.BUTTON_STATUS.completeProject = true;  //立项
							this.BUTTON_STATUS.deleteProject = true; //删除
						}else{
                            let that = this;
                            for(let i = 0; i < that.projectPersonList.length; i++){
								if(mutils.getStore('userinfo').empId == that.projectPersonList[i].EMP_ID_){
									that.BUTTON_STATUS.manageProjectReq = false; //管理需求
									that.BUTTON_STATUS.manageProjectDesign = false; //设计文档
									that.BUTTON_STATUS.manageProjectPerson = true; //管理人员
									that.BUTTON_STATUS.manageModule = false; //模块任务
									that.BUTTON_STATUS.viewProjectGantt = false;  //甘特图
									that.BUTTON_STATUS._preInsertProject = true; //新增
									that.BUTTON_STATUS.preUpdateProject = true; //修改
									that.BUTTON_STATUS.completeProject = true; //立项
									that.BUTTON_STATUS.deleteProject = true; //删除
									return;
								}else{
									that.BUTTON_STATUS.manageProjectReq = true; //管理需求
									that.BUTTON_STATUS.manageProjectDesign = true; //设计文档
									that.BUTTON_STATUS.manageProjectPerson = true; //管理人员
									that.BUTTON_STATUS.manageModule = true; //模块任务
									that.BUTTON_STATUS.viewProjectGantt = false; //甘特图
									that.BUTTON_STATUS._preInsertProject = true; //新增
									that.BUTTON_STATUS.preUpdateProject = true; //修改
									that.BUTTON_STATUS.completeProject = true; //立项
									that.BUTTON_STATUS.deleteProject = true;  //删除
								}
                            }
						}
					}
                }
			},

            selectProjectPerson(row){
				this.divLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectPerson.do',
					data: {
						PROJECT_ID_: row.PROJECT_ID_,
						STATUS_: '1'
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
                        that.projectPersonList = [];
						let projectPersonList = res.data.projectPersonList;
						for (let i = 0; i < projectPersonList.length; i++) {
							const tableItem = {
								EMP_ID_: projectPersonList[i].EMP_ID_,
							};
							that.projectPersonList.push(tableItem);
						}
						that._setButtonStatus(row);
						that.divLoading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
					that.divLoading = false;
				})
            },

			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getProjectList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getProjectList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
            //点击添加按钮
			preInsertProject(){
				this.insertProjectDialog.show = true;
				this.insertProjectDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_project_ref.setInsertProjectForm();
				})
            },
            //关闭监听
			closeInsertProjectDialog(){
			    this.insertProjectDialog.dialogVisible = false;
            },
            //新增之后页面的变化
			_completeInsertProject(returnValue){
				this.insertProjectReqTemp = returnValue;
				let that = this;
				if(this.insertProjectReqTemp.PROJECT_TYPE_CODE_.substring(0, 2) == "WB"){
					const tableItem = {
						PROJECT_ID_: this.insertProjectReqTemp.PROJECT_ID_,
						PROJECT_CODE_: this.insertProjectReqTemp.PROJECT_CODE_,
						PROJECT_NAME_: this.insertProjectReqTemp.PROJECT_NAME_,
						MANAGER_NAME_: this.insertProjectReqTemp.MANAGER_NAME_,
						MANAGER_ID_: this.insertProjectReqTemp.MANAGER_ID_,
						PROJECT_TYPE_CODE_: this.insertProjectReqTemp.PROJECT_TYPE_CODE_,
						START_DATE_: this.insertProjectReqTemp.START_DATE_,
						END_DATE_: this.insertProjectReqTemp.END_DATE_,
						DRAFT_DATE_: dtime(this.insertProjectReqTemp.DRAFT_DATE_).format('YYYY-MM-DD '),
						HOURS_ :  this.insertProjectReqTemp.HOURS_,
						MEMO_: this.insertProjectReqTemp.MEMO_,
						STATUS_: this.insertProjectReqTemp.STATUS_,
						STATUS_DESC_ : that.projectStatusCodeMapList[this.insertProjectReqTemp.STATUS_],
						_async_label: "外部-" + that.projectTypeCodeMapList[this.insertProjectReqTemp.PROJECT_TYPE_CODE_]
					};
					this.projectData.push(tableItem);
                }else{
					const tableItem = {
						PROJECT_ID_: this.insertProjectReqTemp.PROJECT_ID_,
						PROJECT_CODE_: this.insertProjectReqTemp.PROJECT_CODE_,
						PROJECT_NAME_: this.insertProjectReqTemp.PROJECT_NAME_,
						MANAGER_NAME_: this.insertProjectReqTemp.MANAGER_NAME_,
						MANAGER_ID_: this.insertProjectReqTemp.MANAGER_ID_,
						PROJECT_TYPE_CODE_: this.insertProjectReqTemp.PROJECT_TYPE_CODE_,
						START_DATE_: this.insertProjectReqTemp.START_DATE_,
						END_DATE_: this.insertProjectReqTemp.END_DATE_,
						DRAFT_DATE_: dtime(this.insertProjectReqTemp.DRAFT_DATE_).format('YYYY-MM-DD '),
						HOURS_ :  this.insertProjectReqTemp.HOURS_,
						MEMO_: this.insertProjectReqTemp.MEMO_,
						STATUS_: this.insertProjectReqTemp.STATUS_,
						STATUS_DESC_ : that.projectStatusCodeMapList[this.insertProjectReqTemp.STATUS_],
						_async_label: "内部-"+ that.projectTypeCodeMapList[this.insertProjectReqTemp.PROJECT_TYPE_CODE_]
					};
					this.projectData.push(tableItem);
                }
				this.insertProjectDialog.show = false;
            },
            //点击编辑按钮
			_preUpdateProject(){
				let that = this;
				this.updateProjectDialog.show = true;
				this.updateProjectDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_project_ref.preUpdateProjectForm.PROJECT_ID_ = that.taskTable.currentRow.PROJECT_ID_;
					if(that.taskTable.currentRow.STATUS_ == '9'){
						this.$refs.update_project_ref.isDisable = true;
                    }
					this.$refs.update_project_ref.setUpdateProjectForm();
				})
            },
            //关闭监听
			closeUpdateProjectDialog(){
				this.updateProjectDialog.dialogVisible = false;
            },
			closeProjectGanttDialog(){
				this.projectGanttDialog.dialogVisible = false;
            },
            //修改之后的变化
			_completeUpdateProject(returnValue){
				let updateProjectReqTemp = returnValue;
				let that =this;
				for (let key in updateProjectReqTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.taskTable.currentRow[key] != null) ? that.taskTable.currentRow[key] = updateProjectReqTemp[key] : '';
				}
				this.taskTable.currentRow.DRAFT_DATE_ = dtime(updateProjectReqTemp.DRAFT_DATE_).format('YYYY-MM-DD ');
				this.taskTable.currentRow.START_DATE_ = updateProjectReqTemp.START_DATE_;
				this.taskTable.currentRow.END_DATE_ = updateProjectReqTemp.END_DATE_;
				if(updateProjectReqTemp.PROJECT_TYPE_CODE_.substring(0, 2) == "WB"){
					this.taskTable.currentRow._async_label = "外部-"+ that.projectTypeCodeMapList[updateProjectReqTemp.PROJECT_TYPE_CODE_];
                }else{
					this.taskTable.currentRow._async_label = "内部-"+ that.projectTypeCodeMapList[updateProjectReqTemp.PROJECT_TYPE_CODE_];
                }
				this.updateProjectDialog.show = false;
            },
            //点击管理需求
			_manageProjectReq(){
				this.projectReq.show = true;
				this.projectReq.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_req_ref.projectReqForm.PROJECT_ID_ = this.taskTable.currentRow.PROJECT_ID_;
					this.$refs.project_req_ref.getList();
				})
            },
            //关闭监听
			closeProjectReg(){
				this.projectReq.dialogVisible = false;
            },
			//点击管理设计
			_manageProjectDesign() {
				this.projectDesign.show = true;
				this.projectDesign.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_design_ref.riderForm.ID_ = this.taskTable.currentRow.PROJECT_ID_;
					this.$refs.project_design_ref.riderForm.TYPE_ = 'DESIGN';
					this.$refs.project_design_ref.getList();
				})
			},
            //关闭监听
			closeProjectDesign(){
				this.projectDesign.dialogVisible = false;
            },
            //点击管理人员
			_manageProjectPerson(){
				let that = this;
				this.manageProjectPersonDialog.show = true;
				this.manageProjectPersonDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_person_ref.projectPersonForm.PROJECT_ID_ = that.taskTable.currentRow.PROJECT_ID_;
					this.$refs.project_person_ref.doSyncMethod();
				})
            },
			//关闭监听
			closeProjectPersonDialog(){
				this.manageProjectPersonDialog.dialogVisible = false;
			},
			_completeUpdateProjectPerson(returnValue){
				//console.log(returnValue);
				/*let updateProjectPersonReqTemp = returnValue;

				let that =this;
				for (let key in updateProjectPersonReqTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.taskTable.currentRow[key] != null) ? that.taskTable.currentRow[key] = updateProjectPersonReqTemp[key] : '';
				}*/
				// if(updateProjectPersonReqTemp.PROJECT_ROLE_ == "MANAGER" ) {
				// 	this.taskTable.currentRow.MANAGER_NAME_ = updateProjectPersonReqTemp.EMP_NAME_;
				// 	this.taskTable.currentRow.MANAGER_ID_ = updateProjectPersonReqTemp.EMP_ID_;
				// 	this.projectData._async_label = that.projectTypeCodeMapList[updateProjectPersonReqTemp.PROJECT_TYPE_CODE_];
                //
                // }else  {
				// 	that.getProjectList();
                // }
				this.getProjectList();
			},

			//点击管理任务
			_manageModulePersonAllot(){
				this.projectPersonAllot.show = true;
				this.projectPersonAllot.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_person_allot_ref.projectPersonAllotForm.PROJECT_ID_ = this.taskTable.currentRow.PROJECT_ID_;
					this.$refs.project_person_allot_ref.doSyncMethod();
					//this.$refs.project_person_allot_ref.selectModule();
				})
			},
            //关闭监听
			closeProjectPersonAllot(){
				this.projectPersonAllot.dialogVisible = false;
            },
			//点击立项
			_completeProject(){

				this.$confirm('是否立项', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.projectloading = true;
					// let PROJECT_ID_LIST = [];
					// for(let i = 0; i<this.taskTable.length; i++){
					// 	PROJECT_ID_LIST.push(this.taskTable[i].currentRow.PROJECT_ID_);
					// }

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'singleCompleteProject.do',
						data: {
							PROJECT_ID_: that.taskTable.currentRow.PROJECT_ID_
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
							that.getProjectList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						/*请求失败*/
						that.$message.error('系统错误请联系管理员')
					})
				});
            },
            //点击删除
			_deleteProject(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.projectloading = true;
					//  let PROJECT_ID_LIST = [];
					// for (let i = 0; i < this.taskTable.length; i++) {
					// 	PROJECT_ID_LIST.push(this.taskTable[i].PROJECT_ID_);
					// }

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'singleDeleteProject.do',
						data: {
							PROJECT_ID_: that.taskTable.currentRow.PROJECT_ID_
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
							that.getProjectList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						//that.projectloading = false;
					})
				});
            },
            //查看项目甘特图
			_viewProjectGantt(){
				let that = this;
				this.projectGanttDialog.show = true;
				this.projectGanttDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.projectGanttRef.moduleForm.PROJECT_ID_ = that.taskTable.currentRow.PROJECT_ID_;
					// if(that.taskTable.currentRow.STATUS_ == '9'){
					// 	this.$refs.update_project_ref.isDisable = true;
					// }
					this.$refs.projectGanttRef.doSyncMethod();
				})
            }

        }
	}
</script>

<style  >
     /*//用来设置当前页面element全局table 选中某行时的背景色*/
    .currentStyleColor .el-table__body tr.current-row>td{
    background-color: #E0FFFF !important;
    }
     .el-table--enable-row-hover .el-table__body tr:hover>td {
         background-color:  	#d0d0d0;
         /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
     }
</style>
