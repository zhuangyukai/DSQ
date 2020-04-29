<template>
        <el-row>
            <div style="border: 0px solid #BDC0C0;height: 800px;width: auto">
                <el-col :span="10.5">
                    <div class="grid-content " style="border-right: 1px solid #000000;height: 800px;"><!--Org-->
                        <div>
                            <el-form
                                    :inline="true"
                                    :model='party_Query_Date'
                                    ref="search_data"
                                    class="demo-form-inline search-form">
                                <el-form-item>
                                    机构名称:
                                    <el-input v-model="party_Query_Date.PARTY_NAME_ORG" style="width: 130px" placeholder="请输入机构名称"
                                              clearable>
                                    </el-input>
                                </el-form-item>
<!--                                <el-form-item>
                                    <el-input
                                            placeholder="输入机构名称进行过滤"
                                            v-model="filterText">
                                    </el-input>
                                </el-form-item>-->
                                <el-form-item>
                                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectOrg'
                                    >查询</el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertRootPartyOrg'
                                    >添加根节点</el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertSubPartyOrg' :disabled="BUTTON_STATUS.preInsertSubPartyOrgButton"
                                    >添加子节点</el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-edit-outline" @click='preUpdatePartyOrg' :disabled="BUTTON_STATUS.preUpdatePartyOrgButton"
                                    >编辑</el-button>
                                    <el-button type="danger" size="mini"  icon="el-icon-delete" @click='_deletePartyOrg' :disabled="BUTTON_STATUS._deletePartyOrgButton"
                                    >删除</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <div class="statistics common-content">
                            <el-table ref="multipleTable"
                                      :data="orgList"
                                      border style="width: 100%;"
                                      size="medium"
                                      highlight-current-row
                                      @current-change="handleCurrentChange"
                                      :row-class-name="rowClassNameHandler"
                                      row-key="PARTY_ID_">
                                <el-table-column
                                        label="职务名称"
                                        width="300"
                                        align="left"
                                        show-overflow-tooltip
                                        fixed
                                        :filters="[{ text: this.org.PARTY_NAME_, value: this.party_Query_Date.PARTY_NAME_ORG }]"
                                        :filter-method="filterTag"
                                >
                                    <template slot-scope="scope">
                                        <span :style="{marginLeft: scope.row.level * 23 + 'px'}">&ensp;</span>
                                        <i v-if="scope.row.showChildren"
                                           :class="{'fa fa-folder-open':scope.row.showChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                                           @click="onExpand(scope.row)"
                                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                                        <i v-else :class="{'fa fa-folder':scope.row.hasChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                                           @click="onExpand(scope.row)"
                                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                                        <span :data-level="scope.row.level"
                                              :style="{marginLeft: 4 + 'px'}">{{ scope.row.PARTY_NAME_ }}</span>
                                    </template>
                                </el-table-column>
                                <el-table-column prop="ADDR_" label="地址" width="150"align="left"></el-table-column>
                                <el-table-column prop="MEMO_" width="150" label="备注" align="left"></el-table-column>
                            </el-table>
                        </div>

                    </div>
                </el-col>
                <el-col :span="13">
                    <div class="grid-content "><!--Emp-->
                        <div><!--按钮区-->
                            <el-form
                                    :inline="true"
                                    :model='party_Query_Date'
                                    ref="search_data"
                                    class="demo-form-inline search-form">
                                <el-form-item>
                                    员工名称:
                                    <el-input v-model="party_Query_Date.PARTY_NAME_EMP" style="width: 200px" placeholder="请输入员工名称"
                                              clearable>
                                    </el-input>
                                </el-form-item>
                                <el-form-item>
                                    <el-button type="primary" size="mini" icon="el-icon-search" @click='_selectEmp'
                                    >查询</el-button>
                                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='_preInsertEmp' :disabled="BUTTON_STATUS._preInsertEmpButton"
                                    >添加</el-button>
                                    <el-button type="danger" size="mini" icon="el-icon-delete" @click='_deleteEmpParty' :disabled="BUTTON_STATUS._deleteEmpPartyButton"
                                    >删除</el-button>
                                </el-form-item>
                            </el-form>
                        </div>
                        <el-table
                                :data="empList"
                                :style="gridTableStyle"
                                :height="gridTableStyle.height"
                                align='center'
                                :max-height="tableHeight"
                                ref="partyGridRef"
                                @select="handleSelection"
                                @select-all="handleSelectionAll"
                                @selection-change="handleSelectionChange"
                        >
                            <el-table-column type="selection" width="55">
                            </el-table-column>
                            <el-table-column
                                    v-if="idFlag"
                                    prop="PARTY_ID_"
                                    label="主体ID"
                                    align='center'
                                    width="0">
                            </el-table-column>
                            <el-table-column
                                    prop="PARTY_CODE_"
                                    label="人员编码"
                                    align='center'
                                    width="90">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.PARTY_CODE_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.PARTY_CODE_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="PARTY_NAME_"
                                    label="人员名称"
                                    align='center'
                                    width="90">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.PARTY_NAME_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.PARTY_NAME_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="TEL_"
                                    label="电话"
                                    align='center'
                                    width="100">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.TEL_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.TEL_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="EMAIL_"
                                    label="邮箱"
                                    align='center'
                                    width="170">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.EMAIL_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.EMAIL_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="WECHAT_"
                                    label="微信"
                                    align='center'
                                    width="100">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.WECHAT_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.WECHAT_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    prop="QQ_"
                                    label="QQ_"
                                    align='center'
                                    width="100">
                                <template slot-scope="scope">
                                    <div v-if="!scope.row.editing">
                                        <span>{{ scope.row.QQ_ }}</span>
                                    </div>
                                    <div v-else>
                                        <el-input v-model="scope.row.QQ_"></el-input>
                                    </div>
                                </template>
                            </el-table-column>
                            <el-table-column
                                    label="操作"
                                    align="center"
                                    width="200">
                                <template slot-scope="scope">
                                    <div class="operate-groups">
                                        <el-button
                                                type="primary"
                                                size="mini"
                                                v-if="!scope.row.editing"
                                                icon="el-icon-edit-outline"
                                                @click="_preUpdateEmp(scope.$index, scope.row)">编辑
                                        </el-button>
                                        <el-button
                                                type="primary"
                                                size="mini"
                                                v-if="scope.row.editing"
                                                icon="el-icon-success"
                                                @click="_insertOrUpdateEmp(scope.$index, scope.row)">保存
                                        </el-button>
                                        <el-button
                                                size="mini"
                                                type="warning"
                                                v-if="scope.row.editing"
                                                icon="el-icon-warning"
                                                @click="_cancelEmp(scope.$index, scope.row)">取消
                                        </el-button>
                                    </div>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </el-col>
            </div>
            <!--新增根Org窗口-->
            <el-dialog
                    :title="insertRootOrgParty.title"
                    :visible.sync="insertRootOrgParty.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    @closed="_closeInsertRootOrgParty"
                    width  = 30%
            >
                <el-tabs v-model="insertRootOrgParty.tabName" type="card" :style="insertRootOrgParty.style">
                        <template>
                            <insertRootOrgParty ref="insertRootOrgParty" v-if="insertRootOrgParty.dialogVisible"
                                                 :_closePreInsertRootOrgPartyDialog="_closePreInsertRootOrgPartyDialog"
                                                 @listeners="_insertRootPartyOrgReturn">

                            </insertRootOrgParty>
                        </template>
                </el-tabs>
            </el-dialog>
            <!--新增子Org窗口-->
            <el-dialog
                    :title="insertSubOrgParty.title"
                    :visible.sync="insertSubOrgParty.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    @closed="_closeInsertSubOrgParty"
                    width  = 30%
            >
                <el-tabs v-model="insertSubOrgParty.tabName" type="card" :style="insertSubOrgParty.style">
                    <template>
                        <insertSubOrgParty ref="insertSubOrgParty" v-if="insertSubOrgParty.dialogVisible"
                                            :_closePreInsertSubOrgPartyDialog="_closePreInsertSubOrgPartyDialog"
                                            @listeners="_insertSubPartyOrgReturn">

                        </insertSubOrgParty>
                    </template>
                </el-tabs>
            </el-dialog>
            <!--编辑Org窗口-->
            <el-dialog
                    :title="updateOrgParty.title"
                    :visible.sync="updateOrgParty.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    @closed="_closeUpdateOrgParty"
                    width  = 30%
            >
                <el-tabs v-model="updateOrgParty.tabName" type="card" :style="updateOrgParty.style">
                    <template>
                        <updateOrgParty ref="updateOrgParty" v-if="updateOrgParty.dialogVisible"
                                           :_closePreUpdateOrgPartyDialog="_closePreUpdateOrgPartyDialog"
                                           @listeners="_updatePartyOrgReturn">

                        </updateOrgParty>
                    </template>
                </el-tabs>
            </el-dialog>
        </el-row>
</template>

<script>
	import axios from 'axios';
	import insertRootOrgParty from './preInsertRootOrgParty.vue';/*引用新增根机构页面*/
	import insertSubOrgParty from './preInsertSubOrgParty.vue';/*引用新增子机构页面*/
	import updateOrgParty from './preUpdateOrgParty.vue';/*引用新增子机构页面*/

	export default {
		components: {insertRootOrgParty,insertSubOrgParty,updateOrgParty},/*引入外部组件，import的值*/
		data() {
			return {
				mainloading: false,//加载限制
				filterEmp: '',
				filterText: '',
				idFlag: false,
				currentRow: [],
                org: {/*点击机构名称时，值传入这里，目的是调用其它页面传值*/
					PARTY_ID_: '',
					PARENT_PARTY_ID_: '',
					PARTY_CODE_: '',
					PARTY_NAME_: '',
					ADDR_: '',
					MEMO_:''
                },
				BUTTON_STATUS: {//设置按钮状态用
					preInsertSubPartyOrgButton: true,//机构添加子节点按钮
					preUpdatePartyOrgButton: true,//机构编辑按钮
					_deletePartyOrgButton: true,//机构删除按钮
					_preInsertEmpButton: true,//员工添加按钮
					_deleteEmpPartyButton: true,//员工删除按钮
				},
				orgList: [],/*查询机构的数据*/
				empList: [],/*查询成员的数据*/
				insertRootOrgPartyReturn: '',/*新增机构页面的返回值*/
				partyEmpList: [],
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				partyList: [],
				numbers: [],
				multipleSelection: [],
				insertRootOrgParty: {/*新增根机构跳转窗口的参数*/
					show: false,
					title: '新增根机构',
					dialogVisible: true,
					style: {
						height: '400px'
					}
				},
				insertSubOrgParty: {/*新增子机构跳转窗口的参数*/
					show: false,
					title: '新增子机构',
					dialogVisible: true,
					style: {
						height: '400px'
					}
				},
				updateOrgParty: {/*编辑机构跳转窗口的参数*/
					show: false,
					title: '编辑机构',
					dialogVisible: true,
					style: {
						height: '400px'
					}
				},
				partyEmp: {
					tempDate: {
						PARTY_ID_: '',
						PARTY_NAME_: '',
						PARTY_CODE_: ''
					},
					insertOrUpdate: false,
					PARTY_ID_: '',
					tempIndex: ''
				},
				defaultProps: {
					children: 'children',
					label: 'PARTY_NAME_'
				},
                //用于查询框
				party_Query_Date: {
					PARTY_NAME_ORG: '',
					PARTY_NAME_EMP: '',
					PARENT_PARTY_ID_: ''
				},

				empDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					formLabelWidth: '120px',
					empLoading: false,
				},

				empTableStyle: {
					width: '100%',
					height: '400px',
					borderLeft: '3px solid #000'
				},
				tableHeight: '',
            }
        },

/*		 mounted() {
			 this._selectOrg();
		 },*/
		watch: {
			filterText(val) {
				this.$refs.multipleTable.filter(val);
			}
		},
		mounted() {
			let self = this
			self.loadOrgList()
		},

		created() {
			this.doSyncMethod();
		},
		methods: {
			filterNode(value, data) {
				if (!value) return true;
				return data.PARTY_NAME_.indexOf(value) !== -1;
			},
			handleSelection(selection, row) {
				// 表单绑定的数据
				this.empList.forEach((item, i) => {
					if (item.PARTY_ID_ == row.PARTY_ID_) {
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
			},

			clickRow(row) {
				this.$refs.partyGridRef.toggleRowSelection(row, true);

				this.empList.forEach((r, i) => {
					if (r.PARTY_ID_ == row.PARTY_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.partyGridRef.toggleRowSelection(row, false);
						}
					}
				});
			},
			async doSyncMethod() {
				await this._selectOrg();
			},
            /*新增根机构方法*/
			preInsertRootPartyOrg() {
				this.insertRootOrgParty.dialogVisible = true;
				this.insertRootOrgParty.show = true;
			},
			//新增根机构的回调
			_insertRootPartyOrgReturn(){
				this.loadOrgList();
				this.insertRootOrgParty.show = false;
				this.empList = '';
			},
			//新增子机构的回调
			_insertSubPartyOrgReturn(){
				this.loadOrgList();
				this.insertSubOrgParty.show = false;
				//新增后将按钮设为不可用
				this.BUTTON_STATUS.preInsertSubPartyOrgButton = true;
				this.BUTTON_STATUS.preUpdatePartyOrgButton = true;
				this.BUTTON_STATUS._deletePartyOrgButton = true;
				this.empList = '';
			},
			//编辑机构的回调
			_updatePartyOrgReturn(){
				this.loadOrgList();
				this.updateOrgParty.show = false;
				//编辑后将按钮设为不可用
				this.BUTTON_STATUS.preInsertSubPartyOrgButton = true;
				this.BUTTON_STATUS.preUpdatePartyOrgButton = true;
				this.BUTTON_STATUS._deletePartyOrgButton = true;
				this.empList = '';
			},
			/*新增子机构方法*/
			preInsertSubPartyOrg(data) {
				this.insertSubOrgParty.dialogVisible = true;

				this.insertSubOrgParty.show = true;
				this.$nextTick(_ => {
                   this.$refs.insertSubOrgParty.insertSubOrgForm.PARENT_PARTY_ID_ = this.org.PARTY_ID_;
				})
			},
			/*编辑机构方法*/
			preUpdatePartyOrg(data) {
				this.updateOrgParty.dialogVisible = true;

				this.updateOrgParty.show = true;
				this.$nextTick(_ => {
					this.$refs.updateOrgParty.updateOrgParty.PARTY_ID_ = this.org.PARTY_ID_;
					this.$refs.updateOrgParty.updateOrgParty.PARENT_PARTY_ID_ = this.org.PARENT_PARTY_ID_;
					this.$refs.updateOrgParty.updateOrgParty.PARTY_CODE_ = this.org.PARTY_CODE_;
					this.$refs.updateOrgParty.updateOrgParty.PARTY_NAME_ = this.org.PARTY_NAME_;
					this.$refs.updateOrgParty.updateOrgParty.ADDR_ = this.org.ADDR_;
					this.$refs.updateOrgParty.updateOrgParty.MEMO_ = this.org.MEMO_;
				})
			},
            /*由新增根节点窗口的关闭按钮调用*/
			_closePreInsertRootOrgPartyDialog() {
				this.insertRootOrgParty.show = false;
			},
			_closeInsertRootOrgParty() {
				this.insertRootOrgParty.dialogVisible = false;
				this.insertRootOrgParty.riderDialogVisible = false;
			},
			/*由新增子节点窗口的关闭按钮调用*/
			_closePreInsertSubOrgPartyDialog() {
				this.insertSubOrgParty.show = false;
			},
			_closeInsertSubOrgParty() {
				this.insertSubOrgParty.dialogVisible = false;
				this.insertSubOrgParty.riderDialogVisible = false;
			},
			/*由编辑机构窗口的关闭按钮调用*/
			_closePreUpdateOrgPartyDialog() {
				this.updateOrgParty.show = false;
			},
			_closeUpdateOrgParty() {
				this.updateOrgParty.dialogVisible = false;
				this.updateOrgParty.riderDialogVisible = false;
			},
			_preInsertEmp() {
				for (let i = 0; i < this.empList.length; i++) {
					if (this.empList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				this.empList = this.empList || []
				this.empList.push({
					PARTY_ID_: "",
					PARENT_PARTY_ID_: "",
					PARTY_CODE_: "",
					PARTY_NAME_: "",
					PARTY_TYPE_: "",
					TEL_: "",
					ADDR_: "",
					EMAIL_: "",
					WECHAT_: "",
					QQ_: "",
					MEMO_: "",
					editing: true
				});
			},
			// 编辑
			_preUpdateEmp($index, row) {
				this.$set(this.empList[$index], 'editing', true)
			},
			//员工添加或编辑的保存
			_insertOrUpdateEmp(index, row) {

				if (row.PARTY_ID_ == '') {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertParty.do',
						data: {
							PARENT_PARTY_ID_: this.org.PARTY_ID_,
							PARTY_CODE_: row.PARTY_CODE_,
							PARTY_NAME_: row.PARTY_NAME_,
							PARTY_TYPE_: 1,
							TEL_: row.TEL_,
							EMAIL_: row.EMAIL_,
							WECHAT_: row.WECHAT_,
							QQ_: row.QQ_
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
						let partyEmp = res.data.party;
						that.$set(that.empList[index], 'editing', false);
						that.$set(that.empList[index], 'PARTY_CODE_', partyEmp.PARTY_CODE_);
						that.$set(that.empList[index], 'PARTY_NAME_', partyEmp.PARTY_NAME_);
						that.$set(that.empList[index], 'TEL_', partyEmp.TEL_);
						that.$set(that.empList[index], 'EMAIL_', partyEmp.EMAIL_);
						that.$set(that.empList[index], 'WECHAT_', partyEmp.WECHAT_);
						that.$set(that.empList[index], 'QQ_', partyEmp.QQ_);
						that.$set(that.empList[index], 'PARTY_ID_', partyEmp.PARTY_ID_);

						that.$message.success("添加成功");
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				} else {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'updateParty.do',
						data: {
							PARTY_ID_: row.PARTY_ID_,
							PARTY_CODE_: row.PARTY_CODE_,
							PARTY_NAME_: row.PARTY_NAME_,
							PARTY_TYPE_: 1,
							TEL_: row.TEL_,
							EMAIL_: row.EMAIL_,
							WECHAT_: row.WECHAT_,
							QQ_: row.QQ_
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
						let emp = res.data.party;
						that.$set(that.empList[index], 'editing', false);
						that.$set(that.empList[index], 'PARTY_NAME_', emp.PARTY_NAME_);
						that.$set(that.empList[index], 'TEL_', emp.TEL_);
						that.$set(that.empList[index], 'EMAIL_', emp.EMAIL_);
						that.$set(that.empList[index], 'WECHAT_', emp.WECHAT_);
						that.$set(that.empList[index], 'QQ_', emp.QQ_);

						that.$message.success("修改成功");
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				}
			},
			// 取消
			_cancelEmp(index, row) {
				this.$set(this.empList[index], 'editing', false);
				this.cancelRefreshEmp();
			},
			//取消后刷新
			cancelRefreshEmp(){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARENT_PARTY_ID_: that.org.PARTY_ID_
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
					that.empList = res.data.partyList;
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},
			//删除机构
			_deletePartyOrg(data) {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;

					axios({
						method: 'POST',
						url: this.baseUrl + 'deletePartyById.do',
						data: {
							PARTY_ID_: this.org.PARTY_ID_
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
							//删除成功后将按钮状态设为不可用
							that.BUTTON_STATUS.preInsertSubPartyOrgButton = true
							that.BUTTON_STATUS.preUpdatePartyOrgButton = true;
							that.BUTTON_STATUS._deletePartyOrgButton = true
                            //删除成功后调次方法重新加载
							that.loadOrgList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.mainloading = false;
					})
				});
			},
            //删除员工
			_deleteEmpParty() {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					this.mainloading = true;
					let PARTY_ID_LIST = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						PARTY_ID_LIST.push(this.multipleSelection[i].PARTY_ID_);
					}

					axios({
						method: 'POST',
						url: this.baseUrl + 'deletePartyByList.do',
						data: {
							PARTY_ID_LIST: PARTY_ID_LIST
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

							that.deleteRefreshEmp();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			},
			//删除员工后刷新
			deleteRefreshEmp(){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARENT_PARTY_ID_: this.org.PARTY_ID_
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
					that.empList = res.data.partyList;
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},
/*			_selectOrg() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARTY_TYPE_: 0,
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
					that.orgList = res.data.children;
					that.BUTTON_STATUS._deletePartyOrgButton = true,//机构删除按钮设为不可用
					that.BUTTON_STATUS._preInsertEmpButton = true,//员工添加按钮设为不可用
					that.BUTTON_STATUS._deleteEmpPartyButton = true//员工删除按钮设为不可用
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},*/
			_orgOnClick(data) {
				this.mainloading = true;
				//改变按钮状态
				this.BUTTON_STATUS.preInsertSubPartyOrgButton = false;
				this.BUTTON_STATUS.preUpdatePartyOrgButton = false;
				this.BUTTON_STATUS._deletePartyOrgButton   = false;
				this.BUTTON_STATUS._preInsertEmpButton = false;
				this.BUTTON_STATUS._deleteEmpPartyButton = false;

				let that = this;
				that.empDialog.empLoading = true;
				//值传入全局变量，留着给其他页面传值用//
				this.org.MEMO_ = data.MEMO_,
				this.org.ADDR_ = data.ADDR_,
                this.org.PARTY_NAME_ = data.PARTY_NAME_,
				this.org.PARTY_CODE_ = data.PARTY_CODE_,
				this.org.PARENT_PARTY_ID_ = data.PARENT_PARTY_ID_,
				this.org.PARTY_ID_ = data.PARTY_ID_,
				this.party_Query_Date.PARENT_PARTY_ID_ = data.PARTY_ID_,
				axios({
						method: 'POST',
						url: this.baseUrl + 'selectParty.do',
						data: {
							PARENT_PARTY_ID_: data.PARTY_ID_,
                            PARTY_TYPE_: 1
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
						that.empList = res.data.partyList;
						that.empDialog.empLoading = false;
					}).catch(function (err) {
						that.empDialog.empLoading = false;
						/*请求失败*/
						that.$message.error('系统错误请联系管理员')
					})
			},
			//机构查询方法
			selectOrg() {
				let that = this;
				let self = this

				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARTY_TYPE_: 0,
						PARTY_NAME_: this.party_Query_Date.PARTY_NAME_ORG
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
					let result = res.data.children;
					let resultArray = self._processLevelStatisticData(result);
					that.orgList = resultArray
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},
            //员工查询方法
			_selectEmp() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARTY_TYPE_: 1,
						PARENT_PARTY_ID_: this.party_Query_Date.PARENT_PARTY_ID_,
						PARTY_NAME_: this.party_Query_Date.PARTY_NAME_EMP
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
					that.empList = res.data.partyList;
				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},
            /*以下是新方法*/

			filterTag(value, row) {
				return row.tag === value;
			},

			_processLevelStatisticData(dataArray) {
				let self = this

				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_PARTY_ID_ == null) {
						item['level'] = level
						resultArray.push(item)
						self._loadChildrenData(resultArray, dataArray, item, level + 1)
					}
				}
				return resultArray
			},

			_loadChildrenData(resultArray, originArray, item, level) {
				let self = this

				let deployed = 0
				let undeployed = 0
				let edit = 0
				let completed = 0
				for (let i = 0; i < originArray.length; i++) {
					let originItem = originArray[i]
					// 判断是否是item项的子项
					if (originItem.PARENT_PARTY_ID_ == item.PARTY_ID_) {
						item['hasChildren'] = true
						item['showChildren'] = false

						originItem['level'] = level
						originItem['visible'] = false // 子项默认隐藏
						originItem['hiddenByCategory'] = false

						resultArray.push(originItem)
						self._loadChildrenData(
							resultArray,
							originArray,
							originItem,
							level + 1
						)
					}
				}

			},

			search() {
				this.loadOrgList()
			},

			loadOrgList() {
				let self = this
				let that = this;

				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARTY_TYPE_: 0,
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
					let result = res.data.partyList;
					let resultArray = self._processLevelStatisticData(result);
					that.orgList = resultArray
				})

			},
			rowClassNameHandler({row, rowIndex}) {
				let className = 'pid-' + row.PARENT_PARTY_ID_
				if (
					row.PARENT_PARTY_ID_ !== null &&
					(row['visible'] !== true || row['hiddenByCategory'] === true)
				) {
					className += ' hiddenRow'
				}
				return className
			},

			onExpand(row) {
				let self = this
				let isShowChildren = !row['showChildren']
				row['showChildren'] = isShowChildren
				self._loadAllSubItems(row, true, isShowChildren)
			},

			_loadAllSubItems(item, isFirstLevlChildren, isShowChilren) {
				let self = this
				let dataArray = []
				for (let i = 0; i < self.orgList.length; i++) {
					let tempItem = self.orgList[i]
					if (tempItem.PARENT_PARTY_ID_ === item.PARTY_ID_) {
						if (isFirstLevlChildren) {
							tempItem['visible'] = !tempItem['visible']
						}
						tempItem['hiddenByCategory'] = !isShowChilren

						dataArray.push(tempItem)
						let subItemArray = self._loadAllSubItems(
							tempItem,
							false,
							isShowChilren
						)
						dataArray = dataArray.concat(subItemArray)
					}
				}
				return dataArray
			},
			handleCurrentChange(val) {
				this.currentRow = val;
				this._orgOnClick(this.currentRow);
			}
            /*以上是新方法*/
		}
	}
</script>

<style scoped lang="less">
    .grid-content {
        min-height: 36px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }


</style>
