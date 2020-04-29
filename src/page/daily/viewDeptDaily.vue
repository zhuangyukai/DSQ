<template>
    <div class="fillcontain">
        <el-row :gutter="20">
            <el-col :span="6">
                <div class="search_container">
                    <el-form
                            :inline="true"
                            :model='viewDeptDailyForm'
                            ref="viewDeptDailyForm"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-input
                                    v-model="viewDeptDailyForm.EMP_NAME_"
                                    placeholder="请输入员工姓名" style="width: 200px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_selectDeptEmp()'>筛选
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>
                <div class="table_container"
                     style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
                    <el-table
                            :data="deptEmpGrid.deptEmpList"
                            highlight-current-row
                            style="width: 100%"
                            align='center'
                            :height="deptEmpGrid.style.height"
                            v-loading="deptEmpGrid.mainLoading"
                            @row-click="_deptEmpOnClick"
                    >
                        <el-table-column
                                prop="POSI_NAME_"
                                label="岗位"
                                align='center'
                                width="220"
                                sortable
                        >
                        </el-table-column>
                        <el-table-column
                                prop="EMP_NAME_"
                                label="员工名称"
                                align='center'
                                sortable
                        >
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>
            <el-col :span="18">
                <div class="search_container">
                    <el-form
                            :inline="true"
                            :model='dailyForm'
                            ref="dailyForm"
                            class="demo-form-inline search-form">

                        <el-form-item>
                            <el-date-picker
                                    v-model="dailyForm.FROM_DAILY_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <span>-</span>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                    v-model="dailyForm.TO_DAILY_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_selectDaily()'>筛选
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_perExportReportingSituation()'>
                                生成汇报情况
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_perExportDaily()'>生成日报汇总
                            </el-button>
                        </el-form-item>

                    </el-form>
                </div>
                <div class="table_container"
                     style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04)">
                    <el-table
                            :data="dailyGrid.dailyList"
                            style="width: 100%"
                            align='center'
                            :height="dailyGrid.style.height"
                            v-loading="dailyGrid.mainLoading"
                    >
                        <el-table-column type="expand">
                            <template slot-scope="props">
                                <div class="testDivClass">
                                    <el-form label-position="left" inline class="demo-table-expand">
                                        <el-form-item label="项目名称:">
                                            <span>{{ props.row.PROJECT_NAME_ }}</span>
                                        </el-form-item>
                                        <el-form-item label="模块名称:">
                                            <span>{{ props.row.MODULE_NAME_ }}</span>
                                        </el-form-item>
                                        <el-form-item label="完成内容:">
                                            <span>{{ props.row.FINISHED_WORK_ }}</span>
                                        </el-form-item>
                                        <el-form-item label="未完成内容:">
                                            <span>{{ props.row.UNFINISHED_WORK_ }}</span>
                                        </el-form-item>
                                        <el-form-item label="工时:">
                                            <span>{{ props.row.WORKING_HOURS_ }}</span>
                                        </el-form-item>
                                    </el-form>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="PROJECT_NAME_"
                                label="项目名称"
                                align='center'
                                width="220"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="PROJECT_TYPE_CODE_"
                                label="项目类型"
                                align='center'
                                width="100"
                                sortable
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.PROJECT_TYPE }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="MODULE_NAME_"
                                label="模块名称"
                                align='center'
                                width="160"
                                sortable
                        >
                        </el-table-column>
                        <el-table-column
                                prop="IMPLEMENT_WORK_"
                                label="实施类型"
                                align='center'
                                min-width="100"
                                sortable
                        >
                            <template slot-scope="scope">
                                <span>{{ scope.row.IMPLEMENT_WORK }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="DAILY_TYPE_"
                                label="日报类型"
                                align='center'
                                width="100"
                                sortable>
                            <template slot-scope="scope">
                                <div v-if="!scope.row.editing">
                                    <span>{{ scope.row.DAILY_TYPE_LABEL }}</span>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="FINISHED_WORK_"
                                label="完成内容"
                                align='center'
                                sortable
                        >
                        </el-table-column>
                        <el-table-column
                                prop="DAILY_DATE_"
                                label="填报日期"
                                align='center'
                                sortable
                        >
                            <template slot-scope="scope">
                                <el-icon name="time"></el-icon>
                                <span style="margin-left: 10px;color:#66ccff">{{ scope.row.DAILY_DATE_ }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="WORKING_HOURS_"
                                label="工时"
                                align='center'
                                width="80"
                                sortable
                        >
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col :span="24">
                            <div class="pagination" style="height: 40px">
                                <el-pagination
                                        v-if='dailyGrid.paginations.total > 0'
                                        :page-sizes="dailyGrid.paginations.page_sizes"
                                        :page-size="dailyGrid.paginations.page_size"
                                        :layout="dailyGrid.paginations.layout"
                                        :total="dailyGrid.paginations.total"
                                        :current-page='dailyGrid.paginations.page_index'
                                        @current-change='handleCurrentChange'
                                        @size-change='handleSizeChange'>
                                </el-pagination>
                            </div>
                        </el-col>
                    </el-row>
                </div>
            </el-col>
        </el-row>
        <el-dialog
                :title="perExportReportingSituation.title"
                :visible.sync="perExportReportingSituation.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="perExportReportingSituation.style"
                :width="perExportReportingSituation.width"
        >
            <div class="search_container" style="height: 100px">
                <el-form
                        :inline="true"
                        :model='exportDailyForm'
                        ref="exportDailyForm"
                        class="demo-form-inline search-form">

                    <el-form-item prop='START_DATE_'
                            :rules="[{ required: true, message: '时间不能为空' ,trigger: 'blur' }]">
                        <el-date-picker
                                v-model="exportDailyForm.START_DATE_"
                                type="date"
                                placeholder="请选择起始时间"
                                :picker-options="pickerOptionsStart"

                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item>
                        <span>-</span>
                    </el-form-item>
                    <el-form-item prop='END_DATE_' :rules="[{ required: true, message: '时间不能为空' ,trigger: 'blur' }]">
                        <el-date-picker
                                v-model="exportDailyForm.END_DATE_"
                                type="date"
                                placeholder="请选择结束时间"
                                :picker-options="pickerOptionsEnd"
                        >
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item class="btnRight">
                        <el-button type="primary" size="mini" icon="search" :loading="exportDailyForm.buttonLoading"
                                   @click='_exportDailyReportingSituation("exportDailyForm")'>确定
                        </el-button>
                    </el-form-item>

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
		name: "viewDeptDaily",
		data() {
			return {
				ifFlag: false,
				viewDeptDailyForm: {
					EMP_NAME_: ''
				},
				dailyForm: {
					DAILY_DATE_: '',
					FROM_DAILY_DATE_: '',
					TO_DAILY_DATE_: ''
				},
				deptEmpGrid: {
					style: {
						width: '100%',
						height: window.screen.height / 2 + 230
					},
					mainLoading: false,
					deptEmpList: [],
					currentRow: []
				},
				dailyGrid: {
					sortnum: 0,
					style: {
						width: '100%',
						height: window.screen.height / 2 + 190
					},
					mainLoading: false,
					dailyList: [],
					paginations: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
				perExportReportingSituation: {
					width: '530px',
					style: {
						height: '500px',
					},
					show: false,
					title: '选择时间范围',
					windowLoading: false,
					dialogVisible: true
				},
				exportDailyForm: {
					START_DATE_: '',
					END_DATE_: '',
					buttonLoading: false,
					exportType: true
				},
				//导入EXCEL起始时间
				pickerOptionsStart: {
					disabledDate: time => {
						let endDateVal = this.exportDailyForm.END_DATE_;
						if (endDateVal) {
							return time.getTime() > new Date(endDateVal).getTime();
						}
					}
				},
				pickerOptionsEnd: {
					disabledDate: time => {
						let beginDateVal = this.exportDailyForm.START_DATE_;
						if (beginDateVal) {
							return (
								time.getTime() < new Date(beginDateVal).getTime()
							);
						}
					},
				},
				dailyTypeList: [],
				CODE_LIST: [],
				projectTypeCodeMapList: [],
				implementWorkCodeMapList: []
			}
		},
		mounted() {
			//加载数据之前，先加载theme颜色
			this.getList({
				fun: () => {
				}
			});
		},
		created() {
			this._selectCode();
		},
		methods: {
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
							if(that.CODE_LIST[i].CATEGORY_ == 'DAILY_TYPE'){
								that.dailyTypeList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_TYPE'){
								that.projectTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'IMPLEMENT_WORK'){
								that.implementWorkCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.deptEmpGrid.mainLoading = true;
				let formData = this.viewDeptDailyForm;
				let userinfo = mutils.getStore('userinfo')
				// 封装  get,path,params,fn,errfn
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpByOrgPosi.do',
					data: {
						POSI_EMP_ID_: userinfo.posiEmpId,
						EMP_NAME_: this.viewDeptDailyForm.EMP_NAME_
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
						that.deptEmpGrid.deptEmpList = [];
						let empList = res.data.empList;
						for (let i = 0; i < empList.length; i++) {
							const tableItem = {
								EMP_ID_: empList[i].EMP_ID_,
								POSI_NAME_: empList[i].POSI_NAME_,
								EMP_NAME_: empList[i].EMP_NAME_,
							};
							that.deptEmpGrid.deptEmpList.push(tableItem);
						}
						that.deptEmpGrid.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.deptEmpGrid.mainLoading = false;
				})
			},
			_selectDeptEmp() {
				this.getList();
			},
			_selectDaily({
							 page,
							 page_size,
							 where,
							 fun
						 } = {}) {
				if (this.deptEmpGrid.currentRow == null || this.deptEmpGrid.currentRow == '') {
					this.$message.warning('请先选择一位员工');
					return;
				}


				this.dailyGrid.mainLoading = true;
				var query = this.$route.query;
				this.dailyGrid.paginations.page_index = page || parseInt(query.page) || 1;
				this.dailyGrid.paginations.page_size = page_size || parseInt(query.page_size) || this.dailyGrid.paginations.page_size;
				var data = {
					pageIndex: this.dailyGrid.paginations.page_index,
					pageSize: this.dailyGrid.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let FROM_DAILY_DATE_;
				let TO_DAILY_DATE_;
				if (mutils.isEmpty(this.dailyForm.FROM_DAILY_DATE_)) {
					FROM_DAILY_DATE_ = "";
				} else {
					FROM_DAILY_DATE_ = mutils.formatDate(new Date(this.dailyForm.FROM_DAILY_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(this.dailyForm.TO_DAILY_DATE_)) {
					TO_DAILY_DATE_ = "";
				} else {
					TO_DAILY_DATE_ = mutils.formatDate(new Date(this.dailyForm.TO_DAILY_DATE_)); // 毫秒数，时间戳
				}
				// 封装  get,path,params,fn,errfn
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectDaily.do',
					data: {
						DRAFTOR_ID_: this.deptEmpGrid.currentRow.EMP_ID_,
						FROM_DAILY_DATE_: FROM_DAILY_DATE_,
						TO_DAILY_DATE_: TO_DAILY_DATE_,
						limit: this.dailyGrid.paginations.page_size,
						page: this.dailyGrid.paginations.page_index
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
						that.dailyGrid.paginations.total = res.data.total;
						that.dailyGrid.dailyList = [];

						let dailyList = res.data.dailyList;

						for (let i = 0; i < dailyList.length; i++) {
							let type = "";
							if(dailyList[i].PROJECT_TYPE_CODE_.substring(0,2) == "WB"){
								type = "外部-" + that.projectTypeCodeMapList[dailyList[i].PROJECT_TYPE_CODE_]
							}else if(dailyList[i].PROJECT_TYPE_CODE_.substring(0,2) == "NB"){
								type = "内部-" + that.projectTypeCodeMapList[dailyList[i].PROJECT_TYPE_CODE_]
							}else{
								type = "";
							}
							const tableItem = {
								sortnum: that.dailyGrid.sortnum + (i + 1),
								DAILY_ID_: dailyList[i].DAILY_ID_,
								PROJECT_NAME_: dailyList[i].PROJECT_NAME_,
								MODULE_NAME_: dailyList[i].MODULE_NAME_,
								FINISHED_WORK_: dailyList[i].FINISHED_WORK_,
								UNFINISHED_WORK_: dailyList[i].UNFINISHED_WORK_,
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								DAILY_DATE_: dailyList[i].DAILY_DATE_,
								DAILY_TYPE_: dailyList[i].DAILY_TYPE_,
								DAILY_TYPE_LABEL: that.dailyTypeList[dailyList[i].DAILY_TYPE_],
								PROJECT_TYPE_CODE_: dailyList[i].PROJECT_TYPE_CODE_,
								PROJECT_TYPE: type,
								IMPLEMENT_WORK_: dailyList[i].IMPLEMENT_WORK_,
								IMPLEMENT_WORK: that.implementWorkCodeMapList[dailyList[i].IMPLEMENT_WORK_],
							};
							that.dailyGrid.dailyList.push(tableItem);
						}
						that.dailyGrid.mainLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.dailyGrid.mainLoading = false;
				})
			},
			_perExportReportingSituation() {
				this.exportDailyForm.exportType = true;
				this.perExportReportingSituation.show = true;
				this.perExportReportingSituation.dialogVisible = true;
			},
			_perExportDaily() {
				this.exportDailyForm.exportType = false;
				this.perExportReportingSituation.show = true;
				this.perExportReportingSituation.dialogVisible = true;
			},
			_exportDailyReportingSituation(exportDailyForm) {
				this.$refs[exportDailyForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let that = this;
						this.exportDailyForm.buttonLoading = true;
						let START_DATE_;
						let END_DATE_;
						if (mutils.isEmpty(this.exportDailyForm.START_DATE_)) {
							START_DATE_ = "";
						} else {
							START_DATE_ = mutils.formatDate(new Date(this.exportDailyForm.START_DATE_)); // 毫秒数，时间戳
						}

						if (mutils.isEmpty(this.exportDailyForm.END_DATE_)) {
							END_DATE_ = "";
						} else {
							END_DATE_ = mutils.formatDate(new Date(this.exportDailyForm.END_DATE_)); // 毫秒数，时间戳
						}
						//导出汇报详情
						if (this.exportDailyForm.exportType) {
							axios({
								method: 'POST',
								url: this.baseUrl + 'exportDailyReportingSituation.do',
								data: {
									EMP_NAME_: this.viewDeptDailyForm.EMP_NAME_,
									POSI_EMP_ID_: mutils.getStore('userinfo').posiEmpId,
									START_DATE_: START_DATE_,
									END_DATE_: END_DATE_
								},
								transformRequest: [function (data) {
									let ret = ''
									for (let it in data) {
										ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
									}
									return ret
								}],
								headers: {'Content-Type': "application/x-www-form-urlencoded"},
								responseType: 'blob'
							}).then(function (res) {
								that.download(res.data);
								that.exportDailyForm.buttonLoading = false;
								//that.getProjectList();
							}).catch(function (err) {
								/*请求失败*/
								that.$message.error('系统错误请联系管理员')
								that.exportDailyForm.buttonLoading = false;
							})
						} else {
							//导出日报汇报内容
							axios({
								method: 'POST',
								url: this.baseUrl + 'exportDeptDaily.do',
								data: {
									EMP_NAME_: this.viewDeptDailyForm.EMP_NAME_,
									POSI_EMP_ID_: mutils.getStore('userinfo').posiEmpId,
									START_DATE_: START_DATE_,
									END_DATE_: END_DATE_
								},
								transformRequest: [function (data) {
									let ret = ''
									for (let it in data) {
										ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
									}
									return ret
								}],
								headers: {'Content-Type': "application/x-www-form-urlencoded"},
								responseType: 'blob'
							}).then(function (res) {
								that.download(res.data);
								that.exportDailyForm.buttonLoading = false;
								//that.getProjectList();
							}).catch(function (err) {
								/*请求失败*/
								that.$message.error('系统错误请联系管理员')
								that.exportDailyForm.buttonLoading = false;
							})
						}
					}
				})

			},
			// 下载文件
			download(data) {
				if (!data) {
					return
				}
				let url = window.URL.createObjectURL(new Blob([data]))
				let link = document.createElement('a')
				link.style.display = 'none'
				link.href = url
				link.setAttribute('download', '日报汇报情况.xls')

				document.body.appendChild(link)
				link.click()
			},
			_deptEmpOnClick(row, column, event) {
				this.deptEmpGrid.currentRow = row;
				this._selectDaily();
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this._selectDaily({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.dailyGrid.sortnum = this.dailyGrid.paginations.page_size * (page - 1);
				this._selectDaily({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			}
		}

	}
</script>

<style>
    .btnRight {
        float: right;
        margin-right: 18px !important;
    }

    .demo-table-expand {
        font-size: 0;
    }

    .testDivClass .el-form-item__label {
        width: 90px;
        color: #99a9bf;
    }

    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 100%;
    }
</style>
