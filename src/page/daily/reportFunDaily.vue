<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='dailyInsertForm'
                    ref="dailyInsertForm"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="dailyInsertForm.DAILY_DATE_"
                            @change="selectDaily()"
                            type="date"
                            placeholder="填报日期">
                    </el-date-picker>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='_preInsertDaily()'>新增
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    class="template-list"
                    :data="dailyGrid.dailyList"
                    v-loading="dailyGrid.dailyGridLoading"
                    :style="dailyGrid.gridTableStyle"
                    :height="dailyGrid.gridTableStyle.height">
                <el-table-column
                        v-if="idFlag"
                        prop="DAILY_ID_"
                        label="日报ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        label="工作内容"
                        align='center'
                        min-width="250">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.FINISHED_WORK_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.FINISHED_WORK_"
                                      placeholder="请录入工作内容"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="问题反馈"
                        align='center'
                        min-width="250">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.MEMO_ }}</span>
                        </div>
                        <div v-else>
                            <el-input v-model="scope.row.MEMO_"
                                      placeholder="请录入问题反馈"></el-input>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="工时"
                        width="150">
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.WORKING_HOURS_ }}</span>
                        </div>
                        <div v-else>
                            <el-input-number v-model="scope.row.WORKING_HOURS_" :precision="1"
                                             :step="1"></el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="DAILY_DATE_"
                        label="填报日期"
                        align='center'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                        width="230px"
                >
                    <template slot-scope="scope">
                        <div class="operate-groups">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-edit-outline"
                                    @click="_preUpdateDaily(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.editing"
                                    icon="el-icon-success"
                                    @click="_insertDaily(scope.$index, scope.row)">保存
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="danger"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-delete"
                                    @click="_deleteDaily(scope.$index, scope.row)">删除
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.editing"
                                    icon="el-icon-warning"
                                    @click="_cancelDaily(scope.$index, scope.row)">取消
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='dailyGrid.pagination.total > 0'
                                :page-sizes="dailyGrid.pagination.page_sizes"
                                :page-size="dailyGrid.pagination.page_size"
                                :layout="dailyGrid.pagination.layout"
                                :total="dailyGrid.pagination.total"
                                :current-page='dailyGrid.pagination.page_index'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	export default {
		name: "reportFunDaily",
        data(){
		    return{
				idFlag: false,
				T_Height: window.screen.height / 2 + 200,
				dailyInsertForm: {
					DAILY_DATE_: new Date()
				},
				dailyGrid: {
					sortNum: 0,
					dailyList: [],
					dailyGridLoading: false,
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
					tempIndex: '',
					tempDate: {
						PROJECT_ID_: "",
						PROJECT_NAME_: '',
						MODULE_ID_: "",
						MODULE_NAME_: '',
						FINISHED_WORK_: '',
						UNFINISHED_WORK_: '',
                        MEMO_: '',
						WORKING_HOURS_: ''
					}
				},
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				this.getDailyList();
			},
            //查询按钮
			selectDaily(){
				this.getDailyList();
			},
            //查询日报
			getDailyList(){
				this.dailyGrid.dailyGridLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectDaily.do',
					data: {
						DAILY_DATE_ : mutils.formatDate(new Date(that.dailyInsertForm.DAILY_DATE_)),
						DRAFTOR_ID_ : mutils.getStore('userinfo').empId,
						DAILY_TYPE_: 'zn'
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
						that.dailyGrid.dailyList = [];
						let dailyList = res.data.dailyList;

						for (let i = 0; i < dailyList.length; i++) {
							const tableItem = {
								DAILY_ID_: dailyList[i].DAILY_ID_,
								FINISHED_WORK_: dailyList[i].FINISHED_WORK_,
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								MEMO_: dailyList[i].MEMO_,
								DAILY_DATE_: dailyList[i].DAILY_DATE_
							}
							that.dailyGrid.dailyList.push(tableItem);
						}

						that.dailyGrid.dailyGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
				})
			},
            //点击新增按钮
			_preInsertDaily() {
				if(this.dailyInsertForm.DAILY_DATE_ == null || this.dailyInsertForm.DAILY_DATE_ == "" || this.dailyInsertForm.DAILY_DATE_ == undefined){
					this.$message.warning('请填报日期');
					return;
				}

				this.dailyGrid.dailyList.push({
					DAILY_ID_: "",
					FINISHED_WORK_: "",
					WORKING_HOURS_: "",
					MEMO_: "",
					DAILY_DATE_: /\d{4}-\d{1,2}-\d{1,2}/g.exec(mutils.formatDate(new Date(this.dailyInsertForm.DAILY_DATE_))),
					editing: true
				});
			},
            //点击编辑按钮
			_preUpdateDaily(index, row) {
				this.$set(this.dailyGrid.dailyList[index], 'editing', true);
				this.dailyGrid.tempDate.FINISHED_WORK_ = row.FINISHED_WORK_;
				this.dailyGrid.tempDate.MEMO_ = row.MEMO_;
				this.dailyGrid.tempDate.WORKING_HOURS_ = row.WORKING_HOURS_;
			},
            //点击保存按钮
			_insertDaily(index, row) {
				if (row.DAILY_ID_ == ''|| row.DAILY_ID_ == null) {
					let that = this;
					that.dailyGrid.dailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertDaily.do',
						data: {
							FINISHED_WORK_: row.FINISHED_WORK_,
							WORKING_HOURS_: row.WORKING_HOURS_,
							MEMO_: row.MEMO_,
							DAILY_DATE_: mutils.formatDate(new Date(this.dailyInsertForm.DAILY_DATE_)),
							DAILY_TYPE_: 'zn'
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
							let daily = res.data.daily;
							for (let key in daily) {//装载被修改数据到页面
								that.$set(that.dailyGrid.dailyList[index], key, daily[key]);
							}
							that.$set(that.dailyGrid.dailyList[index], 'editing', false);
							that.dailyGrid.dailyGridLoading = false;
							that.$message.success("添加成功");
						} else {
							that.$message.error(res.data.message);
							that.dailyGrid.dailyGridLoading = false;
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
						that.dailyGrid.dailyGridLoading = false;
					})
				} else {
					let that = this;
					that.dailyGrid.dailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'updateDaily.do',
						data: {
							DAILY_ID_: row.DAILY_ID_,
							FINISHED_WORK_: row.FINISHED_WORK_,
							MEMO_: row.MEMO_,
							WORKING_HOURS_: row.WORKING_HOURS_
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
							let daily = res.data.daily;
							for (let key in daily) {//装载被修改数据到页面
								that.$set(that.dailyGrid.dailyList[index], key, daily[key]);
							}
							that.$set(that.dailyGrid.dailyList[index], 'editing', false);
							that.dailyGrid.dailyGridLoading = false;
							that.$message.success("修改成功");
						} else {
							that.$message.error(res.data.message);
							that.dailyGrid.dailyGridLoading = false;
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试');
						that.dailyGrid.dailyGridLoading = false;
					})
				}
			},
            //点击删除按钮
			_deleteDaily(index, row) {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					that.dailyGrid.dailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDaily.do',
						data: {
							DAILY_ID_: row.DAILY_ID_
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
							that.dailyGrid.dailyList.splice(index, 1);
							that.dailyGrid.dailyGridLoading = false;
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.dailyGrid.dailyGridLoading = false;
					})
				});

			},
            //点击取消按钮
			_cancelDaily(index, row) {
				this.$set(this.dailyGrid.dailyList[index], 'editing', false);
				if (row.DAILY_ID_ == '') {
					this.dailyGrid.dailyList.splice(index, 1);
				} else {
					this.dailyGrid.dailyList[index].FINISHED_WORK_ = this.dailyGrid.tempDate.FINISHED_WORK_;
					this.dailyGrid.dailyList[index].WORKING_HOURS_ = this.dailyGrid.tempDate.WORKING_HOURS_;
					this.dailyGrid.dailyList[index].MEMO_ = this.dailyGrid.tempDate.MEMO_;
				}
			},
        }
	}
</script>

<style scoped>

</style>
