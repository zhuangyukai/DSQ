<template>
    <!--选择人员 DIALOG-->
        <div class="temp-list">

            <el-form
                    :inline="true"
                    :model='empQueryDate'
                    ref="search_data"
                    class="demo-form-inline search-form"
            >
                <el-form-item>
                    人员姓名:
                    <el-input v-model="empQueryDate.EMP_NAME_" style="width: 200px" placeholder="请输入人员姓名"
                              clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button circle type="success" size="medium" icon="el-icon-search"
                               @click='_selectEmpByButton()'>
                    </el-button>
                </el-form-item>
            </el-form>

            <el-row>
                <div style="border: 1px solid #BDC0C0;height: 400px;">
                    <el-col :span="12">
                        <div class="grid-content bg-purple">
                            <div>
                                <el-tree
                                        :data="orgList"
                                        :props="defaultProps"
                                        :expand-on-click-node="false"
                                        default-expand-all
                                        highlight-current
                                        @node-click="_orgOnClick"
                                ></el-tree>
                            </div>

                        </div>
                    </el-col>
                    <el-col :span="12">
                        <div class="grid-content bg-purple-light">
                            <el-table
                                    highlight-current-row
                                    v-loading="empDialog.empLoading"
                                    :data="empList"
                                    :style="empTableStyle"
                                    :height="empTableStyle.height"
                                    align='center'
                                    :max-height="tableHeight">
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
                                        width="220">
                                </el-table-column>
                                <el-table-column
                                        prop="operation"
                                        align='left'
                                        label="操作"
                                        fixed="right"
                                        width="70">
                                    <template slot-scope='scope'>
                                        <el-button
                                                type="warning"
                                                icon='edit'
                                                size="mini"
                                                @click='_chooseEmp(scope.row)'
                                        >选择
                                        </el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </el-col>
                </div>
            </el-row>

        </div>
</template>

<script>

	import axios from 'axios';

	export default {
        data(){
			return{
				empQueryDate: {
					EMP_NAME_: ''
				},
				orgList: [],
				defaultProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
				empDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					formLabelWidth: '120px',
					empLoading: false,
				},
				idFlag: false,
				tableHeight: '',
				empTableStyle: {
					width: '100%',
					height: '400px',
					borderLeft: '3px solid #000'
				},
				empList: [],
            }
        },

        methods: {
			_selectOrg() {
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
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},

            //点击部门查询人员
			_orgOnClick(data) {
				let that = this;
				that.empDialog.empLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: data.ORG_ID_
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
						that.empList = res.data.empList;
						that.empDialog.empLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.empDialog.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},

            //模糊查询
			_selectEmpByButton() {
				this.empDialog.empLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						EMP_NAME_: this.empQueryDate.EMP_NAME_
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
						that.empList = res.data.empList;
						that.empDialog.empLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.empDialog.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},


            //点击选择按钮
			_chooseEmp(row) {
				this.$emit('chooseEmpListeners', row);

			},

        }

	}
</script>

<style scoped>

</style>