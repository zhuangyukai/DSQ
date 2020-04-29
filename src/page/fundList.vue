<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='search_data'
                    ref="search_data"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="search_data.startDate"
                            type="date"
                            placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker
                            v-model="search_data.endDate"
                            type="date"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='onScreeoutWeekWork("search_data")'>筛选
                    </el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size="mini" icon="view" @click='onAdd()'>添加</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading= "mainloading"
                    :data="tableData"
                    style="width: 100%"
                    align='center'
                    :max-height="tableHeight">
                <el-table-column
                        v-if="idFlag"
                        prop="weekWorkId"
                        label="周工作报告ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="weekWorkContentId"
                        label="周工作内容ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="nextWeekWorkContentId"
                        label="下周工作内容ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="weekWorkOtherId"
                        label="上级交办的其他工作ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="deptName"
                        label="部门"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="deptManagerName"
                        label="部门负责人"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="posiName"
                        label="岗位名称"
                        align='center'
                        width="240">
                </el-table-column>
                <el-table-column
                        prop="weekStartDate"
                        label="本周开始时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.weekStartDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="weekEndDate"
                        label="本周结束时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.weekEndDate }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="weekNum"
                        label="本月第几周"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="draftorName"
                        label="起草人姓名"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="180">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='onEdit(scope.row)'
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='onDelete(scope.row,scope.$index)'
                        >删除
                        </el-button>
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
        </div>
        <el-dialog
                :title="dialog.title"
                :visible.sync="dialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false">
            <div class="form">
                <el-form
                        ref="form"
                        :model="form"
                        :label-width="dialog.formLabelWidth"
                        style="margin:10px;width:auto;"
                        v-loading= "diagloading"
                >
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="周工作报告" name="weekWork">
                            <el-form-item prop='weekWorkId'  v-if="idFlag" label="周工作报告id:">
                                <el-input type="weekWorkId"   v-model="form.weekWorkId"></el-input>
                            </el-form-item>
                            <el-form-item prop='deptName' label="部门:">
                                <el-input type="deptName" v-model="form.deptName"></el-input>
                            </el-form-item>

                            <el-form-item prop='deptManagerName' label="部门负责人:">
                                <el-input type="deptManagerName" v-model="form.deptManagerName"></el-input>
                            </el-form-item>

                            <el-form-item prop='posiName' label="岗位名称:">
                                <el-input type="posiName" v-model="form.posiName"></el-input>
                            </el-form-item>

                            <el-form-item prop='weekStartDate' label="本周开始时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" v-model.date="form.weekStartDate"
                                                :picker-options="pickerStartDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='weekEndDate' label="本周结束时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" v-model.date="form.weekEndDate"
                                                :picker-options="pickerEndDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='workEndDate' label="岗位职责:">
                                <el-input type="textarea" v-model="form.posiResp"></el-input>
                            </el-form-item>

                            <el-form-item prop='selfEvaluation' label="自评综述:">
                                <el-input type="textarea" v-model="form.selfEvaluation"></el-input>
                            </el-form-item>

                            <el-form-item prop='proposal' label="合理化建议:">
                                <el-input type="textarea" v-model="form.proposal"></el-input>
                            </el-form-item>

                            <el-form-item class="text_right">
                                <el-button @click="dialog.show = false">取 消</el-button>
                                <el-button type="primary" @click='onWeekWorkSubmit("form")'>保 存</el-button>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="周工作内容" name="weekWorkContent" :disabled="openDisabled"    >
                            <el-form class="weekWorkContentForm" :model="weekWorkContentForm" :inline="true"
                                     ref="weekWorkContentForm">
                                <el-row v-for="(item,index) in weekWorkContentForm.weekWorkContentList" :key="index">
                                    <el-form-item label="项目编码" label-width="78px" :prop="'weekWorkContentList.' + index + '.projectCode'" >
                                        <el-input v-model="item.projectCode" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目名称" :prop="'weekWorkContentList.' + index + '.projectName'" :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.projectName" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务进度" :prop="'weekWorkContentList.' + index + '.progress'" :rules="[{ required: true, message: '任务进度不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.progress" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkContentList.' + index + '.startDate'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkContentList.' + index + '.endDate'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="工作内容" label-width="78px"  :prop="'weekW    orkContentList.' + index + '.content'">
                                        <el-input type="textarea" v-model="item.content"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注"  label-width="78px" :prop="'weekWorkContentList.' + index + '.memo'">
                                        <el-input type="textarea" v-model="item.memo" style="width: 750px"></el-input>
                                    </el-form-item>

                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addWeekWorkContentRow">新增周工作内容</el-button>
                                    <el-button type="primary"  @click="removeWeekWorkContentRow">移除周工作内容</el-button>
                                    <el-form-item style="float: right">
                                        <el-button @click="dialog.show = false">取 消</el-button>
                                        <el-button type="primary"
                                                   @click='onWeekWorkContentSubmit("weekWorkContentForm")'>保 存
                                        </el-button>
                                    </el-form-item>
                                </el-row>

                            </el-form>
                        </el-tab-pane >

                        <el-tab-pane label="下周工作内容" name="nextWeekWorkContent" :disabled="openDisabled" >
                            <el-form class="nextWeekWorkContentForm" :model="nextWeekWorkContentForm" :inline="true"
                                     ref="nextWeekWorkContentForm">
                                <el-row v-for="(item,index) in nextWeekWorkContentForm.nextWeekWorkContentList"
                                        :key="index">
                                    <el-form-item label="项目名称"
                                                  :prop="'nextWeekWorkContentList.' + index + '.projectName'" :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.projectName" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="功能模块" :prop="'nextWeekWorkContentList.' + index + '.modular'" :rules="[{ required: true, message: '功能模块不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.modular" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务" :prop="'nextWeekWorkContentList.' + index + '.task'" :rules="[{ required: true, message: '任务不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.task" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间"
                                                  :prop="'nextWeekWorkContentList.' + index + '.startDate'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'nextWeekWorkContentList.' + index + '.endDate'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目前进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.currentProgress'" :rules="[{ required: true, message: '目前进度不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.currentProgress" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目标进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.targetProgress'" :rules="[{ required: true, message: '目标进度不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.targetProgress" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addNextWeekWorkContentRow">新增下周工作内容</el-button>
                                    <el-button type="primary" @click="removeNextWeekWorkContentRow">移除下周工作内容</el-button>

                                    <el-form-item style="float: right">
                                        <el-button @click="dialog.show = false">取 消</el-button>
                                        <el-button type="primary"
                                                   @click='onNextWeekWorkContentSubmit("nextWeekWorkContentForm")'>保 存
                                        </el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="上级交办的其他工作" name="weekWorkOther" :disabled="openDisabled"  >
                            <el-form class="weekWorkOtherForm" :model="weekWorkOtherForm" :inline="true"
                                     ref="weekWorkOtherForm">
                                <el-row v-for="(item,index) in weekWorkOtherForm.weekWorkOtherList" :key="index">
                                    <el-form-item label="代办事项" :prop="'weekWorkOtherList.' + index + '.todoWork'" :rules="[{ required: true, message: '代办事项不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.todoWork" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="进展情况" :prop="'weekWorkOtherList.' + index + '.progress'" :rules="[{ required: true, message: '进展情况不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.progress" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="其他参与人"
                                                  :prop="'weekWorkOtherList.' + index + '.otherParticipant'">
                                        <el-input v-model="item.otherParticipant" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkOtherList.' + index + '.startDate'" :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkOtherList.' + index + '.endDate'" :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="参与事项"
                                                  :prop="'weekWorkOtherList.' + index + '.participationMatters'" :rules="[{ required: true, message: '参与事项不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.participationMatters" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注" label-width="78px" :prop="'weekWorkOtherList.' + index + '.memo'">
                                        <el-input v-model="item.memo" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addWeekWorkOtherRow">新增上级交办的其他工作</el-button>
                                    <el-button type="primary" @click="removeWeekWorkOtherRow">移除上级交办的其他工作</el-button>

                                    <el-form-item style="float: right">
                                        <el-button @click="dialog.show = false">取 消</el-button>
                                        <el-button type="primary"
                                                   @click='onWeekWorkOtherSubmit("weekWorkOtherForm")'>保 存
                                        </el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                    </el-tabs>
                </el-form>
            </div>
        </el-dialog>

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
				diagloading : false,
				mainloading : false,
				tableData: [],
				tableHeight: '',
				idFlag: false,
				sortnum: 0,
				search_data: {
					startDate: '',
					endDate: '',
					startDatePage: '',
                    endDatePage : ''
				},
                activeName:'weekWork',
				openDisabled:true,
				weekWork: {},
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				//详情弹框信息
				dialog: {
					width: '400px',
					show: false,
					title: '修改周工作报告信息',
					formLabelWidth: '120px'
				},
				tab: {

                },
				form: {
					selfEvaluation: '',
					proposal: '',
					deptName: '',
					weekStartDate: '',
					weekEndDate: '',
					weekWorkId: '',
                    posiResp: ''
				},
                item: {
					projectCode: ''
                },
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
				weekWorkContentForm: {
					weekWorkContentList: [{
						weekWorkContentId: '',
                        serial:'',
						projectCode: '',
						projectName: '',
						progress: '',
						startDate: '',
						endDate: '',
						content: '',
						memo: '',
					}]
				},
				nextWeekWorkContentForm: {
					nextWeekWorkContentList: [{
						nextWeekWorkContentId: '',
						projectName: '',
						modular: '',
						task: '',
						startDate: '',
						endDate: '',
						currentProgress: '',
						targetProgress: '',
					}]
				},
				weekWorkOtherForm: {
					weekWorkOtherList: [{
						weekWorkOtherId: '',
						todoWork: '',
						progress: '',
						startDate: '',
						endDate: '',
						otherParticipant: '',
						participationMatters: '',
						memo: '',
					}]
				}
			}
		},
		mounted() {
			//加载数据之前，先加载theme颜色
			this.getList({
				fun: () => {
				}
			});
		},
		methods: {
			/**
			 * 改变页码和当前页时需要拼装的路径方法
			 * @param {string} field 参数字段名
			 * @param {string} value 参数字段值
			 */
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
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.mainloading = true;
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

				//let formData = this[search_data];
				let formData = this.search_data;
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				let FROM_START_DATE_ = formData['startDatePage'];
				let TO_START_DATE_ = formData['endDatePage'];

				if (mutils.isEmpty(FROM_START_DATE_)) {
					FROM_START_DATE_ = "";
				} else {
					FROM_START_DATE_ = mutils.formatDate(new Date(FROM_START_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_START_DATE_)) {
					TO_START_DATE_ = "";
				} else {
					TO_START_DATE_ = mutils.formatDate(new Date(TO_START_DATE_));
				}

				// 封装  get,path,params,fn,errfn
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'selectWeekWork.do?FROM_START_DATE_=' + FROM_START_DATE_ + '&TO_START_DATE_=' + TO_START_DATE_ + '&DRAFTOR_ID_='+ EMP_ID_ +'&limit=' + this.paginations.page_size + '&page=' + this.paginations.page_index + ''
				)
					.then(function (res) {
						that.paginations.total = res.data.total;
						that.tableData = [];
						res.data.weekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								weekWorkId: item.WEEK_WORK_ID_,
								weekStartDate: dtime(item.WEEK_START_DATE_).format('YYYY-MM-DD '),
								weekEndDate: dtime(item.WEEK_END_DATE_).format('YYYY-MM-DD '),
								deptName: item.DEPT_NAME_,
								deptManagerName: item.DEPT_MANAGER_NAME_,
								posiName: item.POSI_NAME_,
								draftorName: item.DRAFTOR_NAME_,
								weekNum: item.WEEK_NUM_
							}
							that.tableData.push(tableItem);
						})
						that.mainloading = false;
					})
					.catch(function (res) {
						that.mainloading = false;
					})
			},
			// 操作方法
			onEdit(row) {
				this.diagloading = true;
				this.openDisabled = false;
				this.activeName='weekWork';
				this.weekWorkContentForm.weekWorkContentList = [{
					weekWorkContentId: '',
					projectCode: '',
					projectName: '',
					progress: '',
					startDate: '',
					endDate: '',
					content: '',
					memo: '',
				}];
				this.nextWeekWorkContentForm.nextWeekWorkContentList = [{
					nextWeekWorkContentId: '',
					projectName: '',
					modular: '',
					task: '',
					startDate: '',
					endDate: '',
					currentProgress: '',
					targetProgress: '',
				}];

				this.weekWorkOtherForm.weekWorkOtherList = [{
					weekWorkOtherId: '',
					todoWork: '',
					progress: '',
					startDate: '',
					endDate: '',
					otherParticipant: '',
					participationMatters: '',
					memo: '',
				}];

				let that = this
				this.$ajax.post(
					this.baseUrl + 'selectWeekWorkInforNew.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
				).then(function (res) {
					if(res.data.success == true){
						let weekWork = res.data.weekWorkInforNew.weekWork;

						that.form.weekWorkId = row.weekWorkId;
						that.form.deptName = row.deptName;
						that.form.deptManagerName = row.deptManagerName;
						that.form.posiName = row.posiName;
						that.form.weekStartDate = weekWork.WEEK_START_DATE_;
						that.form.weekEndDate = weekWork.WEEK_END_DATE_;
						that.form.posiResp = weekWork.POSI_RESP_;
						that.form.selfEvaluation = weekWork.SELF_EVALUATION_;
						that.form.proposal = weekWork.PROPOSAL_;

						let weekWorkContentList = res.data.weekWorkInforNew.weekWorkContentList;
						for (let i = 0; i< weekWorkContentList.length; i++){
							if(i != 0){
								that.addWeekWorkContentRow();
							}
							that.weekWorkContentForm.weekWorkContentList[i].projectCode = weekWorkContentList[i].PROJECT_CODE_;
							that.weekWorkContentForm.weekWorkContentList[i].projectName = weekWorkContentList[i].PROJECT_NAME_;
							that.weekWorkContentForm.weekWorkContentList[i].progress = weekWorkContentList[i].PROGRESS_;
							that.weekWorkContentForm.weekWorkContentList[i].startDate = weekWorkContentList[i].START_DATE_;
							that.weekWorkContentForm.weekWorkContentList[i].endDate = weekWorkContentList[i].END_DATE_;
							that.weekWorkContentForm.weekWorkContentList[i].content = weekWorkContentList[i].CONTENT_;
							that.weekWorkContentForm.weekWorkContentList[i].memo = weekWorkContentList[i].MEMO_;
						}
						let nextWeekWorkContentList = res.data.weekWorkInforNew.nextWeekWorkContentList;
						for (let i = 0; i< nextWeekWorkContentList.length; i++){
							if (i !=0){
								that.addNextWeekWorkContentRow();
							}
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].projectName = nextWeekWorkContentList[i].PROJECT_NAME_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].modular = nextWeekWorkContentList[i].MODULAR_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].task = nextWeekWorkContentList[i].TASK_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].startDate = nextWeekWorkContentList[i].START_DATE_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].endDate = nextWeekWorkContentList[i].END_DATE_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].currentProgress = nextWeekWorkContentList[i].CURRENT_PROGRESS_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].targetProgress = nextWeekWorkContentList[i].TARGET_PROGRESS_;
						}
						let weekWorkOtherList = res.data.weekWorkInforNew.weekWorkOtherList;
						for (var i in weekWorkOtherList){
							if (i !=0){
								that.addWeekWorkOtherRow();
							}
							that.weekWorkOtherForm.weekWorkOtherList[i].todoWork = weekWorkOtherList[i].TODO_WORK_;
							that.weekWorkOtherForm.weekWorkOtherList[i].progress = weekWorkOtherList[i].PROGRESS_;
							that.weekWorkOtherForm.weekWorkOtherList[i].otherParticipant = weekWorkOtherList[i].OTHER_PARTICIPANT_;
							that.weekWorkOtherForm.weekWorkOtherList[i].startDate = weekWorkOtherList[i].START_DATE_;
							that.weekWorkOtherForm.weekWorkOtherList[i].endDate = weekWorkOtherList[i].END_DATE_;
							that.weekWorkOtherForm.weekWorkOtherList[i].participationMatters = weekWorkOtherList[i].PARTICIPATION_MATTERS_;
							that.weekWorkOtherForm.weekWorkOtherList[i].memo = weekWorkOtherList[i].MEMO_;
						}
						that.diagloading = false;
                    }else{
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.diagloading = false;
                    }

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.diagloading = false;
				});


               /* //编辑周工作报告
				this.$ajax.post(
					'http://10.18.26.114:9090/DS/loadWeekWork.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
				).then(function (res) {
					let posiResp = res.data.weekWork.POSI_RESP_;
					let selfEvaluation = res.data.weekWork.SELF_EVALUATION_;
					let proposal = res.data.weekWork.PROPOSAL_;
					let weekStartDate = res.data.weekWork.WEEK_START_DATE_;
					let weekEndDate = res.data.weekWork.WEEK_END_DATE_;

					// let form = res.data.weekWork;
					that.form.weekWorkId = row.weekWorkId;
					that.form.deptName = row.deptName;
					that.form.deptManagerName = row.deptManagerName;
					that.form.posiName = row.posiName;
					that.form.weekStartDate = weekStartDate;
					that.form.weekEndDate = weekEndDate;
					that.form.posiResp = posiResp;
					that.form.selfEvaluation = selfEvaluation;
					that.form.proposal = proposal;

				}),
                //编辑本周工作内容
                this.$ajax.post(
					'http://10.18.26.114:9090/DS/selectWeekWorkContent.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
                ).then(function (res) {
                	let itemData = res.data.weekWorkContentList;
                	for (let i = 0; i< itemData.length; i++){
                		if(i != 0){
							that.addWeekWorkContentRow();
                        }
                		that.weekWorkContentForm.weekWorkContentList[i].projectCode = itemData[i].PROJECT_CODE_;
						that.weekWorkContentForm.weekWorkContentList[i].projectName = itemData[i].PROJECT_NAME_;
						that.weekWorkContentForm.weekWorkContentList[i].progress = itemData[i].PROGRESS_;
						that.weekWorkContentForm.weekWorkContentList[i].startDate = itemData[i].START_DATE_;
						that.weekWorkContentForm.weekWorkContentList[i].endDate = itemData[i].END_DATE_;
						that.weekWorkContentForm.weekWorkContentList[i].content = itemData[i].CONTENT_;
						that.weekWorkContentForm.weekWorkContentList[i].memo = itemData[i].MEMO_;
                    }
				}),
                //编辑下周工作内容
                this.$ajax.post(
					'http://10.18.26.114:9090/DS/selectNextWeekWorkContent.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
                ).then(function (res) {
					let itemData = res.data.nextWeekWorkContentList;
					for (let i = 0; i< itemData.length; i++){
						if (i !=0){
							that.addNextWeekWorkContentRow();
                        }
                        that.nextWeekWorkContentForm.nextWeekWorkContentList[i].projectName = itemData[i].PROJECT_NAME_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].modular = itemData[i].MODULAR_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].task = itemData[i].TASK_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].startDate = itemData[i].START_DATE_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].endDate = itemData[i].END_DATE_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].currentProgress = itemData[i].CURRENT_PROGRESS_;
						that.nextWeekWorkContentForm.nextWeekWorkContentList[i].targetProgress = itemData[i].TARGET_PROGRESS_;
                    }
				}),
                //编辑上级交办的其他工作
                this.$ajax.post(
					'http://10.18.26.114:9090/DS/selectWeekWorkOther.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
                ).then(function (res) {
					let itemData = res.data.weekWorkOtherList;
					for (var i in itemData){
						if (i !=0){
							that.addWeekWorkOtherRow();
                        }
                        that.weekWorkOtherForm.weekWorkOtherList[i].todoWork = itemData[i].TODO_WORK_;
						that.weekWorkOtherForm.weekWorkOtherList[i].progress = itemData[i].PROGRESS_;
						that.weekWorkOtherForm.weekWorkOtherList[i].otherParticipant = itemData[i].OTHER_PARTICIPANT_;
						that.weekWorkOtherForm.weekWorkOtherList[i].startDate = itemData[i].START_DATE_;
						that.weekWorkOtherForm.weekWorkOtherList[i].endDate = itemData[i].END_DATE_;
						that.weekWorkOtherForm.weekWorkOtherList[i].participationMatters = itemData[i].PARTICIPATION_MATTERS_;
						that.weekWorkOtherForm.weekWorkOtherList[i].memo = itemData[i].MEMO_;
                    }
				})*/
				this.dialog.title = '修改周工作报告信息';
				this.dialog.show = true;
			},
			onDelete(row) {
				//根据id来删除数据
				let that = this;

				let data = {
					weekWorkId: row.weekWorkId
				}
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() =>{
                    let that = this;
                    axios({
                        method:'POST',
                        url: this.baseUrl + 'deleteWeekWork.do',
                        data:{
							WEEK_WORK_ID_:row.weekWorkId
                        },
                        transformRequest:[function (data) {
                            let ret = ''
                            for (let it in data){
								ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                            }
                            return ret
                        }],
						headers:{'Content-Type': "application/x-www-form-urlencoded"}
                    }).then(function(res){
                        that.$message('删除成功'),
                            that.getList({
                                fun:() =>{
                                }
                            });
                    }).catch(function(err){
                        /*请求失败*/
                        that.$message.error('删除失败请重试')
                    })
                })




			},
			onAdd() {
				this.diagloading = true;
				this.openDisabled = true;
				this.form.weekWorkId = '';
				this.activeName='weekWork';
				const formdata = this.form;
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

					formdata.deptName = res.data.managerInfo.ORG_NAME_;
					formdata.deptManagerName = res.data.managerInfo.EMP_NAME_;
					formdata.posiName = userinfo.posiName;
					formdata.weekStartDate = new Date(m_time);
					formdata.weekEndDate = new Date(m_time + oneDayLong * 6);
					formdata.posiResp = res.data.managerInfo.ONESELF_POSI_MEMO_,
                    formdata.selfEvaluation = '',
					formdata.proposal = ''
                    that.diagloading = false;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎')
					that.diagloading = false;
				});

				this.weekWorkContentForm.weekWorkContentList = [{
					weekWorkContentId: '',
                    serial: 1,
					projectCode: '',
					projectName: '',
					progress: '',
					startDate:new Date(m_time),
					endDate: new Date(m_time + oneDayLong * 6),
					content: '',
					memo: '',
				}];

				this.nextWeekWorkContentForm.nextWeekWorkContentList = [{
					nextWeekWorkContentId: '',
                    serial: 1,
					projectName: '',
					modular: '',
					task: '',
					startDate:new Date(m_time + oneDayLong * 7),
					endDate: new Date(m_time + oneDayLong * 13),
					currentProgress: '',
					targetProgress: '',
				}]

				this.weekWorkOtherForm.weekWorkOtherList = [{
					weekWorkOtherId: '',
					serial: 1,
					todoWork: '',
					progress: '',
					startDate: new Date(m_time),
					endDate: new Date(m_time + oneDayLong * 6),
					otherParticipant: '',
					participationMatters: '',
					memo: '',
				}];

				this.dialog.title = '新增周工作报告';
				this.dialog.show = true;

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
					that.$message('修改成功'),
						that.paginations.total = data.count;
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('修改失败请重试')
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
					that.form.weekWorkId = res.data.weekWork.WEEK_WORK_ID_;
					that.$message('新增成功'),
						that.openDisabled = false;
						that.paginations.total = data.count;
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('新增失败请重试')
				})
			},
			//周工作报告的增加与修改
			onWeekWorkSubmit(form) {
				this.$refs[form].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[form];
						let data = {};

						for (var i in formData) {
							data.weekWorkId = formData['weekWorkId'];
							data.deptName = formData['deptName']
							data.deptManagerName = formData['deptManagerName']
							data.posiName = formData['posiName']
							if (mutils.isEmpty(formData['weekStartDate'])) {
								data.weekStartDate = "";
							} else {
								data.weekStartDate = mutils.formatDate(new Date(formData['weekStartDate'])); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData['weekEndDate'])) {
								data.weekEndDate = "";
							} else {
								data.weekEndDate = mutils.formatDate(new Date(formData['weekEndDate']));
							}
							data.posiResp = formData['posiResp']
							data.selfEvaluation = formData['selfEvaluation']
							data.proposal = formData['proposal']
						}
						if (formData['weekWorkId'] != "") {
							this.editWeekWork(data)
						} else {
							this.addWeekWork(data)
						}

					}
				})
			},
			//周工作内容的增加与修改
			onWeekWorkContentSubmit(weekWorkContentForm) {
				this.$refs[weekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[weekWorkContentForm].weekWorkContentList;

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
							projectCodeList.push(formData[i].projectCode);
							projectNameList.push(formData[i].projectName);
							progressList.push(formData[i].progress);
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList.push(null);
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList.push(null);
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							contentList.push(formData[i].content);
							memoList.push(formData[i].memo);
						}
						this.editWeekWorkContent(this.form.weekWorkId, serialList, projectCodeList, projectNameList, progressList, startDateList, endDateList, contentList, memoList)

					}
				})
			},
			editWeekWorkContent(weekWorkId, serialList, projectCodeList, projectNameList, progressList, startDateList, endDateList, contentList, memoList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkContentNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
						SERIAL_LIST:serialList,
						PROJECT_CODE_LIST: projectCodeList,
						PROJECT_NAME_LIST: projectNameList,
						PROGRESS_LIST: progressList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						CONTENT_LIST: contentList,
						MEMO_LIST: memoList
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
					that.$message('保存成功'),
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//下周工作内容的增加与修改
			onNextWeekWorkContentSubmit(nextWeekWorkContentForm) {
				this.$refs[nextWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[nextWeekWorkContentForm].nextWeekWorkContentList;

						let serialList = new Array();
						let projectNameList = new Array();
						let modularList = new Array();
						let taskList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let currentProgressList = new Array();
						let targetProgressList = new Array();

						for (let i = 0; i<formData.length; i++) {
							serialList.push(Number(i)+1);
							projectNameList.push(formData[i].projectName);
							modularList.push(formData[i].modular);
							taskList.push(formData[i].task)
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							currentProgressList.push(formData[i].currentProgress);
							targetProgressList.push(formData[i].targetProgress);
						}

						this.editNextWeekWorkContent(this.form.weekWorkId, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList)

					}
				})
			},
			editNextWeekWorkContent(weekWorkId, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateNextWeekWorkContentNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
                        SERIAL_LIST: serialList,
                        PROJECT_NAME_LIST:projectNameList,
						MODULAR_LIST: modularList,
						TASK_LIST: taskList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						CURRENT_PROGRESS_LIST: currentProgressList,
						TARGET_PROGRESS_LIST: targetProgressList
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
					that.$message('保存成功'),
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//上级交办的其他工作的增加与修改
			onWeekWorkOtherSubmit(weekWorkOtherForm) {
				this.$refs[weekWorkOtherForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[weekWorkOtherForm].weekWorkOtherList;

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
							todoWorkList.push(formData[i].todoWork);
							progressList.push(formData[i].progress);
							otherParticipantList.push(formData[i].otherParticipant)
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							participationMattersList.push(formData[i].participationMatters);
							memoList.push(formData[i].memo);
						}

						this.editWeekWorkOther(this.form.weekWorkId, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList)

					}
				})
			},
			editWeekWorkOther(weekWorkId, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkOtherNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
						TODO_WORK_LIST: todoWorkList,
                        SERIAL_LIST: serialList,
						PROGRESS_LIST: progressList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						OTHER_PARTICIPANT_LIST: otherParticipantList,
						PARTICIPATION_MATTERS_LIST: participationMattersList,
						MEMO_LIST: memoList
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
					that.$message('保存成功'),
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//筛选
			onScreeoutWeekWork(search_data) {
				this.search_data.startDatePage = this.search_data.startDate;
				this.search_data.endDatePage = this.search_data.endDate;

				this.getList({
					fun: () => {
					}
				});
			},
			//新增周工作内容数量
			addWeekWorkContentRow() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				this.weekWorkContentForm.weekWorkContentList.push({
					weekWorkContentId: '',
					projectCode: '',
					projectName: '',
					progress: '',
					startDate: new Date(m_time),
					endDate: new Date(m_time + oneDayLong * 6),
					content: '',
					memo: '',
				})
			},
			//新增下周工作内容数量
			addNextWeekWorkContentRow() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间
				this.nextWeekWorkContentForm.nextWeekWorkContentList.push({
					nextWeekWorkContentId: '',
					projectName: '',
					modular: '',
					task: '',
					startDate:new Date(m_time + oneDayLong * 7),
					endDate: new Date(m_time + oneDayLong * 13),
					currentProgress: '',
					targetProgress: '',
				})
			},
			//新增上级交办其他工作数量
			addWeekWorkOtherRow() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				this.weekWorkOtherForm.weekWorkOtherList.push({
					weekWorkOtherId: '',
					todoWork: '',
					progress: '',
					startDate: new Date(m_time),
					endDate: new Date(m_time + oneDayLong * 6),
					otherParticipant: '',
					participationMatters: '',
					memo: '',
				})
			},
            //移除周工作内容
			removeWeekWorkContentRow(){
                this.weekWorkContentForm.weekWorkContentList.splice(this.weekWorkContentForm.weekWorkContentList.length-1, 1);
            },
            //移除下周工作内容
			removeNextWeekWorkContentRow(){
                this.nextWeekWorkContentForm.nextWeekWorkContentList.splice(this.nextWeekWorkContentForm.nextWeekWorkContentList.length-1, 1);
            },
            //移除上级交办的其他工作哦
			removeWeekWorkOtherRow(){
                this.weekWorkOtherForm.weekWorkOtherList.splice(this.weekWorkOtherForm.weekWorkOtherList.length-1, 1);
            }
		},
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


