<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='search_data'
                    ref="search_data"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-input
                            v-model="search_data.draftorName"
                            placeholder="请输入起草人" style="width: 200px">
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-date-picker
                            v-model="search_data.WEEK_"
                            type="week"
                            name="WEEK_"
                            format="yyyy 第 WW 周"
                            placeholder="选择周"
                    >
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='onScreeoutWeekWork("search_data")'>筛选
                    </el-button>
                </el-form-item>

            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    :data="tableData"
                    style="width: 100%"
                    align='center'
                    :height="gridTableStyle.height"
                    v-loading="mainLoading"
            >
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
                        prop="WEEK_START_DATE_"
                        label="本周开始时间"
                        align='center'
                        width="200"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WEEK_END_DATE_"
                        label="本周结束时间"
                        align='center'
                        width="200"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_END_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="weekNum"
                        label="本月第几周"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="WEEK_"
                        label="本年第几周"
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
                :modal-append-to-body="false"
        >
            <div class="form">
                <el-form
                        ref="form"
                        :model="form"
                        :label-width="dialog.formLabelWidth"
                        v-loading="viewWeekWorkLoading"
                        style="margin:10px;width:auto;">
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="周工作报告" name="weekWork">
                            <el-form-item prop='deptName' label="部门:">
                                <el-input type="deptName" readonly v-model="form.deptName"></el-input>
                            </el-form-item>

                            <el-form-item prop='deptManagerName' label="部门负责人:">
                                <el-input type="deptManagerName" readonly v-model="form.deptManagerName"></el-input>
                            </el-form-item>

                            <el-form-item prop='posiName' label="岗位名称:">
                                <el-input type="posiName" readonly v-model="form.posiName"></el-input>
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
                                <span style="color: #BEBEBE; font-size: 12px">周一{{form.WEEK_START_DATE_}}  至  周日{{form.WEEK_END_DATE_}}</span>
                            </el-form-item>

                            <el-form-item style="display: none" prop='WEEK_START_DATE_' label="本周开始时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" readonly
                                                v-model.date="form.WEEK_START_DATE_"
                                                :picker-options="pickerStartDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item style="display: none" prop='WEEK_END_DATE_' label="本周结束时间:">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" readonly
                                                v-model.date="form.WEEK_END_DATE_"
                                                :picker-options="pickerEndDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='workEndDate' label="岗位职责:">
                                <el-input type="textarea" readonly v-model="form.posiResp"></el-input>
                            </el-form-item>

                            <el-form-item prop='selfEvaluation' label="自评综述:">
                                <el-input type="textarea" readonly v-model="form.selfEvaluation"></el-input>
                            </el-form-item>

                            <el-form-item prop='proposal' label="合理化建议:">
                                <el-input type="textarea" readonly v-model="form.proposal"></el-input>
                            </el-form-item>

                        </el-tab-pane>

                        <el-tab-pane label="周工作内容" name="weekWorkContent" :disabled="openDisabled">
                            <el-form class="weekWorkContentForm" :model="weekWorkContentForm" :inline="true"
                                     ref="weekWorkContentForm">
                                <el-row v-for="(item,index) in weekWorkContentForm.weekWorkContentList" :key="index">
                                    <el-form-item label="项目编码" :prop="'weekWorkContentList.' + index + '.projectCode'">
                                        <el-input v-model="item.projectCode" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目名称" :prop="'weekWorkContentList.' + index + '.projectName'">
                                        <el-input v-model="item.projectName" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务进度" :prop="'weekWorkContentList.' + index + '.progress'">
                                        <el-input v-model="item.progress" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkContentList.' + index + '.startDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkContentList.' + index + '.endDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="工作内容" :prop="'weekW    orkContentList.' + index + '.content'">
                                        <el-input type="textarea" v-model="item.content"
                                                  readonly style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注" label-width="67px"
                                                  :prop="'weekWorkContentList.' + index + '.memo'">
                                        <el-input type="textarea" v-model="item.memo" readonly
                                                  style="width: 750px"></el-input>
                                    </el-form-item>

                                    <hr/>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="下周工作内容" name="nextWeekWorkContent" :disabled="openDisabled">
                            <el-form class="nextWeekWorkContentForm" :model="nextWeekWorkContentForm" :inline="true"
                                     ref="nextWeekWorkContentForm">
                                <el-row v-for="(item,index) in nextWeekWorkContentForm.nextWeekWorkContentList"
                                        :key="index">
                                    <el-form-item label="项目名称"
                                                  :prop="'nextWeekWorkContentList.' + index + '.projectName'">
                                        <el-input v-model="item.projectName" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="功能模块" :prop="'nextWeekWorkContentList.' + index + '.modular'">
                                        <el-input v-model="item.modular" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="任务" :prop="'nextWeekWorkContentList.' + index + '.task'">
                                        <el-input v-model="item.task" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间"
                                                  :prop="'nextWeekWorkContentList.' + index + '.startDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'nextWeekWorkContentList.' + index + '.endDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目前进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.currentProgress'">
                                        <el-input v-model="item.currentProgress" readonly
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目标进度"
                                                  :prop="'nextWeekWorkContentList.' + index + '.targetProgress'">
                                        <el-input v-model="item.targetProgress" readonly
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <hr/>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="上级交办的其他工作" name="weekWorkOther" :disabled="openDisabled">
                            <el-form class="weekWorkOtherForm" :model="weekWorkOtherForm" :inline="true"
                                     ref="weekWorkOtherForm">
                                <el-row v-for="(item,index) in weekWorkOtherForm.weekWorkOtherList" :key="index">
                                    <el-form-item label="代办事项" :prop="'weekWorkOtherList.' + index + '.todoWork'">
                                        <el-input v-model="item.todoWork" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="进展情况" :prop="'weekWorkOtherList.' + index + '.progress'">
                                        <el-input v-model="item.progress" readonly style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="其他参与人"
                                                  :prop="'weekWorkOtherList.' + index + '.otherParticipant'">
                                        <el-input v-model="item.otherParticipant" readonly
                                                  style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" :prop="'weekWorkOtherList.' + index + '.startDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.startDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'weekWorkOtherList.' + index + '.endDate'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.endDate"
                                                        readonly style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="参与事项"
                                                  :prop="'weekWorkOtherList.' + index + '.participationMatters'">
                                        <el-input v-model="item.participationMatters" readonly
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注" label-width="67px"
                                                  :prop="'weekWorkOtherList.' + index + '.memo'">
                                        <el-input v-model="item.memo" readonly style="width: 750px"></el-input>
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
			return {
				mainLoading: true,
				viewWeekWorkLoading: true,
				tableData: [],
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 190
				},
				idFlag: false,
				sortnum: 0,
				search_data: {
					startDate: '',
					endDate: '',
					startDatePage: '',
					endDatePage: '',
					draftorName: '',
					draftorNamePage: '',
                    WEEK : ''
				},
				activeName: 'weekWork',
				openDisabled: true,
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
					formLabelWidth: '120px'
				},
				tab: {},
				form: {
					selfEvaluation: '',
					proposal: '',
					deptName: '',
					WEEK_START_DATE_: '',
					WEEK_END_DATE_: '',
					weekWorkId: '',
					posiResp: '',
					WEEK_: ''
				},
				item: {
					projectCode: ''
				},
				pickerStartDate: {
					disabledDate: (time) => {
						/*if (this.form.WEEK_END_DATE_ != "") {
							return time.getTime() > Date.now() || time.getTime() > this.form.WEEK_END_DATE_;
						} else {
							return time.getTime() > Date.now();
						}*/

					}
				},
				pickerEndDate: {
					disabledDate: (time) => {
						return time.getTime() < this.form.WEEK_START_DATE_;
						//return time.getTime() > this.form.WEEK_START_DATE_;
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
				this.mainLoading = true;
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

				let formData = this.search_data;

				let DRAFTOR_NAME_ = formData['draftorNamePage'];
				let FROM_START_DATE_ = formData['startDatePage'];
				let TO_START_DATE_ = formData['endDatePage'];
				let WEEK_ =  document.getElementsByName('WEEK_')[0].value;

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
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectWeekWork.do',
					data: {
						FROM_START_DATE_: FROM_START_DATE_,
						TO_START_DATE_: TO_START_DATE_,
						DRAFTOR_NAME_: DRAFTOR_NAME_,
						WEEK_: WEEK_,
						page: this.paginations.page_index,
						limit: this.paginations.page_size
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
						res.data.weekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								weekWorkId: item.WEEK_WORK_ID_,
								WEEK_START_DATE_: dtime(item.WEEK_START_DATE_).format('YYYY-MM-DD '),
								WEEK_END_DATE_: dtime(item.WEEK_END_DATE_).format('YYYY-MM-DD '),
								deptName: item.DEPT_NAME_,
								deptManagerName: item.DEPT_MANAGER_NAME_,
								posiName: item.POSI_NAME_,
								draftorName: item.DRAFTOR_NAME_,
								weekNum: item.WEEK_NUM_,
								WEEK_ : item.WEEK_,
							}
							that.tableData.push(tableItem);
						})

						that.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (res) {
						that.mainLoading = false;
					})
			},
			// 操作方法
			onView(row) {
				this.viewWeekWorkLoading = true;
				this.openDisabled = false;
				this.activeName = 'weekWork';
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
				//查看周工作报告
				this.$ajax.post(
					this.baseUrl + 'loadWeekWork.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
				).then(function (res) {
					if (res.data.success) {
						let posiResp = res.data.weekWork.POSI_RESP_;
						let selfEvaluation = res.data.weekWork.SELF_EVALUATION_;
						let proposal = res.data.weekWork.PROPOSAL_;
						let WEEK_START_DATE_ = res.data.weekWork.WEEK_START_DATE_;
						let WEEK_END_DATE_ = res.data.weekWork.WEEK_END_DATE_;

						// let form = res.data.weekWork;
						that.form.weekWorkId = row.weekWorkId;
						that.form.deptName = row.deptName;
						that.form.deptManagerName = row.deptManagerName;
						that.form.posiName = row.posiName;
						that.form.WEEK_START_DATE_ = WEEK_START_DATE_;
						that.form.WEEK_END_DATE_ = WEEK_END_DATE_;
						that.form.posiResp = posiResp;
						that.form.selfEvaluation = selfEvaluation;
						that.form.proposal = proposal;
						that.form.WEEK_ = WEEK_START_DATE_;
						that.viewWeekWorkLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}),
					//查看本周工作内容
					this.$ajax.post(
						this.baseUrl + 'selectWeekWorkContent.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
					).then(function (res) {
						if (res.data.success) {
							let itemData = res.data.weekWorkContentList;
							for (let i = 0; i < itemData.length; i++) {
								if (i != 0) {
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
						} else {
							that.$message.error(res.data.message);
						}
					}),
					//查看下周工作内容
					this.$ajax.post(
						this.baseUrl + 'selectNextWeekWorkContent.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
					).then(function (res) {
						if (res.data.success) {
							let itemData = res.data.nextWeekWorkContentList;
							for (let i = 0; i < itemData.length; i++) {
								if (i != 0) {
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
						} else {
							that.$message.error(res.data.message);
						}
					}),
					//查看上级交办的其他工作
					this.$ajax.post(
						this.baseUrl + 'selectWeekWorkOther.do?WEEK_WORK_ID_=' + row.weekWorkId + ''
					).then(function (res) {
						if (res.data.success) {
							let itemData = res.data.weekWorkOtherList;
							for (var i in itemData) {
								if (i != 0) {
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
						} else {
							that.$message.error(res.data.message);
						}
					})
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
			//修改周工作报告
			//筛选
			onScreeoutWeekWork(search_data) {
				this.search_data.startDatePage = this.search_data.startDate;
				this.search_data.endDatePage = this.search_data.endDate;
				this.search_data.draftorNamePage = this.search_data.draftorName;

				this.getList({
					fun: () => {
					}
				});
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

</style>


