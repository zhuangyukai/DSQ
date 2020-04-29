<template>
    <div class="fillcontain">
        <div>
            <el-form
                    :inline="true"
                    :model='search_data'
                    ref="search_data"
                    >
                <el-form-item>
                    <el-date-picker
                            v-model="search_data.WEEK_"
                            type="week"
                            name="WEEK_"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                    >
                    </el-date-picker>
                    汇报情况
                    <el-select v-model="search_data.reportStatus" placeholder="请选择汇报情况">
                        <el-option
                                v-for="item in search_data.reportStatuss"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='onScreeoutMoney("search_data")'>筛选
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
        <div>
            <el-table
                    v-loading= "mainloading"
                    :data="tableData"
                    :height="gridTableStyle.height"
                    style="width: 100%"
                    align='center'
                    >
                <el-table-column
                        v-if="idFlag"
                        prop="WEEK_WORK_ID_"
                        label="周工作报告ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="ORG_NAME_"
                        label="部门名称"
                        sortable
                        align='left'
                >
                </el-table-column>
                <el-table-column
                        prop="EMP_NAME_"
                        label="员工姓名"
                        align='left'
                        sortable
                        width="240">
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="90">
                    <template slot-scope='scope'>
                        <el-button
                                v-if="test(scope.row)"
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='onView(scope.row)'
                        >查看
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
                        v-loading= "diagloading"
                        ref="form"
                        :model="form"
                        :label-width="dialog.formLabelWidth"
                        style="margin:10px;width:auto;">
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="周工作报告" name="weekWork">
                            <el-form-item prop='ORG_NAME_' label="部门:">
                                <el-input type="ORG_NAME_" :readonly="true" v-model="form.ORG_NAME_"></el-input>
                            </el-form-item>

                            <el-form-item prop='deptManagerName' label="部门负责人:">
                                <el-input type="deptManagerName" :readonly="true" v-model="form.deptManagerName"></el-input>
                            </el-form-item>

                            <el-form-item prop='posiName' label="岗位名称:">
                                <el-input type="posiName" :readonly="true" v-model="form.posiName"></el-input>
                            </el-form-item>

                            <el-form-item prop='WEEK_' label="本周时间:"
                                          :rules="[{ required: true, message: '请选择那一周' ,trigger: 'blur' }]">
                                <el-date-picker
                                        readonly
                                        v-model="form.WEEK_"
                                        type="week"
                                        name="WEEK_"
                                        format="yyyy 第 WW 周"
                                        placeholder="选择周"
                                >
                                </el-date-picker>
                                <span style="color: #BEBEBE; font-size: 12px">周一{{form.weekStartDate}}  至  周日{{form.weekEndDate}}</span>
                            </el-form-item>

                            <el-form-item style="display: none" prop='weekStartDate' label="本周开始时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" :readonly="true" v-model.date="form.weekStartDate"
                                                :picker-options="pickerStartDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item style="display: none" prop='weekEndDate' label="本周结束时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" :readonly="true" v-model.date="form.weekEndDate"
                                                :picker-options="pickerEndDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='workEndDate' label="岗位职责:">
                                <el-input type="textarea" :readonly="true" v-model="form.posiResp"></el-input>
                            </el-form-item>

                            <el-form-item prop='selfEvaluation' label="自评综述:">
                                <el-input type="textarea" :readonly="true" v-model="form.selfEvaluation"></el-input>
                            </el-form-item>

                            <el-form-item prop='proposal' label="合理化建议:">
                                <el-input type="textarea" :readonly="true" v-model="form.proposal"></el-input>
                            </el-form-item>

                        </el-tab-pane>

                        <el-tab-pane label="周工作内容" name="weekWorkContent"     >
                            <el-form class="weekWorkContentForm" :model="weekWorkContentForm" :inline="true"
                                     ref="weekWorkContentForm">
                                <el-row v-for="(item,index) in weekWorkContentForm.weekWorkContentList" :key="index">
                                    <el-form-item label="项目编码" :prop="'weekWorkContentList.' + index + '.projectCode'" >
                                        <el-input v-model="item.projectCode" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目名称" :prop="'weekWorkContentList.' + index + '.projectName'" >
                                        <el-input v-model="item.projectName" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务进度" :prop="'weekWorkContentList.' + index + '.progress'" >
                                        <el-input v-model="item.progress" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkContentList.' + index + '.startDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkContentList.' + index + '.endDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="工作内容"  :prop="'weekW    orkContentList.' + index + '.content'">
                                        <el-input type="textarea" v-model="item.content"
                                                  :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注"  label-width="67px" :prop="'weekWorkContentList.' + index + '.memo'">
                                        <el-input type="textarea" v-model="item.memo" :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>

                                    <hr/>
                                </el-row>
                            </el-form>
                        </el-tab-pane >

                        <el-tab-pane label="下周工作内容" name="nextWeekWorkContent" >
                            <el-form class="nextWeekWorkContentForm" :model="nextWeekWorkContentForm" :inline="true"
                                     ref="nextWeekWorkContentForm">
                                <el-row v-for="(item,index) in nextWeekWorkContentForm.nextWeekWorkContentList"
                                        :key="index">
                                    <el-form-item label="项目名称"
                                                  :prop="'nextWeekWorkContentList.' + index + '.projectName'" >
                                        <el-input v-model="item.projectName" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="功能模块" :prop="'nextWeekWorkContentList.' + index + '.modular'" >
                                        <el-input v-model="item.modular" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务" :prop="'nextWeekWorkContentList.' + index + '.task'" >
                                        <el-input v-model="item.task" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间"
                                                  :prop="'nextWeekWorkContentList.' + index + '.startDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'nextWeekWorkContentList.' + index + '.endDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目前进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.currentProgress'" >
                                        <el-input v-model="item.currentProgress" :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目标进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.targetProgress'" >
                                        <el-input v-model="item.targetProgress" :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <hr/>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="上级交办的其他工作" name="weekWorkOther"  >
                            <el-form class="weekWorkOtherForm" :model="weekWorkOtherForm" :inline="true"
                                     ref="weekWorkOtherForm">
                                <el-row v-for="(item,index) in weekWorkOtherForm.weekWorkOtherList" :key="index">
                                    <el-form-item label="代办事项" :prop="'weekWorkOtherList.' + index + '.todoWork'" >
                                        <el-input v-model="item.todoWork" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="进展情况" :prop="'weekWorkOtherList.' + index + '.progress'" >
                                        <el-input v-model="item.progress" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="其他参与人"
                                                  :prop="'weekWorkOtherList.' + index + '.otherParticipant'">
                                        <el-input v-model="item.otherParticipant" :readonly="true" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkOtherList.' + index + '.startDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkOtherList.' + index + '.endDate'" >
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        :readonly="true" style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="参与事项"
                                                  :prop="'weekWorkOtherList.' + index + '.participationMatters'" >
                                        <el-input v-model="item.participationMatters" :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注" label-width="67px" :prop="'weekWorkOtherList.' + index + '.memo'">
                                        <el-input v-model="item.memo" :readonly="true" style="width: 750px"></el-input>
                                    </el-form-item>
                                    <hr/>
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
			let validateData = (rule, value, callback) => {

			};
			return {
				diagloading : false,
				mainloading : false,
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 190
				},
				search_data: {
					week: '',
                    weekPage: '',
					weeks: [],
					reportStatus :'',
					reportStatusPage : '',
					reportStatuss : [{
						value : 1,
						label : '已汇报'
					}, {
						value : 0,
						label : '未汇报'
					} ],
					year: '',
                    yearPage: '',
					years: [],
					month: '',
                    monthPage: '',
					months: [],
                    WEEK_ : new Date()
				},
				tableData: [],
				tableHeight: '',
				idFlag: false,
				weekWorkId: '',
				sortnum: 0,
				activeName:'weekWork',
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
				form: {
					selfEvaluation: '',
					proposal: '',
					ORG_NAME_: '',
					weekStartDate: '',
					weekEndDate: '',
					WEEK_ : ''
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
		created() {
			let date = new Date();
			let tempYears = [];
			for (let i = date.getFullYear() - 9; i <= date.getFullYear() + 2; i++) {
				tempYears.push({
					value: i,
					label: i + ' 年'
				});
			}
			let tempMonths = [];
			for (let i = 1; i <= 12; i++) {
				tempMonths.push({
					value: i,
					label: i + " 月"
				});
			}
			let tempWeeks = [];
			for (let i = 1; i <= 6; i++) {
				tempWeeks.push({
					value: i,
					label: "第" + i + "周"
				});
			}
			let dateweek = new Date(date.getFullYear(), parseInt(date.getMonth() + 1) - 1, date.getDate()), w = dateweek.getDay(), d = dateweek.getDate();
			let weekTemp = Math.ceil((d + 6 - w) / 7);

			this.search_data.years = tempYears;
			this.search_data.months = tempMonths;
			this.search_data.weeks = tempWeeks;
			this.search_data.year = date.getFullYear();
			this.search_data.month = date.getMonth() + 1;
			this.search_data.week = weekTemp > 4 ? 1 : weekTemp;
			//this.search_data.WEEK_ = new Date();
			this.search_data.reportStatus  = 0;

			//第一次赋值查询
			this.search_data.monthPage = this.search_data.month;
			this.search_data.yearPage= this.search_data.year;
			this.search_data.weekPage = this.search_data.week;
			this.search_data.reportStatusPage = this.search_data.reportStatus;
		},
        mounted(){
			this.getList();
        },
		methods: {
			test(row){
				if(mutils.isEmpty(row.WEEK_WORK_ID_)){
					return false;
                }else{
					return true;
                }
            },
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
				if(document.getElementsByName('WEEK_')[0].value == null || document.getElementsByName('WEEK_')[0].value == ''){
					this.$message.warning('请选择时间');
					return;
                }


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
				const MONTH_ = formData['monthPage'];
				const YEAR_ = formData['yearPage'];
				const WEEK_NUM_ = formData['weekPage'];
				const reportStatus = formData['reportStatusPage'];
				// 封装  get,path,params,fn,errfn
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpWeekWork.do',
					data: {
						YEAR_: YEAR_,
						MONTH_: MONTH_,
						WEEK_NUM_: WEEK_NUM_,
						reportStatus : reportStatus,
						WEEK_ : document.getElementsByName('WEEK_')[0].value,
						limit: this.paginations.page_size,
						page: this.paginations.page_index
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
						that.paginations.total = res.data.total;
						that.tableData = [];
						res.data.empWeekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								WEEK_WORK_ID_: item.WEEK_WORK_ID_,
								ORG_NAME_: item.ORG_NAME_,
								POSI_NAME_: item.POSI_NAME_,
								EMP_NAME_: item.EMP_NAME_,
								POSI_MEMO_ : item.POSI_MEMO_
							}
							that.tableData.push(tableItem);
						})
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
			getList2({
						page,
						page_size,
						where,
						fun
					} = {}) {
				if(document.getElementsByName('WEEK_')[0].value == null || document.getElementsByName('WEEK_')[0].value == ''){
					this.$message.warning('请选择时间');
					return;
				}


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
				const MONTH_ = formData['monthPage'];
				const YEAR_ = formData['yearPage'];
				const WEEK_NUM_ = formData['weekPage'];
				const reportStatus = formData['reportStatusPage'];
				// 封装  get,path,params,fn,errfn
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpWeekWork.do',
					data: {
						YEAR_: YEAR_,
						MONTH_: MONTH_,
						WEEK_NUM_: WEEK_NUM_,
						reportStatus : reportStatus,
						WEEK_ : document.getElementsByName('WEEK_')[0].value,
						limit: this.paginations.page_size,
						page: this.paginations.page_index
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
						that.paginations.total = res.data.total;
						that.tableData = [];
						res.data.empWeekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								WEEK_WORK_ID_: item.WEEK_WORK_ID_,
								ORG_NAME_: item.ORG_NAME_,
								POSI_NAME_: item.POSI_NAME_,
								EMP_NAME_: item.EMP_NAME_,
								POSI_MEMO_ : item.POSI_MEMO_
							}
							that.tableData.push(tableItem);
						})
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
			// 操作方法
			onView(row) {
				this.diagloading = true;
				this.activeName='weekWork';
				this.form = {
					selfEvaluation: '',
					proposal: '',
					ORG_NAME_: '',
					weekStartDate: '',
					weekEndDate: '',
                    deptManagerName: '',
                    posiResp: '',
                    posiName : '',
					WEEK_ : ''
                };
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

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'selectWeekWorkInforNew.do?WEEK_WORK_ID_=' + row.WEEK_WORK_ID_ + ''
				).then(function (res) {
					if(res.data.success == true){
						let weekWork = res.data.weekWorkInforNew.weekWork;
						that.form.weekWorkId = row.WEEK_WORK_ID_;
						that.form.ORG_NAME_ = row.ORG_NAME_;
						that.form.deptManagerName =  weekWork.DEPT_MANAGER_NAME_;
						that.form.posiName = weekWork.POSI_NAME_;
						that.form.weekStartDate = weekWork.WEEK_START_DATE_;
						that.form.weekEndDate = weekWork.WEEK_END_DATE_;
						that.form.posiResp = weekWork.POSI_RESP_;
						that.form.selfEvaluation = weekWork.SELF_EVALUATION_;
						that.form.proposal = weekWork.PROPOSAL_;
						that.form.WEEK_ = weekWork.WEEK_START_DATE_;
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
				this.dialog.title = '查看周工作报告信息';
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
			//筛选
			onScreeoutMoney(search_data) {
				this.search_data.monthPage = this.search_data.month;
				this.search_data.yearPage= this.search_data.year;
				this.search_data.weekPage = this.search_data.week;
				this.search_data.reportStatusPage = this.search_data.reportStatus;
				this.getList({
					fun: () => {
					}
				});
				/*this.$refs[search_data].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this.search_data;
						let data = {};
						const FROM_START_DATE_ = formData['startDate'];
						const TO_START_DATE_ = formData['endDate'];

						if (mutils.isEmpty(FROM_START_DATE_)) {
							data.FROM_START_DATE_ = "";
						} else {
							data.FROM_START_DATE_ = mutils.formatDate(new Date(FROM_START_DATE_)); // 毫秒数，时间戳
						}
						if (mutils.isEmpty(TO_START_DATE_)) {
							data.TO_START_DATE_ = "";
						} else {
							data.TO_START_DATE_ = mutils.formatDate(new Date(TO_START_DATE_));
						}
						let that = this;

						this.$ajax.post(
							'http://10.18.26.114:9090/DS/selectWeekWork.do?FROM_START_DATE_=' + data.FROM_START_DATE_ + '&TO_START_DATE_=' + data.TO_START_DATE_ + ''
						).then(function (res) {
							that.paginations.total = res.data.total;
							that.tableData = [];
							res.data.weekWorkList.forEach((item, index) => {
								const tableItem = {
									sortnum: that.sortnum + (index + 1),
									WEEK_WORK_ID_: item.WEEK_WORK_ID_,
									ORG_NAME_: item.ORG_NAME_,
									POSI_NAME_: item.POSI_NAME_,
									EMP_NAME_: item.EMP_NAME_
								}
								that.tableData.push(tableItem);
							})
						})
							.catch(function (res) {
							})
					}
				})*/


			},
			//工作做内容增加
			//点击新增周工作内容
			addWeekWorkContentRow(){
				this.weekWorkContentForm.weekWorkContentList.push({
					WEEK_WORK_CONTENT_ID_: '',
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					CONTENT_: '',
					MEMO_: '',
				})
			},
			//新增下周工作内容
			addNextWeekWorkContentRow(){
				this.nextWeekWorkContentForm.nextWeekWorkContentList.push({
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
				})
			},
			//新增下级交办的其他工作
			addWeekWorkOtherRow(){
				let that = this;
				this.weekWorkOtherForm.weekWorkOtherList.push({
					WEEK_WORK_OTHER_ID_: '',
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				})

			},

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
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #99a9bf;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

</style>
