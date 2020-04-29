<template>
    <div>
        <div style="height: 520px">
            <el-col :span="10">
                <div>
                    <el-form
                            :inline="true"
                            :model='posiEmp_data'
                            ref="posiEmp_data"
                            class="demo-form-inline search-form">
                        <el-form-item>
                            <el-input
                                    style="width: 33%"
                                    v-model="posiEmp_data.EMP_CODE_"
                                    placeholder="人员编码">
                            </el-input>
                            <el-input
                                    style="width: 33%"
                                    v-model="posiEmp_data.EMP_NAME_"
                                    placeholder="人员姓名">
                            </el-input>
                            <el-button type="primary" size="mini" @click='selectEmp("posiEmp_data")'>筛选
                            </el-button>
                            <el-button type="primary" size="mini" @click='insertPosiEmp()'
                                       :disabled="BUTTON_STATUS.insertPosiEmp">添加
                            </el-button>

                        </el-form-item>
                    </el-form>
                </div>
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 475px">
                    <div style="text-align: left; background: -moz-linear-gradient(left,#5A5AAD,white); background: -webkit-linear-gradient(left,#5A5AAD,white); margin-bottom: 2px">
                        <span style="margin-left: 5px; font-size: 16px; font-family: 华文新魏; color: white">人员</span>
                    </div>
                    <el-table
                            v-loading="empLoading"
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
                                prop="EMP_CODE_"
                                label="人员编码"
                                align='center'
                                width="220">
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
                                align='center'
                                width="130">
                        </el-table-column>
                        <el-table-column
                                v-if="idFlag"
                                prop="ORG_ID_"
                                label="部门ID"
                                align='center'
                                width="220">
                        </el-table-column>
                        <el-table-column
                                prop="ORG_NAME_"
                                label="部门名称"
                                align='center'
                                width="220">
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

            <el-col :span="13">
                <div>
                    <el-form>
                        <el-button type="danger" size="mini" @click='deletePosiEmp()' style="margin-left: 19px"
                                   :disabled="BUTTON_STATUS.deletePosiEmp">删除
                        </el-button>
                    </el-form>
                </div>
                <div style="box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04); height: 475px; margin-top: 19px; margin-left: 20px">
                    <div style="text-align: left; background: -moz-linear-gradient(left,#5A5AAD,white); background: -webkit-linear-gradient(left,#5A5AAD,white); margin-bottom: 2px">
                        <span style="margin-left: 5px; font-size: 16px; font-family: 华文新魏; color: white">岗位人员</span>
                    </div>
                    <el-table
                            v-loading="posiloading"
                            :data="posiEmpList"
                            :style="posiGridStyle"
                            align='center'
                            ref="posiGridRef"
                            :height="posiGridStyle.height"
                            @select="handleSelectionPosiEmp"
                            @select-all="handleSelectionAllPosiEmp"
                            @selection-change="handleSelectionChangePosiEmp"
                            @row-click="clickRowPosiEmp">
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
                                prop="POSI_EMP_ID_"
                                label="岗位人员ID"
                                align='center'>
                        </el-table-column>
                        <el-table-column
                                prop="EMP_NAME_"
                                label="人员名称"
                                align='center'
                                width="150">
                        </el-table-column>
                        <el-table-column
                                prop="ORG_NAME_"
                                label="部门名称"
                                align='center'
                                width="200">
                        </el-table-column>
                        <el-table-column
                                prop="OPERATOR_NAME_"
                                label="操作人员"
                                align='center'
                                width="150">
                        </el-table-column>
                    </el-table>
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
				posiEmpForm: {
					POSI_ID_: '',
					ORG_ID_: ''
				},
				posiEmp_data: {
					EMP_CODE_: '',
					EMP_NAME_: '',
					EMP_CODE_page: '',
					EMP_NAME_page: '',
				},
				BUTTON_STATUS: {
					insertPosiEmp: true,
					deletePosiEmp: true
				},
				empLoading: false,
				idFlag: false,
				tableHeight: '',
				empTableStyle: {
					width: '100%',
					height: '400px',
				},
				empList: [],
				numbers: [],
				multipleSelection: [],
				numbersPosiEmp: [],
				multipleSelectionPosiEmp: [],
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 10,   // 1页显示多少条
					page_sizes: [5, 10, 15],  //每页显示多少条
					layout: "total, sizes, prev, pager, next"   // 翻页属性
				},
				empGridStyle: {
					width: '100%',
					height: window.screen.height / 4 + 150
				},
				posiloading: false,//员工页面的加载限制
				posiEmpList: [],
				posiGridStyle: {
					width: '100%',
					height: window.screen.height / 4 + 150
				},
				sortnum: 0
			}
		},
		methods: {
			initPosi() {
				this.getEmpList({
					fun: () => {
					}
				});
				this.selectPosiEmp();
			},
			getEmpList({
							   page,
							   page_size,
							   where,
							   fun
						   } = {}) {
				this.empLoading = true;
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
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: that.posiEmpForm.ORG_ID_,
						EMP_CODE_: that.posiEmp_data.EMP_CODE_,
						EMP_NAME_: that.posiEmp_data.EMP_NAME_,
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
						that.empList = [];

						let empList = res.data.empList;

						for (let i = 0; i < empList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								ORG_ID_: empList[i].ORG_ID_,
								ORG_NAME_: empList[i].ORG_NAME_,
								EMP_ID_: empList[i].EMP_ID_,
								EMP_CODE_: empList[i].EMP_CODE_,
								EMP_NAME_: empList[i].EMP_NAME_,
							};
							that.empList.push(tableItem);
						}
						that.empLoading = false;

					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.empLoading = false;
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
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getEmpList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getEmpList({
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
			selectEmp(posiEmp_data) {
				this.posiEmp_data.EMP_CODE_page = this.posiEmp_data.EMP_CODE_;
				this.posiEmp_data.EMP_NAME_page = this.posiEmp_data.EMP_NAME_;
				this.getEmpList();
			},
			selectPosiEmp() {
				this.numbersPosiEmp = [];
				this.multipleSelectionPosiEmp= [];
				let that = this;
				that.posiloading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectPosiEmp.do',
					data: {
						POSI_ID_: that.posiEmpForm.POSI_ID_
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
						that.posiEmpList = res.data.posiEmpList;
						that.posiloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.posiloading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			handleSelectionPosiEmp(selection, row) {
				// 表单绑定的数据
				this.posiEmpList.forEach((item, i) => {
					if (item.POSI_EMP_ID_ == row.POSI_EMP_ID_) {
						if (this.numbersPosiEmp.indexOf(i) == -1) {
							this.numbersPosiEmp.push(i);
						} else {
							this.numbersPosiEmp.splice(this.numbersPosiEmp.indexOf(i), 1);
						}
					}
				});
			},
			handleSelectionAllPosiEmp(selection) {
				this.multipleSelectionPosiEmp = selection;
				this.numbersPosiEmp = [];
				if (this.multipleSelectionPosiEmp.length != 0) {
					for (let i = 0; i < this.posiEmpList.length; i++) {
						this.numbersPosiEmp.push(i);
					}
				}
			},
			handleSelectionChangePosiEmp(val) {
				this.multipleSelectionPosiEmp = val;
				this._setButtonStatusPosi();
			},
			clickRowPosiEmp(row) {
				this.$refs.posiGridRef.toggleRowSelection(row, true);

				this.posiEmpList.forEach((r, i) => {
					if (r.POSI_EMP_ID_ == row.POSI_EMP_ID_) {
						if (this.numbersPosiEmp.indexOf(i) == -1) {
							this.numbersPosiEmp.push(i);
						} else {
							this.numbersPosiEmp.splice(this.numbersPosiEmp.indexOf(i), 1);
							this.$refs.posiGridRef.toggleRowSelection(row, false);
						}
					}
				});
			},
			_setButtonStatus() {
				if (this.multipleSelection.length > 0) {
					this.BUTTON_STATUS.insertPosiEmp = false;
				}
				if (this.multipleSelection.length == 0) {
					this.BUTTON_STATUS.insertPosiEmp = true;
				}
			},
			_setButtonStatusPosi() {
				if (this.multipleSelectionPosiEmp.length > 0) {
					this.BUTTON_STATUS.deletePosiEmp = false;
				}
				if (this.multipleSelectionPosiEmp.length == 0) {
					this.BUTTON_STATUS.deletePosiEmp = true;
				}
			},
			//点击添加按钮
			insertPosiEmp() {
				let that = this;
				let EMP_ID_LIST = [];
				for (let i = 0; i < this.multipleSelection.length; i++) {
					EMP_ID_LIST.push(this.multipleSelection[i].EMP_ID_);
					for (let j = 0; j < this.posiEmpList.length; j++) {
						if (that.posiEmpList[j].EMP_ID_ == EMP_ID_LIST[i]) {
							this.$message.warning(that.posiEmpList[j].EMP_NAME_ + "已选");
							return;
						}
					}
				}

				axios({
					method: 'POST',
					header: '',
					url: this.baseUrl + 'insertPosiEmpList.do',
					data: {
						POSI_ID_: that.posiEmpForm.POSI_ID_,
						EMP_ID_LIST: EMP_ID_LIST
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
						that.$message.success('新增成功');
						that.selectPosiEmp();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('新增失败请重试');
				})

			},
			//点击删除按钮
			deletePosiEmp() {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					let POSI_EMP_ID_LIST = [];
					for (let i = 0; i < that.multipleSelectionPosiEmp.length; i++) {
						POSI_EMP_ID_LIST.push(this.multipleSelectionPosiEmp[i].POSI_EMP_ID_);
					}
					axios({
						method: 'POST',
						url: this.baseUrl + 'deletePosiEmpByIdList.do',
						data: {
							POSI_EMP_ID_LIST: POSI_EMP_ID_LIST
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
							that.selectPosiEmp();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
				});
			}
		}
	}
</script>

<style scoped>

</style>
