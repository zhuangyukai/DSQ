<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='receivable_Query_Date'
                    class="demo-form-inline search-form">
                <el-form-item>
                    项目名称:
                    <el-input v-model="receivable_Query_Date.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称"
                              clearable>
                    </el-input>
                    项目编码:
                    <el-input v-model="receivable_Query_Date.PROJECT_CODE_" style="width: 200px" placeholder="请输入项目编码"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectReceivable()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertReceivable()'>添加
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="RECEIVABLE_BUTTON_STATUS._preUpdateReceivable" @click='_preUpdateReceivable()'>编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="RECEIVABLE_BUTTON_STATUS._deleteReceivable" @click='_deleteReceivable()'>删除
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading="mainloading"
                    :data="receivableList"
                    :style="gridTableStyle"
                    :height="gridTableStyle.height"
                    align='center'
                    :max-height="tableHeight"
                    ref="receivableGridRef"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow">
                <el-table-column type="selection" width="150">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="RECEIVABLE_ID_"
                        label="应收ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="PROJECT_ID_"
                        label="项目ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="PROJECT_CODE_"
                        label="项目编码"
                        align='center'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="400"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="RECEIVABLE_TYPE_"
                        label="应收类型"
                        align='center'
                        width="300"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.receivable_lable }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="RECEIVABLE_MONEY_"
                        label="应收金额(万元)"
                        align='center'
                        width="150"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PAYMENT_AMOUNT_"
                        label="已收金额(万元)"
                        align='center'
                        width="150"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="RECEIVABLE_DATE_"
                        label="应收时间"
                        align='center'
                        width="300"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.RECEIVABLE_DATE_ }}</span>
                    </template>
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
                    :title="insertReceivableDialog.title"
                    :visible.sync="insertReceivableDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="insertReceivableDialog.style"
                    :width="insertReceivableDialog.width"
            >
                <template>
                    <insertReceivableCom ref="insert_receivable_ref" v-if="insertReceivableDialog.dialogVisible"
                                   @insertReceivableListeners="_completeInsertReceivable"></insertReceivableCom>
                </template>
            </el-dialog>
            <!--编辑-->
            <el-dialog
                    :title="updateReceivableDialog.title"
                    :visible.sync="updateReceivableDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="updateReceivableDialog.style"
                    :width="updateReceivableDialog.width"
            >
                <template>
                    <updateReceivableCom ref="update_receivable_ref" v-if="updateReceivableDialog.dialogVisible"
                                   @updateReceivableListeners="_completeUpdateReceivable">
                    </updateReceivableCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater';
	import axios from 'axios';

	import insertReceivableCom from ".//preInsertReceivable.vue";
	import updateReceivableCom from ".//preUpdateReceivable.vue";

	export default {
		components: {insertReceivableCom, updateReceivableCom},
		data(){
			return{
				RECEIVABLE_BUTTON_STATUS:{
					_preUpdateReceivable: true,
					_deleteReceivable: true,
                },
				receivable_Query_Date: {
					PROJECT_CODE_: '',
					PROJECT_NAME_: ''
				},
				receivableList: [],
				numbers: [],
				multipleSelection: [],
				mainloading: false,
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				idFlag: false,
				sortnum: 0,
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				tableHeight: '',
				receivableTypeList: [],
				receivableTypeCodeMapList: {},
                //新增窗口
				insertReceivableDialog: {
					show: false,
					title: '新增应收',
					insertReceivableDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				insertReceivableReqTemp: '',
				//修改窗口
				updateReceivableDialog: {
					show: false,
					title: '修改应收',
					updateReceivableDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//查看窗口
				viewReceivableDialog: {
					show: false,
					title: '查看应收',
					viewReceivableDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '650px'
				},
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectCode();
				this.getReceivableList();
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
							if(that.CODE_LIST[i].CATEGORY_ == 'RECEIVABLE_TYPE'){
								that.receivableTypeList.push(that.CODE_LIST[i]);
								that.receivableTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
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
			getReceivableList({
						page,
						page_size,
						where,
						fun
					} = {}){
				this.multipleSelection = [];
				this.numbers = [];

				this.mainloading = true;
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
					//url: this.baseUrl + 'selectProject.do',
					url: this.baseUrl + 'selectReceivable.do',
					data: {
						PROJECT_CODE_: this.receivable_Query_Date.PROJECT_CODE_,
						PROJECT_NAME_: this.receivable_Query_Date.PROJECT_NAME_,
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
						that.receivableList = [];

						let receivableList = res.data.receivableList;

						for (let i = 0; i < receivableList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								PROJECT_ID_: receivableList[i].PROJECT_ID_,
								PROJECT_CODE_: receivableList[i].PROJECT_CODE_,
								PROJECT_NAME_: receivableList[i].PROJECT_NAME_,
								RECEIVABLE_ID_: receivableList[i].RECEIVABLE_ID_,
								RECEIVABLE_DATE_: dtime(receivableList[i].RECEIVABLE_DATE_).format('YYYY-MM-DD '),
								RECEIVABLE_MONEY_: receivableList[i].RECEIVABLE_MONEY_,
								PAYMENT_AMOUNT_: receivableList[i].PAYMENT_AMOUNT_==null ? "0":receivableList[i].PAYMENT_AMOUNT_,
								RECEIVABLE_TYPE_: receivableList[i].RECEIVABLE_TYPE_,
								receivable_lable: that.receivableTypeCodeMapList[receivableList[i].RECEIVABLE_TYPE_]
							};
							that.receivableList.push(tableItem);
						}
						that.mainloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.mainloading = false;
				})
            },

            //筛选
			selectReceivable(){
				this.getReceivableList();
            },
			handleSelection(selection, row){
				// 表单绑定的数据
				this.receivableList.forEach((item, i) => {
					if (item.RECEIVABLE_ID_ == row.RECEIVABLE_ID_) {
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
				if (this.multipleSelection.length != 0) {
					for (let i = 0; i < this.receivableList.length; i++) {
						this.numbers.push(i);
					}
				}
            },
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this._setButtonStatus();
			},
			clickRow(row) {
				this.$refs.receivableGridRef.toggleRowSelection(row, true);

				this.receivableList.forEach((r, i) => {
					if (r.RECEIVABLE_ID_ == row.RECEIVABLE_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.receivableGridRef.toggleRowSelection(row, false);
						}
					}
				});

				//this._setButtonStatus();
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getReceivableList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getReceivableList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			_setButtonStatus(){
				if (this.multipleSelection.length == 1 ) {
					this.RECEIVABLE_BUTTON_STATUS._preUpdateReceivable = false;
					this.RECEIVABLE_BUTTON_STATUS._deleteReceivable = false;
				}
				if(this.multipleSelection.length >= 2){
					this.RECEIVABLE_BUTTON_STATUS._preUpdateReceivable = true;
                }
                if(this.multipleSelection.length == 0){
					this.RECEIVABLE_BUTTON_STATUS._preUpdateReceivable = true;
					this.RECEIVABLE_BUTTON_STATUS._deleteReceivable = true;
                }
            },
            //点击添加按钮
			preInsertReceivable(){
				let that = this;
				this.insertReceivableDialog.show = true;
				this.insertReceivableDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_receivable_ref.setInsertReceivableFormNull();
				})
            },
            //新增之后的变化
			_completeInsertReceivable(returnValue){
				this.insertReceivableReqTemp = returnValue;
				let that = this;
				const tableItem = {
					PROJECT_CODE_: this.insertReceivableReqTemp.PROJECT_CODE_,
					PROJECT_NAME_: this.insertReceivableReqTemp.PROJECT_NAME_,
					RECEIVABLE_ID_: this.insertReceivableReqTemp.RECEIVABLE_ID_,
					PROJECT_ID_: this.insertReceivableReqTemp.PROJECT_ID_,
					RECEIVABLE_MONEY_: this.insertReceivableReqTemp.RECEIVABLE_MONEY_,
					PAYMENT_AMOUNT_: this.insertReceivableReqTemp.PAYMENT_AMOUNT_==null ? "0":this.insertReceivableReqTemp.PAYMENT_AMOUNT_,
					RECEIVABLE_DATE_: dtime(this.insertReceivableReqTemp.RECEIVABLE_DATE_).format('YYYY-MM-DD '),
					RECEIVABLE_FLAG__: this.insertReceivableReqTemp.RECEIVABLE_FLAG__,
					RECEIVABLE_TYPE_: this.insertReceivableReqTemp.RECEIVABLE_TYPE_,
					receivable_lable: that.receivableTypeCodeMapList[this.insertReceivableReqTemp.RECEIVABLE_TYPE_]
				};
				this.receivableList.push(tableItem);
				this.insertReceivableDialog.show = false;
            },
            //点击编辑按钮
			_preUpdateReceivable(){
				let that = this;
				this.updateReceivableDialog.show = true;
				this.updateReceivableDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_receivable_ref.preUpdateReceivableForm.RECEIVABLE_ID_ = that.multipleSelection[0].RECEIVABLE_ID_;
					this.$refs.update_receivable_ref.setUpdateReceivable();
				})
            },
            //编辑之后的变化
			_completeUpdateReceivable(returnValue){
				let updateReceivableReqTemp = returnValue;
				let that =this;
				for (let key in updateReceivableReqTemp) {//装载被修改数据到页面
					(that.receivableList[that.numbers[0]][key] != null) ? that.receivableList[that.numbers[0]][key] = updateReceivableReqTemp[key] : '';
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.multipleSelection[0][key] != null) ? that.multipleSelection[0][key] = updateReceivableReqTemp[key] : '';
				}
				this.receivableList[that.numbers[0]].receivable_lable = that.receivableTypeCodeMapList[updateReceivableReqTemp.RECEIVABLE_TYPE_];
				this.multipleSelection[0].RECEIVABLE_DATE_ = dtime(updateReceivableReqTemp.RECEIVABLE_DATE_).format('YYYY-MM-DD ');
				this.receivableList[that.numbers[0]].PAYMENT_AMOUNT_ = "0";
				this.updateReceivableDialog.show = false;
            },
            //删除按钮
			_deleteReceivable(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.mainloading = true;
					let RECEIVABLE_ID_LIST = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						RECEIVABLE_ID_LIST.push(this.multipleSelection[i].RECEIVABLE_ID_);
					}

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteReceivable.do',
						data: {
							RECEIVABLE_ID_LIST: RECEIVABLE_ID_LIST
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
							that.getReceivableList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.mainloading = false;
					})
				});
            },
        }
	}
</script>

<style scoped>

</style>