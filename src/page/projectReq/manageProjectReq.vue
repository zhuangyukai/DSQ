<template>
    <div class="fillcontain">
        <div class="projectReqForm">
            <el-form
                    :inline="true"
                    :model='projectReqForm'
                    ref="projectReqForm"
                    class="demo-form-inline search-form">
                <el-form-item>
                    需求标题:
                    <el-input v-model="projectReqForm.REQ_NAME_" style="width: 200px" placeholder="请输入需求标题"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='_selectProjectReq()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='_preInsertProjectReq()'>添加</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit-outline" :disabled="BUTTON_STATUS.update" @click='_preUpdateProjectReq()'>修改</el-button>
                    <el-button type="success" size="mini" icon="el-icon-check" :disabled="BUTTON_STATUS.complete" @click='_completeProjectReq()'>完成</el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="BUTTON_STATUS.delete" @click='_deleteProjectReq()'>删除</el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="projectReqGrid.gridLoading"
                    :data="projectReqGrid.projectReqList"
                    :style="projectReqGrid.gridTableStyle"
                    :height="projectReqGrid.gridTableStyle.height"
                    align='center'
                    ref="multipleTable"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow"
            >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="REQ_ID_"
                        label="项目需求ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="REQ_NAME_"
                        label="需求标题"
                        align='center'
                >
                </el-table-column>
                <el-table-column
                        prop="RAISER_NAME_"
                        label="提出人"
                        align='center'
                        width="150"
                        sortable
                >
                </el-table-column>
                <el-table-column
                        prop="RAISE_DATE_"
                        label="提出时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.RAISE_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="STATUS_DESC"
                        label="状态"
                        width="100"
                        sortable>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='projectReqGrid.pagination.total > 0'
                                :page-sizes="projectReqGrid.pagination.page_sizes"
                                :page-size="projectReqGrid.pagination.page_size"
                                :layout="projectReqGrid.pagination.layout"
                                :total="projectReqGrid.pagination.total"
                                :current-page='projectReqGrid.pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <!--新增项目需求 DIALOG-->
        <el-dialog
                :title="insertProjectReq.title"
                :visible.sync="insertProjectReq.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                @closed="_closeInsertProjectReq"
        >
            <el-tabs v-model="insertProjectReq.tabName" type="card" :style="insertProjectReq.style">
                <el-tab-pane label="项目需求" name="insertProjectReq">
                    <template>
                        <projectReqInsertCom ref="insertProjectReqRef" v-if="insertProjectReq.dialogVisible"
                                             :_closePreInsertReqDialog="_closePreInsertReqDialog"
                                             @listeners="_completeInsert">

                        </projectReqInsertCom>
                    </template>
                </el-tab-pane>

                <el-tab-pane label="管理附件" name="manageRider" :disabled="insertProjectReq.editEnable">
                    <template>
                        <manageRiderCom ref="manageRiderRef" v-if="insertProjectReq.riderDialogVisible"
                                        :_closePreInsertReqDialog="_closePreInsertReqDialog">

                        </manageRiderCom>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
        <!--修改项目需求 DIALOG-->
        <el-dialog
                :title="updateProjectReq.title"
                :visible.sync="updateProjectReq.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                @closed="_closeUpdateProjectReq"
        >
            <el-tabs v-model="updateProjectReq.tabName" type="card" :style="updateProjectReq.style">
                <el-tab-pane label="项目需求" name="updateProjectReq">
                    <template>
                        <projectReqUpdateCom ref="updateProjectReqRef" v-if="updateProjectReq.dialogVisible"
                                             :_closePreUpdateReqDialog="_closePreUpdateReqDialog"
                                             @listeners="_completeUpdate">

                        </projectReqUpdateCom>
                    </template>
                </el-tab-pane>

                <el-tab-pane label="管理附件" name="manageRider">
                    <template>
                        <manageRiderCom ref="manageRiderRefByUpdate" v-if="updateProjectReq.riderDialogVisible"
                                        :_closePreUpdateReqDialog="_closePreUpdateReqDialog">

                        </manageRiderCom>
                    </template>
                </el-tab-pane>
            </el-tabs>
        </el-dialog>
    </div>
</template>

<style lang="less" scoped>
    .el-table  .warning-row {
        background-color: #000000;
    }
    th .el-checkbox {
        display: none;
    }
</style>

<script>
	import dtime from 'time-formater'
	import axios from 'axios';
	import projectReqInsertCom from './preInsertProjectReq.vue';
	import projectReqUpdateCom from './preUpdateProjectReq.vue';
	import manageRiderCom from '../rider/manageRider.vue';

	export default {
		components: {projectReqInsertCom, projectReqUpdateCom, manageRiderCom},
		data() {
			return {
				BUTTON_STATUS : {
					update : true,
                    delete : true,
                    complete : true
                },
				idFlag: false,
				REQ_STATUS_CodeList: '',
				projectReqForm: {
					PROJECT_ID_: '',
					REQ_NAME_: ''
				},
				projectReqGrid: {
					sortNum: 0,
					gridLoading: false,
					projectReqList: [],
					gridTableStyle: {
						width: '100%',
						height: '500px'
					},
					pagination: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
                    selectedDate : []
				},
				insertProjectReq: {
					show: false,
					title: '新增需求',
					width: '480px',
					tabName: 'insertProjectReq',
					editEnable: true,
					dialogVisible: true,
					riderDialogVisible: true,
					style: {
						height: '500px'
					}
				},
				updateProjectReq: {
					show: false,
					title: '修改需求',
					width: '480px',
					tabName: 'updateProjectReq',
					dialogVisible: true,
					riderDialogVisible: true,
					style: {
						height: '500px'
					},
                    tempIndex : ''
				},
				projectReqTemp: '',
				params: {
					PROJECT_ID_: ''
				},
                numbers : [],
				multipleSelection : []
			}
		},
		mounted() {
			this.doSyncMethod();//此方法为同步方法
		},
		methods: {
			async doSyncMethod() {
				await this._selectReqStatusCode();
			},
			_completeProjectReq(){
				let REQ_ID_LIST = [];
				for(let i = 0; i<this.multipleSelection.length; i++){
					REQ_ID_LIST.push(this.multipleSelection[i].REQ_ID_);
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'completeProjectReq.do',
					data: {
						REQ_ID_LIST: REQ_ID_LIST
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

						that.getList();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
            },
			_setButtonStatus(){
				if(this.multipleSelection.length == 1 && this.multipleSelection[0].STATUS_ == '1'){
					this.BUTTON_STATUS.update = false;
					this.BUTTON_STATUS.delete = false;
					this.BUTTON_STATUS.complete = false;
                }else if(this.multipleSelection.length > 0){
					let deleteStatus = false;
					this.BUTTON_STATUS.update = true;
					for(let i = 0; i< this.multipleSelection.length; i++){
						if(this.multipleSelection[i].STATUS_ == '9'){
							deleteStatus = true;
                        }
                    }
                    if(deleteStatus){
						this.BUTTON_STATUS.delete = true;
						this.BUTTON_STATUS.complete = true;
                    }else{
						this.BUTTON_STATUS.delete = false;
						this.BUTTON_STATUS.complete = false;
                    }
                }
                else{
					this.BUTTON_STATUS.update = true;
					this.BUTTON_STATUS.delete = true;
					this.BUTTON_STATUS.complete = true;

                }

            },
			onSelectAll(selection){
                //this.projectReqGrid.selectedDate = selection;
            },
			handleSelection(selection, row){
				// 表单绑定的数据
				this.projectReqGrid.projectReqList.forEach((item, i) => {
					if (item.REQ_ID_ == row.REQ_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
						}
					}
				});
            },
			handleSelectionAll(selection){
				this.multipleSelection = selection;
				this.numbers = [];
				if(this.multipleSelection.length != 0){
					for(let i = 0; i<this.projectReqGrid.projectReqList.length; i++){
						this.numbers.push(i);
					}
                }
            },
			handleSelectionChange(val){
				this.multipleSelection = val;
				this._setButtonStatus();
            },
			clickRow(row){
				this.$refs.multipleTable.toggleRowSelection(row, true);

				this.projectReqGrid.projectReqList.forEach((r, i) => {
					if (r.REQ_ID_ == row.REQ_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.multipleTable.toggleRowSelection(row, false);
						}
					}
				});

				//this._setButtonStatus();
            },
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {

				this.multipleSelection = [];
				this.numbers = [];
				this.BUTTON_STATUS.update = true;
				this.BUTTON_STATUS.delete = true;
				this.BUTTON_STATUS.complete = true;

				this.projectReqGrid.gridLoading = true;
				let query = this.$route.query;
				this.projectReqGrid.pagination.page_index = page || parseInt(query.page) || 1;
				this.projectReqGrid.pagination.page_size = page_size || parseInt(query.page_size) || this.projectReqGrid.pagination.page_size;
				let data = {
					pageIndex: this.projectReqGrid.pagination.page_index,
					pageSize: this.projectReqGrid.pagination.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectReq.do',
					data: {
						PROJECT_ID_: this.projectReqForm.PROJECT_ID_,
						REQ_NAME_: this.projectReqForm.REQ_NAME_,
						limit: this.projectReqGrid.pagination.page_size,
						page: this.projectReqGrid.pagination.page_index
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
						that.projectReqGrid.pagination.total = res.data.total;
						that.projectReqGrid.projectReqList = [];

						let projectReqList = res.data.projectReqList;

						for (let i = 0; i < projectReqList.length; i++) {
							const tableItem = {
								sortNum: that.projectReqGrid.sortNum + (i + 1),
								REQ_ID_: projectReqList[i].REQ_ID_,
								PROJECT_ID_: projectReqList[i].PROJECT_ID_,
								REQ_CODE_: projectReqList[i].REQ_CODE_,
								REQ_NAME_: projectReqList[i].REQ_NAME_,
								ORIGIN_: projectReqList[i].ORIGIN_,
								MEMO_: projectReqList[i].MEMO_,
								MANAGER_ID_: projectReqList[i].MANAGER_ID_,
								RAISER_NAME_: projectReqList[i].RAISER_NAME_,
								RAISER_CP_: projectReqList[i].RAISER_CP_,
								RAISE_DATE_: dtime(projectReqList[i].RAISE_DATE_).format('YYYY-MM-DD '),
								END_DATE_: dtime(projectReqList[i].END_DATE_).format('YYYY-MM-DD '),
								STATUS_ : projectReqList[i].STATUS_,
								STATUS_DESC: that.REQ_STATUS_CodeList[projectReqList[i].STATUS_],
								ButtonShow : projectReqList[i].STATUS_ == '9' ? false : true
							};
							that.projectReqGrid.projectReqList.push(tableItem);
						}
						that.projectReqGrid.gridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.projectReqGrid.gridLoading = false;
				})
			},
			_selectProjectReq() {
				this.getList();
			},
			_selectReqStatusCode() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectCodeAll.do',
					data: {
						CATEGORY_: 'REQ_STATUS'
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
						that.REQ_STATUS_CodeList = res.data.codeMapList;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			_preInsertProjectReq() {
				this.insertProjectReq.tabName = 'insertProjectReq';
				this.insertProjectReq.dialogVisible = true;
				this.insertProjectReq.riderDialogVisible = true;

				this.insertProjectReq.editEnable = true;
				this.insertProjectReq.show = true;
				this.$nextTick(_ => {
					this.$refs.insertProjectReqRef.projectReqForm.PROJECT_ID_ = this.projectReqForm.PROJECT_ID_;
				})
			},
			_preUpdateProjectReq(row, index) {
				this.updateProjectReq.tabName = 'updateProjectReq';
				this.updateProjectReq.dialogVisible = true;
				this.updateProjectReq.riderDialogVisible = true;
				//this.updateProjectReq.tempIndex = index;
				this.updateProjectReq.tempIndex = this.numbers[0];

				this.updateProjectReq.show = true;
				this.$nextTick(_ => {
					this.$refs.updateProjectReqRef.projectReqForm.REQ_ID_ = this.multipleSelection[0].REQ_ID_;
					this.$refs.manageRiderRefByUpdate.riderForm.ID_ = this.multipleSelection[0].REQ_ID_;
					this.$refs.updateProjectReqRef._loadProjectReq();
					this.$refs.manageRiderRefByUpdate.getList();
				})
			},
			_deleteProjectReq() {
				let REQ_ID_LIST = [];
				for(let i = 0; i<this.multipleSelection.length; i++){
					REQ_ID_LIST.push(this.multipleSelection[i].REQ_ID_);
                }

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'deleteProjectReq.do',
					data: {
						REQ_ID_LIST: REQ_ID_LIST
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

						that.getList();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('删除失败请重试')
				})
			},
			_closeInsertProjectReq() {
				this.insertProjectReq.dialogVisible = false;
				this.insertProjectReq.riderDialogVisible = false;
			},
			// 上下分页
			handleCurrentChange(page) {
				this.projectReqGrid.sortNum = this.projectReqGrid.pagination.page_size * (page - 1);
				this.getList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			setPath(field, value) {
				let path = this.$route.path,
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
			_closePreInsertReqDialog() {
				this.insertProjectReq.show = false;
			},
			_closeUpdateProjectReq() {
				this.updateProjectReq.dialogVisible = false;
				this.updateProjectReq.riderDialogVisible = false;
			},
			_closePreUpdateReqDialog() {
				this.updateProjectReq.show = false;
			},
			_completeUpdate(returnValue){
				let projectReqTemp = returnValue;

				for (let key in projectReqTemp) {//装载被修改数据到页面
					(this.projectReqGrid.projectReqList[this.updateProjectReq.tempIndex][key] != null) ? this.projectReqGrid.projectReqList[this.updateProjectReq.tempIndex][key] = projectReqTemp[key] : '';
					//给选中的那条数据改值,防止错误,谨慎!!
					(this.multipleSelection[0][key] != null) ? this.multipleSelection[0][key] = projectReqTemp[key] : '';
				}
				this.projectReqGrid.projectReqList[this.updateProjectReq.tempIndex].RAISE_DATE_ = dtime(projectReqTemp.RAISE_DATE_).format('YYYY-MM-DD ');
				this.multipleSelection[0].RAISE_DATE_ = dtime(projectReqTemp.RAISE_DATE_).format('YYYY-MM-DD ');
				this.projectReqGrid.projectReqList[this.updateProjectReq.tempIndex].STATUS_ = this.REQ_STATUS_CodeList[projectReqTemp.STATUS_];
				this.multipleSelection[0].STATUS_ = this.REQ_STATUS_CodeList[projectReqTemp.STATUS_];
			},
			_completeInsert(returnValue) {
				this.projectReqTemp = returnValue;
				const tableItem = {
					sortNum: this.projectReqGrid.sortNum + 1,
					REQ_ID_: this.projectReqTemp.REQ_ID_,
					PROJECT_ID_: this.projectReqTemp.PROJECT_ID_,
					REQ_CODE_: this.projectReqTemp.REQ_CODE_,
					REQ_NAME_: this.projectReqTemp.REQ_NAME_,
					ORIGIN_: this.projectReqTemp.ORIGIN_,
					MEMO_: this.projectReqTemp.MEMO_,
					MANAGER_ID_: this.projectReqTemp.MANAGER_ID_,
					RAISER_NAME_: this.projectReqTemp.RAISER_NAME_,
					RAISER_CP_: this.projectReqTemp.RAISER_CP_,
					RAISE_DATE_: dtime(this.projectReqTemp.RAISE_DATE_).format('YYYY-MM-DD '),
					END_DATE_: dtime(this.projectReqTemp.END_DATE_).format('YYYY-MM-DD '),
					STATUS_: this.projectReqTemp.STATUS_,
					STATUS_DESC: this.REQ_STATUS_CodeList[this.projectReqTemp.STATUS_]
				};
				this.projectReqGrid.projectReqList.push(tableItem);
				this.projectReqGrid.pagination.total = this.projectReqGrid.pagination.total + 1;
				this.insertProjectReq.editEnable = false;

				this.$refs.manageRiderRef.riderForm.ID_ = this.projectReqTemp.REQ_ID_;
				this.$refs.manageRiderRef.riderForm.TYPE_ = 'PROJECT_REQ';
			}
		}
	}
</script>


