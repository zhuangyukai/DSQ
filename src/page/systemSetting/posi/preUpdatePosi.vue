<template>
    <div>
        <div>
            <el-form
                    ref="updatePosiForm"
                    :model="updatePosiForm"
                    v-loading= "updatePosiLoading"
                    style="margin:10px;width:auto;height:200px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='DUTY_ID_' label="职务:" label-width="25%"
                                      :rules="[{ required: true, message: '职务不能为空' ,trigger: 'blur' }]">
                            <el-select v-model="updatePosiForm.DUTY_ID_" placeholder="请选择" style="width: 80%">
                                <el-option
                                        v-for="item in dutyList"
                                        :key="item.DUTY_ID_"
                                        :label="item.DUTY_NAME_"
                                        :value="item.DUTY_ID_">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='POSI_CODE_' label="岗位编码:"
                                      :rules="[{ required: true, message: '岗位编码不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="updatePosiForm.POSI_CODE_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='POSI_NAME_' label="岗位名称:"
                                      :rules="[{ required: true, message: '岗位名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="updatePosiForm.POSI_NAME_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='ORDER_' label="排序:" label-width="25.5%">
                            <el-input-number v-model="updatePosiForm.ORDER_" :precision="0" :step="1" style="width: 80%">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item prop='MEMO_' label="备注:" label-width="12.5%">
                    <el-input type="textarea" v-model="updatePosiForm.MEMO_" style="width: 91.5%"></el-input>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_updatePosi("updatePosiForm")'>保 存</el-button>
                </el-form-item>


            </el-form>
        </div>
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		data(){
			return{
				POSI_ID_: '',
				updatePosiForm: {
					DUTY_ID_: '',
					POSI_CODE_: '',
					POSI_NAME_: '',
					ORDER_: '',
					MEMO_: ''
				},
				updatePosiLoading: false,
				dutyList: {}
            }
        },
		created() {
			this.doSyncMethod();
		},
        methods: {
			async doSyncMethod() {
				await this._selectDuty();
			},
			async _selectDuty(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectDuty.do',
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
						that.dutyList = res.data.dutyList;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			setPosiValue(){
				this.updatePosiLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadPosi.do?POSI_ID_=' + that.POSI_ID_ + ''
				).then(function (res) {
					if (res.data.success) {
						let posi = res.data.posi;

						that.updatePosiForm.DUTY_ID_ = posi.DUTY_ID_;
						that.updatePosiForm.POSI_CODE_ = posi.POSI_CODE_;
						that.updatePosiForm.POSI_NAME_ = posi.POSI_NAME_;
						that.updatePosiForm.ORDER_ = posi.ORDER_;
						that.updatePosiForm.MEMO_ = posi.MEMO_;
						that.updatePosiLoading = false;
					} else {
						that.$message.error(res.data.message);
						that.updatePosiLoading = false;
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updatePosiLoading = false;
				});
            },
			_updatePosi(updatePosiForm){
				this.$refs[updatePosiForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updatePosiForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updatePosi.do',
							data: {
								POSI_ID_ : that.POSI_ID_,
								DUTY_ID_: formData['DUTY_ID_'],
								POSI_CODE_: formData['POSI_CODE_'],
								POSI_NAME_: formData['POSI_NAME_'],
								MEMO_: formData['MEMO_'],
								ORDER_: formData['ORDER_'],
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
								let returnValue = res.data.posi;

								that.$emit('updatePosiListeners', returnValue);
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