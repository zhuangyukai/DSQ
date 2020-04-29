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
                            :model='viewEmpDailyForm'
                            ref="viewEmpDailyForm"
                            class="demo-form-inline search-form">

                        <el-form-item>
                            <el-date-picker
                                    v-model="viewEmpDailyForm.FROM_DAILY_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <span>-</span>
                        </el-form-item>
                        <el-form-item>
                            <el-date-picker
                                    v-model="viewEmpDailyForm.TO_DAILY_DATE_"
                                    type="date"
                                    placeholder="请选择时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item style="display: none">
                            <el-input
                                    clearable
                                    v-model="viewEmpDailyForm.PROJECT_ID_"
                                    style="width: 200px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            项目名称
                            <el-input
                                    clearable
                                    v-model="viewEmpDailyForm.PROJECT_NAME_"
                                    @focus="_preChooseProject()"
                                    placeholder="请填写项目" style="width: 200px">
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            项目类型
                            <el-cascader v-model="viewEmpDailyForm.PROJECT_TYPE_" clearable collapse-tags
                                         placeholder="请选择项目类型"
                                         :options="projectTypeList"
                                         :props="{
                                            value: 'CODE_',
                                            label: 'NAME_',
                                            children: 'children',
                                            multiple: true
                                         }"
                                         clearable>
                            </el-cascader>

                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_selectViewEmpDaily()'>筛选
                            </el-button>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="search" @click='_perExportViewEmpDaily()' :loading="viewEmpDailyForm.buttonLoading">生成日报汇总
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
                                width="200"
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
                                width="400"
                                sortable
                        >
                        </el-table-column>
                        <el-table-column
                                prop="DAILY_DATE_"
                                label="填报日期"
                                align='center'
                                sortable
                                width="150"
                        >
                            <template slot-scope="scope">
                                <el-icon name="time"></el-icon>
                                <span style="margin-left: 10px;color:#66ccff">{{ scope.row.DAILY_DATE_ }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="EMP_NAME_"
                                label="填报人"
                                align='center'
                                width="100"
                                sortable
                        >
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
                                        @current-change='handleCurrentChangeDailyGrid'
                                        @size-change='handleSizeChangeDailyGrid'>
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
		name: "viewEmpDaily",
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
				viewEmpDailyForm: {
					buttonLoading: false,
					FROM_DAILY_DATE_: '',
					TO_DAILY_DATE_: '',
					PROJECT_ID_: '',
					PROJECT_NAME_: '',
					PROJECT_TYPE_: ''
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
				numbers: [],
				multipleSelection: [],
				CODE_LIST: [],
				projectTypeList: [],
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
				projectTypeCodeMapList: [],
                max_dailyDate: '',
				min_dailyDate: '',
				dailyTypeList: [],
				CODE_WORK_LIST: [],
				implementWorkCodeMapList: []
			}
		},
		created() {
			this.doSyncMethod();
		},
		methods: {
			async doSyncMethod() {
				await this._selectOrg();
				await this._selectCode();
				await this.selectByCategory();
			},
			async selectByCategory() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectByCategory.do',
					data: {
						CATEGORY_: 'PROJECT_TYPE'
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
						that.projectTypeList = res.data.children;
						that.CODE_LIST = res.data.codeList;
						for(let i = 0; i<that.CODE_LIST.length; i++){
							that.projectTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
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
						that.CODE_WORK_LIST = res.data.codeList;
						for(let i = 0; i<that.CODE_WORK_LIST.length; i++){
							if(that.CODE_WORK_LIST[i].CATEGORY_ == 'DAILY_TYPE'){
								that.dailyTypeList[that.CODE_WORK_LIST[i].CODE_] = that.CODE_WORK_LIST[i].NAME_;
							}
							if(that.CODE_WORK_LIST[i].CATEGORY_ == 'IMPLEMENT_WORK'){
								that.implementWorkCodeMapList[that.CODE_WORK_LIST[i].CODE_] = that.CODE_WORK_LIST[i].NAME_;
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
				that.dailyGrid.dailyList = [];
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
						that._selectViewEmpDaily();
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
				this._selectViewEmpDaily();
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
			//查询项目
			_selectViewEmpDaily({
									page,
									page_size,
									where,
									fun
								} = {}) {
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
				let PROJECT_ID_LIST = [];

				let FROM_DAILY_DATE_;
				let TO_DAILY_DATE_;
				let PROJECT_TYPE = [];
				if (mutils.isEmpty(this.viewEmpDailyForm.FROM_DAILY_DATE_)) {
					FROM_DAILY_DATE_ = "";
				} else {
					FROM_DAILY_DATE_ = mutils.formatDate(new Date(this.viewEmpDailyForm.FROM_DAILY_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(this.viewEmpDailyForm.TO_DAILY_DATE_)) {
					TO_DAILY_DATE_ = "";
				} else {
					TO_DAILY_DATE_ = mutils.formatDate(new Date(this.viewEmpDailyForm.TO_DAILY_DATE_)); // 毫秒数，时间戳
				}
				if (this.viewEmpDailyForm.PROJECT_ID_ == "" || this.viewEmpDailyForm.PROJECT_ID_ == null || this.viewEmpDailyForm.PROJECT_ID_ == undefined) {
					PROJECT_ID_LIST = [];
				} else {
					PROJECT_ID_LIST = this.viewEmpDailyForm.PROJECT_ID_;
				}
				if (this.viewEmpDailyForm.PROJECT_NAME_ == "" || this.viewEmpDailyForm.PROJECT_NAME_ == null || this.viewEmpDailyForm.PROJECT_NAME_ == undefined) {
					PROJECT_ID_LIST = [];
				}
				let that = this;
				let DRAFTOR_ID_LIST = [];
				for (let j = 0; j < that.multipleSelection.length; j++) {
					DRAFTOR_ID_LIST.push(that.multipleSelection[j].EMP_ID_)
				}
				if (this.viewEmpDailyForm.PROJECT_TYPE_ == "" || this.viewEmpDailyForm.PROJECT_TYPE_ == null || this.viewEmpDailyForm.PROJECT_TYPE_ == undefined) {
					PROJECT_TYPE = [];
				} else {
					PROJECT_TYPE = this.viewEmpDailyForm.PROJECT_TYPE_;
				}

				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpDaily.do',
					data: {
						PROJECT_TYPE_LIST: PROJECT_TYPE,
						DRAFTOR_ID_LIST: DRAFTOR_ID_LIST,
						FROM_DAILY_DATE_: FROM_DAILY_DATE_,
						TO_DAILY_DATE_: TO_DAILY_DATE_,
						PROJECT_ID_LIST: PROJECT_ID_LIST,
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
								PROJECT_TYPE_CODE_: dailyList[i].PROJECT_TYPE_CODE_,
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								DAILY_DATE_: dailyList[i].DAILY_DATE_,
								EMP_NAME_: dailyList[i].EMP_NAME_,
								PROJECT_TYPE: type,
								DAILY_TYPE_: dailyList[i].DAILY_TYPE_,
								DAILY_TYPE_LABEL: that.dailyTypeList[dailyList[i].DAILY_TYPE_],
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
					/!*请求失败*!/
					that.$message.error('操作失败请重试')
					that.dailyGrid.mainLoading = false;
				})
			},
			//点击生成日报汇总
			_perExportViewEmpDaily() {
                if(this.multipleSelection.length == 0){
					this.$message.warning("请选择部门人员!");
					return;
                }
				let that = this;
				this.viewEmpDailyForm.buttonLoading = true;

				let DRAFTOR_ID_LIST = [];
				for (let j = 0; j < that.multipleSelection.length; j++) {
					DRAFTOR_ID_LIST.push(that.multipleSelection[j].EMP_ID_)
				}
				let PROJECT_ID_LIST;
				if (this.viewEmpDailyForm.PROJECT_ID_ == "" || this.viewEmpDailyForm.PROJECT_ID_ == null || this.viewEmpDailyForm.PROJECT_ID_ == undefined) {
					PROJECT_ID_LIST = [];
				} else {
					PROJECT_ID_LIST = this.viewEmpDailyForm.PROJECT_ID_;
				}
				if (this.viewEmpDailyForm.PROJECT_NAME_ == "" || this.viewEmpDailyForm.PROJECT_NAME_ == null || this.viewEmpDailyForm.PROJECT_NAME_ == undefined) {
					PROJECT_ID_LIST = [];
				}
				let PROJECT_TYPE = [];
				if (this.viewEmpDailyForm.PROJECT_TYPE_ == "" || this.viewEmpDailyForm.PROJECT_TYPE_ == null || this.viewEmpDailyForm.PROJECT_TYPE_ == undefined) {
					PROJECT_TYPE = [];
				} else {
					PROJECT_TYPE = this.viewEmpDailyForm.PROJECT_TYPE_;
				}
				let START_DATE_;
				let END_DATE_;
				if (mutils.isEmpty(this.viewEmpDailyForm.FROM_DAILY_DATE_)) {
					START_DATE_ = "";
				} else {
					START_DATE_ = mutils.formatDate(new Date(this.viewEmpDailyForm.FROM_DAILY_DATE_)); // 毫秒数，时间戳
				}

				if (mutils.isEmpty(this.viewEmpDailyForm.TO_DAILY_DATE_)) {
					END_DATE_ = "";
				} else {
					END_DATE_ = mutils.formatDate(new Date(this.viewEmpDailyForm.TO_DAILY_DATE_)); // 毫秒数，时间戳
				}
				axios({
					method: 'POST',
					url: that.baseUrl + 'exportDeptDailyNew.do',
					data: {
						PROJECT_ID_LIST: PROJECT_ID_LIST,
						PROJECT_TYPE_LIST: PROJECT_TYPE,
						DRAFTOR_ID_LIST: DRAFTOR_ID_LIST,
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
					that.viewEmpDailyForm.buttonLoading = false;
				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
					that.viewEmpDailyForm.buttonLoading = false;
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
			// 日报数据每页多少条切换
			handleSizeChangeDailyGrid(page_size) {
				this._selectViewEmpDaily({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 日报数据上下分页
			handleCurrentChangeDailyGrid(page) {
				this.dailyGrid.sortnum = this.dailyGrid.paginations.page_size * (page - 1);
				this._selectViewEmpDaily({
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
						that.viewEmpDailyForm.PROJECT_NAME_ += returnValue[i].PROJECT_NAME_;
						that.viewEmpDailyForm.PROJECT_ID_ = returnValue[i].PROJECT_ID_;
					} else {
						that.viewEmpDailyForm.PROJECT_NAME_ += ',' + returnValue[i].PROJECT_NAME_;
						that.viewEmpDailyForm.PROJECT_ID_ += ',' + returnValue[i].PROJECT_ID_;
					}
				}
			}
		}
	}
</script>

<style scoped>

</style>
