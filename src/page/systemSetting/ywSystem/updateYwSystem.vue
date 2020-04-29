<template>
    <div class="fillcontain">
        <el-form
                v-loading="updateYwSystemFormLoading"
                ref="preUpdateYwSystemForm"
                :model="preUpdateYwSystemForm"
                style="margin:10px;width:auto; ">
            <el-form-item prop='ORG_ID_' label="公司名称:" label-width="100px"
                          :rules="[{ required: true, message: '公司名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '公司名称不能超过60位', trigger: 'blur' }]">
                <el-select v-model="preUpdateYwSystemForm.ORG_ID_" placeholder="请选择公司" style="width: 100%" clearable>
                    <el-option
                            v-for="item in orgList"
                            :key="item.ORG_ID_"
                            :label="item.ORG_NAME_"
                            :value="item.ORG_ID_">
                    </el-option>
                </el-select>
            </el-form-item>
            <el-form-item prop='SYSTEM_CODE_' label="系统编码:" label-width="100px"
                          :rules="[{ required: true, message: '系统编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '系统编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="preUpdateYwSystemForm.SYSTEM_CODE_" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item prop='SYSTEM_NAME_' label="系统名称:" label-width="100px"
                          :rules="[{ required: true, message: '系统名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '系统名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="preUpdateYwSystemForm.SYSTEM_NAME_" style="width: 100%"></el-input>
            </el-form-item>
            <el-form-item prop='ORDER_' label="排序:" label-width="24.5%">
                <el-input-number v-model="preUpdateYwSystemForm.ORDER_" label="排序:" :precision="0" :step="1">
                </el-input-number>
            </el-form-item>
            <el-form-item class="text_right">
                <el-button type="primary" icon="el-icon-check" @click='_updateYwSystem("preUpdateYwSystemForm")'>保 存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		name: "updateYwSystem",
		data(){
			return{
				SYSTEM_ID_: '',
				preUpdateYwSystemForm: {
					ORG_ID_: '',
					ORG_NAME_: '',
					SYSTEM_CODE_: '',
					SYSTEM_NAME_: '',
					ORDER_: ''
				},
				updateYwSystemFormLoading: false,
				orgList: [],
			}
		},
		created(){
			this.doSyncMethod();
		},
		methods: {
			async doSyncMethod() {
				await this._selectYwOrg();
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
			setUpdateYwSystemForm(){
				this.updateYwSystemFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadYwSystem.do?SYSTEM_ID_=' + this.SYSTEM_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let ywSystem = res.data.ywSystem;

						that.preUpdateYwSystemForm.ORG_ID_ = ywSystem.ORG_ID_;
						that.preUpdateYwSystemForm.SYSTEM_CODE_ = ywSystem.SYSTEM_CODE_;
						that.preUpdateYwSystemForm.SYSTEM_NAME_ = ywSystem.SYSTEM_NAME_;
						that.preUpdateYwSystemForm.ORDER_ = ywSystem.ORDER_;

						that.updateYwSystemFormLoading = false;

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateYwSystemFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateYwSystemFormLoading = false;
				});
			},
            //点击保存按钮
			_updateYwSystem(preUpdateYwSystemForm){
				this.$refs[preUpdateYwSystemForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[preUpdateYwSystemForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateYwSystem.do',
							data: {
								SYSTEM_ID_: that.SYSTEM_ID_,
								ORG_ID_: formData['ORG_ID_'],
								SYSTEM_CODE_: formData['SYSTEM_CODE_'],
								SYSTEM_NAME_: formData['SYSTEM_NAME_'],
								ORDER_: formData['ORDER_']
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
								let returnValue = res.data.ywSystem;

								that.$emit('updateYwSystemListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('修改失败请重试');
						})

					}
				})
			},
		}
	}
</script>

<style scoped>

</style>
