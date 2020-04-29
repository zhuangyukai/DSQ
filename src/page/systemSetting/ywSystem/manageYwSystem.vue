<template>
    <div style="width: 100%">
        <div>
            <el-form
                    :inline="true"
                    :model='ywSystem_Query_Date'
                    ref="ywSystem_Query_Date"
                    class="demo-form-inline search-form">
                <el-form-item>
                    公司名称:
                    <el-select v-model="ywSystem_Query_Date.ORG_NAME_" placeholder="请选择公司" style="width: 200px" clearable>
                        <el-option
                                v-for="item in orgList"
                                :key="item.ORG_ID_"
                                :label="item.ORG_NAME_"
                                :value="item.ORG_ID_">
                        </el-option>
                    </el-select>
                    系统名称:
                    <el-input v-model="ywSystem_Query_Date.SYSTEM_NAME_" style="width: 200px" placeholder="请输入系统名称"
                              clearable>
                    </el-input>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectYwSystem()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertYwSystem()'>添加
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" @click='preUpdateYwSystem()' :disabled="BUTTON_STATUS.preUpdateYwSystem">编辑
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-delete" @click='deleteYwSystem()' :disabled="BUTTON_STATUS.deleteYwSystem">删除
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
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
                <el-table-column
                        prop="ORG_CODE_"
                        label="公司编码"
                        align='left'
                        width="220"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="ORG_NAME_"
                        label="公司名称"
                        align='left'
                        width="300"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="EMP_NAME_"
                        label="起草人"
                        align='left'
                        width="220"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="DRAFT_DATE_"
                        label="起草时间"
                        align='left'
                        width="220"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="ORDER_"
                        label="排序"
                        align='left'
                        width="150"
                        sortable>
                </el-table-column>
            </el-table>
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

            <!--添加-->
            <el-dialog
                    :title="insertYwSystemDialog.title"
                    :visible.sync="insertYwSystemDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="insertYwSystemDialog.style"
                    :width="insertYwSystemDialog.width"
                    @close="closeInsertYwSystemDialog"
            >
                <template>
                    <insertYwSystemCom ref="insert_ywSystem_ref" v-if="insertYwSystemDialog.dialogVisible"
                                      @insertYwSystemListeners="_completeInsertYwSystem"></insertYwSystemCom>
                </template>
            </el-dialog>

            <!--编辑-->
            <el-dialog
                    :title="updateYwSystemDialog.title"
                    :visible.sync="updateYwSystemDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="false"
                    :style="updateYwSystemDialog.style"
                    :width="updateYwSystemDialog.width"
                    @close="closeUpdateYwSystemDialog"
            >
                <template>
                    <updateYwSystemCom ref="update_ywSystem_ref" v-if="updateYwSystemDialog.dialogVisible"
                                      @updateYwSystemListeners="_completeUpdateYwSystem"></updateYwSystemCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	import insertYwSystemCom from "../ywSystem/insertYwSystem.vue"
    import updateYwSystemCom from "../ywSystem/updateYwSystem.vue"
	export default {
		name: "manageYwSystem",
		components: {insertYwSystemCom, updateYwSystemCom},
        data(){
		    return{
				ywSystem_Query_Date: {
					ORG_NAME_: '',
					ORG_ID_: '',
					SYSTEM_NAME_: ''
                },
				ywSystemloading: false,
				ywSystemData: [],
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				tableHeight: '',
				idFlag: false,
				sortnum: 0,
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				currentRow : null,
				//按钮状态
				BUTTON_STATUS: {
					preUpdateYwSystem: true,
					deleteYwSystem: true
				},
				//新增窗口
				insertYwSystemDialog: {
					show: false,
					title: '新增系统',
					insertYwSystemDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//编辑窗口
				updateYwSystemDialog: {
					show: false,
					title: '编辑项目',
					updateYwSystemDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				orgList: [],
            }
        },
        created(){
			this.ywSystemloading = true;
			this.doSyncMethod();
        },
        methods: {
			async doSyncMethod() {
				await this._selectYwOrg();
				this.getYwSystemList();
			},
			async _selectYwOrg(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectDevOpsOrg.do',
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
						that.orgList = res.data.orgList;

					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			getYwSystemList({
                       page,
                       page_size,
                       where,
                        fun
					} = {}){

				this.BUTTON_STATUS.preUpdateYwSystem = true;
				this.BUTTON_STATUS.deleteYwSystem = true;

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
						ORG_ID_: this.ywSystem_Query_Date.ORG_NAME_,
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
								DRAFT_DATE_: dtime(ywSystemList[i].DRAFT_DATE_).format('YYYY-MM-DD '),
								ORDER_: ywSystemList[i].ORDER_,
								ORG_ID_: ywSystemList[i].ORG_ID_,
								ORG_CODE_: ywSystemList[i].ORG_CODE_,
								ORG_NAME_: ywSystemList[i].ORG_NAME_,
								EMP_NAME_: ywSystemList[i].EMP_NAME_
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
			clickRow(){
                this.BUTTON_STATUS.preUpdateYwSystem = false;
				this.BUTTON_STATUS.deleteYwSystem = false;
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
            //点击筛选
			selectYwSystem(){
				this.getYwSystemList();
            },
            //点击添加
			preInsertYwSystem(){
				this.insertYwSystemDialog.show = true;
				this.insertYwSystemDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_ywSystem_ref.setInsertYwSystemForm();
				})
            },
			closeInsertYwSystemDialog(){
				this.insertYwSystemDialog.dialogVisible = false;
            },
			_completeInsertYwSystem(returnValue){
				let insertYwSystemTemp = returnValue;
				const tableItem = {
					SYSTEM_ID_: insertYwSystemTemp.SYSTEM_ID_,
					SYSTEM_CODE_: insertYwSystemTemp.SYSTEM_CODE_,
					SYSTEM_NAME_:insertYwSystemTemp.SYSTEM_NAME_,
					DRAFTOR_ID_: insertYwSystemTemp.DRAFTOR_ID_,
					DRAFT_DATE_: dtime(insertYwSystemTemp.DRAFT_DATE_).format('YYYY-MM-DD '),
					ORDER_: insertYwSystemTemp.ORDER_,
					ORG_ID_: insertYwSystemTemp.ORG_ID_,
					ORG_CODE_: insertYwSystemTemp.ORG_CODE_,
					ORG_NAME_: insertYwSystemTemp.ORG_NAME_,
					EMP_NAME_: insertYwSystemTemp.EMP_NAME_

				};
				this.ywSystemData.push(tableItem);
				this.insertYwSystemDialog.show = false;
            },
            //点击编辑
			preUpdateYwSystem(){
				let that = this;
				this.updateYwSystemDialog.show = true;
				this.updateYwSystemDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_ywSystem_ref.SYSTEM_ID_ = that.currentRow.SYSTEM_ID_;
					this.$refs.update_ywSystem_ref.setUpdateYwSystemForm();
				})
            },
			closeUpdateYwSystemDialog(){
				this.updateYwSystemDialog.dialogVisible = false;
            },
			_completeUpdateYwSystem(returnValue){
				let updateYwSystemTemp = returnValue;
				let that =this;
				for (let key in updateYwSystemTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.currentRow[key] != null) ? that.currentRow[key] = updateYwSystemTemp[key] : '';
				}
				this.currentRow.DRAFT_DATE_ = dtime(updateYwSystemTemp.DRAFT_DATE_).format('YYYY-MM-DD ');
				this.updateYwSystemDialog.show = false;
            },
            //点击删除
			deleteYwSystem(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteYwSystem.do',
						data: {
							SYSTEM_ID_: that.currentRow.SYSTEM_ID_
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
							that.getYwSystemList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
					})
                })
			},
        }
	}
</script>

<style scoped>

</style>
