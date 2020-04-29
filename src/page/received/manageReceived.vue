<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='received_Query_Date'
                    ref="search_data"
                    class="demo-form-inline search-form">
                <el-form-item>
                    付款单位:
                    <el-input v-model="received_Query_Date.RECEIVED_ORG_" style="width: 200px" placeholder="请输入付款单位"
                              clearable>
                    </el-input>
                    <el-date-picker
                            v-model="received_Query_Date.startDate"
                            type="date"
                            placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker
                            v-model="received_Query_Date.endDate"
                            type="date"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectReceived()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertReceived()'>添加
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="RECEIVED_BUTTON_STATUS._preUpdateReceived" @click='_preUpdateReceived()'>编辑
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="RECEIVED_BUTTON_STATUS._deleteReceived" @click='_deleteReceived()'>删除
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-message" :disabled="RECEIVED_BUTTON_STATUS._manageBill" @click='_manageBill()'>单据
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="RECEIVED_BUTTON_STATUS._allotMoney" @click='_allotMoney()'>金额分配
                    </el-button>
                    <el-button type="primary" size="mini" :disabled="RECEIVED_BUTTON_STATUS._viewAllotMoney" @click='_viewAllotMoney()'>查看
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading="mainloading"
                    :data="receivedList"
                    :style="gridTableStyle"
                    :height="gridTableStyle.height"
                    align='center'
                    :max-height="tableHeight"
                    ref="receivedGridRef"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow">
                <el-table-column type="selection" width="200">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="RECEIVED_ID_"
                        label="已收ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="RECEIVED_MONEY_"
                        label="已收金额(万元)"
                        align='center'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PAYMENT_AMOUNT_"
                        label="已分配金额(万元)"
                        align='center'
                        width="200"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="RECEIVED_DATE_"
                        label="已收时间"
                        align='center'
                        width="300"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.RECEIVED_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="RECEIVED_ORG_"
                        label="付款单位"
                        align='center'
                        width="800"
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
                    :title="insertReceivedDialog.title"
                    :visible.sync="insertReceivedDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="insertReceivedDialog.style"
                    :width="insertReceivedDialog.width"
            >
                <template>
                    <insertReceivedCom ref="insert_received_ref" v-if="insertReceivedDialog.dialogVisible"
                                         @insertReceivedListeners="_completeInsertReceived"></insertReceivedCom>
                </template>
            </el-dialog>

            <!--编辑-->
            <el-dialog
                    :title="updateReceivedDialog.title"
                    :visible.sync="updateReceivedDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="updateReceivedDialog.style"
                    :width="updateReceivedDialog.width"
            >
                <template>
                    <updateReceivedCom ref="update_received_ref" v-if="updateReceivedDialog.dialogVisible"
                                       @updateReceivedListeners="_completeUpdateReceived"></updateReceivedCom>
                </template>
            </el-dialog>

            <!--单据-->
            <el-dialog
                    :title="manageBillDialog.title"
                    :visible.sync="manageBillDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :width="manageBillDialog.width"
            >
                <template>
                    <riderCom ref="manage_bill_ref" v-if="manageBillDialog.dialogVisible"></riderCom>
                </template>
            </el-dialog>

            <!--分配金额-->
            <el-dialog
                    :title="allotMoneyDialog.title"
                    :visible.sync="allotMoneyDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="allotMoneyDialog.style"
                    :width="allotMoneyDialog.width"
                    @close="closeAllowMoney"
            >
                <template>
                    <allotMoneyCom ref="allot_money_ref" v-if="allotMoneyDialog.dialogVisible"
                                       @updateReceivedListeners="_completeUpdateReceived"></allotMoneyCom>
                </template>
            </el-dialog>

            <!--查看-->
            <el-dialog
                    :title="viewAllowMoneyDialog.title"
                    :visible.sync="viewAllowMoneyDialog.show"
                    :close-on-click-modal='false'
                    :close-on-press-escape='false'
                    :modal-append-to-body="false"
                    :modal="true"
                    :style="viewAllowMoneyDialog.style"
                    :width="viewAllowMoneyDialog.width"
            >
                <template>
                    <viewAllowMoneyCom ref="view_allow_money_ref" v-if="viewAllowMoneyDialog.dialogVisible"
                                  ></viewAllowMoneyCom>
                </template>
            </el-dialog>

        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater';
	import axios from 'axios';
	import insertReceivedCom from "../received/preInsertReceived.vue";
	import updateReceivedCom from "../received/preUpdateReceived.vue";
	import riderCom from '../rider/manageRider.vue';
	import allotMoneyCom from '../received/allotMoney.vue';
	import * as mutils from 'utils/mUtils';
	import viewAllowMoneyCom from '../received/viewAllotMoney.vue';

	export default {
		components: {insertReceivedCom, updateReceivedCom, riderCom, allotMoneyCom, viewAllowMoneyCom},
		data(){
			return{
				RECEIVED_BUTTON_STATUS:{
					_preUpdateReceived: true,
					_deleteReceived: true,
					_manageBill: true,
					_allotMoney: true,
					_viewAllotMoney: true
                },
				received_Query_Date: {
					RECEIVED_ORG_: '',
					startDate: '',
                    endDate: '',
					startDatePage: '',
					endDatePage : ''
				},
				receivedList: [],
				mainloading: false,
				idFlag: false,
				sortnum: 0,
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				tableHeight: '',
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				numbers: [],
				multipleSelection: [],
				//新增窗口
				insertReceivedDialog: {
					show: false,
					title: '新增已收',
					insertReceivedDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				insertReceivedReqTemp: '',
				//修改窗口
				updateReceivedDialog: {
					show: false,
					title: '修改已收',
					updateReceivedDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '500px'
				},
				//单据窗口
				manageBillDialog: {
					show: false,
					title: '管理单据',
					loading: false,
					dialogVisible: true,
					params: {
						RECEIVED_ID_: ''
					}
				},
				//金额分配的窗口
				allotMoneyDialog: {
					show: false,
					title: '金额分配',
					allotMoneyDialogDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '1100px'
				},
				//查看窗口
				viewAllowMoneyDialog: {
					show: false,
					title: '查看已收',
					viewAllowMoneyDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '1100px'
				},
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				this.getReceivedList();
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
			getReceivedList({
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
				let formData = this.received_Query_Date;
				let that = this;

				let FROM_START_DATE_ = formData['startDatePage'];
				let TO_START_DATE_ = formData['endDatePage'];

				if (mutils.isEmpty(FROM_START_DATE_)) {
					FROM_START_DATE_ = "";
				} else {
					FROM_START_DATE_ = mutils.formatDate(new Date(FROM_START_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_START_DATE_)) {
					TO_START_DATE_ = "";
				} else {
					TO_START_DATE_ = mutils.formatDate(new Date(TO_START_DATE_));
				}

				axios({
					method: 'POST',
					url: this.baseUrl + 'selectReceived.do',
					data: {
						RECEIVED_ORG_: this.received_Query_Date.RECEIVED_ORG_,
						FROM_START_DATE_: FROM_START_DATE_,
						TO_START_DATE_: TO_START_DATE_,
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
						that.receivedList = [];

						let receivedList = res.data.receivedList;

						for (let i = 0; i < receivedList.length; i++) {
							const tableItem = {
								sortnum: that.sortnum + (i + 1),
								RECEIVED_ID_: receivedList[i].RECEIVED_ID_,
								RECEIVED_MONEY_: receivedList[i].RECEIVED_MONEY_,
								PAYMENT_AMOUNT_: receivedList[i].PAYMENT_AMOUNT_==null ? "0":receivedList[i].PAYMENT_AMOUNT_,
								RECEIVED_ORG_: receivedList[i].RECEIVED_ORG_,
								RECEIVED_DATE_: dtime(receivedList[i].RECEIVED_DATE_).format('YYYY-MM-DD ')
							};
							that.receivedList.push(tableItem);
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
			handleSelection(selection, row){
				// 表单绑定的数据
				this.receivedList.forEach((item, i) => {
					if (item.RECEIVED_ID_ == row.RECEIVED_ID_) {
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
					for (let i = 0; i < this.receivedList.length; i++) {
						this.numbers.push(i);
					}
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this._setButtonStatus();
			},
			clickRow(row) {
				this.$refs.receivedGridRef.toggleRowSelection(row, true);

				this.receivedList.forEach((r, i) => {
					if (r.RECEIVED_ID_ == row.RECEIVED_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.receivedGridRef.toggleRowSelection(row, false);
						}
					}
				});

				//this._setButtonStatus();
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getReceivedList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getReceivedList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			_setButtonStatus(){
				if (this.multipleSelection.length == 1 ) {
					this.RECEIVED_BUTTON_STATUS._preUpdateReceived = false;
					this.RECEIVED_BUTTON_STATUS._deleteReceived = false;
					this.RECEIVED_BUTTON_STATUS._manageBill = false;
					this.RECEIVED_BUTTON_STATUS._allotMoney = false;
					this.RECEIVED_BUTTON_STATUS._viewAllotMoney = false;
				}
				if(this.multipleSelection.length >= 2){
					this.RECEIVED_BUTTON_STATUS._preUpdateReceived = true;
					this.RECEIVED_BUTTON_STATUS._manageBill = true;
					this.RECEIVED_BUTTON_STATUS._allotMoney = true;
					this.RECEIVED_BUTTON_STATUS._viewAllotMoney = true;
				}
				if(this.multipleSelection.length == 0){
					this.RECEIVED_BUTTON_STATUS._preUpdateReceived = true;
					this.RECEIVED_BUTTON_STATUS._deleteReceived = true;
					this.RECEIVED_BUTTON_STATUS._manageBill = true;
					this.RECEIVED_BUTTON_STATUS._allotMoney = true;
					this.RECEIVED_BUTTON_STATUS._viewAllotMoney = true;
				}
            },
            //筛选按钮
			selectReceived(){
				this.received_Query_Date.startDatePage = this.received_Query_Date.startDate;
				this.received_Query_Date.endDatePage = this.received_Query_Date.endDate;

				this.getReceivedList({
					fun: () => {
					}
				});
            },
            //点击添加按钮
			preInsertReceived(){
				let that = this;
				this.insertReceivedDialog.show = true;
				this.insertReceivedDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_received_ref.setInsertReceivedFormNull();
				})
            },
            //新增后的变化
			_completeInsertReceived(returnValue){
				this.insertReceivedReqTemp = returnValue;
				let that = this;
				const tableItem = {
					RECEIVED_ID_: this.insertReceivedReqTemp.RECEIVED_ID_,
					RECEIVED_MONEY_: this.insertReceivedReqTemp.RECEIVED_MONEY_,
					RECEIVED_ORG_: this.insertReceivedReqTemp.RECEIVED_ORG_,
					PAYMENT_AMOUNT_: "0",
					RECEIVED_DATE_: dtime(this.insertReceivedReqTemp.RECEIVED_DATE_).format('YYYY-MM-DD '),
				};
				this.receivedList.push(tableItem);
				this.insertReceivedDialog.show = false;
            },
			//点击编辑按钮
			_preUpdateReceived(){
				let that = this;
				this.updateReceivedDialog.show = true;
				this.updateReceivedDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_received_ref.preUpdateReceivedForm.RECEIVED_ID_ = that.multipleSelection[0].RECEIVED_ID_;
					this.$refs.update_received_ref.setUpdateReceived();
				})
			},
            //编辑之后的变化
			_completeUpdateReceived(returnValue){
				let updateReceivedReqTemp = returnValue;
				let that =this;
				for (let key in updateReceivedReqTemp) {//装载被修改数据到页面
					(that.receivedList[that.numbers[0]][key] != null) ? that.receivedList[that.numbers[0]][key] = updateReceivedReqTemp[key] : '';
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.multipleSelection[0][key] != null) ? that.multipleSelection[0][key] = updateReceivedReqTemp[key] : '';
				}
				this.receivedList[that.numbers[0]].PAYMENT_AMOUNT_ = "0";
				this.multipleSelection[0].RECEIVED_DATE_ = dtime(updateReceivedReqTemp.RECEIVED_DATE_).format('YYYY-MM-DD ');
				this.updateReceivedDialog.show = false;
            },
            //点击删除
			_deleteReceived(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.mainloading = true;
					let RECEIVED_ID_LIST = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						RECEIVED_ID_LIST.push(this.multipleSelection[i].RECEIVED_ID_);
					}

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteReceived.do',
						data: {
							RECEIVED_ID_LIST: RECEIVED_ID_LIST
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
							that.getReceivedList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.mainloading = false;
					})
				});
            },
            //点击单据
			_manageBill(){
				this.manageBillDialog.show = true;
				this.manageBillDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.manage_bill_ref.riderForm.ID_ = this.multipleSelection[0].RECEIVED_ID_;
					this.$refs.manage_bill_ref.riderForm.TYPE_ = 'BILL';
					this.$refs.manage_bill_ref.getList();
				})
            },
            //点击金额分配
			_allotMoney(){
				this.allotMoneyDialog.show = true;
				this.allotMoneyDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.allot_money_ref.allotMoneyForm.RECEIVED_ID_ = this.multipleSelection[0].RECEIVED_ID_;
					this.$refs.allot_money_ref.allotMoneyForm.RECEIVED_MONEY_ = this.multipleSelection[0].RECEIVED_MONEY_;
					this.$refs.allot_money_ref.getAllotMoney();
				})
            },
            //关闭金额点击的操作
			closeAllowMoney(){
				this.getReceivedList();
            },
            //点击查看
			_viewAllotMoney(){
				this.viewAllowMoneyDialog.show = true;
				this.viewAllowMoneyDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.view_allow_money_ref.viewAllowMoneyForm.RECEIVED_ID_ = this.multipleSelection[0].RECEIVED_ID_;
					this.$refs.view_allow_money_ref.selectViewAllowMoney();
				})
            }
        }
	}
</script>

<style scoped>

</style>