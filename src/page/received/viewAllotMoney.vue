<template>
    <div>
        <div>
            <el-table
                    v-loading="viewAllowMoneyloading"
                    highlight-current-row
                    :data="viewAllowMoneyList"
                    align='center'>
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
                        label="已分配金额(万元)"
                        align='center'
                        width="150"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PAYMENT_DATE_"
                        label="分配时间"
                        align='center'
                        width="150"
                        sortable>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
	import dtime from 'time-formater';
	import axios from 'axios';
	export default {
		data(){
			return{
				viewAllowMoneyForm:{
					RECEIVED_ID_: ''
                },
				viewAllowMoneyloading: false,
				viewAllowMoneyList: [],
				receivableTypeList: [],
				receivableTypeCodeMapList: {},
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods:{
			async doSyncMethod() {
				await this._selectCode();
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
			selectViewAllowMoney(){
				this.viewAllowMoneyloading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectReceivedReceivableByReceived.do',
					data: {
						RECEIVED_ID_: this.viewAllowMoneyForm.RECEIVED_ID_
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
						that.viewAllowMoneyList = [];

						let receivedReceivable = res.data.receivedReceivable;

						for (let i = 0; i < receivedReceivable.length; i++) {
							const tableItem = {
								PROJECT_CODE_: receivedReceivable[i].PROJECT_CODE_,
								PROJECT_NAME_: receivedReceivable[i].PROJECT_NAME_,
								RECEIVABLE_MONEY_: receivedReceivable[i].RECEIVABLE_MONEY_,
								PAYMENT_AMOUNT_: receivedReceivable[i].PAYMENT_AMOUNT_,
								RECEIVABLE_TYPE_: receivedReceivable[i].RECEIVABLE_TYPE_,
								PAYMENT_DATE_: dtime(receivedReceivable[i].PAYMENT_DATE_).format('YYYY-MM-DD '),
								receivable_lable: that.receivableTypeCodeMapList[receivedReceivable[i].RECEIVABLE_TYPE_]
							};
							that.viewAllowMoneyList.push(tableItem);
						}
						that.viewAllowMoneyloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.viewAllowMoneyloading = false;
				});
            },
        },
	}
</script>

<style scoped>

</style>