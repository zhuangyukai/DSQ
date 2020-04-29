<template>
    <div style="width: 1580px;">
        <div style="height: 600px; width: 100%; margin-left: -35px">
            <el-col :span="7.2"
                    style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); margin-left:23px;  margin-right: 10px;height: 600px;">
                <div style="text-align: left; background: -moz-linear-gradient(left,#5A5AAD,white); background: -webkit-linear-gradient(left,#5A5AAD,white); margin-bottom: 2px">
                    <!--<h7 style="margin-top: 5px; margin-bottom: 5px; font-family: Microsoft Yahei, sans-serif">模块管理</h7>-->
                    <span style="margin-left: 5px; font-size: 16px; font-family: 华文新魏; color: white">模块管理</span>
                </div>
                <div>
                    <el-form>
                        <el-form-item>
                            <el-button type="primary" size="mini"
                                       @click='preInsertRootModule()'>新增根
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertSubModule"
                                       @click='preInsertSubModule()'>新增下级
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS._preUpdateModule"
                                       @click='_preUpdateModule()'>修改
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS._updateModuleStatus"
                                       @click='_preUpdateModuleStatus()'>状态
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS._deleteModule"
                                       @click='_deleteModule()'>删除
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS._moveModule"
                                       @click='_moveModule()'>移动
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="moduleTreeDiv" style="width: 100%; height: 520px">
                    <!--<el-tree-->
                    <!--v-loading="moduleTree.mainLoading"-->
                    <!--:data="moduleList"-->
                    <!--:expand-on-click-node="false"-->
                    <!--default-expand-all-->
                    <!--node-key="id"-->
                    <!--ref="tree"-->
                    <!--highlight-current-->
                    <!--:props="defaultModuleProps"-->
                    <!--@node-click="_moduleOnClick"-->
                    <!--&gt;-->
                    <!--</el-tree>-->
                    <div class="table_container currentStyleColor2">
                        <el-table ref="multipleTable" :data="moduleTree.moduleList" border style="width: 100%;"
                                  size="medium"
                                  v-loading="moduleTree.mainLoading"
                                  :style="{height : 520}"
                                  :row-class-name="rowClassNameHandler" row-key="MODULE_ID_"
                                  :row-style="{height:0}"
                                  :cell-style="{padding:0}"
                                  :height="moduleTree.gridTableStyle.height"
                                  @row-click="clickModuleRow"
                                  header-row-class-name="moduleTreeHearder"
                                  highlight-current-row
                        >
                            <el-table-column label="模块名称" width="220" align="left" show-overflow-tooltip>
                                <template slot-scope="scope">
                                    <span :style="{marginLeft: scope.row.level * 10 + 'px'}">&ensp;</span>
                                    <i v-if="scope.row.showChildren"
                                       :class="{'fa fa-folder-open':scope.row.showChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                                       @click="onExpand(scope.row)"
                                       :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                                    <i v-else
                                       :class="{'fa fa-folder':scope.row.hasChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                                       @click="onExpand(scope.row)"
                                       :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                                    <span :data-level="scope.row.level"
                                          :style="{marginLeft: 2 + 'px'}">{{ scope.row.MODULE_NAME_ }}</span>
                                </template>
                            </el-table-column>
                            <!--<el-table-column prop="DUTY_ID_" label="分类ID" width="80" align="center"></el-table-column>-->
                            <!--<el-table-column prop="PARENT_DUTY_ID_" label="父类ID" width="80" align="center"></el-table-column>-->
                            <el-table-column prop="START_DATE_" label="开始时间" align="center" width="80"
                                             style="font-size: 5px">
                                <template slot-scope="scope">
                                    <span class="moduleDateClass">{{ scope.row.START_DATE_ }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="END_DATE_" label="结束时间" align="center" width="80">
                                <template slot-scope="scope">
                                    <span class="moduleDateClass">{{ scope.row.END_DATE_ }}</span>
                                </template>
                            </el-table-column>
                            <el-table-column prop="STATUS_DESC_" label="状态" align="center" width="85">
                                <template slot-scope="scope">
                                    <span style="font-size: 11px">{{ scope.row.STATUS_DESC_ }}</span>
                                </template>
                            </el-table-column>
                        </el-table>

                    </div>
                </div>
            </el-col>

            <el-col :span="5"
                    style="box-shadow: 1px 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); margin-right: 10px; height: 600px">
                <div style="text-align: left; background: -moz-linear-gradient(left,#5A5AAD,white); background: -webkit-linear-gradient(left,#5A5AAD,white); margin-bottom: 2px">
                    <span style="margin-left: 5px; font-size: 16px; font-family: 华文新魏; color: white">任务管理</span>
                </div>
                <div>
                    <el-form>
                        <el-form-item>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertTask"
                                       @click='preInsertTask()'>新增
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS._preUpdateTask"
                                       @click='_preUpdateTask()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS._deleteTask"
                                       @click='_deleteTask()'>删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div style="width: 100%; height: 520px">
                    <el-table
                            v-loading="taskloading"
                            :data="taskList"
                            :style="taskGridStyle"
                            height="520"
                            align='center'
                            ref="taskGridRef"
                            highlight-current-row
                            @current-change="taskCurrentChange"
                            @row-click="clickRow"
                            :row-class-name="taskTableRowClassName"
                    >
                        <el-table-column
                                v-if="idFlag"
                                prop="TASK_ID_"
                                label="任务ID"
                                align='center'>
                        </el-table-column>
                        <el-table-column
                                prop="TASK_NAME_"
                                label="任务名称"
                                align='center'
                                width="150"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="TASK_LEVEL_"
                                label="任务等级"
                                align='center'
                                width="100"
                                sortable>
                            <template slot-scope="scope">
                                <span>{{ scope.row.task_level_ }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="TASK_STATUS_"
                                label="状态"
                                align='center'
                                width="80"
                                sortable>
                            <template slot-scope="scope">
                                <span>{{ scope.row.TASK_STATUS_DESC_ }}</span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </el-col>

            <el-col :span="10.8"
                    style="box-shadow: 1px 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 600px">
                <div style="text-align: left; background: -moz-linear-gradient(left,#5A5AAD,white); background: -webkit-linear-gradient(left,#5A5AAD,white); margin-bottom: 2px">
                    <span style="margin-left: 5px; font-size: 16px; font-family: 华文新魏; color: white">分配任务</span>
                </div>
                <div>
                    <el-form>
                        <el-form-item>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.insertTaskPerson"
                                       @click='insertTaskPerson()'>新增
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div>
                    <el-table
                            v-loading="taskPersonTable.taskPersonTableLoading"
                            :data="taskPersonList"
                            align='center'>
                        <el-table-column
                                label="人员姓名"
                                width="100px"
                                align='center'
                                sortable>
                            <template slot-scope="scope">
                                <div v-if="!scope.row.editing">
                                    <span>{{ scope.row.EMP_NAME_ }}</span>
                                </div>
                                <div v-else>
                                    <el-input v-model="scope.row.EMP_NAME_"
                                              readonly
                                              @focus="_preChooseEmp(scope.$index, scope.row)"
                                              placeholder="请选择人员"></el-input>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="任务人员类型"
                                width="120px"
                                align='center'
                                sortable>
                            <template slot-scope="scope">
                                <div v-if="!scope.row.editing">
                                    <span>{{ scope.row.TASK_PERSON_TYPE_NAME_ }}</span>
                                </div>
                                <div v-else>
                                    <el-select v-model="scope.row.TASK_PERSON_TYPE_" placeholder="请选择任务人员类型">
                                        <el-option
                                                v-for="item in taskPersonTypeList"
                                                :key="item.CODE_"
                                                :label="item.NAME_"
                                                :value="item.CODE_">
                                        </el-option>
                                    </el-select>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="开始时间"
                                align='center'
                                width="160px"
                                sortable>
                            <template slot-scope="scope">
                                <div v-if="!scope.row.editing">
                                    <span>{{ scope.row.START_DATE_ }}</span>
                                </div>
                                <div v-else>
                                    <el-date-picker
                                            v-model="scope.row.START_DATE_"
                                            type="date"
                                            placeholder="选择日期"
                                            @change="startTimeStatus"
                                            :picker-options="pickerOptionsStart">
                                    </el-date-picker>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="结束时间"
                                align='center'
                                width="160px"
                                sortable>
                            <template slot-scope="scope">
                                <div v-if="!scope.row.editing">
                                    <span>{{ scope.row.END_DATE_ }}</span>
                                </div>
                                <div v-else>
                                    <el-date-picker
                                            v-model="scope.row.END_DATE_"
                                            type="date"
                                            placeholder="选择日期"
                                            @change="endTimeStatus"
                                            :picker-options="pickerOptionsEnd">
                                    </el-date-picker>
                                </div>
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
                                            @click="_updateTaskPerson(scope.$index, scope.row)">编辑
                                    </el-button>
                                    <el-button
                                            type="primary"
                                            size="mini"
                                            v-if="scope.row.editing"
                                            icon="el-icon-success"
                                            @click="_insertTaskPerson(scope.$index, scope.row)">保存
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="danger"
                                            v-if="!scope.row.editing"
                                            icon="el-icon-delete"
                                            @click="_deleteTaskPerson(scope.$index, scope.row)">删除
                                    </el-button>
                                    <el-button
                                            size="mini"
                                            type="warning"
                                            v-if="scope.row.editing"
                                            icon="el-icon-warning"
                                            @click="_cancelTaskPerson(scope.$index, scope.row)">取消
                                    </el-button>
                                </div>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>

            <!--新增根模块-->
            <el-dialog
                    :title="insertRootModuleDialog.title"
                    :visible.sync="insertRootModuleDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="insertRootModuleDialog.style"
                    :width="insertRootModuleDialog.width"
                    @close="closeInsertRootModuleDialog"
            >
                <template>
                    <insertRootModuleCom ref="insert_root_module_ref" v-if="insertRootModuleDialog.dialogVisible"
                                         @insertRootModuleListeners="_completeInsertRootModule"></insertRootModuleCom>
                </template>
            </el-dialog>
            <!--新增下级模块-->
            <el-dialog
                    :title="insertSubModuleDialog.title"
                    :visible.sync="insertSubModuleDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="insertSubModuleDialog.style"
                    :width="insertSubModuleDialog.width"
                    @close="closeInsertSubModuleDialog"
            >
                <template>
                    <insertSubModuleCom ref="insert_sub_module_ref" v-if="insertSubModuleDialog.dialogVisible"
                                        @insertSubModuleListeners="_completeInsertSubModule"></insertSubModuleCom>
                </template>
            </el-dialog>
            <!--修改模块-->
            <el-dialog
                    :title="updateModuleDialog.title"
                    :visible.sync="updateModuleDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="updateModuleDialog.style"
                    :width="updateModuleDialog.width"
                    @close="closeUpdateModuleDialog"
            >
                <template>
                    <updateModuleCom ref="update_module_ref" v-if="updateModuleDialog.dialogVisible"
                                     @updateModuleListeners="_completeupdateModule"></updateModuleCom>
                </template>
            </el-dialog>
            <!--新增任务-->
            <el-dialog
                    :title="insertTaskDialog.title"
                    :visible.sync="insertTaskDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="insertTaskDialog.style"
                    :width="insertTaskDialog.width"
                    @close="closeInsertTaskDialog"
            >
                <template>
                    <insertTaskCom ref="insert_task_ref" v-if="insertTaskDialog.dialogVisible"
                                   @insertTaskListeners="_completeInsertTask"></insertTaskCom>
                </template>
            </el-dialog>
            <!--修改任务-->
            <el-dialog
                    :title="updateTaskDialog.title"
                    :visible.sync="updateTaskDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="updateTaskDialog.style"
                    :width="updateTaskDialog.width"
                    @close="closeUpdateTaskDialog"
            >
                <template>
                    <updateTaskCom ref="update_task_ref" v-if="updateTaskDialog.dialogVisible"
                                   @updateTaskListeners="_completeUpdateTask">
                    </updateTaskCom>
                </template>
            </el-dialog>
            <!--选择人员-->
            <el-dialog
                    :title="chooseTaskEmpDialog.title"
                    :visible.sync="chooseTaskEmpDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseTaskEmpDialog.style"
                    :width="chooseTaskEmpDialog.width"
                    @close="closeChooseEmpDialog"
            >
                <template>
                    <chooseTaskEmpCom ref="choose_task_emp_ref" v-if="chooseTaskEmpDialog.dialogVisible"
                                      @chooseEmpListeners="_completeChooseTaskEmp">
                    </chooseTaskEmpCom>
                </template>
            </el-dialog>
            <!--选择模块-->
            <el-dialog
                    :title="chooseModuleDialog.title"
                    :visible.sync="chooseModuleDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseModuleDialog.style"
                    :width="chooseModuleDialog.width"
                    @close="closeChooseModuleDialog"
            >
                <template>
                    <chooseModuleCom ref="choose_module_ref" v-if="chooseModuleDialog.dialogVisible"
                                      @chooseModuleListeners="_completeChooseModule">
                    </chooseModuleCom>
                </template>
            </el-dialog>
            <!--修改模块状态-->
            <el-dialog
                    :title="moduleStatusDialog.title"
                    :visible.sync="moduleStatusDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :width="moduleStatusDialog.width"
                    class="moduleStatusDialogClass"
            >
                <div class="form">
                    <el-form
                            ref="moduleStatusForm"
                            :model="moduleStatusForm"
                            style="margin:10px;width:auto;"
                    >

                        <el-form-item prop='STATUS_DESC_' label="模块状态:" label-width="24.5%"
                        >
                            <el-radio-group v-model="moduleStatusForm.STATUS_DESC" fill="pink">
                                <el-radio-button label="完工"></el-radio-button>
                                <el-radio-button label="开发中"></el-radio-button>
                            </el-radio-group>
                        </el-form-item>

                        <el-form-item class="text_right">
                            <el-button type="primary" @click='_completeModule()'>确定</el-button>
                            <el-button type="warning" @click='_closeModuleStatus()'>取消</el-button>
                        </el-form-item>
                    </el-form>

                </div>
            </el-dialog>

        </div>
    </div>
</template>

<script>

	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	import dtime from 'time-formater'
	import insertTaskCom from '../task/preInsertTask.vue';
	import updateTaskCom from '../task/preUpdateTask.vue';
	import insertRootModuleCom from '../modulePersonAllot/preInsertRootModule.vue';
	import insertSubModuleCom from '../modulePersonAllot/preInsertSubModule.vue';
	import updateModuleCom from '../modulePersonAllot/preUpdateModule.vue';
	import chooseTaskEmpCom from '../emp/preChooseEmp.vue';
	import Sortable from 'sortablejs';
	import chooseModuleCom from '../module/preChooseMoveModule.vue';

	export default {
		components: {
			insertTaskCom,
			updateTaskCom,
			insertRootModuleCom,
			insertSubModuleCom,
			updateModuleCom,
			chooseTaskEmpCom,
			Sortable,
			chooseModuleCom
		},
		//数据
		data() {
			return {
				moduleTree: {
					mainLoading: false,
					moduleList: [],
					multipleSelection: [],//checkbox
					numbers: [],
					gridTableStyle: {
						width: '100%',
						height: 520
					},
					moduleStatusCodeMapList: {},
				},
				moduleStatusForm: {
					STATUS_DESC: ''
				},
				moduleStatusDialog: {
					title: '状态修改',
					show: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				BUTTON_STATUS: {
					preInsertSubModule: true,
					_updateModuleStatus: true,
					_preUpdateModule: true,
					_deleteModule: true,
					_moveModule: true,
					preInsertTask: true,
					_preUpdateTask: true,
					_deleteTask: true,
					_completeTask: true,
					insertTaskPerson: true,
					_completeModule: true
				},
				//管理项目页面点击管理模块传过来的值
				projectPersonAllotForm: {
					PROJECT_ID_: ''
				},
				//模块树结构的数据
				moduleList: [],
				//模块树结构的显示数据
				defaultModuleProps: {
					children: 'children',
					label: 'MODULE_NAME_'
				},
				//定义一个全局的module_id
				module_id: '',
				//新增根模块的窗口
				insertRootModuleDialog: {
					show: false,
					title: '新增根模块',
					insertRootModuleDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				//新增下级模块的窗口
				insertSubModuleDialog: {
					show: false,
					title: '新增下级模块',
					insertSubModuleDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				//修改模块的窗口
				updateModuleDialog: {
					show: false,
					title: '修改模块',
					updateModuleDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				//移动模块的窗口
				chooseModuleDialog: {
					show: false,
					title: '选择模块',
					chooseModuleDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				//任务的数据
				taskList: [],
				//任务grid的style
				taskGridStyle: {
					width: '100%',
				},
				taskloading: false,
				idFlag: false,
				tableHeight: '',
				//任务等级的渲染数据
				taskLevelCodeMapList: [],
				//新增任务窗口
				insertTaskDialog: {
					show: false,
					title: '新增任务',
					insertTaskDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				insertTaskReqTemp: '',
				//修改任务窗口
				updateTaskDialog: {
					show: false,
					title: '修改任务',
					updateTaskDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '400px'
				},
				//任务人员的数据
				taskPersonList: [],
				//任务TABLE
				taskTable: {
					taskTableLoading: false,
					taskStatusCodeMapList: [],
					currentRow: null
				},
				//任务人员TABLE
				taskPersonTable: {
					taskPersonTableLoading: false,
				},
				taskPerson: {
					tempDate: {
						TASK_PERSON_ID_: '',
						EMP_NAME_: '',
						EMP_ID_: '',
						TASK_PERSON_TYPE_: '',
						START_DATE_: '',
						END_DATE_: ''
					},
					insertOrUpdate: false,
					TASK_PERSON_ID_: '',
					tempIndex: ''
				},
				//任务人员种类的渲染数据
				taskPersonTypeList: [],
				taskPersonTypeCodeMapList: [],
				//打开人员机构的窗口
				chooseTaskEmpDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					dialogVisible: true,
					formLabelWidth: '120px',
					empLoading: false,
				},
				//设置人员的时间
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.taskPerson.tempDate.END_DATE_;
						if (endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.taskPerson.tempDate.START_DATE_;
						if (beginDateVal) {
							return (
								time.getTime() < new Date(beginDateVal).getTime()
							);
						}
					},
				},
			}
		},

		mounted() {

		},
		created() {
			//this.doSyncMethod();
			//this.selectModule();
		},
		methods: {
			async doSyncMethod() {
				await this._selectCode();

				await this.selectModule();
			},
			_moduleStatusOnChange(value) {
			},
			_preUpdateModuleStatus() {
				let that = this;
				if (that.moduleTree.multipleSelection.MODULE_ID_ == "") {
					that.$message.error('请选择一个模块');
					return;
				}
				this.moduleStatusForm.STATUS_DESC = that.moduleTree.multipleSelection.STATUS_DESC_;
				this.moduleStatusDialog.show = true;
				this.moduleStatusDialog.dialogVisible = true;
			},
			_closeModuleStatus() {
				this.moduleStatusDialog.show = false;
				this.moduleStatusDialog.dialogVisible = false;
			},
			selectModule() {
				this.moduleTree.mainLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectModule.do',
					data: {
						PROJECT_ID_: this.projectPersonAllotForm.PROJECT_ID_,
						notModuleStatus: '0'
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
						let moduleList = res.data.moduleList;

						for (let i = 0; i < moduleList.length; i++) {
							moduleList[i].STATUS_DESC_ = that.moduleTree.moduleStatusCodeMapList[moduleList[i].MODULE_STATUS_];
						}
						let resultArray = that._processLevelModuleData(moduleList)
						that.moduleTree.moduleList = resultArray
						that.moduleTree.mainLoading = false;

						//that.moduleList = res.data.children;
						//that.moduleTree.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.moduleTree.mainLoading = false;
				})


				// this.$ajax.post(
				// 	this.baseUrl + 'selectMenu.do'
				// ).then(function (res) {
				// 	let result = res.data.menuList;
				// 	let resultArray = self._processLevelStatisticData(result)
				// 	self.statisticDatas = resultArray
				// 	self.mainLoading = false;
				// })
			},
			_processLevelModuleData(dataArray) {
				let that = this
				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_MODULE_ID_ == null) {
						item['level'] = level;
						resultArray.push(item)
						that._loadChildrenData(resultArray, dataArray, item, level + 1)
					}
				}
				return resultArray
			},
			_loadChildrenData(resultArray, originArray, item, level) {
				let self = this

				let deployed = 0
				let undeployed = 0
				let edit = 0
				let completed = 0
				for (let i = 0; i < originArray.length; i++) {
					let originItem = originArray[i]
					// 判断是否是item项的子项
					if (originItem.PARENT_MODULE_ID_ == item.MODULE_ID_) {
						item['hasChildren'] = true
						item['showChildren'] = true

						originItem['level'] = level
						originItem['visible'] = true // 子项默认隐藏(false 隐藏,  true 自动展开) 跟随上面showChildren 也得改成true;
						originItem['hiddenByCategory'] = false

						resultArray.push(originItem)
						self._loadChildrenData(
							resultArray,
							originArray,
							originItem,
							level + 1
						)
					}
				}
			},
			// 时间开始选择器
			startTimeStatus: function (value) {
				this.taskPerson.tempDate.START_DATE_ = value
			},
			// 时间结束选择器
			endTimeStatus: function (value) {
				this.taskPerson.tempDate.END_DATE_ = value
			},
			taskCurrentChange(val) {
				this.taskTable.currentRow = val;
			},
			//查询code
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
								that.taskLevelCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if (that.CODE_LIST[i].CATEGORY_ == 'TASK_STATUS') {
								that.taskTable.taskStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if (that.CODE_LIST[i].CATEGORY_ == 'TASK_PERSON_TYPE') {
								that.taskPersonTypeList.push(that.CODE_LIST[i]);
								that.taskPersonTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if (that.CODE_LIST[i].CATEGORY_ == 'MODULE_STATUS') {
								that.moduleTree.moduleStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//查询模块
			_selectProject() {
				this.moduleTree.mainLoading = true;
				this.taskList = [];
				this.taskPersonList = [];
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectModule.do',
					data: {
						PROJECT_ID_: this.projectPersonAllotForm.PROJECT_ID_,
						MODULE_STATUS_: '1'
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
						that.moduleList = res.data.children;
						that.moduleTree.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.moduleTree.mainLoading = false;
				})
			},
			//根模块新增按钮
			preInsertRootModule() {
				let that = this;
				this.insertRootModuleDialog.show = true;
				this.insertRootModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_root_module_ref.preInsertRootModuleForm.PROJECT_ID_ = that.projectPersonAllotForm.PROJECT_ID_;
					this.$refs.insert_root_module_ref.setInsertRootModule();
				})
			},
			//关闭监听
			closeInsertRootModuleDialog() {
				this.insertRootModuleDialog.dialogVisible = false;
			},
			//新增根模块之后的变化
			_completeInsertRootModule() {
				this.selectModule();
				this.insertRootModuleDialog.modal = true;
				this.insertRootModuleDialog.show = false;
				this.taskList = [];
			},
			//下级模块新增按钮
			preInsertSubModule() {
				let that = this;
				if (this.module_id == "") {
					that.$message.error('请选择一个模块');
					return;
				}
				this.insertSubModuleDialog.show = true;
				this.insertSubModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_sub_module_ref.preInsertSubModuleForm.PROJECT_ID_ = that.projectPersonAllotForm.PROJECT_ID_;
					this.$refs.insert_sub_module_ref.preInsertSubModuleForm.PARENT_MODULE_ID_ = that.module_id;
					this.$refs.insert_sub_module_ref.preInsertSubModuleForm.PARENT_START_DATE_ = that.moduleTree.multipleSelection.START_DATE_;
					this.$refs.insert_sub_module_ref.preInsertSubModuleForm.PARENT_END_DATE_ = that.moduleTree.multipleSelection.END_DATE_;
					this.$refs.insert_sub_module_ref.setInsertSubModule();
				})
			},
			//关闭监听
			closeInsertSubModuleDialog() {
				this.insertSubModuleDialog.dialogVisible = false;
			},
			//新增下级模块之后的变化
			_completeInsertSubModule() {
				this.selectModule();
				this.BUTTON_STATUS.preInsertTask = true;
				this.insertSubModuleDialog.modal = true;
				this.insertSubModuleDialog.show = false;
				this.taskList = [];
			},
			//修改模块的按钮
			_preUpdateModule() {
				let that = this;
				if (this.module_id == "") {
					that.$message.error('请选择一个模块');
					return;
				}
				this.updateModuleDialog.show = true;
				this.updateModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_module_ref.preUpdateModuleForm.MODULE_ID_ = that.module_id;
					this.$refs.update_module_ref.setUpdateModule();
				})
			},
			//完成模块
			_completeModule() {
				if (this.moduleTree.multipleSelection.MODULE_ID_ == "" && this.moduleTree.multipleSelection.MODULE_ID_ == 'undefined') {
					this.$message.error('请选择一个模块');
					return;
				}
				let that = this;
				let MODULE_STATUS_ = '';
				if (that.moduleStatusForm.STATUS_DESC == '完工') {
					MODULE_STATUS_ = '9'
				} else if (that.moduleStatusForm.STATUS_DESC == '开发中') {
					MODULE_STATUS_ = '1'
				}

				axios({
					method: 'POST',
					url: this.baseUrl + 'updateModuleStatus.do',
					data: {
						MODULE_ID_: that.moduleTree.multipleSelection.MODULE_ID_,
						MODULE_STATUS_: MODULE_STATUS_
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
						that._closeModuleStatus();
						that.selectModule();
						that._setModuleButtonStatus(res.data.module.MODULE_STATUS_);
						let tempDate = res.data.module;
						tempDate.STATUS_DESC_ = that.moduleTree.moduleStatusCodeMapList[res.data.module.MODULE_STATUS_];
						that.moduleTree.multipleSelection = tempDate;

						that.BUTTON_STATUS.preInsertTask = true;
						that.taskList = [];
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作请重试')
				})
			},
			//关闭监听
			closeUpdateModuleDialog() {
				this.updateModuleDialog.dialogVisible = false;
			},
			//修改模块之后的变化
			_completeupdateModule() {
				this.selectModule();
				this.BUTTON_STATUS.preInsertTask = true;
				this.updateModuleDialog.modal = true;
				this.updateModuleDialog.show = false;
				this.taskList = [];
			},
			//点击删除模块按钮
			_deleteModule() {
				let that = this;
				if (this.module_id == "") {
					that.$message.error('请选择一个模块');
					return;
				}
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'invalidModule.do',
						data: {
							MODULE_ID_: that.module_id
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
							that.selectModule();

							that._setModuleButtonStatus();
							that.moduleTree.multipleSelection = [];
							that.moduleTree.numbers = [];

							that.BUTTON_STATUS.preInsertTask = true;
							that.taskList = [];
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			},
			//点击模块查询出来任务
			_moduleOnClick(data) {
				this.taskloading = true;
				this._setModuleButtonStatus(data.MODULE_STATUS_);
				this.BUTTON_STATUS.preInsertTask = false;
				this.BUTTON_STATUS._preUpdateTask = true;
				this.BUTTON_STATUS._completeTask = true;
				this.BUTTON_STATUS._deleteTask = true;
				this.BUTTON_STATUS.insertTaskPerson = true;
				this.taskPersonList = [];
				let that = this;
				this.module_id = data.MODULE_ID_;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTask.do',
					data: {
						MODULE_ID_: data.MODULE_ID_
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
								task_level_: that.taskLevelCodeMapList[taskList[i].TASK_LEVEL_],
								TASK_STATUS_: taskList[i].TASK_STATUS_,
								TASK_STATUS_DESC_: that.taskTable.taskStatusCodeMapList[taskList[i].TASK_STATUS_],
							};
							that.taskList.push(tableItem);
						}
						that.taskloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.taskloading = false;
				})
			},
			//点击任务完成按钮
			_completeTask() {
				if (this.taskTable.currentRow == null) {
					this.$message.warning('请选择一条任务');
					return;
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'completeTask.do',
					data: {
						TASK_ID_: this.taskTable.currentRow.TASK_ID_
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
						let task = res.data.task;
						for (let key in task) {//装载被修改数据到页面
							that.$set(that.taskList[that.taskTable.currentRow.index], key, task[key]);
						}

						that.$set(that.taskList[that.taskTable.currentRow.index], 'TASK_STATUS_DESC_', that.taskTable.taskStatusCodeMapList[task.TASK_STATUS_],);

						that._setTaskButtonStatus(task.TASK_STATUS_);
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作失败请重试')
				})
			},
			clickRow(row, column, event) {
				this.selectTaskPerson(row.TASK_ID_);
				this._setTaskButtonStatus(row.TASK_STATUS_);
			},
			taskTableRowClassName({row, rowIndex}) {
				row.index = rowIndex;
			},
			_setTaskButtonStatus(TASK_STATUS_) {
				if (TASK_STATUS_ == '9') {
					this.BUTTON_STATUS._preUpdateTask = true;
					this.BUTTON_STATUS._deleteTask = true;
					this.BUTTON_STATUS._completeTask = true;
					this.BUTTON_STATUS.insertTaskPerson = false;
				} else {
					this.BUTTON_STATUS._preUpdateTask = false;
					this.BUTTON_STATUS._deleteTask = false;
					this.BUTTON_STATUS._completeTask = false;
					this.BUTTON_STATUS.insertTaskPerson = false;
				}
			},
			//新增任务按钮
			preInsertTask() {
				if (this.module_id == null || this.module_id == '') {
					this.$message.warning('请先选择模块');
					return;
				}

				let that = this;
				this.insertTaskDialog.show = true;
				this.insertTaskDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_task_ref.preInsertTaskForm.MODULE_ID_ = that.module_id;
					this.$refs.insert_task_ref.setInsertTaskFormNull();
				})
			},
			//关闭监听
			closeInsertTaskDialog() {
				this.insertTaskDialog.dialogVisible = false;
			},
			//新增之后的grid变化
			_completeInsertTask(returnValue) {
				this.insertTaskReqTemp = returnValue;
				let that = this;
				const tableItem = {
					TASK_ID_: this.insertTaskReqTemp.TASK_ID_,
					MODULE_ID_: this.insertTaskReqTemp.MODULE_ID_,
					TASK_NAME_: this.insertTaskReqTemp.TASK_NAME_,
					TASK_LEVEL_: this.insertTaskReqTemp.TASK_LEVEL_,
					DRAFTOR_ID_: this.insertTaskReqTemp.DRAFTOR_ID_,
					DRAFT_DATE_: dtime(this.insertTaskReqTemp.DRAFT_DATE_).format('YYYY-MM-DD '),
					task_level_: that.taskLevelCodeMapList[this.insertTaskReqTemp.TASK_LEVEL_],
					TASK_STATUS_: this.insertTaskReqTemp.TASK_STATUS_,
					TASK_STATUS_DESC_: that.taskTable.taskStatusCodeMapList[this.insertTaskReqTemp.TASK_STATUS_]
				};
				this.taskList.push(tableItem);
				this.insertTaskDialog.show = false;
			},
			//修改任务按钮
			_preUpdateTask() {
				if (this.taskTable.currentRow == null) {
					this.$message.warning('请选择一条任务');
					return;
				}
				let that = this;
				this.updateTaskDialog.show = true;
				this.updateTaskDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_task_ref.preUpdateTaskForm.TASK_ID_ = this.taskTable.currentRow.TASK_ID_;
					this.$refs.update_task_ref._loadTask();
				})
			},
			//关闭监听
			closeUpdateTaskDialog() {
				this.updateTaskDialog.dialogVisible = false;
			},
			//修改之后的变化
			_completeUpdateTask(returnValue) {
				let updateTaskReqTemp = returnValue;
				let that = this;
				for (let key in updateTaskReqTemp) {//装载被修改数据到页面
					(that.taskList[this.taskTable.currentRow.index][key] != null) ? that.taskList[this.taskTable.currentRow.index][key] = updateTaskReqTemp[key] : '';
				}
				that.taskList[this.taskTable.currentRow.index].task_level_ = that.taskLevelCodeMapList[updateTaskReqTemp.TASK_LEVEL_];
				that.taskList[this.taskTable.currentRow.index].TASK_STATUS_DESC_ = that.taskTable.taskStatusCodeMapList[updateTaskReqTemp.TASK_STATUS_];
				this.updateTaskDialog.show = false;

			},
			//删除任务按钮
			_deleteTask() {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteTask.do',
						data: {
							TASK_ID_: that.taskTable.currentRow.TASK_ID_
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
							that.taskPersonList = [];
							that.taskList.splice(that.taskTable.currentRow.index, 1);
							that.BUTTON_STATUS._preUpdateTask = true;
							that.BUTTON_STATUS._deleteTask = true;
							that.BUTTON_STATUS._completeTask = true;
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			},
			//删除刷新
			refreshTask() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTask.do',
					data: {
						MODULE_ID_: that.module_id
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
								task_level_: that.taskLevelCodeMapList[taskList[i].TASK_LEVEL_]
							};
							that.taskList.push(tableItem);
						}
						that.taskloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.taskloading = false;
				})
			},
			//加载任务人员数据
			selectTaskPerson(TASK_ID_) {
				this.taskPersonTable.taskPersonTableLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTaskPerson.do',
					data: {
						TASK_ID_: TASK_ID_
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
						that.taskPersonList = [];
						let taskPersonList = res.data.taskPersonList;

						for (let i = 0; i < taskPersonList.length; i++) {
							const tableItem = {
								TASK_PERSON_ID_: taskPersonList[i].TASK_PERSON_ID_,
								TASK_ID_: taskPersonList[i].TASK_ID_,
								EMP_ID_: taskPersonList[i].EMP_ID_,
								EMP_NAME_: taskPersonList[i].EMP_NAME_,
								TASK_PERSON_STATUS_: taskPersonList[i].TASK_PERSON_STATUS_,
								TASK_PERSON_TYPE_: taskPersonList[i].TASK_PERSON_TYPE_,
								START_DATE_: taskPersonList[i].START_DATE_,
								END_DATE_: taskPersonList[i].END_DATE_,
								WORKING_HOURS_: taskPersonList[i].WORKING_HOURS_,
								TASK_PERSON_TYPE_NAME_: that.taskPersonTypeCodeMapList[taskPersonList[i].TASK_PERSON_TYPE_]
							}
							that.taskPersonList.push(tableItem);
						}

						that.taskPersonTable.taskPersonTableLoading = false;
					} else {
						that.$message.error(res.data.message);
						that.taskPersonTable.taskPersonTableLoading = false;
					}

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
					that.taskPersonTable.taskPersonTableLoading = false;
				})
			},
			//增加人员的按钮
			insertTaskPerson() {
				for (let i = 0; i < this.taskPersonList.length; i++) {
					if (this.taskPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				this.taskPerson.insertOrUpdate = true;
				this.taskPersonList = this.taskPersonList || []
				this.taskPersonList.push({
					TASK_PERSON_ID_: "",
					TASK_ID_: "",
					EMP_ID_: "",
					EMP_NAME_: '',
					TASK_PERSON_TYPE_: "0",
					START_DATE_: "",
					END_DATE_: "",
					WORKING_HOURS_: "",
					TASK_PERSON_STATUS_: "",
					editing: true
				});
				this.taskPerson.tempDate.START_DATE_ = "";
				this.taskPerson.tempDate.END_DATE_ = "";

			},
			//点击选择人员的单元格
			_preChooseEmp(index, row) {
				this.chooseTaskEmpDialog.show = true;
				this.chooseTaskEmpDialog.dialogVisible = true;
				this.taskPerson.tempIndex = index;
				this.$nextTick(_ => {
					this.$refs.choose_task_emp_ref._selectOrg();
				})
			},
			//关闭监听
			closeChooseEmpDialog() {
				this.chooseTaskEmpDialog.dialogVisible = false;
			},
			//赋人名
			_completeChooseTaskEmp(row) {
				this.taskPersonList[this.taskPerson.tempIndex].EMP_ID_ = row.EMP_ID_;
				this.taskPersonList[this.taskPerson.tempIndex].EMP_NAME_ = row.EMP_NAME_;
				this.chooseTaskEmpDialog.show = false;
			},
			//新增人员的编辑按钮
			_updateTaskPerson($index, row) {
				for (let i = 0; i < this.taskPersonList.length; i++) {
					if (this.taskPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				this.taskPerson.insertOrUpdate = false;
				this.$set(this.taskPersonList[$index], 'editing', true)
				this.taskPerson.tempDate.EMP_NAME_ = row.EMP_NAME_;
				this.taskPerson.tempDate.EMP_ID_ = row.EMP_ID_;
				this.taskPerson.tempDate.START_DATE_ = row.START_DATE_;
				this.taskPerson.tempDate.END_DATE_ = row.END_DATE_;
			},
			//新增人员的保存按钮
			_insertTaskPerson(index, row) {
				if (row.TASK_PERSON_ID_ == '') {
					let TASK_ID_ = this.taskTable.currentRow.TASK_ID_
					let that = this;
					if (that.taskPersonList[index].EMP_ID_ == "") {
						this.$message.warning("请选择人员");
						return;
					}
					if (row.TASK_PERSON_TYPE_ == "") {
						this.$message.warning("请选择人员类型");
						return;
					}
					if (row.START_DATE_ == "" || row.END_DATE_ == "") {
						this.$message.warning("请填写日期");
						return;
					}
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertTaskPerson.do',
						data: {
							TASK_ID_: TASK_ID_,
							EMP_ID_: that.taskPersonList[index].EMP_ID_,
							TASK_PERSON_TYPE_: row.TASK_PERSON_TYPE_,
							START_DATE_: mutils.formatDate(new Date(row.START_DATE_)),
							END_DATE_: mutils.formatDate(new Date(row.END_DATE_))
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
							let taskPerson = res.data.taskPerson;
							that.$set(that.taskPersonList[index], 'editing', false);

							that.$set(that.taskPersonList[index], 'TASK_PERSON_ID_', taskPerson.TASK_PERSON_ID_);
							that.$set(that.taskPersonList[index], 'EMP_ID_', taskPerson.EMP_ID_);
							that.$set(that.taskPersonList[index], 'START_DATE_', taskPerson.START_DATE_);
							that.$set(that.taskPersonList[index], 'END_DATE_', taskPerson.END_DATE_);
							that.$set(that.taskPersonList[index], 'TASK_PERSON_TYPE_', taskPerson.TASK_PERSON_TYPE_);
							that.$set(that.taskPersonList[index], 'TASK_PERSON_TYPE_NAME_', that.taskPersonTypeCodeMapList[taskPerson.TASK_PERSON_TYPE_]);

							that.$message.success("添加成功");
							that.taskList[that.taskTable.currentRow.index].TASK_STATUS_ = taskPerson.TASK_STATUS_;
							that.taskList[that.taskTable.currentRow.index].TASK_STATUS_DESC_ = that.taskTable.taskStatusCodeMapList[taskPerson.TASK_STATUS_];
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})


				} else {
					let that = this;
					if (that.taskPersonList[index].EMP_ID_ == "") {
						this.$message.warning("请选择人员");
						return;
					}
					if (row.TASK_PERSON_TYPE_ == "") {
						this.$message.warning("请选择人员类型");
						return;
					}
					if (row.START_DATE_ == "" || row.END_DATE_ == "") {
						this.$message.warning("请填写日期");
						return;
					}
					axios({
						method: 'POST',
						url: this.baseUrl + 'updateTaskPerson.do',
						data: {
							TASK_PERSON_ID_: row.TASK_PERSON_ID_,
							EMP_ID_: that.taskPersonList[index].EMP_ID_,
							TASK_PERSON_TYPE_: row.TASK_PERSON_TYPE_,
							START_DATE_: mutils.formatDate(new Date(row.START_DATE_)),
							END_DATE_: mutils.formatDate(new Date(row.END_DATE_))
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
							let taskPerson = res.data.taskPerson;
							that.$set(that.taskPersonList[index], 'editing', false);
							that.$set(that.taskPersonList[index], 'TASK_PERSON_ID_', taskPerson.TASK_PERSON_ID_);
							that.$set(that.taskPersonList[index], 'EMP_ID_', taskPerson.EMP_ID_);
							that.$set(that.taskPersonList[index], 'START_DATE_', taskPerson.START_DATE_);
							that.$set(that.taskPersonList[index], 'END_DATE_', taskPerson.END_DATE_);
							that.$set(that.taskPersonList[index], 'TASK_PERSON_TYPE_', taskPerson.TASK_PERSON_TYPE_);
							that.$set(that.taskPersonList[index], 'TASK_PERSON_TYPE_NAME_', that.taskPersonTypeCodeMapList[taskPerson.TASK_PERSON_TYPE_]);

							that.$message.success("修改成功");
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				}
			},
			//新增人员的删除按钮
			_deleteTaskPerson(index, row) {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteTaskPerson.do',
						data: {
							TASK_PERSON_ID_: row.TASK_PERSON_ID_
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
							that.$message.success('删除成功');
							that.taskPersonList.splice(index, 1);
							that.taskList[that.taskTable.currentRow.index].TASK_STATUS_ = task.TASK_STATUS_;
							that.taskList[that.taskTable.currentRow.index].TASK_STATUS_DESC_ = that.taskTable.taskStatusCodeMapList[task.TASK_STATUS_];
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			},
			//取消
			_cancelTaskPerson(index, row) {
				this.$set(this.taskPersonList[index], 'editing', false);
				if (this.taskPerson.insertOrUpdate) {
					this.taskPersonList.splice(index, 1);
				} else {
					this.taskPersonList[index].EMP_ID_ = this.taskPerson.tempDate.EMP_ID_;
					this.taskPersonList[index].EMP_NAME_ = this.taskPerson.tempDate.EMP_NAME_;
					this.taskPersonList[index].START_DATE_ = this.taskPerson.tempDate.START_DATE_;
					this.taskPersonList[index].END_DATE_ = this.taskPerson.tempDate.END_DATE_;
				}
			},
			rowClassNameHandler({row, rowIndex}) {
				let className = 'pid-' + row.PARENT_MODULE_ID_;
				if (
					row.PARENT_MODULE_ID_ !== null &&
					(row['visible'] !== true || row['hiddenByCategory'] === true)
				) {
					className += ' hiddenRow'
				}

				if (row.MODULE_STATUS_ == '9') {
					className += ' moduleTreeRowClass9';
				} else if (row.MODULE_STATUS_ == '1') {
					className += ' moduleTreeRowClass1';
				}

				return className
			},
			//模块按钮状态
			_setModuleButtonStatus(MODULE_STATUS_) {
				if (MODULE_STATUS_ != '' && MODULE_STATUS_ != null && MODULE_STATUS_ != 'undefined') {
					if (MODULE_STATUS_ == '9') {
						this.BUTTON_STATUS._preUpdateModule = true;
						this.BUTTON_STATUS._completeModule = true;
						this.BUTTON_STATUS._deleteModule = true;
					} else {
						this.BUTTON_STATUS._preUpdateModule = false;
						this.BUTTON_STATUS._completeModule = false;
						this.BUTTON_STATUS._deleteModule = false;
					}
					this.BUTTON_STATUS.preInsertSubModule = false;
					this.BUTTON_STATUS._updateModuleStatus = false;
					this.BUTTON_STATUS._moveModule = false;
				} else {
					this.BUTTON_STATUS.preInsertSubModule = true;
					this.BUTTON_STATUS._updateModuleStatus = true;
					this.BUTTON_STATUS._moveModule = true;
					this.BUTTON_STATUS._preUpdateModule = true;
					this.BUTTON_STATUS._completeModule = true;
					this.BUTTON_STATUS._deleteModule = true;
				}

			},
			clickModuleRow(row, column) {
				this.moduleTree.multipleSelection = row;
				this.moduleTree.moduleList.forEach((r, i) => {
					if (r.MODULE_ID_ == row.MODULE_ID_) {
						this.moduleTree.numbers = i;
					}
				});

				this.taskloading = true;
				this._setModuleButtonStatus(row.MODULE_STATUS_);

				this.BUTTON_STATUS.preInsertTask = false;
				this.BUTTON_STATUS._preUpdateTask = true;
				this.BUTTON_STATUS._completeTask = true;
				this.BUTTON_STATUS._deleteTask = true;
				this.BUTTON_STATUS.insertTaskPerson = true;

				let that = this;
				this.module_id = row.MODULE_ID_;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectTask.do',
					data: {
						MODULE_ID_: row.MODULE_ID_
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
								task_level_: that.taskLevelCodeMapList[taskList[i].TASK_LEVEL_],
								TASK_STATUS_: taskList[i].TASK_STATUS_,
								TASK_STATUS_DESC_: that.taskTable.taskStatusCodeMapList[taskList[i].TASK_STATUS_],
							};
							that.taskList.push(tableItem);
						}
						that.taskloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.taskloading = false;
				})
			},
			moduleTreeHeaderRowStyle(row, index) {
				return 'font-size : 12px;back'
			},
			onExpand(row) {
				let that = this
				let isShowChildren = !row['showChildren']
				row['showChildren'] = isShowChildren
				that._loadAllSubItems(row, true, isShowChildren)
			},
			_loadAllSubItems(item, isFirstLevlChildren, isShowChilren) {
				let that = this
				let dataArray = []
				for (let i = 0; i < that.moduleTree.moduleList.length; i++) {
					let tempItem = that.moduleTree.moduleList[i]
					if (tempItem.PARENT_MODULE_ID_ === item.MODULE_ID_) {
						if (isFirstLevlChildren) {
							tempItem['visible'] = !tempItem['visible']
						}
						tempItem['hiddenByCategory'] = !isShowChilren;

						dataArray.push(tempItem);
						let subItemArray = that._loadAllSubItems(
							tempItem,
							false,
							isShowChilren
						)
						dataArray = dataArray.concat(subItemArray)
					}
				}
				return dataArray
			},
            //点击移动按钮
			_moveModule(){
				let that =this;
				this.chooseModuleDialog.show = true;
				this.chooseModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_module_ref.moduleQueryForm.PROJECT_ID_ = that.projectPersonAllotForm.PROJECT_ID_;
					this.$refs.choose_module_ref.moduleQueryForm.MODULE_ID_ = that.module_id;
					this.$refs.choose_module_ref.getList();
					this.$refs.choose_module_ref.getModuleId();
				})
            },
			closeChooseModuleDialog(){
				this.chooseModuleDialog.dialogVisible = false;
            },
			_completeChooseModule(){
				this.chooseModuleDialog.show = false;
				this.selectModule();
            }

		}

	}
</script>
<style scoped lang="less">
    .moduleTreeDiv {
        .hiddenRow {
            display: none;
        }
    }

    .moduleTreeHearder {
        font-size: 12px;
    }

    .moduleDateClass {
        font-size: 10px;
    }

</style>

<style lang="less">

    .moduleTreeRowClass1 {
        background-color: #FFC0CB !important;
    }

    .moduleTreeRowClass9 {
        background-color: #FFF0F5 !important;
    }

    .moduleStatusDialogClass {
        border: 1px solid red;
    }

    .currentStyleColor2 .el-table {

        //去掉table的border start----------------------------
        border: 0;
        th,
        tr,
        td {
            border: 0;
            // background-color: #fff;
        }
        &::before {
            height: 0px;
        }
        &::after {
            width: 0;
        }

        .el-table__fixed:before {
            height: 0;
        }
        //去掉table的border end----------------------------
    }

</style>
