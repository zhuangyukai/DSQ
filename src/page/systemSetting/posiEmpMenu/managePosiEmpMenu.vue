<template>
    <div>
        <div>
            <el-col :span="6">
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 830px">
                    <el-tree
                            v-loading="orgloading"
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
            <el-col :span="5">
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 830px; margin-left: 10px">
                    <div>
                        <el-table
                                v-loading="posiloading"
                                :data="posiList"
                                :style="posiGridStyle"
                                align='center'
                                ref="posiGridRef"
                                highlight-current-row
                                :height="posiGridStyle.height"
                                @row-click="clickPosiRow">
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
                                    prop="POSI_NAME_"
                                    label="岗位名称"
                                    align='center'
                                    width="160">
                            </el-table-column>
                            <el-table-column
                                    prop="POSI_CODE_"
                                    label="岗位编码"
                                    align='center'
                                    width="160">
                            </el-table-column>
                        </el-table>
                    </div>
                    <div>
                        <el-table
                                v-loading="emploading"
                                :data="empList"
                                :style="empGridStyle"
                                align='center'
                                ref="empGridRef"
                                highlight-current-row
                                :height="empGridStyle.height"
                                @row-click="clickEmpRow">
                            <el-table-column
                                    v-if="idFlag"
                                    prop="EMP_ID_"
                                    label="员工ID"
                                    align='center'>
                            </el-table-column>
                            <el-table-column
                                    v-if="idFlag"
                                    prop="POSI_EMP_ID_"
                                    label="岗位人员ID"
                                    align='center'>
                            </el-table-column>
                            <el-table-column
                                    v-if="idFlag"
                                    prop="EMP_CODE_"
                                    label="员工编码"
                                    align='center'>
                            </el-table-column>
                            <el-table-column
                                    prop="EMP_NAME_"
                                    label="员工姓名"
                                    align='left'
                                    width="320">
                            </el-table-column>
                        </el-table>
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
                </div>
            </el-col>
            <el-col :span="13">
                <div>
                    <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 830px; margin-left: 10px; overflow-y:scroll">
                        <el-form>
                            <el-button type="primary" size="mini" @click='savePosiEmpMenu()' style="margin-left: 8px"
                                       :disabled="BUTTON_STATUS.savePosiEmpMenu">保存
                            </el-button>
                        </el-form>
                        <el-scrollbar>
                        <el-tree
                                v-loading="menuloading"
                                :data="menuList"
                                :expand-on-click-node="false"
                                default-expand-all
                                ref="menuTree"
                                highlight-current
                                show-checkbox
                                check-strictly="true"
                                node-key="MENU_ID_"
                                @node-click="clickTree"
                                :style="tempStyle"
                                :props="defaultmenuProps">
                        </el-tree>
                        </el-scrollbar>
                    </div>
                </div>
            </el-col>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				tempStyle : {
                    height : '800px'
                },
				orgloading: false,
				orgList: [],
				defaultOrgProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
				posiloading: false,//员工页面的加载限制
				posiList: [],
				posiGridStyle: {
					width: '100%',
					height: window.screen.height / 4 + 100
				},
				idFlag: false,
				emploading: false,//员工页面的加载限制
				empList: [],
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 5,   // 1页显示多少条
					page_sizes: [5, 10, 15],  //每页显示多少条
					layout: "total, sizes, prev, pager, next"   // 翻页属性
				},
				empGridStyle: {
					width: '100%',
					height: window.screen.height / 4 + 150
				},
				posiForm: {
					POSI_ID_: '',//存储公司或部门的id
				},
				BUTTON_STATUS: {
					savePosiEmpMenu: true
				},
				menuloading: false,
				menuList: [],
				defaultmenuProps: {
					children: 'children',
					label: 'MENU_NAME_'
				},
				POSI_EMP_ID_: '',
				numbers: [],
				menu: []
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
				await this._selectMenu();
			},
			async _selectOrg() {
				this.orgloading = true;
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
						that.orgloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.orgloading = false;
				})
			},
			async _selectMenu() {
				this.menuloading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectMenu.do',
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
						that.menuList = res.data.children;
						that.menu = res.data.menuList;
						that.menuloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.menuloading = false;
				})
			},
			//点击部门
			_orgOnClick(data) {
				this.posiloading = true;
				let that = this;
				this.empList = [];
				let menuIdList = [];
				this.$refs.menuTree.setCheckedKeys(menuIdList);
				this.BUTTON_STATUS.savePosiEmpMenu = true;
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
			//点击岗位的行
			clickPosiRow(row) {
				this.emploading = true;
				let menuIdList = [];
				this.$refs.menuTree.setCheckedKeys(menuIdList);
				this.BUTTON_STATUS.savePosiEmpMenu = true;
				this.posiForm.POSI_ID_ = row.POSI_ID_;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectPosiEmp.do',
					data: {
						POSI_ID_: row.POSI_ID_,
						// page: that.paginations.page_size,
						// limit: that.paginations.page_index
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
						let posiEmpList = res.data.posiEmpList;
						that.paginations.total = res.data.total;

						for (let i = 0; i < posiEmpList.length; i++) {
							const tableItem = {
								EMP_ID_: posiEmpList[i].EMP_ID_,
								EMP_CODE_: posiEmpList[i].EMP_CODE_,
								EMP_NAME_: posiEmpList[i].EMP_NAME_,
								POSI_EMP_ID_: posiEmpList[i].POSI_EMP_ID_,
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
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.clickPosiRow(this.posiForm, {
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.clickPosiRow(this.posiForm, {
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			//点击人的行
			clickEmpRow(row) {
				this.menuloading = true;
				this.BUTTON_STATUS.savePosiEmpMenu = false;
				this.POSI_EMP_ID_ = row.POSI_EMP_ID_;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectPosiEmpMenu.do',
					data: {
						POSI_EMP_ID_: row.POSI_EMP_ID_
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
						let empMenuList = res.data.posiEmpMenuList;
						let menuIdList = [];
						for (let i = 0; i < empMenuList.length; i++) {
							menuIdList.push(empMenuList[i].MENU_ID_);
						}
						that.$refs.menuTree.setCheckedKeys(menuIdList);
						that.menuloading = false;
					} else {
						that.$message.error(res.data.message);
						that.menuloading = false;
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
					that.menuloading = false;
				})
			},
			//点击保存按钮
			savePosiEmpMenu() {
				let that = this;
				let node = this.$refs.menuTree.getCheckedKeys().concat(this.$refs.menuTree.getHalfCheckedKeys());
				let MENU_ID_LIST = [];
				for (let i = 0; i < node.length; i++) {
					MENU_ID_LIST.push(node[i]);
				}
				axios({
					method: 'POST',
					header: '',
					url: this.baseUrl + 'updatePosiEmpMenu.do',
					data: {
						POSI_EMP_ID_: that.POSI_EMP_ID_,
						MENU_ID_LIST: MENU_ID_LIST
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
						that.$message.success('保存成功');
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试');
				})
			},
			clickTree(key) {
				this.$refs.menuTree.setChecked(key, true, false);
				this.menu.forEach((r, i) => {
					if (r.MENU_ID_ == key.MENU_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.menuTree.setChecked(key, false, false);
						}
					}
				});
			},
		}
	}
</script>

<style scoped>

</style>
