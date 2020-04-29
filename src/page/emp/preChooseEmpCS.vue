<template>
    <div class="fillcontain">
        <div class="empForm">
            <el-form
                    :inline="true"
                    :model='empForm'
                    ref="empForm"
                    class="demo-form-inline search-form">
                <el-form-item>
                    部门:
                    <el-select clearable v-model="empForm.ORG_ID_" filterable placeholder="请选择" style="width: 200px">
                        <el-option
                                v-for="item in orgList"
                                :key="item.value"
                                :label="item.ORG_NAME_"
                                :value="item.ORG_ID_">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item>
                    人员名称:
                    <el-input v-model="empForm.EMP_NAME_" style="width: 200px" placeholder="请输入人员名称"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" style="margin-top: 3.5px"
                               @click='_selectEmp()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="search" style="margin-top: 3.5px"
                               @click='_chooseEmp()'>确定
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="empGrid.gridLoading"
                    :data="empGrid.empList"
                    :style="empGrid.gridTableStyle"
                    :height="empGrid.gridTableStyle.height"
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
                        prop="ORG_NAME_"
                        label="部门名称"
                        align='left'
                >
                </el-table-column>
                <el-table-column
                        prop="EMP_NAME_"
                        label="人员名称"
                        align='left'
                >
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';

	export default {
		name: "preChooseEmpCS",
		data() {
			return {
				empForm: {
					ORG_ID_ : '',
					EMP_NAME_: ''
				},
                temOrgId : '',
				orgList: [],
				empGrid: {
					sortNum: 0,
					gridLoading: false,
					empList: [],
					gridTableStyle: {
						width: '100%',
						height: '400px'
					},
					selectedDate: []
				},
				numbers: [],
				multipleSelection: []
			};
		},
		mounted() {
			this.empGrid.gridLoading = true;
			this.doSyncMethod();
		},
		methods: {
			async doSyncMethod() {
				await this._selectOrg();
				this._selectEmp();
			},
			async _selectOrg(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectOrg.do',
					data: {
						ORG_ID_ : '100'
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
						that.orgList = res.data.orgList;
						if(that.temOrgId != ''){
							that.empForm.ORG_ID_ = that.temOrgId;
                        }
						// that.CODE_LIST = res.data.codeList;
						// for(let i = 0; i<that.CODE_LIST.length; i++){
						// 	if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_TYPE'){
						// 		that.projectTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						// 	}
						// 	if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_STATUS'){
						// 		that.projectStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						// 	}
						// }
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
            },
			_selectEmp({
						   page,
						   page_size,
						   where,
						   fun
					   } = {}) {
				this.multipleSelection = [];
				this.numbers = [];

				this.empGrid.gridLoading = true;

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: this.empForm.ORG_ID_,
						EMP_NAME_: this.empForm.EMP_NAME_
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
						that.empGrid.empList = [];
						let empList = res.data.empList;

						for (let i = 0; i < empList.length; i++) {
							const tableItem = {
								sortNum: that.empGrid.sortNum + (i + 1),
								EMP_ID_: empList[i].EMP_ID_,
								EMP_NAME_: empList[i].EMP_NAME_,
								ORG_NAME_ : empList[i].ORG_NAME_
							};
							that.empGrid.empList.push(tableItem);
						}
						that.empGrid.gridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.empGrid.gridLoading = false;
				})
			},
			_chooseEmp(){
				this.$emit('chooseParticipantListeners', this.multipleSelection);
            },
			handleSelection(selection, row){
				// 表单绑定的数据
				this.empGrid.empList.forEach((item, i) => {
					if (item.EMP_ID_ == row.EMP_ID_) {
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
					for(let i = 0; i<this.empGrid.empList.length; i++){
						this.numbers.push(i);
					}
				}
			},
			handleSelectionChange(val){
				this.multipleSelection = val;
			},
			clickRow(row){
				this.$refs.multipleTable.toggleRowSelection(row, true);

				this.empGrid.empList.forEach((r, i) => {
					if (r.EMP_ID_ == row.EMP_ID_) {
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
		}
	}
</script>

<style scoped>
</style>
