<template>
    <div class="fillcontain">
        <el-form
                ref="updateDevOpsOrgForm"
                :model="updateDevOpsOrgForm"
                style="margin:10px;width:auto; "
        >
            <el-form-item prop='ORG_CODE_' label="机构代码:"  label-width="100px"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsOrgForm.ORG_CODE_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='ORG_NAME_' label="机构名称:"  label-width="100px"
                          :rules="[{ required: true, message: '机构名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsOrgForm.ORG_NAME_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='ORG_TYPE_' label="机构类型:" label-width="100px"
                          :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                <el-select v-model="updateDevOpsOrgForm.ORG_TYPE_" placeholder="请选择" style="width: 50%">
                    <el-option
                            v-for="item in orgTypeList"
                            :key="item.CODE_"
                            :label="item.NAME_"
                            :value="item.CODE_">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_updateDevOpsOrg("updateDevOpsOrgForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
    
</template>

<script>
	import axios from 'axios';
	export default {
		name: "preUpdateDevOpsOrg",
        data() {
			return {
				preUpdateDevOpsOrgForm: {
					ORG_ID_: ''
				},
				orgTypeList: [],
				updateReportingOrgFormLoading: false,
				updateDevOpsOrgForm: {
					ORG_ID_: '',
					ORG_CODE_: '',
					ORG_NAME_: '',
					ORG_TYPE_: ''

				},
            }
        },
        created() {
			this.doSyncMethod();

        },
        methods : {
			async doSyncMethod() {
				await this._selectCode();
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
							if (that.CODE_LIST[i].CATEGORY_ == 'YW_ORG_TYPE_') {
								that.orgTypeList.push(that.CODE_LIST[i]);
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//赋值
			setUpdateDevOpsOrgForm(){
				this.updateReportingOrgFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadDevOpsOrg.do?ORG_ID_=' + this.preUpdateDevOpsOrgForm.ORG_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let devOpsOrgMap = res.data.devOpsOrgMap;

						that.updateDevOpsOrgForm.ORG_CODE_ = devOpsOrgMap.ORG_CODE_;
						that.updateDevOpsOrgForm.ORG_NAME_ = devOpsOrgMap.ORG_NAME_;
						that.updateDevOpsOrgForm.ORG_TYPE_ = devOpsOrgMap.ORG_TYPE_;

						that.updateReportingOrgFormLoading = false;

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateReportingOrgFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateReportingOrgFormLoading = false;
				});
			},

			//点击保存
			_updateDevOpsOrg (updateDevOpsOrgForm){
				this.$refs[updateDevOpsOrgForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateDevOpsOrgForm];

						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateDevOpsOrg.do',
							data: {
								ORG_ID_: that.preUpdateDevOpsOrgForm.ORG_ID_,
								ORG_CODE_: formData['ORG_CODE_'],
								ORG_NAME_: formData['ORG_NAME_'],
								ORG_TYPE_: formData['ORG_TYPE_'],

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
								let returnValue = res.data.devOpsOrg;

								that.$emit('updateDevOpsOrgListeners', returnValue);
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