<template>
    <div>
        <div>
            <el-form
                    ref="updateWeekWorkForm"
                    :model="updateWeekWorkForm"
                    style="margin:10px;width:auto; "
                    v-loading= "updateWeekWorkFormLoading"
            >
                <el-tabs v-model="activeName" type="card">
                    <el-tab-pane label="周工作报告" name="weekWork">
                        <el-form-item prop='WEEK_WORK_ID_' label="周工作报告id:" style="display: none">
                            <el-input v-model="updateWeekWorkForm.WEEK_WORK_ID_"></el-input>
                        </el-form-item>
                        <el-form-item prop='DEPT_NAME_' label="部门:" label-width="11.65%" :rules="[{ required: true, message: '部门名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="updateWeekWorkForm.DEPT_NAME_" style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='DEPT_MANAGER_NAME_' label="部门负责人:" label-width="11.65%" :rules="[{ required: true, message: '部门负责人不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="updateWeekWorkForm.DEPT_MANAGER_NAME_" style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='POSI_NAME_' label="岗位名称:" label-width="11.65%" :rules="[{ required: true, message: '岗位名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="updateWeekWorkForm.POSI_NAME_"  style="width: 94.5%"></el-input>
                        </el-form-item>
                        <el-form-item prop='WEEK_' label="本周时间:"  label-width="11.65%" :rules="[{ required: true, message: '请选择那一周' ,trigger: 'blur' }]">
                            <el-date-picker
                                    v-model="updateWeekWorkForm.WEEK_"
                                    type="week"
                                    name="WEEK_"
                                    format="yyyy 第 WW 周"
                                    placeholder="选择周"
                                    @change="onChangeWeek"
                            >
                            </el-date-picker>
                            <span style="color: #BEBEBE; font-size: 12px">周一{{updateWeekWorkForm.WEEK_START_DATE_}}  至  周日{{updateWeekWorkForm.WEEK_END_DATE_}}</span>
                        </el-form-item>
                        <el-form-item style="display: none" prop='WEEK_START_DATE_' label="本周开始时间:"  :rules="[{ required: true, message: '本周开始时间不能为空' ,trigger: 'blur' }]">
                            <el-date-picker type="date" value-format="yyyy-MM-dd-hh-mm-ss" v-model.date="updateWeekWorkForm.WEEK_START_DATE_"
                                            :picker-options="pickerStartDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item style="display: none" prop='WEEK_END_DATE_' label="本周结束时间:" :rules="[{ required: true, message: '本周结束时间不能为空' ,trigger: 'blur' }]">
                            <el-date-picker type="date" value-format="yyyy-MM-dd-hh-mm-ss" v-model.date="updateWeekWorkForm.WEEK_END_DATE_"
                                            :picker-options="pickerEndDate"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop='POSI_RESP_' label="岗位职责:" label-width="11.65%">
                            <el-input type="textarea" v-model="updateWeekWorkForm.POSI_RESP_" style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item prop='SELF_EVALUATION_' label="自评综述:" label-width="11.65%">
                            <el-input type="textarea" v-model="updateWeekWorkForm.SELF_EVALUATION_" style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item prop='PROPOSAL_' label="合理化建议:" label-width="11.65%">
                            <el-input type="textarea" v-model="updateWeekWorkForm.PROPOSAL_" style="width: 94.5%"></el-input>
                        </el-form-item>

                        <el-form-item class="text_right">
                            <el-button type="primary" @click='onSaveWeekWork("updateWeekWorkForm")'>保 存</el-button>
                        </el-form-item>
                    </el-tab-pane>

                    <el-tab-pane label="周工作内容" name="weekWorkContent">
                        <el-form
                                :model="updateWeekWorkContentForm"
                                :inline="true"
                                ref="updateWeekWorkContentForm">
                            <el-row v-for="(item,index) in updateWeekWorkContentForm.updateWeekWorkContentList" :key="index">
                                <el-form-item label="项目编码" label-width="78px" :prop="'updateWeekWorkContentList.' + index + '.PROJECT_CODE_'" style="display: none">
                                    <el-input v-model="item.PROJECT_CODE_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="项目名称" :prop="'updateWeekWorkContentList.' + index + '.PROJECT_NAME_'" :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROJECT_NAME_"
                                              @focus="_preChooseWeekWorkContentProject(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-form-item label="任务进度" :prop="'updateWeekWorkContentList.' + index + '.PROGRESS_'" :rules="[{ required: true, message: '任务进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROGRESS_" style="width: 180px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="开始时间" :prop="'updateWeekWorkContentList.' + index + '.START_DATE_'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" :prop="'updateWeekWorkContentList.' + index + '.END_DATE_'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="工作内容" label-width="78px"  :prop="'updateWeekWorkContentList.' + index + '.CONTENT_'">
                                    <el-input type="textarea" v-model="item.CONTENT_"
                                              style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="备注"  label-width="78px" :prop="'updateWeekWorkContentList.' + index + '.MEMO_'">
                                    <el-input type="textarea" v-model="item.MEMO_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeWeekWorkContentRow(index)">移 除</el-button>
                                    </template>
                                </el-form-item>
                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addWeekWorkContentRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveWeekWorkContent("updateWeekWorkContentForm")'>保 存
                                    </el-button>
                                </el-form-item>
                            </el-row>

                        </el-form>
                    </el-tab-pane >

                    <el-tab-pane label="下周工作内容" name="nextWeekWorkContent">
                        <el-form
                                :model="updateNextWeekWorkContentForm"
                                :inline="true"
                                ref="updateNextWeekWorkContentForm">
                            <el-row v-for="(item,index) in updateNextWeekWorkContentForm.updateNextWeekWorkContentList"
                                    :key="index">
                                <el-form-item label="项目名称" :prop="'updateNextWeekWorkContentList.' + index + '.PROJECT_NAME_'" :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROJECT_NAME_"
                                              @focus="_preChooseNextWeekWorkContentProject(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-table-column
                                        :prop="'updateNextWeekWorkContentList.' + index + '.PROJECT_ID_'"
                                        style="display: none"
                                        label="项目ID"
                                        align='center'
                                        width="200"
                                        sortable>
                                </el-table-column>
                                <el-form-item label="功能模块" :prop="'updateNextWeekWorkContentList.' + index + '.MODULAR_'" :rules="[{ required: true, message: '功能模块不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.MODULAR_"
                                              @focus="_preChooseNextWeekWorkContentModule(index)"
                                              style="width:180px"
                                              readonly
                                              placeholder="请选择项目"></el-input>
                                </el-form-item>
                                <el-table-column
                                        :prop="'updateNextWeekWorkContentList.' + index + '.MODULE_ID_'"
                                        style="display: none"
                                        label="模块ID"
                                        align='center'
                                        width="200"
                                        sortable>
                                </el-table-column>
                                <el-form-item label="任务" :prop="'updateNextWeekWorkContentList.' + index + '.TASK_'" :rules="[{ required: true, message: '任务不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TASK_"
                                              style="width:180px"></el-input>
                                </el-form-item>
                                <el-form-item label="开始时间"
                                              :prop="'updateNextWeekWorkContentList.' + index + '.START_DATE_'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" :prop="'updateNextWeekWorkContentList.' + index + '.END_DATE_'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="目前进度"
                                              :prop="'updateNextWeekWorkContentList.' + index + '.CURRENT_PROGRESS_'" :rules="[{ required: true, message: '目前进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.CURRENT_PROGRESS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="目标进度"
                                              :prop="'updateNextWeekWorkContentList.' + index + '.TARGET_PROGRESS_'" :rules="[{ required: true, message: '目标进度不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TARGET_PROGRESS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeNextWeekWorkContentRow(index)">移 除</el-button>
                                    </template>
                                </el-form-item>
                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addNextWeekWorkContentRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveNextWeekWorkContent("updateNextWeekWorkContentForm")'>保 存
                                    </el-button>
                                </el-form-item>
                            </el-row>
                        </el-form>
                    </el-tab-pane>

                    <el-tab-pane label="上级交办的其他工作" name="weekWorkOther">
                        <el-form
                                :model="updateWeekWorkOtherForm"
                                :inline="true"
                                ref="updateWeekWorkOtherForm">
                            <el-row v-for="(item,index) in updateWeekWorkOtherForm.updateWeekWorkOtherList" :key="index">
                                <el-form-item label="代办事项" :prop="'updateWeekWorkOtherList.' + index + '.TODO_WORK_'" :rules="[{ required: true, message: '代办事项不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.TODO_WORK_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="进展情况" :prop="'updateWeekWorkOtherList.' + index + '.PROGRESS_'" :rules="[{ required: true, message: '进展情况不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PROGRESS_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="其他参与人"
                                              :prop="'updateWeekWorkOtherList.' + index + '.OTHER_PARTICIPANT_'">
                                    <el-input v-model="item.OTHER_PARTICIPANT_" style="width: 180px"></el-input>
                                </el-form-item>
                                <el-form-item label="开始时间" :prop="'updateWeekWorkOtherList.' + index + '.START_DATE_'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <el-form-item label="结束时间" :prop="'updateWeekWorkOtherList.' + index + '.END_DATE_'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                    <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                    style="width: 180px"></el-date-picker>
                                </el-form-item>
                                <br/>
                                <el-form-item label="参与事项"
                                              :prop="'updateWeekWorkOtherList.' + index + '.PARTICIPATION_MATTERS_'" :rules="[{ required: true, message: '参与事项不能为空' ,trigger: 'change' }]">
                                    <el-input v-model="item.PARTICIPATION_MATTERS_" style="width: 750px"></el-input>
                                </el-form-item>
                                <br/>
                                <el-form-item label="备注" label-width="78px" :prop="'updateWeekWorkOtherList.' + index + '.MEMO_'">
                                    <el-input v-model="item.MEMO_" style="width: 750px"></el-input>
                                </el-form-item>
                                <el-form-item style="float: right">
                                    <template slot-scope="scope">
                                        <el-button type="primary" @click="removeWeekWorkOtherRow(index)" >移 除</el-button>
                                    </template>
                                </el-form-item>
                                <hr/>
                            </el-row>
                            <el-row>
                                <el-button type="primary" @click="addWeekWorkOtherRow">新 增</el-button>

                                <el-form-item style="float: right">
                                    <el-button type="primary"
                                               @click='onSaveWeekWorkOther("updateWeekWorkOtherForm")'>保 存
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
		data(){
			return{
				WEEK_WORK_ID_: '',
				activeName:'weekWork',
				updateWeekWorkFormLoading: false,
				updateWeekWorkForm: {
					WEEK_WORK_ID_: '',
					DEPT_NAME_: '',
					DEPT_MANAGER_NAME_: '',
					POSI_NAME_: '',
					WEEK_START_DATE_: '',
					WEEK_END_DATE_: '',
					POSI_RESP_: '',
					SELF_EVALUATION_: '',
					PROPOSAL_: '',
                    WEEK_ : ''
				},
				updateWeekWorkContentForm: {
					updateWeekWorkContentList: [{
						WEEK_WORK_CONTENT_ID_: '',
						SERIAL_:'',
						PROJECT_CODE_: '',
						PROJECT_NAME_: '',
						PROGRESS_: '',
						START_DATE_: '',
						END_DATE_: '',
						CONTENT_: '',
						MEMO_: '',
					}]
				},
				updateNextWeekWorkContentForm: {
					updateNextWeekWorkContentList: [{
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
				updateWeekWorkOtherForm: {
					updateWeekWorkOtherList: [{
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
				//本周工作打开项目的窗口
				chooseProjectDialog: {
					width: '800px',
					show: false,
					title: '选择项目',
					dialogVisible : true,
					formLabelWidth: '120px'
				},
				//下周工作打开项目的窗口
				chooseNextProjectDialog: {
					width: '800px',
					show: false,
					title: '选择项目',
					dialogVisible : true,
					formLabelWidth: '120px'
				},
				//下周工作打开模块的窗口
				chooseModuleDialog: {
					width: '640px',
					show: false,
					title: '选择模块',
					dialogVisible : true,
					formLabelWidth: '120px'
				},
				weekWork: {},
				//周工作的索引
				weekWorkContentProjectindex: '',
				//下周项目的索引
				nextWeekWorkContentProjectIndex: '',
				//下周模块的索引
				nextWeekWorkContentModuleIndex: '',
				//下周任务的索引
				nextWeekWorkContentTaskIndex: '',
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
        methods:{
			onChangeWeek(date){
				this.updateWeekWorkForm.WEEK_START_DATE_ = mutils.formatDate(date).substring(0, 10);
				this.updateWeekWorkForm.WEEK_END_DATE_ = mutils.formatDate(new Date(new Date(date).setDate(date.getDate() + 6))).substring(0, 10);
				console.log(date);
				console.log(mutils.formatDate(date).substring(0, 10));
				console.log(new Date(new Date(date).setDate(date.getDate() + 6)));
				console.log(mutils.formatDate(new Date(new Date(date).setDate(date.getDate() + 6))));
			},
			setLoadWeekWorkForm(){
				this.updateWeekWorkFormLoading = true;
				this.activeName='weekWork';
				this.updateWeekWorkContentForm.updateWeekWorkContentList = [{
					WEEK_WORK_CONTENT_ID_: '',
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					CONTENT_: '',
					MEMO_: ''
				}];
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList = [{
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					START_DATE_: '',
					END_DATE_: '',
					CURRENT_PROGRESS_: '',
					TARGET_PROGRESS_: '',
					PROJECT_ID_: '',
					MODULE_ID_: ''
				}];
				this.updateWeekWorkOtherForm.updateWeekWorkOtherList = [{
					WEEK_WORK_OTHER_ID_: '',
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				}];
				let that = this
				this.$ajax.post(
					this.baseUrl + 'selectWeekWorkInforNew.do?WEEK_WORK_ID_=' + this.WEEK_WORK_ID_ + ''
				).then(function (res) {
					if(res.data.success == true){
						let weekWork = res.data.weekWorkInforNew.weekWork;
                        that.weekWork = res.data.weekWorkInforNew.weekWork;
						that.updateWeekWorkForm.WEEK_WORK_ID_ = weekWork.WEEK_WORK_ID_;
						that.updateWeekWorkForm.DEPT_NAME_ = weekWork.DEPT_NAME_;
						that.updateWeekWorkForm.DEPT_MANAGER_NAME_ = weekWork.DEPT_MANAGER_NAME_;
						that.updateWeekWorkForm.POSI_NAME_ = weekWork.POSI_NAME_;
						// this.updateWeekWorkForm.WEEK_START_DATE_ = mutils.formatDate(date).substring(0, 10);
						// this.updateWeekWorkForm.WEEK_END_DATE_ = mutils.formatDate(new Date(new Date(date).setDate(date.getDate() + 7))).substring(0, 10);
						that.updateWeekWorkForm.WEEK_START_DATE_ = weekWork.WEEK_START_DATE_;
						that.updateWeekWorkForm.WEEK_END_DATE_ =weekWork.WEEK_END_DATE_;
						that.updateWeekWorkForm.POSI_RESP_ = weekWork.POSI_RESP_;
						that.updateWeekWorkForm.SELF_EVALUATION_ = weekWork.SELF_EVALUATION_;
						that.updateWeekWorkForm.PROPOSAL_ = weekWork.PROPOSAL_;
						that.updateWeekWorkForm.WEEK_ = weekWork.WEEK_START_DATE_;

						let weekWorkContentList = res.data.weekWorkInforNew.weekWorkContentList;
						for (let i = 0; i< weekWorkContentList.length; i++){
							if(i != 0){
								that.addWeekWorkContentRow();
							}
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].PROJECT_CODE_ = weekWorkContentList[i].PROJECT_CODE_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].PROJECT_NAME_ = weekWorkContentList[i].PROJECT_NAME_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].PROGRESS_ = weekWorkContentList[i].PROGRESS_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].START_DATE_ = weekWorkContentList[i].START_DATE_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].END_DATE_ = weekWorkContentList[i].END_DATE_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].CONTENT_ = weekWorkContentList[i].CONTENT_;
							that.updateWeekWorkContentForm.updateWeekWorkContentList[i].MEMO_ = weekWorkContentList[i].MEMO_;
						}
						let nextWeekWorkContentList = res.data.weekWorkInforNew.nextWeekWorkContentList;
						for (let i = 0; i< nextWeekWorkContentList.length; i++){
							if (i !=0){
								that.addNextWeekWorkContentRow();
							}
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].PROJECT_NAME_ = nextWeekWorkContentList[i].PROJECT_NAME_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].MODULAR_ = nextWeekWorkContentList[i].MODULAR_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].TASK_ = nextWeekWorkContentList[i].TASK_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].START_DATE_ = nextWeekWorkContentList[i].START_DATE_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].END_DATE_ = nextWeekWorkContentList[i].END_DATE_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].CURRENT_PROGRESS_ = nextWeekWorkContentList[i].CURRENT_PROGRESS_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].TARGET_PROGRESS_ = nextWeekWorkContentList[i].TARGET_PROGRESS_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].PROJECT_ID_ = nextWeekWorkContentList[i].PROJECT_ID_;
							that.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[i].MODULE_ID_ = nextWeekWorkContentList[i].MODULE_ID_;
						}
						let weekWorkOtherList = res.data.weekWorkInforNew.weekWorkOtherList;
						for (var i in weekWorkOtherList){
							if (i !=0){
								that.addWeekWorkOtherRow();
							}
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].TODO_WORK_ = weekWorkOtherList[i].TODO_WORK_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].PROGRESS_ = weekWorkOtherList[i].PROGRESS_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].OTHER_PARTICIPANT_ = weekWorkOtherList[i].OTHER_PARTICIPANT_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].START_DATE_ = weekWorkOtherList[i].START_DATE_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].END_DATE_ = weekWorkOtherList[i].END_DATE_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].PARTICIPATION_MATTERS_ = weekWorkOtherList[i].PARTICIPATION_MATTERS_;
							that.updateWeekWorkOtherForm.updateWeekWorkOtherList[i].MEMO_ = weekWorkOtherList[i].MEMO_;
						}
						that.updateWeekWorkFormLoading = false;
					}else{
						/*请求失败*/
						that.$message.error(res.data.message);
						that.updateWeekWorkFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateWeekWorkFormLoading = false;
				});
            },
			//点击新增周工作内容
			addWeekWorkContentRow(){
				let that = this;
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间
				this.updateWeekWorkContentForm.updateWeekWorkContentList.push({
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
			removeWeekWorkContentRow(index){
				if(this.updateWeekWorkContentForm.updateWeekWorkContentList.length > 1){
					this.updateWeekWorkContentForm.updateWeekWorkContentList.splice(index, 1);
				}else{
					this.$message.warning('至少有一条');
				}
			},
			//点击新增下周工作内容
			addNextWeekWorkContentRow(){
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

				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList.push({
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
			removeNextWeekWorkContentRow(index){
				if(this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList.length > 1){
					this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList.splice(index, 1);
				}else{
					this.$message.warning('至少有一条');
				}
			},
			//点击新增上级交办的其他任务
			addWeekWorkOtherRow(){
				let that = this;
				this.updateWeekWorkOtherForm.updateWeekWorkOtherList.push({
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
			removeWeekWorkOtherRow(index){
				if(this.updateWeekWorkOtherForm.updateWeekWorkOtherList.length > 1){
					this.updateWeekWorkOtherForm.updateWeekWorkOtherList.splice(index, 1);
				}else{
					this.$message.warning('至少有一条');
				}
			},
			//周工作内容选择项目
			_preChooseWeekWorkContentProject(index){
				this.weekWorkContentProjectindex= index;
				this.chooseProjectDialog.show = true;
			},
			//本周赋项目
			_completeChooseWeekWorkContentProject(returnValue){
				this.chooseProjectDialog.show = false;
				this.updateWeekWorkContentForm.updateWeekWorkContentList[this.weekWorkContentProjectindex].PROJECT_CODE_ = returnValue.PROJECT_CODE_;
				this.updateWeekWorkContentForm.updateWeekWorkContentList[this.weekWorkContentProjectindex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
			},
			//下周工作内容选择项目
			_preChooseNextWeekWorkContentProject(index){
				this.nextWeekWorkContentProjectIndex = index;
				this.chooseNextProjectDialog.show = true;
			},
			//下周赋项目
			_completeChooseNextWeekWorkContentProject(returnValue){
				this.chooseNextProjectDialog.show = false;
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_ID_ = returnValue.PROJECT_ID_;
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULE_ID_ = "";
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULAR_ = "";
			},
			//下周工作选择模块
			_preChooseNextWeekWorkContentModule(index){
				this.nextWeekWorkContentModuleIndex = index;
				if (this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].PROJECT_NAME_ == "") {
					this.$message.warning("请先完成选择项目");
					return;
				}
				this.chooseModuleDialog.show = true;
				this.chooseModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_module_ref.moduleQueryForm.PROJECT_ID_ = this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].PROJECT_ID_;
					this.$refs.choose_module_ref.getList();
				})
			},
			//赋模块
			_completeChooseNextWeekWorkContentModule(returnValue){
				this.chooseModuleDialog.show = false;
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULE_ID_ = returnValue.MODULE_ID_;
				this.updateNextWeekWorkContentForm.updateNextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULAR_ = returnValue.MODULE_NAME_;
			},
			//周工作报告保存
			onSaveWeekWork(updateWeekWorkForm){
				this.$refs[updateWeekWorkForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateWeekWorkForm];
						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateWeekWorkNew.do',
							data: {
								WEEK_WORK_ID_: formData['WEEK_WORK_ID_'],
								DEPT_NAME_: formData['DEPT_NAME_'],
								DEPT_MANAGER_NAME_: formData['DEPT_MANAGER_NAME_'],
								POSI_NAME_: formData['POSI_NAME_'],
								POSI_RESP_: formData['POSI_RESP_'],
								WEEK_START_DATE_: mutils.formatDate(new Date(formData['WEEK_START_DATE_'])),
								WEEK_END_DATE_: mutils.formatDate(new Date(formData['WEEK_END_DATE_'])),
								SELF_EVALUATION_: formData['SELF_EVALUATION_'],
								PROPOSAL_: formData['PROPOSAL_'],
								WEEK_ : document.getElementsByName('WEEK_')[0].value
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
								let returnValue = res.data.weekWork;
								that.$emit('updateWeekWorkListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试')
						})

					}
				})
			},
			//保存周工作内容
			onSaveWeekWorkContent(updateWeekWorkContentForm){
				this.$refs[updateWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateWeekWorkContentForm].updateWeekWorkContentList;

						let serialList = new Array();
						let projectCodeList = new Array();
						let projectNameList = new Array();
						let progressList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let contentList = new Array();
						let memoList = new Array();

						for (let i = 0; i<formData.length; i++) {
							serialList.push(Number(i)+1);
							projectCodeList.push({
								PROJECT_CODE_:formData[i].PROJECT_CODE_
							});
							projectNameList.push({
								PROJECT_NAME_:formData[i].PROJECT_NAME_
							});
							progressList.push({
								PROGRESS_:formData[i].PROGRESS_
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
								CONTENT_:formData[i].CONTENT_
							});
							memoList.push({
								MEMO_:formData[i].MEMO_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateWeekWorkContentNew.do',
							data: {
								WEEK_WORK_ID_: that.WEEK_WORK_ID_,
								SERIAL_LIST:serialList,
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
			//保存下周工作
			onSaveNextWeekWorkContent(updateNextWeekWorkContentForm){
				this.$refs[updateNextWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateNextWeekWorkContentForm].updateNextWeekWorkContentList;

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

						for (let i = 0; i<formData.length; i++) {
							serialList.push(Number(i)+1);
							projectNameList.push({
								PROJECT_NAME_:formData[i].PROJECT_NAME_
							});
							modularList.push({
								MODULAR_:formData[i].MODULAR_
							});
							taskList.push({
								TASK_:formData[i].TASK_
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
								CURRENT_PROGRESS_:formData[i].CURRENT_PROGRESS_
							});
							targetProgressList.push({
								TARGET_PROGRESS_:formData[i].TARGET_PROGRESS_
							});
							projectIdList.push({
								PROJECT_ID_:formData[i].PROJECT_ID_
							});
							moduleIdList.push({
								MODULE_ID_:formData[i].MODULE_ID_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateNextWeekWorkContentNew.do',
							data: {
								WEEK_WORK_ID_: that.WEEK_WORK_ID_,
								SERIAL_LIST: serialList,
								PROJECT_NAME_LIST:JSON.stringify(projectNameList),
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
			onSaveWeekWorkOther(updateWeekWorkOtherForm){
				this.$refs[updateWeekWorkOtherForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateWeekWorkOtherForm].updateWeekWorkOtherList;

						let serialList = new Array();
						let todoWorkList = new Array();
						let progressList = new Array();
						let otherParticipantList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let participationMattersList = new Array();
						let memoList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i)+1);
							todoWorkList.push({
								TODO_WORK_:formData[i].TODO_WORK_
							});
							progressList.push({
								PROGRESS_:formData[i].PROGRESS_
							});
							otherParticipantList.push({
								OTHER_PARTICIPANT_:formData[i].OTHER_PARTICIPANT_
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
								PARTICIPATION_MATTERS_:formData[i].PARTICIPATION_MATTERS_
							});
							memoList.push({
								MEMO_:formData[i].MEMO_
							});
						}

						let that = this;
						axios({
							method: 'POST',
							url: this.baseUrl + 'updateWeekWorkOtherNew.do',
							data: {
								WEEK_WORK_ID_: that.WEEK_WORK_ID_,
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

</style>
