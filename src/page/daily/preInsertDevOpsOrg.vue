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
                            <!--<el-button type="primary" size="mini"-->
                                       <!--@click='_preInsertDevOpsOrg()'>新增-->
                            <!--</el-button>-->
                            <!--<el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateDevOpsOrg"-->
                                       <!--@click='_preUpdateDevOpsOrg()'>修改-->
                            <!--</el-button>-->
                            <!--<el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteDevOpsOrg"-->
                                       <!--@click='_deleteDevOpsOrg()'>删除-->
                            <!--</el-button>-->
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
                        <div class="pagination" >
                            <el-pagination
                                    small
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

            <el-col span="8">
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
                                width="200"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="DEPT_NAME_"
                                label="部室/作业区名字"
                                align='left'
                                width="200"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="DEPT_STATUS_"
                                label="状态"
                                align='left'
                                width="200"
                                sortable>
                        </el-table-column>

                    </el-table>

                </div>
                <el-row >
                    <el-col :span="24">
                        <div class="pagination" style="width: auto">
                            <el-pagination
                                    small
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


            <el-col span="8">
                <div style="margin-top: 15px">
                    <el-form
                            :inline="true"
                            :model='ywSystem_Query_Date'
                            ref="ywSystem_Query_Date"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-input v-model="ywSystem_Query_Date.SYSTEM_NAME_" style="width: 200px" placeholder="请输入系统名称"
                                      clearable>
                            </el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" size="mini" icon="el-icon-search" @click='selectYwSystem()'>筛选
                            </el-button>
                            <el-button type="warning" size="mini" @click='_chooseProject' :disabled="BUTTON_STATUS.preChoose" >保存
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 700px">
                    <el-table
                            v-loading="ywSystemloading"
                            :data="ywSystemData"
                            :style="gridTableStyle"
                            :height="gridTableStyle.height"
                            align='center'
                            :max-height="tableHeight"
                            ref="ywSystemGridRef"
                            highlight-current-row
                            @current-change="handCurrentChange"
                            @row-click="clickRow">
                        <el-table-column
                                v-if="idFlag"
                                prop="SYSTEM_ID_"
                                label="运维系统ID"
                                align='center'
                                width="220">
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="ORG_ID_"
                                label="公司ID"
                                align='left'
                                width="220">
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="DRAFTOR_ID_"
                                label="起草人ID"
                                align='left'
                                width="220">
                        </el-table-column>
                        <el-table-column
                                prop="SYSTEM_CODE_"
                                label="运维系统编码"
                                align='left'
                                width="220"
                                sortable>
                        </el-table-column>
                        <el-table-column
                                prop="SYSTEM_NAME_"
                                label="运维系统名称"
                                align='left'
                                width="300"
                                sortable>
                        </el-table-column>
                    </el-table>

                </div>
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

            </el-col>


        </el-row>

    </div>
    
</template>

<script>
	import dtime from 'time-formater'
	import axios from 'axios';
	export default {
		name: "preInsertDevOpsOrg",
        data() {
			return {
				//单位数据集
				OrgStore: {
					ORG_NAME_: ''
				},
				ORG_ID_: '',
				ORG_NAME_: '',
				DEPT_ID_: '',
				DEPT_NAME_: '',
				SYSTEM_ID_: '',
				SYSTEM_NAME_: '',
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

				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 160
				},
				tableHeight: '',

                //system
				ywSystem_Query_Date: {
					ORG_NAME_: '',
					ORG_ID_: '',
					SYSTEM_NAME_: ''
				},
				ywSystemloading: false,
				ywSystemData: [],


				sortnum: 0,
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				currentRow : null,

				returnValue : {
					ORG_ID_: '',
					ORG_NAME_: '',
					DEPT_ID_: '',
					DEPT_NAME_: '',
					SYSTEM_ID_: '',
					SYSTEM_NAME_: ''
                },

				BUTTON_STATUS: {
					preChoose: true

				},

            }
        },

        created() {
			//this.projectloading = true;
			this.doSyncMethod();
        },

        methods : {
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
				this.ORG_ID_ = row.ORG_ID_;
				this.ORG_NAME_ = row.ORG_NAME_;
				this.selectDept();
				this.getYwSystemList();
				this.BUTTON_STATUS.preChoose = true;
			},

			_chooseProject(){
				this.returnValue.ORG_ID_ = this.ORG_ID_;
				this.returnValue.ORG_NAME_ = this.ORG_NAME_;
				this.returnValue.DEPT_ID_ = this.DEPT_ID_;
				this.returnValue.DEPT_NAME_ = this.DEPT_NAME_;
				this.returnValue.SYSTEM_ID_ = this.SYSTEM_ID_;
				this.returnValue.SYSTEM_NAME_ = this.SYSTEM_NAME_;
				this.$emit('chooseEmpListeners', this.returnValue);

			},


			deptHandCurrentChange(val) {
				this.deptTable.currentRow = val;
				//this._setButtonStatus();
			},
			clickDeptRow(row, column, event) {
				this.DEPT_ID_ = row.DEPT_ID_;
				this.DEPT_NAME_ = row.DEPT_NAME_;
				//this.setButton(this.DEPT_ID_);
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
						ORG_ID_: this.ORG_ID_ != '' ? this.ORG_ID_ : '',
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

			getYwSystemList({
								page,
								page_size,
								where,
								fun
							} = {}){


				this.ywSystemloading = true;
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

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectYwSystem.do',
					data: {
						ORG_ID_: this.ORG_ID_ != '' ? this.ORG_ID_ : '',
						SYSTEM_NAME_: this.ywSystem_Query_Date.SYSTEM_NAME_,
						limit: this.paginations.page_size,
						page: this.paginations.page_index
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
						that.ywSystemData = [];

						let ywSystemList = res.data.ywSystemList;

						for (let i = 0; i < ywSystemList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								SYSTEM_ID_: ywSystemList[i].SYSTEM_ID_,
								SYSTEM_CODE_: ywSystemList[i].SYSTEM_CODE_,
								SYSTEM_NAME_: ywSystemList[i].SYSTEM_NAME_,
								DRAFTOR_ID_: ywSystemList[i].DRAFTOR_ID_,
								ORG_ID_: ywSystemList[i].ORG_ID_
							};
							that.ywSystemData.push(tableItem);
						}
						that.ywSystemloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.ywSystemloading = false;
				})

			},
			handCurrentChange(val) {
				this.currentRow = val;
			},

			clickRow(row){
				//this.currentRow = val;
				// this.BUTTON_STATUS.preUpdateYwSystem = false;
				// this.BUTTON_STATUS.deleteYwSystem = false;
				this.SYSTEM_ID_ = row.SYSTEM_ID_;
				this.SYSTEM_NAME_ = row.SYSTEM_NAME_;
				this.setButton(this.SYSTEM_ID_);
			},

			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getYwSystemList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getYwSystemList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},

            //按钮状态
            setButton( SYSTEM_ID_){
				if (SYSTEM_ID_!= "") {
					this.BUTTON_STATUS.preChoose = false;
                }

            }

		}
	}
</script>

<style scoped>

</style>