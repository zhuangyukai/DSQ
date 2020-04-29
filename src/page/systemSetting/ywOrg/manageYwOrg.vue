<template>
    <div style="width: 100%">
        <el-row :gutter="20">
            <el-col span="8">

                <div style="margin-top: 15px">
                    <el-form :model='OrgStore'>
                        <el-form-item>
                            <el-input
                                    placeholder="输入报修单位名称"
                                    v-model="OrgStore.ORG_NAME_"
                                    style="width: 180px">
                            </el-input>
                            <el-button type="primary" size="mini" icon="el-icon-search"
                                       @click='selectOrg()'>单位筛选
                            </el-button>
                            <el-button type="primary" size="mini"
                                       @click='_preInsertDevOpsOrg()'>新增
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateDevOpsOrg"
                                       @click='_preUpdateDevOpsOrg()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteDevOpsOrg"
                                       @click='_deleteDevOpsOrg()'>删除
                            </el-button>
                        </el-form-item>

                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 700px" class="currentStyleColor">
                    <el-table
                            v-loading="orgGrid.projectloading"
                            :data="orgGrid.orgData"
                            :height="gridTableStyle.height"
                            ref="projectGridRef"
                            highlight-current-row
                            @current-change="orgHandCurrentChange"
                            @row-click="clickOrgRow"
                            :style="gridTableStyle">

                        <el-table-column
                                v-if="idFlag"
                                prop="ORG_ID_"
                                label="机构ID"
                                align='center'
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="ORG_CODE_"
                                label="机构代码"
                                align='left'
                                width="200"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="ORG_NAME_"
                                label="机构名称"
                                align='left'
                                width="200"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="ORG_TYPE_"
                                label="机构类型"
                                align='left'
                                width="100"
                                sortable>
                            <template slot-scope="scope">
                            <span>{{ scope.row._async_label }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="ORG_STATUS_"
                                label="状态"
                                align='left'
                                width="200"
                                sortable>
                        </el-table-column>

                    </el-table>

                </div>
                <el-row >
                    <el-col :span="24">
                        <div class="pagination">
                            <el-pagination
                                    v-if='orgGrid.paginations.total > 0'
                                    :page-sizes="orgGrid.paginations.page_sizes"
                                    :page-size="orgGrid.paginations.page_size"
                                    :layout="orgGrid.paginations.layout"
                                    :total="orgGrid.paginations.total"
                                    :current-page='orgGrid.paginations.page_index'
                                    @current-change='orgHandleCurrentChange'
                                    @size-change='orgHandleSizeChange'>
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>

            </el-col>

            <el-col span="16">
                <div style="margin-top: 15px">
                    <el-form
                            :model='DeptStore'
                            :inline="true"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-input
                                    placeholder="输入作业区名称"
                                    v-model="DeptStore.DEPT_NAME_"
                                    style="width: 180px">
                            </el-input>
                            <el-button type="primary" size="mini" icon="el-icon-search"
                                       @click='selectDept()'>查询
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertDevOpsDept"
                                       @click='_preInsertDevOpsDept()'>新增
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateDevOpsDept"
                                       @click='_preUpdateDevOpsDept()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteDevOpsDept"
                                       @click='_deleteDevOpsDept()'>删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 700px">
                    <el-table
                            v-loading="deptGrid.deptloading"
                            :data="deptGrid.deptData"
                            ref="projectGridRef"
                            :style="gridTableStyle"
                            :height="gridTableStyle.height"
                            highlight-current-row
                            @current-change="deptHandCurrentChange"
                            @row-click="clickDeptRow">

                        <el-table-column
                                v-if="idFlag"
                                prop="DEPT_ID_"
                                label="部室/作业区ID"
                                align='center'
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="DEPT_CODE_"
                                label="部室/作业区代码"
                                align='left'
                                width="400"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="DEPT_NAME_"
                                label="部室/作业区名字"
                                align='left'
                                width="400"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="DEPT_STATUS_"
                                label="状态"
                                align='left'
                                width="200"
                                sortable>
                            <!--<template slot-scope="scope">-->
                            <!--<span v-if="scope.row.STATUS_ == '9'" style="color: #67C23A; ">{{ scope.row.STATUS_DESC_ }}</span>-->
                            <!--<span v-else style="color: #E6A23C;">{{ scope.row.STATUS_DESC_ }}</span>-->
                            <!--</template>-->
                        </el-table-column>

                    </el-table>

                    <!--添加单位-->
                    <el-dialog
                            :title="insertDevOpsOrgDialog.title"
                            :visible.sync="insertDevOpsOrgDialog.show"
                            :close-on-click-modal='false'
                            :close-on-press-escape='false'
                            :modal-append-to-body="false"
                            :modal="true"
                            :style="insertDevOpsOrgDialog.style"
                            :width="insertDevOpsOrgDialog.width"
                            @close="closeInsertDevOpsOrgDialog"
                    >
                        <template>
                            <insertDevOpsOrgCom ref="insert_org_ref" v-if="insertDevOpsOrgDialog.dialogVisible"
                                              @insertDevOpsOrgListeners="_completeInsertDevOpsOrg"></insertDevOpsOrgCom>
                        </template>
                    </el-dialog>

                    <!--修改单位-->
                    <el-dialog
                            :title="updateDevOpsOrgDialog.title"
                            :visible.sync="updateDevOpsOrgDialog.show"
                            :close-on-click-modal='false'
                            :close-on-press-escape='false'
                            :modal-append-to-body="false"
                            :modal="true"
                            :style="updateDevOpsOrgDialog.style"
                            :width="updateDevOpsOrgDialog.width"
                            @close="closeUpdateDevOpsOrgDialog"
                    >
                        <template>
                            <updateDevOpsOrgCom ref="update_project_ref" v-if="updateDevOpsOrgDialog.dialogVisible"
                                              @updateDevOpsOrgListeners="_completeUpdateDevOpsOrg"></updateDevOpsOrgCom>
                        </template>
                    </el-dialog>

                    <!--添加部室/作业区-->
                    <el-dialog
                            :title="insertDevOpsDeptDialog.title"
                            :visible.sync="insertDevOpsDeptDialog.show"
                            :close-on-click-modal='false'
                            :close-on-press-escape='false'
                            :modal-append-to-body="false"
                            :modal="true"
                            :style="insertDevOpsDeptDialog.style"
                            :width="insertDevOpsDeptDialog.width"
                            @close="closeInsertDevOpsDeptDialog"
                    >
                        <template>
                            <insertDevOpsDeptCom ref="insert_dept_ref" v-if="insertDevOpsDeptDialog.dialogVisible"
                                                   @insertDevOpsDeptListeners="_completeInsertDevOpsDept"></insertDevOpsDeptCom>
                        </template>
                    </el-dialog>

                    <!--修改部室/作业区-->
                    <el-dialog
                            :title="updateDevOpsDeptDialog.title"
                            :visible.sync="updateDevOpsDeptDialog.show"
                            :close-on-click-modal='false'
                            :close-on-press-escape='false'
                            :modal-append-to-body="false"
                            :modal="true"
                            :style="updateDevOpsDeptDialog.style"
                            :width="updateDevOpsDeptDialog.width"
                            @close="closeUpdateDevOpsDeptDialog"
                    >
                        <template>
                            <updateDevOpsDeptCom ref="update_dept_ref" v-if="updateDevOpsDeptDialog.dialogVisible"
                                                   @updateDevOpsDeptListeners="_completeUpdateDevOpsDept"></updateDevOpsDeptCom>
                        </template>
                    </el-dialog>


                </div>
                <el-row >
                    <el-col :span="24">
                        <div class="pagination">
                            <el-pagination
                                    v-if='deptGrid.paginations.total > 0'
                                    :page-sizes="deptGrid.paginations.page_sizes"
                                    :page-size="deptGrid.paginations.page_size"
                                    :layout="deptGrid.paginations.layout"
                                    :total="deptGrid.paginations.total"
                                    :current-page='deptGrid.paginations.page_index'
                                    @current-change='deptHandleCurrentChange'
                                    @size-change='deptHandleSizeChange'>
                            </el-pagination>
                        </div>
                    </el-col>
                </el-row>

            </el-col>


        </el-row>

    </div>
</template>

<script>
	import axios from 'axios';

	import insertDevOpsOrgCom from "../ywOrg/preInsertDevOpsOrg.vue";
	import updateDevOpsOrgCom from "../ywOrg/preUpdateDevOpsOrg.vue";

	import insertDevOpsDeptCom from "../ywOrg/preInsertDevOpsDept.vue";
	import updateDevOpsDeptCom from "../ywOrg/preUpdateDevOpsDept.vue";
	export default {
		components: {insertDevOpsOrgCom, updateDevOpsOrgCom, insertDevOpsDeptCom, updateDevOpsDeptCom},
		name: "manageYwOrg",

		data() {
			return {
				//单位数据集
				OrgStore: {
					ORG_NAME_: ''
				},
                ORG_ID_: '',
				orgTypeCodeMapList: {},
				CODE_LIST : [],
				//任务TABLE
				orgTable: {
					orgkTableLoading: false,
					//taskStatusCodeMapList: [],
					currentRow : null
				},
				deptTable: {
					orgkTableLoading: false,
					//taskStatusCodeMapList: [],
					currentRow : null
				},
				DeptStore: {//部室/作业区数据集
					DEPT_NAME_: ''
                },
				//projectloading: false,
				deptGrid: {
					sortnum: 0,
					style: {
						width: '100%',
						height: window.screen.height / 2 + 190
					},
					deptloading: false,//部室页面的加载限制
					deptData: [],//部室表单数据
					paginations: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},

				idFlag: false,

				orgGrid: {
					sortnum: 0,
					style: {
						width: '100%',
						height: window.screen.height / 2 + 190
					},
					projectloading: false,
					orgData: [],
					paginations: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
				//按钮状态
				BUTTON_STATUS: {
					preUpdateDevOpsOrg: true,
					deleteDevOpsOrg: true,

					preInsertDevOpsDept: true,
					preUpdateDevOpsDept: true,
					deleteDevOpsDept: true

				},
				//新增窗口(单位)
				insertDevOpsOrgDialog: {
					show: false,
					title: '新增项目',
					insertDevOpsOrgDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//修改窗口(单位)
				updateDevOpsOrgDialog: {
					show: false,
					title: '修改项目',
					updateProjectDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},

				//新增窗口(部室/作业区)
				insertDevOpsDeptDialog: {
					show: false,
					title: '新增项目',
					insertReportingDeptDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//修改窗口(部室/作业区)
				updateDevOpsDeptDialog: {
					show: false,
					title: '修改项目',
					updateReportingDeptDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 160
				},
				tableHeight: '',
			}

		},
		created() {
			//this.projectloading = true;
			this.doSyncMethod();


		},

		methods: {
			async doSyncMethod() {
				await this.getOrgList();
				 this._selectCode();

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
							if(that.CODE_LIST[i].CATEGORY_ == 'YW_ORG_TYPE_'){
								that.orgTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//筛选按钮
			selectOrg() {
				this.getOrgList();
			},

			getOrgList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.orgGrid.projectloading = true;
				let formData = this.OrgStore;
				//let userinfo = mutils.getStore('userinfo')
				// 封装  get,path,params,fn,errfn
				var query = this.$route.query;
				this.orgGrid.paginations.page_index = page || parseInt(query.page) || 1;
				this.orgGrid.paginations.page_size = page_size || parseInt(query.page_size) || this.orgGrid.paginations.page_size;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectDevOpsOrg.do',
					data: {
						ORG_NAME_: this.OrgStore.ORG_NAME_,
						STATUS_: '1',
						limit: this.orgGrid.paginations.page_size,
						page: this.orgGrid.paginations.page_index
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
						that.orgGrid.orgData = [];
						that.orgGrid.paginations.total = res.data.total;
						let orgList = res.data.orgList;
						for (let i = 0; i < orgList.length; i++) {
							// if(that.orgList[i].CATEGORY_ == 'YW_ORG_TYPE_'){
							// 	that.orgTypeCodeMapList[that.orgList[i].CODE_] = that.orgList[i].NAME_;
							// }
							const tableItem = {
								sortnum: that.orgGrid.sortnum + (i + 1),
								ORG_ID_: orgList[i].ORG_ID_,
								ORG_CODE_: orgList[i].ORG_CODE_,
								ORG_NAME_: orgList[i].ORG_NAME_,
								ORG_TYPE_: orgList[i].ORG_TYPE_,
								ORG_STATUS_: orgList[i].STATUS_,
								_async_label: that.orgTypeCodeMapList[orgList[i].ORG_TYPE_],
							};
							that.orgGrid.orgData.push(tableItem);
						}
						that.orgGrid.projectloading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.orgGrid.projectloading = false;
				})
			},



			// 每页多少条切换
			orgHandleSizeChange(page_size) {
				this.selectOrg({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			orgHandleCurrentChange(page) {
				this.orgGrid.sortnum = this.orgGrid.paginations.page_size * (page - 1);
				this.selectOrg({
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


			orgHandCurrentChange(val) {
				this.orgTable.currentRow = val;
				//this._setButtonStatus();
			},

			clickOrgRow(row, column, event) {
				this.BUTTON_STATUS.preUpdateDevOpsOrg = false;
				this.BUTTON_STATUS.deleteDevOpsOrg = false;

				this.BUTTON_STATUS.preInsertDevOpsDept = false;
				//this.BUTTON_STATUS.preUpdateDevOpsDept = false;
                this.ORG_ID_ = row.ORG_ID_;
				this.selectDept();
			},


			deptHandCurrentChange(val) {
				this.deptTable.currentRow = val;
				//this._setButtonStatus();
			},
			clickDeptRow(row, column, event) {
				// this.BUTTON_STATUS.preUpdateDevOpsOrg = false;
				// this.BUTTON_STATUS.preInsertDevOpsDept = false;
				this.BUTTON_STATUS.preUpdateDevOpsDept = false;
				this.BUTTON_STATUS.deleteDevOpsDept = false;
				// this.ORG_ID_ = row.ORG_ID_;
				// this.selectDept();
			},

			//点击添加按钮(添加单位)
			_preInsertDevOpsOrg(){
				this.insertDevOpsOrgDialog.show = true;
				this.insertDevOpsOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_org_ref.setInsertDevOpsOrgForm();
				})
			},
			//关闭监听
			closeInsertDevOpsOrgDialog(){
				this.insertDevOpsOrgDialog.dialogVisible = false;
			},
			//新增之后页面的变化
			_completeInsertDevOpsOrg(returnValue){
				this.insertDevOpsOrgReqTemp = returnValue;
				let that = this;
				const tableItem = {
					ORG_ID_: this.insertDevOpsOrgReqTemp.ORG_ID_,
					ORG_CODE_: this.insertDevOpsOrgReqTemp.ORG_CODE_,
					ORG_NAME_: this.insertDevOpsOrgReqTemp.ORG_NAME_,
					ORG_TYPE_: this.insertDevOpsOrgReqTemp.ORG_TYPE_,
					ORG_STATUS_: this.insertDevOpsOrgReqTemp.ORG_STATUS_,
					// STATUS_DESC_ : that.projectStatusCodeMapList[this.insertDevOpsOrgReqTemp.STATUS_],
					 _async_label: that.orgTypeCodeMapList[this.insertDevOpsOrgReqTemp.ORG_TYPE_]
				};
				this.orgGrid.orgData.push(tableItem);
				this.insertDevOpsOrgDialog.show = false;
			},

			//点击修改按钮
			_preUpdateDevOpsOrg(){
				let that = this;
				this.updateDevOpsOrgDialog.show = true;
				this.updateDevOpsOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_project_ref.preUpdateDevOpsOrgForm.ORG_ID_ = that.orgTable.currentRow.ORG_ID_;
					// if(that.orgTable.currentRow.STATUS_ == '9'){
						//this.BUTTON_STATUS.preUpdateDevOpsOrg = false;
					// }
					this.$refs.update_project_ref.setUpdateDevOpsOrgForm();
				})
			},
			//关闭监听
			closeUpdateDevOpsOrgDialog(){
				this.updateDevOpsOrgDialog.dialogVisible = false;
			},
			//修改之后的变化
			_completeUpdateDevOpsOrg(returnValue){
				let updateDevOpsOrgReqTemp = returnValue;
				let that =this;
				for (let key in updateDevOpsOrgReqTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.orgTable.currentRow[key] != null) ? that.orgTable.currentRow[key] = updateDevOpsOrgReqTemp[key] : '';
				}
				//this.orgTable.currentRow.DRAFT_DATE_ = dtime(updateProjectReqTemp.DRAFT_DATE_).format('YYYY-MM-DD ');
				this.orgTable.currentRow._async_label = that.orgTypeCodeMapList[updateDevOpsOrgReqTemp.ORG_TYPE_];
				this.updateDevOpsOrgDialog.show = false;
			},

			//点击删除
			_deleteDevOpsOrg(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.projectloading = true;
					//  let PROJECT_ID_LIST = [];
					// for (let i = 0; i < this.orgTable.length; i++) {
					// 	PROJECT_ID_LIST.push(this.orgTable[i].PROJECT_ID_);
					// }

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDevOpsOrg.do',
						data: {
							ORG_ID_: that.orgTable.currentRow.ORG_ID_
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
							that.getOrgList();
							that.selectDept();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						//that.projectloading = false;
					})
				});
			},



			selectDept({
						   page,
						   page_size,
						   where,
						   fun
					   } = {}) {
				this.deptGrid.deptloading = true;
				let formData = this.DeptStore;
				//let userinfo = mutils.getStore('userinfo')
				// 封装  get,path,params,fn,errfn
				var query = this.$route.query;
				this.deptGrid.paginations.page_index = page || parseInt(query.page) || 1;
				this.deptGrid.paginations.page_size = page_size || parseInt(query.page_size) || this.deptGrid.paginations.page_size;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectdevOpsDept.do',
					data: {
						ORG_ID_: this.ORG_ID_ != '' ? that.ORG_ID_ : '',
						DEPT_NAME_: this.DeptStore.DEPT_NAME_ != '' ? this.DeptStore.DEPT_NAME_ : '',
						STATUS_: '1',
						limit: this.deptGrid.paginations.page_size,
						page: this.deptGrid.paginations.page_index
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
						that.deptGrid.deptData = [];
						that.deptGrid.paginations.total = res.data.total;
						let deptList = res.data.deptList;
						for (let i = 0; i < deptList.length; i++) {
							// if(that.orgList[i].CATEGORY_ == 'YW_ORG_TYPE_'){
							// 	that.orgTypeCodeMapList[that.orgList[i].CODE_] = that.orgList[i].NAME_;
							// }
							const tableItem = {
								sortnum: that.deptGrid.sortnum + (i + 1),
								ORG_ID_: deptList[i].ORG_ID_,
								DEPT_ID_: deptList[i].DEPT_ID_,
								DEPT_CODE_: deptList[i].DEPT_CODE_,
								DEPT_NAME_: deptList[i].DEPT_NAME_,
								//ORG_TYPE_: deptList[i].ORG_TYPE_,
								DEPT_STATUS_: deptList[i].STATUS_,
								//_async_label: that.orgTypeCodeMapList[orgList[i].ORG_TYPE_],
							};
							that.deptGrid.deptData.push(tableItem);
						}
						that.deptGrid.deptloading = false;
					} else {
						that.$message.error(res.data.message);
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.deptGrid.deptloading = false;
				})
			},



			// 每页多少条切换
			deptHandleSizeChange(page_size) {
				this.selectDept({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			deptHandleCurrentChange(page) {
				this.deptGrid.sortnum = this.deptGrid.paginations.page_size * (page - 1);
				this.selectDept({
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

			//点击添加按钮(添加部室、作业区)
			_preInsertDevOpsDept(){
				this.insertDevOpsDeptDialog.show = true;
				this.insertDevOpsDeptDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_dept_ref.insertDevOpsDeptForm.ORG_ID_ = this.ORG_ID_;
					this.$refs.insert_dept_ref.setInsertDevOpsDeptForm();
				})
			},
			//关闭监听
			closeInsertDevOpsDeptDialog(){
				this.insertDevOpsDeptDialog.dialogVisible = false;
			},
			//新增之后页面的变化
			_completeInsertDevOpsDept(returnValue){
				let insertDevOpsDeptReqTemp = returnValue;
				const tableItem = {
					ORG_ID_: insertDevOpsDeptReqTemp.ORG_ID_,
					DEPT_ID_: insertDevOpsDeptReqTemp.DEPT_ID_,
					DEPT_CODE_: insertDevOpsDeptReqTemp.DEPT_CODE_,
					DEPT_NAME_: insertDevOpsDeptReqTemp.DEPT_NAME_,
					DEPT_STATUS_: insertDevOpsDeptReqTemp.DEPT_STATUS_,
					// STATUS_DESC_ : that.projectStatusCodeMapList[this.insertReportingOrgReqTemp.STATUS_],
					//_async_label: that.orgTypeCodeMapList[this.insertReportingDeptReqTemp.ORG_TYPE_]
				};
				this.deptGrid.deptData.push(tableItem);
				this.insertDevOpsDeptDialog.show = false;
			},

			//点击修改按钮
			_preUpdateDevOpsDept(){
				let that = this;
				this.updateDevOpsDeptDialog.show = true;
				this.updateDevOpsDeptDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_dept_ref.preUpdateDevOpsDeptForm.DEPT_ID_ = that.deptTable.currentRow.DEPT_ID_;

					this.$refs.update_dept_ref.setUpdateDevOpsDeptForm();
				})
			},
			//关闭监听
			closeUpdateDevOpsDeptDialog(){
				this.updateDevOpsDeptDialog.dialogVisible = false;
			},
			//修改之后的变化
			_completeUpdateDevOpsDept(returnValue){
				let updateDevOpsDeptReqTemp = returnValue;
				let that =this;
				for (let key in updateDevOpsDeptReqTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.deptTable.currentRow[key] != null) ? that.deptTable.currentRow[key] = updateDevOpsDeptReqTemp[key] : '';
				}
				//this.orgTable.currentRow.DRAFT_DATE_ = dtime(updateProjectReqTemp.DRAFT_DATE_).format('YYYY-MM-DD ');
				//this.orgTable.currentRow._async_label = that.orgTypeCodeMapList[updateReportingDeptReqTemp.ORG_TYPE_];
				this.updateDevOpsDeptDialog.show = false;
			},

			//点击删除
			_deleteDevOpsDept(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					// this.projectloading = true;
					//  let PROJECT_ID_LIST = [];
					// for (let i = 0; i < this.orgTable.length; i++) {
					// 	PROJECT_ID_LIST.push(this.orgTable[i].PROJECT_ID_);
					// }

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDevOpsDept.do',
						data: {
							DEPT_ID_: that.deptTable.currentRow.DEPT_ID_
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
							that.selectDept();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						//that.projectloading = false;
					})
				});
			}
		}

	}
</script>

<style scoped>

</style>