<template>
    <div>
        <div>
            <el-form
                    ref="updateReceivedForm"
                    :model="updateReceivedForm"
                    style="margin:10px;width:auto;"
            >

                <el-form-item prop='RECEIVED_MONEY_'label="实收金额(万元):"
                              :rules="[{ required: true, message: '实收金额不能为空' ,trigger: 'blur' }]">
                    <el-input-number v-model="updateReceivedForm.RECEIVED_MONEY_" :precision="2" :min="0" label="应售金额(万元):" >
                    </el-input-number>
                </el-form-item>

                <el-form-item prop='RECEIVED_DATE_' label="实收日期:" label-width="27%"
                              :rules="[{ required: true, message: '实收日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="updateReceivedForm.RECEIVED_DATE_"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_updateReceived("updateReceivedForm")'>保 存</el-button>
                </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	export default {
		data(){
			return {
				preUpdateReceivedForm: {
					RECEIVED_ID_: ''
				},
				updateReceivedForm: {
					RECEIVED_MONEY_: '',
					RECEIVED_DATE_: ''
				},
			}
		},
        methods: {
			//修改前赋值
			setUpdateReceived(){
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadReceived.do?RECEIVED_ID_=' + that.preUpdateReceivedForm.RECEIVED_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let received = res.data.received;

						that.updateReceivedForm.RECEIVED_MONEY_ = received.RECEIVED_MONEY_;
						that.updateReceivedForm.RECEIVED_DATE_ = received.RECEIVED_DATE_;

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
				});
			},
            //保存按钮
			_updateReceived(updateReceivedForm){
				this.$refs[updateReceivedForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateReceivedForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateReceived.do',
							data: {
								RECEIVED_ID_ : that.preUpdateReceivedForm.RECEIVED_ID_,
								RECEIVED_MONEY_: formData['RECEIVED_MONEY_'],
								RECEIVED_DATE_: mutils.formatDate(new Date(formData['RECEIVED_DATE_']))
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
								that.$message.success('修改成功');
								let returnValue = res.data.received;

								that.$emit('updateReceivedListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}

						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试');
						})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>