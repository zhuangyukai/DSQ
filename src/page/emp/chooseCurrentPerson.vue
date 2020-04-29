<template>
    <div>
        <div>
            <el-table
                    highlight-current-row
                    v-loading="empLoading"
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
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		data(){
		    return{
				chooseCurrentPersonForm:{
					ORG_ID_: ''
                },
				empLoading: false,
				idFlag: false,
				tableHeight: '',
				empTableStyle: {
					width: '100%',
					height: '400px',
				},
				empList: [],
            }
        },
        methods:{
			selectEmp(){
				let that = this;
				that.empLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmpByOrgPosi.do',
					data: {
						POSI_EMP_ID_: that.chooseCurrentPersonForm.ORG_ID_
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
						that.empLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
            },
			_chooseEmp(row){
				this.$emit('choosePersonListeners', row);
				this.$emit('chooseLeaderListeners', row);
				this.$emit('chooseParticipantListeners', row);
            }
        }
	}
</script>

<style scoped>

</style>