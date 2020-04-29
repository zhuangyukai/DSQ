<template>
    <div>
        <div>
            <el-form
                    ref="updateReceivableForm"
                    :model="updateReceivableForm"
                    style="margin:10px;width:auto;"
            >
                <el-form-item prop='PROJECT_NAME_' label="项目名称:" label-width="27%"
                              :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="updateReceivableForm.PROJECT_NAME_" style="width: 90%"
                              readonly></el-input>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_TYPE_' label="应收类型:" label-width="27%"
                              :rules="[{ required: true, message: '应收类型不能为空' ,trigger: 'blur' }]">
                    <el-select v-model="updateReceivableForm.RECEIVABLE_TYPE_" placeholder="请选择" style="width: 68%">
                        <el-option
                                v-for="item in receivableTypeList"
                                :key="item.CODE_"
                                :label="item.NAME_"
                                :value="item.CODE_">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_MONEY_'label="应收金额(万元):"
                              :rules="[{ required: true, message: '应收金额不能为空' ,trigger: 'blur' }]">
                    <el-input-number v-model="updateReceivableForm.RECEIVABLE_MONEY_" :precision="2" :min="0" label="应售金额(万元):" style="width: 50%">
                    </el-input-number>
                </el-form-item>

                <el-form-item prop='RECEIVABLE_DATE_' label="应收日期:" label-width="27%"
                              :rules="[{ required: true, message: '应收日期不能为空' ,trigger: 'blur' }]">
                    <el-date-picker
                            v-model="updateReceivableForm.RECEIVABLE_DATE_"
                            type="date"
                            placeholder="选择日期">
                    </el-date-picker>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_updateReceivable("updateReceivableForm")'>保 存</el-button>
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
				preUpdateReceivableForm: {
					RECEIVABLE_ID_: ''
				},
				updateReceivableForm: {
					PROJECT_NAME_: '',
					RECEIVABLE_TYPE_: '',
					RECEIVABLE_MONEY_: '',
					RECEIVABLE_DATE_: ''
				},
				receivableTypeList: [],
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
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
            //修改前赋值
			setUpdateReceivable(){
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadReceivable.do?RECEIVABLE_ID_=' + that.preUpdateReceivableForm.RECEIVABLE_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let receivable = res.data.receivable;

						that.updateReceivableForm.PROJECT_NAME_ = receivable.PROJECT_NAME_;
						that.updateReceivableForm.RECEIVABLE_TYPE_ = receivable.RECEIVABLE_TYPE_;
						that.updateReceivableForm.RECEIVABLE_MONEY_ = receivable.RECEIVABLE_MONEY_;
						that.updateReceivableForm.RECEIVABLE_DATE_ = receivable.RECEIVABLE_DATE_;

					} else {
						/*请求失败*/
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
				});
            },
            //修改的保存按钮
			_updateReceivable(updateReceivableForm){
				this.$refs[updateReceivableForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateReceivableForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateReceivable.do',
							data: {
								RECEIVABLE_ID_ : that.preUpdateReceivableForm.RECEIVABLE_ID_,
								RECEIVABLE_TYPE_: formData['RECEIVABLE_TYPE_'],
								RECEIVABLE_MONEY_: formData['RECEIVABLE_MONEY_'],
								RECEIVABLE_DATE_: mutils.formatDate(new Date(formData['RECEIVABLE_DATE_']))
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
								let returnValue = res.data.receivable;

								that.$emit('updateReceivableListeners', returnValue);
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