<template>
    <div style="width: 100%">
        <el-row :gutter="20">
            <el-col :span="8"
            >
                <div>
                    <el-form>
                        <el-form-item>
                            <el-input
                                    placeholder="输入公司/部门名称进行过滤"
                                    v-model="filterText"
                                    style="width: 180px">
                            </el-input>
                            <el-button type="primary" size="mini"
                                       @click='preInsertRootOrg()'>新增根
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertSubOrgButton"
                                       @click='preInsertSubOrg()'>新增下级
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateOrgButton"
                                       @click='_preUpdateOrg()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteOrgButton"
                                       @click='_deleteOrg()'>删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 733px">
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
                </div>

            </el-col>

            <el-col :span="16">
                <div>
                    <el-form
                            :inline="true"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.insertPosiButton"
                                       @click='preInsertPosi()'>新增
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.updatePosiButton"
                                       @click='_preUpdatePosi()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deletePosiButton"
                                       @click='_deletePosi()'>删除
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.managePosiEmp"
                                       @click='managePosiEmp()'>管理岗位人员
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); ">
                    <el-table
                            v-loading="posiloading"
                            :data="posiList"
                            :style="posiGridStyle"
                            align='center'
                            ref="posiGridRef"
                            :height="posiGridStyle.height"
                            @select="handleSelectionPosi"
                            @select-all="handleSelectionAllPosi"
                            @selection-change="handleSelectionChangePosi"
                            @row-click="clickRowPosi">
                        <el-table-column type="selection" width="35">
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="POSI_ID_"
                                label="岗位ID"
                                align='center'>
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="ORG_ID_"
                                label="部门ID"
                                align='center'>
                        </el-table-column>
                        <el-table-column
                                prop="POSI_CODE_"
                                label="岗位编码"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="POSI_NAME_"
                                label="岗位名称"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="DUTY_NAME_"
                                label="职务名称"
                                align='center'
                                width="240">
                        </el-table-column>
                        <el-table-column
                                prop="UPDATE_DATE_"
                                label="更新日期"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="OPERATOR_NAME_"
                                label="操作人姓名    "
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="ORDER_"
                                label="排序"
                                align='center'
                                width="180">
                        </el-table-column>
                    </el-table>
                </div>
            </el-col>

            <el-col :span="16">
                <div style="margin-top: 15px">
                    <el-form
                            :inline="true"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preInsertEmpButton"
                                       @click='preInsertEmp()'>新增
                            </el-button>
                            <el-button type="primary" size="mini" :disabled="BUTTON_STATUS.preUpdateEmpButton"
                                       @click='_preUpdateEmp()'>修改
                            </el-button>
                            <el-button type="danger" size="mini" :disabled="BUTTON_STATUS.deleteEmpButton"
                                       @click='_deleteEmp()'>删除
                            </el-button>
                        </el-form-item>
                    </el-form>
                </div>

                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 303px">
                    <el-table
                            v-loading="emploading"
                            :data="empList"
                            :style="empGridStyle"
                            align='center'
                            ref="empGridRef"
                            :height="empGridStyle.height"
                            @select="handleSelection"
                            @select-all="handleSelectionAll"
                            @selection-change="handleSelectionChange"
                            @row-click="clickRow">
                        <el-table-column type="selection" width="35">
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="EMP_ID_"
                                label="员工ID"
                                align='center'>
                        </el-table-column>
                        <el-table-column
                                prop="EMP_CODE_"
                                label="员工编码"
                                align='center'
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="EMP_NAME_"
                                label="员工姓名"
                                align='center'
                                width="120">
                        </el-table-column>
                        <el-table-column
                                prop="GENDER_"
                                label="员工性别"
                                align='center'
                                width="120">
                            <template slot-scope="scope">
                                <span>{{ scope.row.emp_gender }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="BIRTH_DATE_"
                                label="出生日期"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="TEL_"
                                label="电话"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="EMAIL_"
                                label="邮箱"
                                align='center'
                                width="180">
                        </el-table-column>
                        <el-table-column
                                prop="MEMO_"
                                label="备注"
                                align='center'
                                width="180">
                        </el-table-column>
                    </el-table>
                    <el-row>
                        <el-col :span="20">
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

            </el-col>

        </el-row>

        <!--新增根部门-->
        <el-dialog
                :title="insertRootOrgDialog.title"
                :visible.sync="insertRootOrgDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="insertRootOrgDialog.style"
                :width="insertRootOrgDialog.width"
        >
            <template>
                <insertRootOrgCom ref="insert_root_org_ref" v-if="insertRootOrgDialog.dialogVisible"
                                  :_closeInsertRootOrgDialog="_closeInsertRootOrgDialog"
                                  @insertRootOrgListeners="_completeInsertRootOrg"></insertRootOrgCom>
            </template>
        </el-dialog>

        <!--新增下级部门-->
        <el-dialog
                :title="insertSubOrgDialog.title"
                :visible.sync="insertSubOrgDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="insertSubOrgDialog.style"
                :width="insertSubOrgDialog.width"
        >
            <template>
                <insertSubOrgCom ref="insert_sub_org_ref" v-if="insertSubOrgDialog.dialogVisible"
                                 :_closeInsertSubOrgDialog="_closeInsertSubOrgDialog"
                                 @insertSubOrgListeners="_completeInsertSubOrg"></insertSubOrgCom>
            </template>
        </el-dialog>

        <!--修改部门-->
        <el-dialog
                :title="updateOrgDialog.title"
                :visible.sync="updateOrgDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="updateOrgDialog.style"
                :width="updateOrgDialog.width">
            <template>
                <updateOrgCom ref="update_org_ref" v-if="updateOrgDialog.dialogVisible"
                              :_closeUpdateOrgDialog="_closeUpdateOrgDialog"
                              @updateOrgListeners="_completeUpdateOrg"></updateOrgCom>
            </template>
        </el-dialog>

        <!--新增人员-->
        <el-dialog
                :title="insertEmpDialog.title"
                :visible.sync="insertEmpDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="insertEmpDialog.style"
                :width="insertEmpDialog.width">
            <template>
                <insertEmpCom ref="insert_emp_ref" v-if="insertEmpDialog.dialogVisible"
                              :_closeInsertEmpDialog="_closeInsertEmpDialog"
                              @insertEmpListeners="_insertEmpReturn"></insertEmpCom>
            </template>
        </el-dialog>

        <!--修改人员-->
        <el-dialog
                :title="updateEmpDialog.title"
                :visible.sync="updateEmpDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="updateEmpDialog.style"
                :width="updateEmpDialog.width">
            <template>
                <updateEmpCom ref="update_emp_ref" v-if="updateEmpDialog.dialogVisible"
                              :_closeUpdateEmpDialog="_closeUpdateEmpDialog"
                              @updateEmpListeners="_updateEmpReturn"></updateEmpCom>
            </template>
        </el-dialog>

        <!--新增岗位-->
        <el-dialog
                :title="insertPosiDialog.title"
                :visible.sync="insertPosiDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="insertPosiDialog.style"
                :width="insertPosiDialog.width"
                @close="_closeInsertPosiDialog">
            <template>
                <insertPosiCom ref="insert_posi_ref" v-if="insertPosiDialog.dialogVisible"
                               @insertPosiListeners="_insertPosiReturn"></insertPosiCom>
            </template>
        </el-dialog>

        <!--修改岗位-->
        <el-dialog
                :title="updatePosiDialog.title"
                :visible.sync="updatePosiDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :style="updatePosiDialog.style"
                :width="updatePosiDialog.width"
                @close="_closeUpdatePosiDialog">
            <template>
                <updatePosiCom ref="update_posi_ref" v-if="updatePosiDialog.dialogVisible"
                               @updatePosiListeners="_updatePosiReturn"></updatePosiCom>
            </template>
        </el-dialog>

        <!--管理岗位人员-->
        <el-dialog
                :title="managePosiEmpDialog.title"
                :visible.sync="managePosiEmpDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                :style="managePosiEmpDialog.style"
                :width="managePosiEmpDialog.width"
                @close="closeManagePosiEmp">
            <template>
                <managePosiEmpCom ref="manage_posi_emp_ref" v-if="managePosiEmpDialog.dialogVisible"
                ></managePosiEmpCom>
            </template>
        </el-dialog>

    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	import dtime from 'time-formater'
	import insertRootOrgCom from "./preInsertRootOrg.vue";
	import insertSubOrgCom from "../manageOrgAndEmp/preInsertSubOrg.vue";
	import updateOrgCom from "../manageOrgAndEmp/preUpdateOrg.vue";
	import insertEmpCom from "../manageOrgAndEmp/preInsertEmp.vue";
	import updateEmpCom from "../manageOrgAndEmp/preUpdateEmp.vue";
	import insertPosiCom from "../posi/preInsertPosi.vue";
	import updatePosiCom from "../posi/preUpdatePosi.vue";
	import managePosiEmpCom from "../posiEmp/managePosiEmp.vue";
	import moment from "moment";

	export default {
		components: {
			insertRootOrgCom,
			insertSubOrgCom,
			updateOrgCom,
			insertEmpCom,
			updateEmpCom,
			insertPosiCom,
			updatePosiCom,
			managePosiEmpCom
		},
		data() {
			return {
				mainloading: false,
				code: {//类型查询结果集
					genderTypeMapList: {},
				},
				BUTTON_STATUS: {
					preInsertSubOrgButton: true,
					preUpdateOrgButton: true,
					deleteOrgButton: true,
					preInsertEmpButton: true,
					preUpdateEmpButton: true,
					deleteEmpButton: true,
					insertPosiButton: true,
					updatePosiButton: true,
					deletePosiButton: true,
					managePosiEmp: true
				},
				orgList: [],
				filterText: '',//机构过滤文本框输入的变量
				ORG_NAME_: '',//机构名称，机构过滤时用
				defaultOrgProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
				//新增根部门的窗口
				insertRootOrgDialog: {
					show: false,
					title: '新增根部门',
					insertRootOrgDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '500px'
				},
				parentOrgId: '',//新增部门时，存储的公司id
				orgIdForm: {
					ORG_ID_: '',//存储公司或部门的id
				},
				//新增下级部门的窗口
				insertSubOrgDialog: {
					show: false,
					title: '新增下级部门',
					insertSubOrgDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//修改的窗口
				updateOrgDialog: {
					show: false,
					title: '修改部门',
					updateOrgDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '500px'
				},
				emploading: false,//员工页面的加载限制
				empList: [],
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 5,   // 1页显示多少条
					page_sizes: [5, 10, 15],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				empGridStyle: {
					width: '100%',
					height: window.screen.height / 4
				},
				posiloading: false,//员工页面的加载限制
				posiList: [],
				posiGridStyle: {
					width: '100%',
					height: window.screen.height / 4 + 100
				},
				idFlag: false,
				numbers: [],
				multipleSelection: [],
				numbersPosi: [],
				multipleSelectionPosi: [],
				//新增人员的窗口
				insertEmpDialog: {
					show: false,
					title: '新增人员',
					insertEmpDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '700px'
				},
				//修改人员的窗口
				updateEmpDialog: {
					show: false,
					title: '修改人员',
					updateEmpDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '700px'
				},
				//新增岗位的窗口
				insertPosiDialog: {
					show: false,
					title: '新增岗位',
					insertDutyDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '700px'
				},
				insertDutyReqTemp: '',
				//修改岗位的窗口
				updatePosiDialog: {
					show: false,
					title: '修改岗位',
					updateDutyDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '700px'
				},
				//管理岗位人员的窗口
				managePosiEmpDialog: {
					show: false,
					title: '管理岗位人员',
					managePosiEmpDialogLoading: false,
					dialogVisible: true,
					formLabelWidth: '120px',
					width: '1200px'
				},
			}
		},
		watch: {
			filterText(val) {
				this.$refs.tree.filter(val);
			}
		},
		created() {
			this.doSyncMethod();
		},
		methods: {
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
			async doSyncMethod() {
				await this._selectOrg();
				await this._selectCode();
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
			//查询类型
			async _selectCode() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
					data: {},
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
						for (let i = 0; i < that.CODE_LIST.length; i++) {
							if (that.CODE_LIST[i].CATEGORY_ == 'GENDER') {
								that.code.genderTypeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this._orgOnClick(this.orgIdForm, {
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this._orgOnClick(this.orgIdForm, {
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
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
				this._setButtonStatus();
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
			handleSelectionPosi(selection, row) {
				// 表单绑定的数据
				this.posiList.forEach((item, i) => {
					if (item.POSI_ID_ == row.POSI_ID_) {
						if (this.numbersPosi.indexOf(i) == -1) {
							this.numbersPosi.push(i);
						} else {
							this.numbersPosi.splice(this.numbersPosi.indexOf(i), 1);
						}
					}
				});
			},
			handleSelectionAllPosi(selection) {
				this.multipleSelectionPosi = selection;
				this.numbersPosi = [];
				if (this.multipleSelectionPosi.length != 0) {
					for (let i = 0; i < this.posiList.length; i++) {
						this.numbersPosi.push(i);
					}
				}
			},
			handleSelectionChangePosi(val) {
				this.multipleSelectionPosi = val;
				this._setButtonStatusPosi();
			},
			clickRowPosi(row) {
				this.$refs.posiGridRef.toggleRowSelection(row, true);

				this.posiList.forEach((r, i) => {
					if (r.POSI_ID_ == row.POSI_ID_) {
						if (this.numbersPosi.indexOf(i) == -1) {
							this.numbersPosi.push(i);
						} else {
							this.numbersPosi.splice(this.numbersPosi.indexOf(i), 1);
							this.$refs.posiGridRef.toggleRowSelection(row, false);
						}
					}
				});
			},
			//点击新增根的按钮
			preInsertRootOrg() {
				let that = this;
				this.insertRootOrgDialog.show = true;
				this.insertRootOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_root_org_ref.setInsertRootOrg();
				})
			},
			//关闭新增根窗口
			_closeInsertRootOrgDialog() {
				this.insertRootOrgDialog.show = false;
			},
			//新增根的变化
			_completeInsertRootOrg() {
				this.insertRootOrgDialog.show = false;
				this._selectOrg();
				this._setButton();
			},
			//点击树
			_orgOnClick(data, {
				page,
				page_size,
				where,
				fun
			} = {}) {
				this.emploading = true;
				this.posiloading = true;
				//改变按钮状态
				this.BUTTON_STATUS.preInsertSubOrgButton = false;
				this.BUTTON_STATUS.preUpdateOrgButton = false;
				this.BUTTON_STATUS.deleteOrgButton = false;
				this.BUTTON_STATUS.preInsertEmpButton = false;
				this.BUTTON_STATUS.insertPosiButton = false;

				//分页
				var query = this.$route.query;
				this.paginations.page_index = page || parseInt(query.page) || 1;
				this.paginations.page_size = page_size || parseInt(query.page_size) || this.paginations.page_size;
				var data1 = {
					pageIndex: this.paginations.page_index,
					pageSize: this.paginations.page_size
				};
				if (where) {
					data1 = Object.assign(data1, where || {});
				}

				this.parentOrgId = data.ORG_ID_;
				this.orgIdForm.ORG_ID_ = data.ORG_ID_;

				this.selectEmp(data);
				this.selectPosi(data);

			},
			//查询人员
			selectEmp(data) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: data.ORG_ID_,
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
						that.empList = [];
						let empList = res.data.empList;
						that.paginations.total = res.data.total;

						for (let i = 0; i < empList.length; i++) {
							const tableItem = {
								EMP_ID_: empList[i].EMP_ID_,
								EMP_CODE_: empList[i].EMP_CODE_,
								EMP_NAME_: empList[i].EMP_NAME_,
								GENDER_: empList[i].GENDER_,
								emp_gender: that.code.genderTypeMapList[empList[i].GENDER_],
								BIRTH_DATE_: empList[i].BIRTH_DATE_ == null ? null : dtime(empList[i].BIRTH_DATE_).format('YYYY-MM-DD '),
								IN_DATE_: empList[i].IN_DATE_,
								OUT_DATE_: empList[i].OUT_DATE_,
								TEL_: empList[i].TEL_,
								EMAIL_: empList[i].EMAIL_,
								STATUS_: empList[i].STATUS_,
								MEMO_: empList[i].MEMO_
							};
							that.empList.push(tableItem);
						}
						that.emploading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.emploading = false;
					that.emploading = true;
				})
			},
			//查询岗位
			selectPosi(data) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectPosi.do',
					data: {
						ORG_ID_: data.ORG_ID_,
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
						that.posiList = [];
						let posiList = res.data.posiList;

						for (let i = 0; i < posiList.length; i++) {
							const tableItem = {
								POSI_ID_: posiList[i].POSI_ID_,
								POSI_CODE_: posiList[i].POSI_CODE_,
								POSI_NAME_: posiList[i].POSI_NAME_,
								UPDATE_DATE_: dtime(posiList[i].UPDATE_DATE_).format('YYYY-MM-DD '),
								OPERATOR_NAME_: posiList[i].OPERATOR_NAME_,
								DUTY_NAME_: posiList[i].DUTY_NAME_,
								ORDER_: posiList[i].ORDER_,
								ORG_ID_: posiList[i].ORG_ID_,
							};
							that.posiList.push(tableItem);
						}
						that.posiloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.posiloading = false;
				})
			},
			//点击新增下级的按钮
			preInsertSubOrg() {
				let that = this;
				if (this.parentOrgId == "") {
					that.$message.error('请选择');
					return;
				}
				this.insertSubOrgDialog.show = true;
				this.insertSubOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_sub_org_ref.preInsertSubOrgForm.PARENT_ORG_ID_ = that.parentOrgId;
					this.$refs.insert_sub_org_ref.setInsertSubOrg();
				})
			},
			//关闭新增下级窗口
			_closeInsertSubOrgDialog() {
				this.insertSubOrgDialog.show = false;
			},
			//新增下级的变化
			_completeInsertSubOrg() {
				this.insertSubOrgDialog.show = false;
				this._selectOrg();
				this._setButton();
			},
			//点击公司、部门修改按钮
			_preUpdateOrg() {
				let that = this;
				this.updateOrgDialog.show = true;
				this.updateOrgDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_org_ref.preUpdatOrgForm.ORG_ID_ = that.parentOrgId;
					this.$refs.update_org_ref.setUpdateOrg();
				})
			},
			//关闭修改窗口
			_closeUpdateOrgDialog() {
				this.updateOrgDialog.show = false;
			},
			//修改之后的变化
			_completeUpdateOrg() {
				this.updateOrgDialog.show = false;
				this._selectOrg();
				this._setButton();
			},
			//删除公司/部门
			_deleteOrg(data) {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteOrg.do',
						data: {
							ORG_ID_: this.orgIdForm.ORG_ID_
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
							that._setButton();
							//删除成功后调次方法重新加载
							that._selectOrg();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						// that.mainloading = false;
					})
				});
			},
            //设置按钮
			_setButton(){
				this.BUTTON_STATUS.preInsertSubOrgButton = true;
				this.BUTTON_STATUS.preUpdateOrgButton = true;
				this.BUTTON_STATUS.deleteOrgButton = true;
				this.BUTTON_STATUS.preInsertEmpButton = true;
				this.BUTTON_STATUS.insertPosiButton = true;
            },
			//点击员工的新增按钮
			preInsertEmp() {
				this.insertEmpDialog.show = true;
				this.insertEmpDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_emp_ref.ORG_ID_ = this.orgIdForm.ORG_ID_;
				})
			},
			//关闭新增员工窗口
			_closeInsertEmpDialog() {
				this.insertEmpDialog.show = false;
			},
			//新增员工之后的变化
			_insertEmpReturn(returnValue) {
				this.insertEmpDialog.show = false;
				this._refreshEmp(returnValue);
			},
			//点击修改员工的按钮
			_preUpdateEmp() {
				this.updateEmpDialog.show = true;
				this.updateEmpDialog.dialogVisible = true;

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadEmp.do?EMP_ID_=' + this.multipleSelection[0].EMP_ID_ + ''
				).then(function (res) {
					if (res.data.success) {
						let emp = res.data.emp;
						that.$nextTick(_ => {
							that.$refs.update_emp_ref.updateEmpForm.EMP_ID_ = emp.EMP_ID_;
							that.$refs.update_emp_ref.updateEmpForm.ORG_ID_ = that.orgId;
							that.$refs.update_emp_ref.updateEmpForm.EMP_CODE_ = emp.EMP_CODE_;
							that.$refs.update_emp_ref.updateEmpForm.EMP_NAME_ = emp.EMP_NAME_;
							that.$refs.update_emp_ref.updateEmpForm.GENDER_ = emp.GENDER_;
							that.$refs.update_emp_ref.updateEmpForm.BIRTH_DATE_ = emp.BIRTH_DATE_ == null ? null : moment(emp.BIRTH_DATE_).format('YYYY-MM-DD'),
							that.$refs.update_emp_ref.updateEmpForm.TEL_ = emp.TEL_;
							that.$refs.update_emp_ref.updateEmpForm.EMAIL_ = emp.EMAIL_;
							that.$refs.update_emp_ref.updateEmpForm.MEMO_ = emp.MEMO_;
						})
					} else {
						that.$message.error(res.data.message);
						that.updateDiagloading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
				});
			},
			//关闭修改员工窗口
			_closeUpdateEmpDialog() {
				this.updateEmpDialog.show = false;
			},
			//修改员工之后的变化
			_updateEmpReturn(returnValue) {
				this.updateEmpDialog.show = false;
				this._refreshEmp(returnValue);
			},
			//删除员工
			_deleteEmp() {
				if (this.multipleSelection.length > 0) {
					this.$confirm('是否删除', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
						let that = this;
						let EMP_ID_LIST = [];
						for (let i = 0; i < this.multipleSelection.length; i++) {
							EMP_ID_LIST.push(this.multipleSelection[i].EMP_ID_);
						}

						axios({
							method: 'POST',
							url: this.baseUrl + 'deleteEmpByList.do',
							data: {
								EMP_ID_LIST: EMP_ID_LIST
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
								that._refreshEmp(that.orgIdForm);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							that.$message.error('删除失败请重试')
						})
					});
				} else {
					this.$confirm('请选择要删除的员工', '提示', {
						type: 'warning'
					})
				}
			},
			//员工新增、修改、删除后的页面刷新方法
			_refreshEmp(returnValue) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: returnValue.ORG_ID_
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
						that.empList = [];
						let empList = res.data.empList;
						for (let i = 0; i < empList.length; i++) {
							const tableItem = {
								EMP_ID_: empList[i].EMP_ID_,
								EMP_CODE_: empList[i].EMP_CODE_,
								EMP_NAME_: empList[i].EMP_NAME_,
								GENDER_: empList[i].GENDER_,
								emp_gender: that.code.genderTypeMapList[empList[i].GENDER_],
								BIRTH_DATE_: empList[i].BIRTH_DATE_== null ? null : moment(empList[i].BIRTH_DATE_).format('YYYY-MM-DD'),
								TEL_: empList[i].TEL_,
								EMAIL_: empList[i].EMAIL_,
								MEMO_: empList[i].MEMO_,
							};

							that.empList.push(tableItem);
						}
						that.emploading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.emploading = false;
				})
			},
			_setButtonStatus() {
				if (this.multipleSelection.length == 1) {
					this.BUTTON_STATUS.preUpdateEmpButton = false;
					this.BUTTON_STATUS.deleteEmpButton = false;
				}
				if (this.multipleSelection.length >= 2) {
					this.BUTTON_STATUS.preUpdateEmpButton = true;
					this.BUTTON_STATUS.deleteEmpButton = false;
				}
				if (this.multipleSelection.length == 0) {
					this.BUTTON_STATUS.preUpdateEmpButton = true;
					this.BUTTON_STATUS.deleteEmpButton = true;
				}
			},
			_setButtonStatusPosi() {
				if (this.multipleSelectionPosi.length == 1) {
					this.BUTTON_STATUS.updatePosiButton = false;
					this.BUTTON_STATUS.deletePosiButton = false;
					this.BUTTON_STATUS.managePosiEmp = false;
				}
				if (this.multipleSelectionPosi.length >= 2) {
					this.BUTTON_STATUS.updatePosiButton = true;
					this.BUTTON_STATUS.deletePosiButton = false;
					this.BUTTON_STATUS.managePosiEmp = true;
				}
				if (this.multipleSelectionPosi.length == 0) {
					this.BUTTON_STATUS.updatePosiButton = true;
					this.BUTTON_STATUS.deletePosiButton = true;
					this.BUTTON_STATUS.managePosiEmp = true;
				}
			},
			//新增岗位按钮
			preInsertPosi() {
				this.insertPosiDialog.show = true;
				this.insertPosiDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_posi_ref.ORG_ID_ = this.orgIdForm.ORG_ID_;
					this.$refs.insert_posi_ref.setPosiValue();
				})
			},
			//新增岗位后变化
			_insertPosiReturn(returnValue) {
				this.insertDutyReqTemp = returnValue;
				const tableItem = {
					POSI_ID_: this.insertDutyReqTemp.POSI_ID_,
					ORG_ID_: this.insertDutyReqTemp.ORG_ID_,
					POSI_CODE_: this.insertDutyReqTemp.POSI_CODE_,
					POSI_NAME_: this.insertDutyReqTemp.POSI_NAME_,
					ORDER_: this.insertDutyReqTemp.ORDER_,
					UPDATE_DATE_: dtime(this.insertDutyReqTemp.UPDATE_DATE_).format('YYYY-MM-DD '),
					DUTY_NAME_: this.insertDutyReqTemp.DUTY_NAME_,
					OPERATOR_NAME_: this.insertDutyReqTemp.OPERATOR_NAME_,
				};
				this.posiList.push(tableItem);
				this.insertPosiDialog.show = false;
			},
			//关闭新增岗位的监听
			_closeInsertPosiDialog() {
				this.insertPosiDialog.dialogVisible = false;
			},
			//打开修改按钮
			_preUpdatePosi() {
				this.updatePosiDialog.show = true;
				this.updatePosiDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_posi_ref.POSI_ID_ = this.multipleSelectionPosi[0].POSI_ID_
					this.$refs.update_posi_ref.setPosiValue();
				})
			},
			//修改岗位后的变化
			_updatePosiReturn(returnValue) {
				let updateDutyReqTemp = returnValue;
				let that = this;
				for (let key in updateDutyReqTemp) {//装载被修改数据到页面
					(that.posiList[that.numbersPosi[0]][key] != null) ? that.posiList[that.numbersPosi[0]][key] = updateDutyReqTemp[key] : '';
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.multipleSelectionPosi[0][key] != null) ? that.multipleSelectionPosi[0][key] = updateDutyReqTemp[key] : '';
				}
				this.multipleSelectionPosi[0].UPDATE_DATE_ = dtime(updateDutyReqTemp.UPDATE_DATE_).format('YYYY-MM-DD ');
				this.updatePosiDialog.show = false;
			},
			//关闭修改岗位的监听
			_closeUpdatePosiDialog() {
				this.updatePosiDialog.dialogVisible = false;
			},
			//点击删除岗位按钮
			_deletePosi() {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.posiloading = true;
					let POSI_ID_LIST = [];
					for (let i = 0; i < this.multipleSelectionPosi.length; i++) {
						POSI_ID_LIST.push(this.multipleSelectionPosi[i].POSI_ID_);
					}
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deletePosiNew.do',
						data: {
							POSI_ID_LIST: POSI_ID_LIST
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
							that.posiloading = false;
							that.refreshPosi();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.posiloading = false;
					})
				});
			},
			//删除岗位后的刷新
			refreshPosi() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectPosi.do',
					data: {
						ORG_ID_: that.orgIdForm.ORG_ID_
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
						that.posiList = [];
						let posiList = res.data.posiList;

						for (let i = 0; i < posiList.length; i++) {
							const tableItem = {
								POSI_ID_: posiList[i].POSI_ID_,
								POSI_CODE_: posiList[i].POSI_CODE_,
								POSI_NAME_: posiList[i].POSI_NAME_,
								UPDATE_DATE_: dtime(posiList[i].UPDATE_DATE_).format('YYYY-MM-DD '),
								OPERATOR_NAME_: posiList[i].OPERATOR_NAME_,
								DUTY_NAME_: posiList[i].DUTY_NAME_,
								ORDER_: posiList[i].ORDER_,
								ORG_ID_: posiList[i].ORG_ID_,
							};
							that.posiList.push(tableItem);
						}
						that.posiloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.posiloading = false;
				})
			},
			//点击管理岗位人员
			managePosiEmp() {
				let that = this;
				this.managePosiEmpDialog.show = true;
				this.managePosiEmpDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.manage_posi_emp_ref.posiEmpForm.POSI_ID_ = that.multipleSelectionPosi[0].POSI_ID_;
					this.$refs.manage_posi_emp_ref.posiEmpForm.ORG_ID_ = that.multipleSelectionPosi[0].ORG_ID_;
					this.$refs.manage_posi_emp_ref.initPosi();
				})
			},
			//关闭管理岗位人员的监听
			closeManagePosiEmp() {
				this.managePosiEmpDialog.dialogVisible = false;
			}
		}
	}
</script>

<style>

</style>
