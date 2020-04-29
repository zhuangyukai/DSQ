<template>
    <div>
        <div>
            <el-form
                    ref="insertReceivedForm"
                    :model="insertReceivedForm"
                    style="margin:10px;width:auto;"
            >

                <el-form-item prop='RECEIVED_MONEY_'label="实收金额(万元):"
                              :rules="[{ required: true, message: '实收金额不能为空' ,trigger: 'blur' }]">
                    <el-input-number v-model="insertReceivedForm.RECEIVED_MONEY_" :precision="2" :min="0" label="应售金额(万元):" >
                    </el-input-number>
                </el-form-item>

                <el-form-item prop='RECEIVED_DATE_' label="实收日期:" label-width="27%"
                              :rules="[{ required: true, message: '实收日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="insertReceivedForm.RECEIVED_DATE_"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item prop='RECEIVED_ORG_' label="付款单位:" label-width="27%"
                              :rules="[{ required: true, message: '付款单位不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="insertReceivedForm.RECEIVED_ORG_" style="width: 90%"></el-input>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertReceived("insertReceivedForm")'>保 存</el-button>
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
				insertReceivedForm: {
					RECEIVED_MONEY_: '',
					RECEIVED_DATE_: '',
					RECEIVED_ORG_: ''
				},
            }
        },
        methods: {
			setInsertReceivedFormNull(){
				this.insertReceivedForm.RECEIVED_MONEY_ = '';
				this.insertReceivedForm.RECEIVED_DATE_ = '';
				this.insertReceivedForm.RECEIVED_ORG_ = '';
			},
            //点击保存按钮
			_insertReceived(insertReceivedForm){
				this.$refs[insertReceivedForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertReceivedForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertReceived.do',
							data: {
								RECEIVED_MONEY_: formData['RECEIVED_MONEY_'],
								RECEIVED_ORG_: formData['RECEIVED_ORG_'],
								RECEIVED_DATE_: mutils.formatDate(new Date(formData['RECEIVED_DATE_'])),
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
								that.$message.success('新增成功');
								let returnValue = res.data.received;

								that.$emit('insertReceivedListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
            }
        }
	}
</script>

<style scoped>

</style>