<template>
    <el-row>
        <div style="border: 0px solid #BDC0C0;height: 800px;">
            <el-col :span="9">
                <div class="grid-content " style="border-right: 1px solid #000000;height: 800px;">
                    <div>
                        <el-form>
                            <el-form-item>
                                <el-input
                                        placeholder="输入公司/部门名称进行过滤"
                                        v-model="filterText"
                                        style="width: 180px">
                                </el-input>
                            </el-form-item>
                        </el-form>
                    </div>
                    <div>
                        <el-tree
                                v-loading="mainloading"
                                :data="orgList"
                                :expand-on-click-node="false"
                                :filter-node-method="filterNode"
                                default-expand-all
                                ref="tree"
                                highlight-current
                                :props="defaultOrgProps"
                                @node-click="_orgOnClick">
                        </el-tree>
                    </div>
                </div>
            </el-col>
            <el-col :span="15">
                <div class="grid-content "><!--Emp-->
                    <div><!--按钮区-->
                        <el-form
                                :inline="true"
                                :model='emp_Query_Date'
                                ref="search_data"
                                class="demo-form-inline search-form">
                            <el-form-item>
                                员工名称:
                                <el-input v-model="emp_Query_Date.EMP_NAME_" style="width: 150px" placeholder="请输入员工名称"
                                          clearable>
                                </el-input>
                            </el-form-item>
                            <el-form-item>
                                <el-button type="primary" size="mini"
                                @click='_selectDailyOfCalendar'>查看日报</el-button>
                            </el-form-item>
                        </el-form>
                    </div>
                    <el-table
                            v-loading="emploading"
                            :data="empList"
                            :style="empGridStyle"
                            align='center'
                            ref="empGridRef"
                            height="750px"
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
                </div>
            </el-col>
        </div>
        <div style="margin-left: 950px">
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
        <!--打开查看日报页面-->
  <!--      <el-dialog
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
                <manageCalendar ref="insert_root_org_ref" v-if="insertRootOrgDialog.dialogVisible"
                                  :_closeInsertRootOrgDialog="_closeInsertRootOrgDialog">
                </manageCalendar>
            </template>
        </el-dialog>-->
    </el-row>
</template>
<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	import manageCalendar from "../calendar/manageCalendar.vue";

	export default {
		components: {manageCalendar},

		data(){
		    return{
				mainloading: false,
		    	code: {//类型查询结果集
					genderTypeMapList: {},
                },
				orgList: [],
				filterText: '',//机构过滤文本框输入的变量
				ORG_NAME_: '',//机构名称，机构过滤时用
				defaultOrgProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
/*				//打开查看日报页面参数
				insertRootOrgDialog:{
					show: false,
					title: '新增根部门',
					insertRootOrgDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},*/
                parentOrgId : '',//新增部门时，存储的公司id
				orgIdForm: {
					ORG_ID_: '',//存储公司或部门的id
                },
				emploading: false,//员工页面的加载限制
				empList: [],
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 15,   // 1页显示多少条
					page_sizes: [5, 10, 15],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				emp_Query_Date: {
					EMP_NAME_: '',
                },
				empGridStyle: {
					width: '100%',
				},
				idFlag: false,
				numbers: [],
				multipleSelection: [],
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
        methods:{
			filterNode(value, data) {
				if (!value) return true;
				return data.ORG_NAME_.indexOf(value) !== -1;
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
					url: this.baseUrl + 'selectOrganization.do',
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
					that.orgList = res.data.children;
					that.mainloading = false;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.mainloading = false;
				})
			},
            //查询类型
			async _selectCode(){
				let that = this;
				axios({
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
					that.CODE_LIST = res.data.codeList;
					for(let i = 0; i<that.CODE_LIST.length; i++){
						if(that.CODE_LIST[i].CATEGORY_ == 'GENDER'){
							that.code.genderTypeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						}
					}
				}).catch(function (err) {
				});
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this._orgOnClick(this.orgIdForm,{
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this._orgOnClick(this.orgIdForm,{
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
            //点击树
			_orgOnClick(data,{
                        page,
                        page_size,
                        where,
                        fun
			} = {}){
				this.emploading = true;
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
                let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmployees.do',
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
							BIRTH_DATE_: empList[i].BIRTH_DATE_,
							IN_DATE_:  empList[i].IN_DATE_,
							OUT_DATE_: empList[i].OUT_DATE_,
							TEL_: empList[i].TEL_,
							EMAIL_: empList[i].EMAIL_,
							STATUS_: empList[i].STATUS_,
							MEMO_: empList[i].MEMO_
						};
						that.empList.push(tableItem);
					}
					that.emploading = false;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.emploading = false;
					this.emploading = true;
				})

            },
			_selectDailyOfCalendar(){
				href="manageCalendar.vue";
				let that = this;
				// this.insertRootOrgDialog.show = true;
				// this.insertRootOrgDialog.dialogVisible = true;

				if(this.multipleSelection.length = 0){
					this.$confirm('请选择员工', '提示', {
						confirmButtonText: '确定',
						cancelButtonText: '取消',
						type: 'warning'
					}).then(() => {
                        this.url = "manageCalendar?EMP_ID_=" + this.multipleSelection[0].EMP_ID_
					})
				}

				this.$nextTick(_ => {
					this.$refs.insert_root_org_ref.setInsertRootOrg();
				})
			}
        }
	}
</script>

<style scoped>
    .grid-content {
        min-height: 36px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .search-form {
        width: 100%;
        min-width: 750px;
    }
    .el-form-item {
        margin-bottom: 10px !important;
    }
    .el-date-editor {
        width: 200px;
    }
    .el-input__inner {
        height: 36px !important;
    }
</style>