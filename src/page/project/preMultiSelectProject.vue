<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='projectQueryForm'
                    ref="projectQueryForm">
                <el-form-item>
                    项目名称:
                    <el-input v-model="projectQueryForm.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称" clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='_selectProject()'>筛选
                    </el-button>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='_chooseProject()'>选择
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    highlight-current-row
                    v-loading="projectGrid.projectGridLoading"
                    :data="projectGrid.projectList"
                    :style="projectGrid.gridTableStyle"
                    :height="projectGrid.gridTableStyle.height"
                    align='center'
                    ref="projectGridRef"
                    :max-height="tableHeight"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow"
            >
                <el-table-column type="selection" width="40">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="PROJECT_ID_"
                        label="项目ID"
                        width="250"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        width="450"
                        align="center"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_CODE_"
                        label="项目编码"
                        width="250"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="STATUS_DESC_"
                        label="状态"
                        width="80"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.STATUS_DESC_ }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='projectGrid.pagination.total > 0'
                                :page-sizes="projectGrid.pagination.page_sizes"
                                :page-size="projectGrid.pagination.page_size"
                                :layout="projectGrid.pagination.layout"
                                :total="projectGrid.pagination.total"
                                :current-page='projectGrid.pagination.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	export default {
		name: "preMultiSelectProject",
        data(){
			return{
				projectQueryForm : {
					PROJECT_NAME_ : '',
					STATUS_ : '9'
				},
				projectGrid :{
					sortNum: 0,
					projectList : [],
					projectGridLoading : true,
					gridTableStyle: {
						width: '100%',
						height: '500px'
					},
					pagination: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					}
				},
				tableHeight: '',
				idFlag: false,
				PROJECT_STATUS_CODE_LIST: [],
				projectStatusCodeMapList:{},
				numbers: [],
				multipleSelection: [],
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this._selectCode();
				this.getList();
			},
			_selectProject(){
				this.getList();
			},
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.projectGrid.projectGridLoading = true;
				let query = this.$route.query;
				this.projectGrid.pagination.page_index = page || parseInt(query.page) || 1;
				this.projectGrid.pagination.page_size = page_size || parseInt(query.page_size) || this.projectGrid.pagination.page_size;
				let data = {
					pageIndex: this.projectGrid.pagination.page_index,
					pageSize: this.projectGrid.pagination.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProject.do',
					data: {
						PROJECT_NAME_: this.projectQueryForm.PROJECT_NAME_,
						STATUS_: this.projectQueryForm.STATUS_,
						limit: this.projectGrid.pagination.page_size,
						page: this.projectGrid.pagination.page_index
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
						that.projectGrid.pagination.total = res.data.total;
						that.projectGrid.projectList = [];

						let projectList = res.data.projectList;

						for (let i = 0; i < projectList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								PROJECT_ID_: projectList[i].PROJECT_ID_,
								PROJECT_CODE_: projectList[i].PROJECT_CODE_,
								PROJECT_NAME_: projectList[i].PROJECT_NAME_,
								STATUS_: projectList[i].STATUS_,
								STATUS_DESC_ : that.projectStatusCodeMapList[projectList[i].STATUS_]
							};
							that.projectGrid.projectList.push(tableItem);
						}
						that.projectGrid.projectGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试');
					that.projectGrid.projectGridLoading = false;
				})
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
							if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_STATUS'){
								that.PROJECT_STATUS_CODE_LIST.push(that.CODE_LIST[i]);
								that.projectStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			handleSelection(selection, row) {
				// 表单绑定的数据
				this.projectGrid.projectList.forEach((item, i) => {
					if (item.PROJECT_ID_ == row.PROJECT_ID_) {
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
				this.$refs.projectGridRef.toggleRowSelection(row, true);

				this.projectGrid.projectList.forEach((r, i) => {
					if (r.PROJECT_ID_ == row.PROJECT_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.projectGridRef.toggleRowSelection(row, false);
						}
					}
				});
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.projectGrid.pagination.page_size * (page - 1);
				this.getList({
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
            //点击选择
			_chooseProject(){
                if(this.multipleSelection.length == 0){
					this.$message.warning("请选择项目!");
					return;
                }
                let returnValue = this.multipleSelection;
				this.$emit('multiProjectListeners', returnValue);
            },
        }
	}
</script>

<style scoped>

</style>
