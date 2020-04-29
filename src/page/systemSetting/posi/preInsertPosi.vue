<template>
    <div>
        <div>
            <el-form
                    ref="insertPosiForm"
                    :model="insertPosiForm"
                    v-loading= "insertPosiLoading"
                    style="margin:10px;width:auto;height:200px">
                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='DUTY_ID_' label="职务:" label-width="25%"
                                      :rules="[{ required: true, message: '职务不能为空' ,trigger: 'blur' }]">
                            <el-select v-model="insertPosiForm.DUTY_ID_" placeholder="请选择" style="width: 80%">
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
                            <el-input v-model="insertPosiForm.POSI_CODE_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row>
                    <el-col :span="12">
                        <el-form-item prop='POSI_NAME_' label="岗位名称:"
                                      :rules="[{ required: true, message: '岗位名称不能为空' ,trigger: 'blur' }]">
                            <el-input v-model="insertPosiForm.POSI_NAME_" style="width: 60%"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item prop='ORDER_' label="排序:" label-width="25.5%">
                            <el-input-number v-model="insertPosiForm.ORDER_" :precision="0" :step="1" style="width: 80%">
                            </el-input-number>
                        </el-form-item>
                    </el-col>
                </el-row>
                    <el-form-item prop='MEMO_' label="备注:" label-width="12.5%">
                        <el-input type="textarea" v-model="insertPosiForm.MEMO_" style="width: 91.5%"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button type="primary" @click='_insertPosi("insertPosiForm")'>保 存</el-button>
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
				ORG_ID_: '',
				insertPosiForm: {
					DUTY_ID_: '',
					POSI_CODE_: '',
					POSI_NAME_: '',
					ORDER_: '',
					MEMO_: ''
                },
				insertPosiLoading: false,
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
				this.insertPosiForm.DUTY_ID_ = '';
				this.insertPosiForm.POSI_CODE_ = '';
				this.insertPosiForm.POSI_NAME_ = '';
				this.insertPosiForm.ORDER_ = '';
				this.insertPosiForm.MEMO_ = '';
            },
			_insertPosi(insertPosiForm){
				this.$refs[insertPosiForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertPosiForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertPosi.do',
							data: {
								ORG_ID_: that.ORG_ID_,
								DUTY_ID_: formData['DUTY_ID_'],
								POSI_CODE_: formData['POSI_CODE_'],
								POSI_NAME_: formData['POSI_NAME_'],
								MEMO_: formData['MEMO_'],
								ORDER_: formData['ORDER_']
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
								that.$message.success('新增成功');
								let returnValue = res.data.posi;
								that.$emit('insertPosiListeners', returnValue);
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