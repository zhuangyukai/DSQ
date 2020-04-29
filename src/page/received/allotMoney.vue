<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='allotMoney_Query_Date'
                    class="demo-form-inline search-form">
                <el-form-item>
                    项目名称:
                    <el-input v-model="allotMoney_Query_Date.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称"
                              clearable>
                    </el-input>
                    项目编码:
                    <el-input v-model="allotMoney_Query_Date.PROJECT_CODE_" style="width: 200px" placeholder="请输入项目编码"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectAllowMoneyReceivable()'>筛选
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading="allowMoneyloading"
                    highlight-current-row
                    height="500px"
                    :data="allotMoneyList"
                    align='center'>
                <el-table-column
                        v-if="idFlag"
                        prop="RECEIVABLE_ID_"
                        label="应收ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="PROJECT_CODE_"
                        label="项目编码"
                        align='center'
                        width="100"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="300"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="RECEIVABLE_TYPE_"
                        label="应收类型"
                        align='center'
                        width="150"
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
                        label="实收金额(万元)"
                        align='center'
                        width="150"
                        sortable>
                    <template slot-scope="scope">
                        <div v-if="!scope.row.editing">
                            <span>{{ scope.row.PAYMENT_AMOUNT_ }}</span>
                        </div>
                        <div v-else>
                            <el-input-number v-model="scope.row.PAYMENT_AMOUNT_" :precision="2" :min="0">
                            </el-input-number>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                        label="操作"
                        fixed="right"
                        align="center"
                >
                    <template slot-scope="scope">
                        <div class="operate-groups">
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="!scope.row.editing"
                                    icon="el-icon-edit-outline"
                                    @click="_updateAllotMoney(scope.$index, scope.row)">编辑
                            </el-button>
                            <el-button
                                    type="primary"
                                    size="mini"
                                    v-if="scope.row.editing"
                                    icon="el-icon-success"
                                    @click="_insertAllotMoney(scope.$index, scope.row)">保存
                            </el-button>
                            <el-button
                                    size="mini"
                                    type="warning"
                                    v-if="scope.row.editing"
                                    icon="el-icon-warning"
                                    @click="_cancelAllotMoney(scope.$index, scope.row)">取消
                            </el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>

	import axios from 'axios';

	export default {

		data() {
			return {
				allotMoneyForm: {
					RECEIVED_ID_: '',
					RECEIVED_MONEY_: ''
				},
				allotMoney_Query_Date: {
					PROJECT_CODE_: '',
					PROJECT_NAME_: ''
				},
				allotMoneyList: [],
				allowMoneyloading: false,
				idFlag: false,
				allowMoneyReceivableTypeCodeMapList: {},
				receivable: {
					tempDate: {
						PAYMENT_AMOUNT_: ''
					},
					insertOrUpdate: false,
					tempIndex: ''
				},
				aaa: '',
				bbb: '',
				sum: ''
			}
		},
		created() {
			this.doSyncMethod();
		},
		methods: {

			async doSyncMethod() {
				await this._selectCode();
				//this.getAllotMoney();
			},

			async _selectCode() {
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
					data: {},
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
						for (let i = 0; i < that.CODE_LIST.length; i++) {
							if (that.CODE_LIST[i].CATEGORY_ == 'RECEIVABLE_TYPE') {
								that.allowMoneyReceivableTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			getAllotMoney() {
				this.allowMoneyloading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectReceivable.do',
					data: {
						PROJECT_CODE_: this.allotMoney_Query_Date.PROJECT_CODE_,
						PROJECT_NAME_: this.allotMoney_Query_Date.PROJECT_NAME_,
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
						that.allotMoneyList = [];

						let receivableList = res.data.receivableList;

						for (let i = 0; i < receivableList.length; i++) {
							const tableItem = {
								PROJECT_CODE_: receivableList[i].PROJECT_CODE_,
								PROJECT_NAME_: receivableList[i].PROJECT_NAME_,
								RECEIVABLE_ID_: receivableList[i].RECEIVABLE_ID_,
								RECEIVABLE_MONEY_: receivableList[i].RECEIVABLE_MONEY_,
								PAYMENT_AMOUNT_: receivableList[i].PAYMENT_AMOUNT_ == null ? "0" : receivableList[i].PAYMENT_AMOUNT_,
								RECEIVABLE_TYPE_: receivableList[i].RECEIVABLE_TYPE_,
								receivable_lable: that.allowMoneyReceivableTypeCodeMapList[receivableList[i].RECEIVABLE_TYPE_]
							};
							that.allotMoneyList.push(tableItem);
						}
						that.allowMoneyloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.allowMoneyloading = false;
				});
			},
			//筛选
			selectAllowMoneyReceivable() {
				this.getAllotMoney();
			},
			//点击编辑
			_updateAllotMoney($index, row) {
				for (let i = 0; i < this.allotMoneyList.length; i++) {
					if (this.allotMoneyList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}
				this.receivable.insertOrUpdate = false;
				this.$set(this.allotMoneyList[$index], 'editing', true)
				this.receivable.tempDate.PAYMENT_AMOUNT_ = row.PAYMENT_AMOUNT_;

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'loadReceivedReceivable.do',
					data: {
						RECEIVED_ID_: that.allotMoneyForm.RECEIVED_ID_,
						RECEIVABLE_ID_: row.RECEIVABLE_ID_
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
						if (res.data.receivedReceivable == null || res.data.receivedReceivable == '' || res.data.receivedReceivable == undefined) {
							that.aaa = 0;
						}
						else {
							that.aaa = res.data.receivedReceivable.PAYMENT_AMOUNT_;
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});

				axios({
					method: 'POST',
					url: this.baseUrl + 'loadReceived.do',
					data: {
						RECEIVED_ID_: that.allotMoneyForm.RECEIVED_ID_,
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
						if (res.data.received.PAYMENT_AMOUNT_ == null || res.data.received.PAYMENT_AMOUNT_ == '' || res.data.received.PAYMENT_AMOUNT_ == undefined) {
							that.bbb = 0;
						}
						else {
							that.bbb = res.data.received.PAYMENT_AMOUNT_;
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});

				this.sum = row.PAYMENT_AMOUNT_;
			},
			//保存按钮
			_insertAllotMoney(index, row) {
				let RECEIVED_MONEY_ = new Number(this.allotMoneyForm.RECEIVED_MONEY_);
				let bbb = new Number(this.bbb);

				let ccc = RECEIVED_MONEY_ - bbb;
				let ddd = new Number(row.PAYMENT_AMOUNT_) - new Number(this.sum);
				if (row.PAYMENT_AMOUNT_ > row.RECEIVABLE_MONEY_) {
					this.$message.warning("实收金额不能大于应收金额");
					return;
				}
				if (ddd > ccc) {
					this.$message.warning("实收金额不能大于可分配金额,可分配金额为" + ccc + "万元");
					return;
				}
				if (bbb == 0 && ddd < 0) {
					this.$message.warning("该已收还未分配，不可减少分配金额");
					return;
				}
				if (this.aaa == 0) {
					let that = this;
					let result = new Number(row.PAYMENT_AMOUNT_) - new Number(this.sum);
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertReceivedReceivable.do',
						data: {
							RECEIVABLE_ID_: row.RECEIVABLE_ID_,
							RECEIVED_ID_: that.allotMoneyForm.RECEIVED_ID_,
							PAYMENT_AMOUNT_: Math.abs(result)
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
							let receivedReceivable = res.data.receivedReceivable;

							that.$set(that.allotMoneyList[index], 'editing', false);

							that.$set(that.allotMoneyList[index], 'RECEIVED_ID_', receivedReceivable.RECEIVED_ID_);

							that.$message.success("添加成功");
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				}
				else {
					let that = this;
					let sum = new Number(this.sum) - new Number(row.PAYMENT_AMOUNT_);
					let result = new Number(this.aaa) - new Number(sum);
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertReceivedReceivable.do',
						data: {
							RECEIVABLE_ID_: row.RECEIVABLE_ID_,
							RECEIVED_ID_: that.allotMoneyForm.RECEIVED_ID_,
							PAYMENT_AMOUNT_: Math.abs(result)
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
							let receivedReceivable = res.data.receivedReceivable;

							that.$set(that.allotMoneyList[index], 'editing', false);

							that.$set(that.allotMoneyList[index], 'RECEIVED_ID_', receivedReceivable.RECEIVED_ID_);

							that.$message.success("添加成功");
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				}

			},


			//取消
			_cancelAllotMoney(index, row) {
				this.$set(this.allotMoneyList[index], 'editing', false);
				if (this.receivable.insertOrUpdate) {
					this.allotMoneyList.splice(index, 1);
				} else {
					this.allotMoneyList[index].PAYMENT_AMOUNT_ = this.receivable.tempDate.PAYMENT_AMOUNT_;
				}
			}


		}

	}

</script>