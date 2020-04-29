<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='projectDailyForm'
                    ref="projectDailyForm"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="projectDailyForm.FROM_DAILY_DATE_"
                            type="date"
                            placeholder="请选择起始日期">
                    </el-date-picker>
                    --
                    <el-date-picker
                            v-model="projectDailyForm.TO_DAILY_DATE_"
                            type="date"
                            placeholder="请选择结束日期">
                    </el-date-picker>
                    <el-form-item>
                        <el-input
                                v-model="projectDailyForm.PROJECT_NAME_"
                                @focus="_preChooseProject()"
                                placeholder="请选择项目" style="width: 200px">
                        </el-input>
                        <el-input
                                v-model="projectDailyForm.PROJECT_ID_"
                                placeholder="请选择项目" style="display: none">
                        </el-input>
                    </el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='_selectProjectDaily()'>查询
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-download" @click='_preExportProjectDaily()' :loading="projectDailyForm.buttonLoading">导出
                    </el-button>
                </el-form-item>
            </el-form>
        </div>

        <div class="table_container currentStyleColor">
            <el-table
                    class="template-list"
                    :data="projectDailyGrid.projectDailyList"
                    v-loading="projectDailyGrid.projectDailyGridLoading"
                    :style="projectDailyGrid.gridTableStyle"
                    :height="projectDailyGrid.gridTableStyle.height"
                    highlight-current-row
            >
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="350"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_TYPE_CODE_"
                        label="项目类型"
                        align='left'
                        width="100"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.PROJECT_TYPE }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="MODULE_NAME_"
                        label="模块名称"
                        align='center'
                        min-width="150"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="FINISHED_WORK_"
                        label="完成内容"
                        align='center'
                        min-width="250"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="UNFINISHED_WORK_"
                        align='center'
                        label="未完成内容"
                        min-width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="MEMO_"
                        align='center'
                        label="问题反馈"
                        min-width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="WORKING_HOURS_"
                        align='center'
                        label="工时"
                        width="100"
                        sortable>
                    <template slot-scope="scope">
                        <span style="color:#FFA500">{{ scope.row.WORKING_HOURS_ }}小时</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="DAILY_DATE_"
                        label="填报日期"
                        align='center'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="color:#FFA500">{{ scope.row.DAILY_DATE_ }}</span>
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
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='projectDailyGrid.pagination.total > 0'
                                :page-sizes="projectDailyGrid.pagination.page_sizes"
                                :page-size="projectDailyGrid.pagination.page_size"
                                :layout="projectDailyGrid.pagination.layout"
                                :total="projectDailyGrid.pagination.total"
                                :current-page='projectDailyGrid.pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>

        <!--选择项目DIALOG-->
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
	import dtime from 'time-formater'
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'
	import preChooseProject from '../project/preChooseProject.vue';
	export default {
		name: "viewProjectDaily",
		components: {preChooseProject},
        data(){
			return{
				projectDailyForm: {
					FROM_DAILY_DATE_: '',
					TO_DAILY_DATE_: '',
                    PROJECT_ID_: '',
                    PROJECT_NAME_: '',
					buttonLoading: false
				},
				projectDailyGrid: {
					sortNum: 0,
					projectDailyList: [],
					projectDailyGridLoading: false,
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
				},
				CODE_LIST: [],
				projectTypeCodeMapList: [],
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
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectCode();
				this._selectProjectDaily();
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
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},

			_selectProjectDaily({
							 page,
							 page_size,
							 where,
							 fun
						 } = {}) {
				this.projectDailyGrid.projectDailyGridLoading = true;
				var query = this.$route.query;
				this.projectDailyGrid.pagination.page_index = page || parseInt(query.page) || 1;
				this.projectDailyGrid.pagination.page_size = page_size || parseInt(query.page_size) || this.projectDailyGrid.pagination.page_size;
				var data = {
					pageIndex: this.projectDailyGrid.pagination.page_index,
					pageSize: this.projectDailyGrid.pagination.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				let FROM_DAILY_DATE_ = this.projectDailyForm.FROM_DAILY_DATE_;
				let TO_DAILY_DATE_ = this.projectDailyForm.TO_DAILY_DATE_;

				if (mutils.isEmpty(FROM_DAILY_DATE_)) {
					FROM_DAILY_DATE_ = "";
				} else {
					FROM_DAILY_DATE_ = mutils.formatDate(new Date(FROM_DAILY_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_DAILY_DATE_)) {
					TO_DAILY_DATE_ = "";
				} else {
					TO_DAILY_DATE_ = mutils.formatDate(new Date(TO_DAILY_DATE_));
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectDaily.do',
					data: {
						FROM_DAILY_DATE_: FROM_DAILY_DATE_,
						TO_DAILY_DATE_: TO_DAILY_DATE_,
						EMP_ID_: EMP_ID_,
						PROJECT_ROLE_: 'MANAGER',
						PROJECT_ID_: this.projectDailyForm.PROJECT_ID_,
						limit: this.projectDailyGrid.pagination.page_size,
						page: this.projectDailyGrid.pagination.page_index
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
						that.projectDailyGrid.pagination.total = res.data.total;
						that.projectDailyGrid.projectDailyList = [];

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
								sortnum: that.projectDailyGrid.sortnum + (i + 1),
								DAILY_ID_: dailyList[i].DAILY_ID_,
								PROJECT_ID_: dailyList[i].PROJECT_ID_,
								MODULE_ID_: dailyList[i].MODULE_ID_,
								FINISHED_WORK_: dailyList[i].FINISHED_WORK_,
								UNFINISHED_WORK_: dailyList[i].UNFINISHED_WORK_,
								MEMO_: dailyList[i].MEMO_,
								DAILY_DATE_: dtime(dailyList[i].DAILY_DATE_).format('YYYY-MM-DD '),
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								PROJECT_CODE_: dailyList[i].PROJECT_CODE_,
								PROJECT_NAME_: dailyList[i].PROJECT_NAME_,
								MODULE_NAME_: dailyList[i].MODULE_NAME_,
								DRAFTOR_ID_: dailyList[i].DRAFTOR_ID_,
								EMP_NAME_: dailyList[i].EMP_NAME_,
								DAILY_TYPE_: dailyList[i].DAILY_TYPE_,
								PROJECT_TYPE_CODE_: dailyList[i].PROJECT_TYPE_CODE_,
								PROJECT_TYPE: type,
							};
							that.projectDailyGrid.projectDailyList.push(tableItem);
						}
						that.projectDailyGrid.projectDailyGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.projectDailyGrid.projectDailyGridLoading = false;
				})
			},
			_preExportProjectDaily() {
				this.projectDailyForm.buttonLoading = true;

				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				let FROM_DAILY_DATE_ = this.projectDailyGrid.FROM_DAILY_DATE_;
				let TO_DAILY_DATE_ = this.projectDailyGrid.TO_DAILY_DATE_;

				if (mutils.isEmpty(FROM_DAILY_DATE_)) {
					FROM_DAILY_DATE_ = "";
				} else {
					FROM_DAILY_DATE_ = mutils.formatDate(new Date(FROM_DAILY_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_DAILY_DATE_)) {
					TO_DAILY_DATE_ = "";
				} else {
					TO_DAILY_DATE_ = mutils.formatDate(new Date(TO_DAILY_DATE_));
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'exportProjectDailyContent.do',
					data: {
						DRAFTOR_ID_: EMP_ID_,
						FROM_DAILY_DATE_: FROM_DAILY_DATE_,
						TO_DAILY_DATE_: TO_DAILY_DATE_,
						PROJECT_ROLE_: 'MANAGER',
						PROJECT_ID_: this.projectDailyForm.PROJECT_ID_
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
					that.projectDailyForm.buttonLoading = false;
					//that.getProjectList();
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.projectDailyForm.buttonLoading = false;
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
				link.setAttribute('download', '项目组日报.xls')

				document.body.appendChild(link)
				link.click()
			},
            //点击项目框
			_preChooseProject() {
				this.preChooseProject.show = true;
				this.preChooseProject.dialogVisible = true;
			},
			_closedPreChooseProject() {
				this.preChooseProject.dialogVisible = false;
			},
			_closePreChooseProjectDialog() {
				this.preChooseProject.show = false;
			},
			_completeChooseProject(returnValue) {
				this._closePreChooseProjectDialog();
				this.projectDailyForm.PROJECT_ID_ = returnValue.PROJECT_ID_;
				this.projectDailyForm.PROJECT_NAME_ = returnValue.PROJECT_NAME_;
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
				this.projectDailyGrid.sortnum = this.projectDailyGrid.pagination.page_size * (page - 1);
				this._selectDaily({
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
			}
        },
	}
</script>

<style scoped>

</style>
