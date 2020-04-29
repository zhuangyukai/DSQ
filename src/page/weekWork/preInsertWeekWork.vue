<template>
    <div>
        <div>
            <el-form
                    ref="insertWeekWorkForm"
                    :model="insertWeekWorkForm"
                    style="margin:10px;width:auto; "
                    v-loading="insertWeekWorkFormLoading"
            >
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="周工作报告" name="weekWork">
                        <el-form-item prop='WEEK_WORK_ID_' label="周工作报告id:" style="display: none">
                            <el-input v-model="insertWeekWorkForm.WEEK_WORK_ID_"></el-input>
                        </el-form-item>
                        <el-form-item prop='DEPT_NAME_' label="部门:" label-width="11.65%"
                                      :rules="[{ required: true, message: '部门名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertWeekWorkForm.DEPT_NAME_" style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='DEPT_MANAGER_NAME_' label="部门负责人:" label-width="11.65%"
                                      :rules="[{ required: true, message: '部门负责人不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertWeekWorkForm.DEPT_MANAGER_NAME_" style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='POSI_NAME_' label="岗位名称:" label-width="11.65%"
                                      :rules="[{ required: true, message: '岗位名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertWeekWorkForm.POSI_NAME_" style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='WEEK_' label="本周时间:" label-width="11.65%"
                                      :rules="[{ required: true, message: '请选择那一周' ,trigger: 'blur' }]">
                            <el-date-picker
                                    v-model="insertWeekWorkForm.WEEK_"
                                    type="week"
                                    name="WEEK_"
                                    format="yyyy 第 WW 周"
                                    placeholder="选择周"
                                    @change="onChangeWeek"
                            >
                            </el-date-picker>
                            <span style="color: #BEBEBE; font-size: 12px">周一{{insertWeekWorkForm.WEEK_START_DATE_}}  至  周日{{insertWeekWorkForm.WEEK_END_DATE_}}</span>
                        </el-form-item>
                        <el-form-item style="display: none" prop='WEEK_START_DATE_' label="本周开始时间:"
                                      :rules="[{ required: true, message: '本周开始时间不能为空' ,trigger: 'blur' }]">
                            <el-date-picker type="date" value-format="yyyy-MM-dd"
                                            v-model.date="insertWeekWorkForm.WEEK_START_DATE_"
                                            :picker-options="pickerStartDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item style="display: none" prop='WEEK_END_DATE_' label="本周结束时间:"
                                      :rules="[{ required: true, message: '本周结束时间不能为空' ,trigger: 'blur' }]">
                            <el-date-picker type="date" value-format="yyyy-MM-dd"
                                            v-model.date="insertWeekWorkForm.WEEK_END_DATE_"
                                            :picker-options="pickerEndDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop='POSI_RESP_' label="岗位职责:" label-width="11.65%">
                            <el-input type="textarea" v-model="insertWeekWorkForm.POSI_RESP_"
                                      style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item prop='SELF_EVALUATION_' label="自评综述:" label-width="11.65%">
                            <el-input type="textarea" v-model="insertWeekWorkForm.SELF_EVALUATION_"
                                      style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item prop='PROPOSAL_' label="合理化建议:" label-width="11.65%">
                            <el-input type="textarea" v-model="insertWeekWorkForm.PROPOSAL_"
                                      style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item class="text_right">
                            <el-button type="primary" @click='onSaveWeekWork("insertWeekWorkForm")'>保 存</el-button>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="周工作内容" name="weekWorkContent" :disabled="openDisabled">
                        <el-form
                                :model="insertWeekWorkContentForm"
                                :inline="true"
                                ref="insertWeekWorkContentForm">
                            <el-row v-for="(item,index) in insertWeekWorkContentForm.insertWeekWorkContentList"
                                    :key="index">
                                <el-form-item label="项目编码" label-width="78px"
                                              :prop="'insertWeekWorkContentList.' + index + '.PROJECT_CODE_'"
                                              style="display: none">
                                    <el-input v-model="item.PROJECT_CODE_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="项目名称"
                                              :prop="'insertWeekWorkContentList.' + index + '.PROJECT_NAME_'"
                                              :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROJECT_NAME_"
                                              @focus="_preChooseWeekWorkContentProject(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-form-item label="任务进度" :prop="'insertWeekWorkContentList.' + index + '.PROGRESS_'"
                                              :rules="[{ required: true, message: '任务进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROGRESS_" style="width: 180px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="开始时间" :prop="'insertWeekWorkContentList.' + index + '.START_DATE_'"
                                              :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" :prop="'insertWeekWorkContentList.' + index + '.END_DATE_'"
                                              :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="工作内容" label-width="78px"
                                              :prop="'insertWeekWorkContentList.' + index + '.CONTENT_'">
                                    <el-input type="textarea" v-model="item.CONTENT_"
                                              style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="备注" label-width="78px"
                                              :prop="'insertWeekWorkContentList.' + index + '.MEMO_'">
                                    <el-input type="textarea" v-model="item.MEMO_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeWeekWorkContentRow(index)">移 除
                                        </el-button>
                                    </template>
                                </el-form-item>
                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addWeekWorkContentRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveWeekWorkContent("insertWeekWorkContentForm")'>保 存
                                    </el-button>
                                </el-form-item>
                            </el-row>

                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="下周工作内容" name="nextWeekWorkContent" :disabled="openDisabled">
                        <el-form
                                :model="insertNextWeekWorkContentForm"
                                :inline="true"
                                ref="insertNextWeekWorkContentForm">
                            <el-row v-for="(item,index) in insertNextWeekWorkContentForm.insertNextWeekWorkContentList"
                                    :key="index">
                                <el-form-item label="项目名称"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.PROJECT_NAME_'"
                                              :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROJECT_NAME_"
                                              @focus="_preChooseNextWeekWorkContentProject(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-table-column
                                        :prop="'insertNextWeekWorkContentList.' + index + '.PROJECT_ID_'"
                                        style="display: none"
                                        label="项目ID"
                                        align='center'
                                        width="200"
                                        sortable>
                                </el-table-column>
                                <el-form-item label="功能模块"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.MODULAR_'"
                                              :rules="[{ required: true, message: '功能模块不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.MODULAR_"
                                              @focus="_preChooseNextWeekWorkContentModule(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-table-column
                                        :prop="'insertNextWeekWorkContentList.' + index + '.MODULE_ID_'"
                                        style="display: none"
                                        label="模块ID"
                                        align='center'
                                        width="200"
                                        sortable>
                                </el-table-column>
                                <el-form-item label="任务" :prop="'insertNextWeekWorkContentList.' + index + '.TASK_'"
                                              :rules="[{ required: true, message: '任务不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TASK_"
                                              style="width:180px"></el-input>
                                </el-form-item>
                                <el-form-item label="开始时间"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.START_DATE_'"
                                              :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.END_DATE_'"
                                              :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="目前进度"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.CURRENT_PROGRESS_'"
                                              :rules="[{ required: true, message: '目前进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.CURRENT_PROGRESS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="目标进度"
                                              :prop="'insertNextWeekWorkContentList.' + index + '.TARGET_PROGRESS_'"
                                              :rules="[{ required: true, message: '目标进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TARGET_PROGRESS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeNextWeekWorkContentRow(index)">移 除
                                        </el-button>
                                    </template>
                                </el-form-item>
                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addNextWeekWorkContentRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveNextWeekWorkContent("insertNextWeekWorkContentForm")'>保 存
                                    </el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="上级交办的其他工作" name="weekWorkOther" :disabled="openDisabled">
                        <el-form
                                :model="insertWeekWorkOtherForm"
                                :inline="true"
                                ref="insertWeekWorkOtherForm">
                            <el-row v-for="(item,index) in insertWeekWorkOtherForm.insertWeekWorkOtherList"
                                    :key="index">
                                <el-form-item label="代办事项" :prop="'insertWeekWorkOtherList.' + index + '.TODO_WORK_'"
                                              :rules="[{ required: true, message: '代办事项不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TODO_WORK_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="进展情况" :prop="'insertWeekWorkOtherList.' + index + '.PROGRESS_'"
                                              :rules="[{ required: true, message: '进展情况不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROGRESS_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="其他参与人"
                                              :prop="'insertWeekWorkOtherList.' + index + '.OTHER_PARTICIPANT_'">
                                    <el-input v-model="item.OTHER_PARTICIPANT_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="开始时间" :prop="'insertWeekWorkOtherList.' + index + '.START_DATE_'"
                                              :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" :prop="'insertWeekWorkOtherList.' + index + '.END_DATE_'"
                                              :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="参与事项"
                                              :prop="'insertWeekWorkOtherList.' + index + '.PARTICIPATION_MATTERS_'"
                                              :rules="[{ required: true, message: '参与事项不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PARTICIPATION_MATTERS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="备注" label-width="78px"
                                              :prop="'insertWeekWorkOtherList.' + index + '.MEMO_'">
                                    <el-input v-model="item.MEMO_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeWeekWorkOtherRow(index)">移 除</el-button>
                                    </template>
                                </el-form-item>

                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addWeekWorkOtherRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveWeekWorkOther("insertWeekWorkOtherForm")'>保 存
                                    </el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-tab-pane>

                </el-tabs>
            </el-form>

            <!--本周选择项目-->
            <el-dialog
                    :title="chooseProjectDialog.title"
                    :visible.sync="chooseProjectDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseProjectDialog.style"
                    :width="chooseProjectDialog.width"
            >
                <template>
                    <chooseProjectCom ref="choose_project_ref" v-if="chooseProjectDialog.dialogVisible"
                                      @chooseProjectListeners="_completeChooseWeekWorkContentProject">
                    </chooseProjectCom>
                </template>
            </el-dialog>

            <!--下周选择项目-->
            <el-dialog
                    :title="chooseNextProjectDialog.title"
                    :visible.sync="chooseNextProjectDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseNextProjectDialog.style"
                    :width="chooseNextProjectDialog.width"
            >
                <template>
                    <chooseProjectCom ref="choose_project_ref" v-if="chooseNextProjectDialog.dialogVisible"
                                      @chooseProjectListeners="_completeChooseNextWeekWorkContentProject">
                    </chooseProjectCom>
                </template>
            </el-dialog>

            <!--下周选择模块-->
            <el-dialog
                    :title="chooseModuleDialog.title"
                    :visible.sync="chooseModuleDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="chooseModuleDialog.style"
                    :width="chooseModuleDialog.width"
            >
                <template>
                    <chooseModuleCom ref="choose_module_ref" v-if="chooseModuleDialog.dialogVisible"
                                     @listeners="_completeChooseNextWeekWorkContentModule">
                    </chooseModuleCom>
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
	import chooseProjectCom from '../project/preChooseProject.vue';
	import chooseModuleCom from "../module/preChooseModule.vue";
	import chooseTaskCom from "../task/preChooseTask.vue";

	export default {
		components: {chooseProjectCom, chooseModuleCom, chooseTaskCom},
		data() {
			return {
				activeName: 'weekWork',
				insertWeekWorkFormLoading: false,
				insertWeekWorkForm: {
					WEEK_WORK_ID_: '',
					DEPT_NAME_: '',
					DEPT_MANAGER_NAME_: '',
					POSI_NAME_: '',
					WEEK_START_DATE_: '',
					WEEK_END_DATE_: '',
					POSI_RESP_: '',
					SELF_EVALUATION_: '',
					PROPOSAL_: '',
					WEEK_: ''
				},
				openDisabled: true,
				insertWeekWorkContentForm: {
					insertWeekWorkContentList: [{
						WEEK_WORK_CONTENT_ID_: '',
						SERIAL_: '',
						PROJECT_CODE_: '',
						PROJECT_NAME_: '',
						PROGRESS_: '',
						START_DATE_: '',
						END_DATE_: '',
						CONTENT_: '',
						MEMO_: '',
					}]
				},
				insertNextWeekWorkContentForm: {
					insertNextWeekWorkContentList: [{
						NEXT_WEEK_WORK_CONTENT_ID_: '',
						SERIAL_: '',
						PROJECT_NAME_: '',
						MODULAR_: '',
						TASK_: '',
						START_DATE_: '',
						END_DATE_: '',
						CURRENT_PROGRESS_: '',
						TARGET_PROGRESS_: '',
						PROJECT_ID_: '',
						MODULE_ID_: ''
					}]
				},
				insertWeekWorkOtherForm: {
					insertWeekWorkOtherList: [{
						WEEK_WORK_OTHER_ID_: '',
						SERIAL_: '',
						TODO_WORK_: '',
						PROGRESS_: '',
						START_DATE_: '',
						END_DATE_: '',
						OTHER_PARTICIPANT_: '',
						PARTICIPATION_MATTERS_: '',
						MEMO_: ''
					}]
				},
				week_work_id: '',
				//本周工作打开项目的窗口
				chooseProjectDialog: {
					width: '640px',
					show: false,
					title: '选择项目',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				//下周工作打开项目的窗口
				chooseNextProjectDialog: {
					width: '640px',
					show: false,
					title: '选择项目',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				//下周工作打开模块的窗口
				chooseModuleDialog: {
					width: '640px',
					show: false,
					title: '选择模块',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				//周工作的索引
				weekWorkContentProjectindex: '',
				//下周项目的索引
				nextWeekWorkContentProjectIndex: '',
				//下周模块的索引
				nextWeekWorkContentModuleIndex: '',
				//下周任务的索引
				nextWeekWorkContentTaskIndex: '',
				weekWork: {},
				pickerStartDate: {
					disabledDate: (time) => {
						/*if (this.form.weekEndDate != "") {
							return time.getTime() > Date.now() || time.getTime() > this.form.weekEndDate;
						} else {
							return time.getTime() > Date.now();
						}*/

					}
				},
				pickerEndDate: {
					disabledDate: (time) => {
						return time.getTime() < this.form.weekStartDate;
						//return time.getTime() > this.form.weekStartDate;
					}
				},

			}
		},
		methods: {
			onChangeWeek(date) {
				this.insertWeekWorkForm.WEEK_START_DATE_ = mutils.formatDate(date).substring(0, 10);
				this.insertWeekWorkForm.WEEK_END_DATE_ = mutils.formatDate(new Date(new Date(date).setDate(date.getDate() + 6))).substring(0, 10);
			},
			//初始化周工作报告
			setInsertWeekWorkForm() {
				this.openDisabled = true;
				this.activeName = 'weekWork';
				this.insertWeekWorkFormLoading = true;
				this.insertWeekWorkForm.WEEK_WORK_ID_ = '';
				this.insertWeekWorkForm.SELF_EVALUATION_ = '';
				this.insertWeekWorkForm.PROPOSAL_ = '';
				const formdata = this.insertWeekWorkForm;
				let userinfo = mutils.getStore('userinfo')
				let poseEmpId = userinfo.posiEmpId

				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadPosiEmpManager.do?POSI_EMP_ID_=' + poseEmpId + ''
				).then(function (res) {
					if (res.data.success) {
						formdata.DEPT_NAME_ = res.data.managerInfo.ORG_NAME_;
						formdata.DEPT_MANAGER_NAME_ = res.data.managerInfo.EMP_NAME_;
						formdata.POSI_NAME_ = userinfo.posiName;
						formdata.WEEK_START_DATE_ = mutils.formatDate(new Date(m_time)).substring(0, 10);
						formdata.WEEK_END_DATE_ = mutils.formatDate(new Date(m_time + oneDayLong * 6)).substring(0, 10);
						formdata.POSI_RESP_ = res.data.managerInfo.ONESELF_POSI_MEMO_;
						formdata.WEEK_ = new Date();
						that.insertWeekWorkFormLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎')
					that.insertWeekWorkFormLoading = false;
				});
			},
			//初始化周工作内容
			setInsertWeekWorkContentForm() {
				let that = this;
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				this.$ajax.post(
					this.baseUrl + 'selectDaily.do?FROM_DAILY_DATE_=' + mutils.formatDate(new Date(this.weekWork.WEEK_START_DATE_)) + '&TO_DAILY_DATE_=' + mutils.formatDate(new Date(this.weekWork.WEEK_END_DATE_)) + '&DRAFTOR_ID_=' + EMP_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let dailyList = res.data.dailyList;
						if (dailyList.length == 0) {
							that.insertWeekWorkContentForm.insertWeekWorkContentList = [{
								WEEK_WORK_CONTENT_ID_: '',
								SERIAL_: 1,
								PROJECT_CODE_: '',
								PROJECT_NAME_: '',
								CONTENT_: '',
								START_DATE_: that.weekWork.WEEK_START_DATE_,
								END_DATE_: that.weekWork.WEEK_END_DATE_,
								PROGRESS_: '',
								MEMO_: ''
							}]
						} else {
							let projectArr = [];
							let obj = {}
							for (let i = 0; i < dailyList.length; i++) {
								if (!obj[dailyList[i].PROJECT_ID_]) {
									projectArr.push({
										'PROJECT_ID_': dailyList[i].PROJECT_ID_,
										'PROJECT_NAME_': dailyList[i].PROJECT_NAME_,
										'FINISHED_WORK_': ''
									})
									obj[dailyList[i].PROJECT_ID_] = 1
								}
							}
							for (let i = 0; i < projectArr.length; i++) {
								if (i != 0) {
									that.addWeekWorkContentRow();
								}
								let index = 1;
								for (let j = 0; j < dailyList.length; j++) {
										if(projectArr[i].PROJECT_ID_ == dailyList[j].PROJECT_ID_){
											if(dailyList[j].FINISHED_WORK_ != ''){
												if(index == 1){
													projectArr[i].FINISHED_WORK_ = index + '. ' + dailyList[j].FINISHED_WORK_
												}else{
													projectArr[i].FINISHED_WORK_ += ("\n" + index + '. ' + dailyList[j].FINISHED_WORK_ )
												}
												index++;
                                            }
										}
								}
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].WEEK_WORK_CONTENT_ID_ = '';
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROJECT_CODE_ = projectArr[i].PROJECT_CODE_;
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROJECT_NAME_ = projectArr[i].PROJECT_NAME_;
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].START_DATE_ = that.weekWork.WEEK_START_DATE_;
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].END_DATE_ = that.weekWork.WEEK_END_DATE_;
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].CONTENT_ = projectArr[i].FINISHED_WORK_;
								that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROGRESS_ = '';
							}
							// for (let i = 0; i < dailyList.length; i++) {
							// 	if (i != 0) {
							// 		that.addWeekWorkContentRow();
							// 	}
							// 	let a = dailyList[i].FINISHED_WORK_.split("$^$");
							// 	console.log(dailyList[i].FINISHED_WORK_);
							// 	console.log(a);
							// 	let b = '';
							// 	for (let j = 0; j < a.length; j++) {
							// 		if (j == 0) {
							// 			b += "1." + a[j];
							// 		} else {
							// 			b += ("\n" + (j + 1) + "." + a[j]);
							// 		}
							// 	}
							// 	console.log(b);
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].WEEK_WORK_CONTENT_ID_ = '';
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROJECT_CODE_ = dailyList[i].PROJECT_CODE_;
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROJECT_NAME_ = dailyList[i].PROJECT_NAME_;
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].START_DATE_ = that.weekWork.WEEK_START_DATE_;
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].END_DATE_ = that.weekWork.WEEK_END_DATE_;
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].CONTENT_ = b;
							// 	that.insertWeekWorkContentForm.insertWeekWorkContentList[i].PROGRESS_ = '';
							// }
						}

					} else {
						/*请求失败*/
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
				});

			},
			//初始化下周工作内容
			setInsertNextWeekWorkContentForm() {
				let nowStartTemp = new Date(this.weekWork.WEEK_START_DATE_);//当前时间
				let oneStartDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_start_time = nowStartTemp.getTime();//当前时间的毫秒时间
				let c_start_day = nowStartTemp.getDay() || 7;//当前时间的星期几
				let m_start_time = c_start_time - (c_start_day - 1) * oneStartDayLong;//当前周一的毫秒时间

				let nowEndTemp = new Date(this.weekWork.WEEK_END_DATE_);//当前时间
				let oneEndDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_end_time = nowEndTemp.getTime();//当前时间的毫秒时间
				let c_end_day = nowEndTemp.getDay() || 7;//当前时间的星期几
				let m_end_time = c_end_time - (c_end_day - 1) * oneEndDayLong;//当前周一的毫秒时间

				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList = [{
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					SERIAL_: 1,
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					START_DATE_: new Date(m_start_time + oneStartDayLong * 7),
					END_DATE_: new Date(m_end_time + oneEndDayLong * 13),
					CURRENT_PROGRESS_: '',
					TARGET_PROGRESS_: '',
					PROJECT_ID_: '',
					MODULE_ID_: ''
				}]
			},
			//初始化上级交办的其他工作
			setInsertWeekWorkOtherForm() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				this.insertWeekWorkOtherForm.insertWeekWorkOtherList = [{
					WEEK_WORK_OTHER_ID_: '',
					SERIAL_: 1,
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: new Date(this.weekWork.WEEK_START_DATE_),
					END_DATE_: new Date(this.weekWork.WEEK_END_DATE_),
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				}]
			},
			//点击周工作报告保存
			onSaveWeekWork(insertWeekWorkForm) {
				this.$refs[insertWeekWorkForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertWeekWorkForm];
						let data = {};

						for (var i in formData) {
							data.weekWorkId = formData['WEEK_WORK_ID_'];
							data.deptName = formData['DEPT_NAME_']
							data.deptManagerName = formData['DEPT_MANAGER_NAME_']
							data.posiName = formData['POSI_NAME_']
							if (mutils.isEmpty(formData['WEEK_START_DATE_'])) {
								data.weekStartDate = "";
							} else {
								data.weekStartDate = mutils.formatDate(new Date(formData['WEEK_START_DATE_'])); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData['WEEK_END_DATE_'])) {
								data.weekEndDate = "";
							} else {
								data.weekEndDate = mutils.formatDate(new Date(formData['WEEK_END_DATE_']));
							}
							data.posiResp = formData['POSI_RESP_']
							data.selfEvaluation = formData['SELF_EVALUATION_']
							data.proposal = formData['PROPOSAL_'];
							data.WEEK_ = formData['WEEK_'];
						}
						if (formData['WEEK_WORK_ID_'] != "") {
							this.editWeekWork(data)
						} else {
							this.addWeekWork(data)
						}

					}
				})
			},
			//新增周工作报告
			addWeekWork(data) {
				let userinfo = mutils.getStore('userinfo');
				let DRAFTOR_ID_ = userinfo.empId;
				let DRAFTOR_NAME_ = userinfo.username;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'insertWeekWorkNew.do',
					data: {
						DEPT_NAME_: data.deptName,
						DEPT_MANAGER_NAME_: data.deptManagerName,
						POSI_NAME_: data.posiName,
						POSI_RESP_: data.posiResp,
						WEEK_START_DATE_: data.weekStartDate,
						WEEK_END_DATE_: data.weekEndDate,
						DRAFTOR_ID_: DRAFTOR_ID_,
						DRAFTOR_NAME_: DRAFTOR_NAME_,
						SELF_EVALUATION_: data.selfEvaluation,
						PROPOSAL_: data.proposal,
						WEEK_: document.getElementsByName('WEEK_')[0].value
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
						that.insertWeekWorkForm.WEEK_WORK_ID_ = res.data.weekWork.WEEK_WORK_ID_;
						that.openDisabled = false;
						let returnValue = res.data.weekWork;
						that.weekWork = res.data.weekWork;
						that.setInsertWeekWorkContentForm();
						that.setInsertNextWeekWorkContentForm();
						that.setInsertWeekWorkOtherForm();
						that.week_work_id = returnValue.WEEK_WORK_ID_;
						that.$emit('insertWeekWorkListeners', returnValue);
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('新增失败请重试')
				})
			},
			//修改周工作报告
			editWeekWork(data) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkNew.do',
					data: {
						WEEK_WORK_ID_: data.weekWorkId,
						DEPT_NAME_: data.deptName,
						DEPT_MANAGER_NAME_: data.deptManagerName,
						POSI_NAME_: data.posiName,
						POSI_RESP_: data.posiResp,
						WEEK_START_DATE_: data.weekStartDate,
						WEEK_END_DATE_: data.weekEndDate,
						SELF_EVALUATION_: data.selfEvaluation,
						PROPOSAL_: data.proposal
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
						that.openDisabled = false;
						let returnValue = res.data.weekWork;
						that.$emit('insertUpdateWeekWorkListeners', returnValue);
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('修改失败请重试')
				})

			},
			//点击新增周工作内容
			addWeekWorkContentRow() {
				let that = this;
				this.insertWeekWorkContentForm.insertWeekWorkContentList.push({
					WEEK_WORK_CONTENT_ID_: '',
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					PROGRESS_: '',
					START_DATE_: new Date(that.weekWork.WEEK_START_DATE_),
					END_DATE_: new Date(that.weekWork.WEEK_END_DATE_),
					CONTENT_: '',
					MEMO_: '',
				})
			},
			//点击移除周工作内容
			removeWeekWorkContentRow(index) {
				if (this.insertWeekWorkContentForm.insertWeekWorkContentList.length > 1) {
					this.insertWeekWorkContentForm.insertWeekWorkContentList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//点击新增下周工作内容
			addNextWeekWorkContentRow() {
				let nowStartTemp = new Date(this.weekWork.WEEK_START_DATE_);//当前时间
				let oneStartDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_start_time = nowStartTemp.getTime();//当前时间的毫秒时间
				let c_start_day = nowStartTemp.getDay() || 7;//当前时间的星期几
				let m_start_time = c_start_time - (c_start_day - 1) * oneStartDayLong;//当前周一的毫秒时间

				let nowEndTemp = new Date(this.weekWork.WEEK_END_DATE_);//当前时间
				let oneEndDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_end_time = nowEndTemp.getTime();//当前时间的毫秒时间
				let c_end_day = nowEndTemp.getDay() || 7;//当前时间的星期几
				let m_end_time = c_end_time - (c_end_day - 1) * oneEndDayLong;//当前周一的毫秒时间

				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList.push({
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					START_DATE_: new Date(m_start_time + oneStartDayLong * 7),
					END_DATE_: new Date(m_end_time + oneEndDayLong * 13),
					CURRENT_PROGRESS_: '',
					TARGET_PROGRESS_: '',
					PROJECT_ID_: '',
					MODULE_ID_: ''
				})

			},
			//点击移除下周工作内容
			removeNextWeekWorkContentRow(index) {
				if (this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList.length > 1) {
					this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//点击新增上级交办的其他任务
			addWeekWorkOtherRow() {
				let that = this;
				this.insertWeekWorkOtherForm.insertWeekWorkOtherList.push({
					WEEK_WORK_OTHER_ID_: '',
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: new Date(that.weekWork.WEEK_START_DATE_),
					END_DATE_: new Date(that.weekWork.WEEK_END_DATE_),
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				})
			},
			//点击移除上级交办的其他任务
			removeWeekWorkOtherRow(index) {
				if (this.insertWeekWorkOtherForm.insertWeekWorkOtherList.length > 1) {
					this.insertWeekWorkOtherForm.insertWeekWorkOtherList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//周工作内容选择项目
			_preChooseWeekWorkContentProject(index) {
				this.weekWorkContentProjectindex = index;
				this.chooseProjectDialog.show = true;
			},
			//本周赋项目
			_completeChooseWeekWorkContentProject(returnValue) {
				this.chooseProjectDialog.show = false;
				this.insertWeekWorkContentForm.insertWeekWorkContentList[this.weekWorkContentProjectindex].PROJECT_CODE_ = returnValue.PROJECT_CODE_;
				this.insertWeekWorkContentForm.insertWeekWorkContentList[this.weekWorkContentProjectindex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
			},
			//保存周工作内容
			onSaveWeekWorkContent(insertWeekWorkContentForm) {
				this.$refs[insertWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertWeekWorkContentForm].insertWeekWorkContentList;

						let serialList = new Array();
						let projectCodeList = new Array();
						let projectNameList = new Array();
						let progressList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let contentList = new Array();
						let memoList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							projectCodeList.push({
								PROJECT_CODE_: formData[i].PROJECT_CODE_
							});
							projectNameList.push({
								PROJECT_NAME_: formData[i].PROJECT_NAME_
							});
							progressList.push({
								PROGRESS_: formData[i].PROGRESS_
							});
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								startDateList.push(null);
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].START_DATE_))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								endDateList.push(null);
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							contentList.push({
								CONTENT_: formData[i].CONTENT_
							});
							memoList.push({
								MEMO_: formData[i].MEMO_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateWeekWorkContentNew.do',
							data: {
								WEEK_WORK_ID_: that.week_work_id,
								SERIAL_LIST: serialList,
								PROJECT_CODE_LIST: JSON.stringify(projectCodeList),
								PROJECT_NAME_LIST: JSON.stringify(projectNameList),
								PROGRESS_LIST: JSON.stringify(progressList),
								START_DATE_LIST: startDateList,
								END_DATE_LIST: endDateList,
								CONTENT_LIST: JSON.stringify(contentList),
								MEMO_LIST: JSON.stringify(memoList)
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
								that.$message.success('保存成功');
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('保存失败请重试')
						})

					}
				})
			},
			//下周工作内容选择项目
			_preChooseNextWeekWorkContentProject(index) {
				this.nextWeekWorkContentProjectIndex = index;
				this.chooseNextProjectDialog.show = true;
			},
			//下周赋项目
			_completeChooseNextWeekWorkContentProject(returnValue) {
				this.chooseNextProjectDialog.show = false;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_ID_ = returnValue.PROJECT_ID_;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULE_ID_ = "";
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULAR_ = "";
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].TASK_ = "";
			},
			//下周工作选择模块
			_preChooseNextWeekWorkContentModule(index) {
				this.nextWeekWorkContentModuleIndex = index;
				if (this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].PROJECT_NAME_ == "") {
					this.$message.warning("请先完成选择项目");
					return;
				}
				this.chooseModuleDialog.show = true;
				this.chooseModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_module_ref.moduleQueryForm.PROJECT_ID_ = this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_ID_;
					this.$refs.choose_module_ref.getList();
				})
			},
			//赋模块
			_completeChooseNextWeekWorkContentModule(returnValue) {
				this.chooseModuleDialog.show = false;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULE_ID_ = returnValue.MODULE_ID_;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULAR_ = returnValue.MODULE_NAME_;
				this.insertNextWeekWorkContentForm.insertNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].TASK_ = "";
			},
			//保存下周工作
			onSaveNextWeekWorkContent(insertNextWeekWorkContentForm) {
				this.$refs[insertNextWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertNextWeekWorkContentForm].insertNextWeekWorkContentList;

						let serialList = new Array();
						let projectNameList = new Array();
						let modularList = new Array();
						let taskList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let currentProgressList = new Array();
						let targetProgressList = new Array();
						let projectIdList = new Array();
						let moduleIdList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							projectNameList.push({
								PROJECT_NAME_: formData[i].PROJECT_NAME_
							});
							modularList.push({
								MODULAR_: formData[i].MODULAR_
							});
							taskList.push({
								TASK_: formData[i].TASK_
							})
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].START_DATE_))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							currentProgressList.push({
								CURRENT_PROGRESS_: formData[i].CURRENT_PROGRESS_
							});
							targetProgressList.push({
								TARGET_PROGRESS_: formData[i].TARGET_PROGRESS_
							});
							projectIdList.push({
								PROJECT_ID_: formData[i].PROJECT_ID_
							});
							moduleIdList.push({
								MODULE_ID_: formData[i].MODULE_ID_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateNextWeekWorkContentNew.do',
							data: {
								WEEK_WORK_ID_: that.week_work_id,
								SERIAL_LIST: serialList,
								PROJECT_NAME_LIST: JSON.stringify(projectNameList),
								MODULAR_LIST: JSON.stringify(modularList),
								TASK_LIST: JSON.stringify(taskList),
								START_DATE_LIST: startDateList,
								END_DATE_LIST: endDateList,
								CURRENT_PROGRESS_LIST: JSON.stringify(currentProgressList),
								TARGET_PROGRESS_LIST: JSON.stringify(targetProgressList),
								PROJECT_ID_LIST: JSON.stringify(projectIdList),
								MODULE_ID_LIST: JSON.stringify(moduleIdList)
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
								that.$message.success('保存成功');
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('保存失败请重试')
						})

					}
				})
			},
			//保存上级的其他工作
			onSaveWeekWorkOther(insertWeekWorkOtherForm) {
				this.$refs[insertWeekWorkOtherForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertWeekWorkOtherForm].insertWeekWorkOtherList;

						let serialList = new Array();
						let todoWorkList = new Array();
						let progressList = new Array();
						let otherParticipantList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let participationMattersList = new Array();
						let memoList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							todoWorkList.push({
								TODO_WORK_: formData[i].TODO_WORK_
							});
							progressList.push({
								PROGRESS_: formData[i].PROGRESS_
							});
							otherParticipantList.push({
								OTHER_PARTICIPANT_: formData[i].OTHER_PARTICIPANT_
							})
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].START_DATE_))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							participationMattersList.push({
								PARTICIPATION_MATTERS_: formData[i].PARTICIPATION_MATTERS_
							});
							memoList.push({
								MEMO_: formData[i].MEMO_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateWeekWorkOtherNew.do',
							data: {
								WEEK_WORK_ID_: that.week_work_id,
								TODO_WORK_LIST: JSON.stringify(todoWorkList),
								SERIAL_LIST: serialList,
								PROGRESS_LIST: JSON.stringify(progressList),
								START_DATE_LIST: startDateList,
								END_DATE_LIST: endDateList,
								OTHER_PARTICIPANT_LIST: JSON.stringify(otherParticipantList),
								PARTICIPATION_MATTERS_LIST: JSON.stringify(participationMattersList),
								MEMO_LIST: JSON.stringify(memoList)
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
								that.$message.success('保存成功');
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('保存失败请重试')
						})

					}
				})
			},
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

</style>
