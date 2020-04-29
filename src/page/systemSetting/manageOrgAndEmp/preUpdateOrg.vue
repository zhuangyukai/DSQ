<template>
    <div>
        <div>
            <el-form
                    ref="updateOrgForm"
                    :model="updateOrgForm"
                    style="margin:10px;width:auto;"
            >

                <el-form-item prop='ORG_CODE_' label="公司编码:"
                              :rules="[{ required: true, message: '公司编码不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="updateOrgForm.ORG_CODE_"></el-input>
                </el-form-item>

                <el-form-item prop='ORG_NAME_' label="公司名称:"
                              :rules="[{ required: true, message: '公司名称不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="updateOrgForm.ORG_NAME_"></el-input>
                </el-form-item>

                <el-form-item prop='ORG_ABBR_NAME_' label="公司简称:">
                    <el-input v-model="updateOrgForm.ORG_ABBR_NAME_"></el-input>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_updateOrg("updateOrgForm")'>保 存</el-button>
                    <el-button @click="_close()">关闭</el-button>
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
				preUpdatOrgForm: {
					ORG_ID_: ''
				},
				updateOrgForm: {
					ORG_CODE_: '',
					ORG_NAME_: '',
					ORG_ABBR_NAME_: ''
				},
            }
        },
		props: {
			_closeUpdateOrgDialog: {
				type: Function,
				default: null
			}
		},
        methods: {
            //修改前赋值
			setUpdateOrg(){
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadOrg.do?ORG_ID_=' + that.preUpdatOrgForm.ORG_ID_ + ''
				).then(function (res) {
					if (res.data.success) {
						let org = res.data.org;
						that.updateOrgForm.ORG_CODE_ = org.ORG_CODE_;
						that.updateOrgForm.ORG_NAME_ = org.ORG_NAME_;
						that.updateOrgForm.ORG_ABBR_NAME_ = org.ORG_ABBR_NAME_;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
				});
            },
            //保存
			_updateOrg(updateOrgForm){
				this.$refs[updateOrgForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateOrgForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateOrg.do',
							data: {
								ORG_ID_ : that.preUpdatOrgForm.ORG_ID_,
								ORG_CODE_: formData['ORG_CODE_'],
								ORG_NAME_: formData['ORG_NAME_'],
								ORG_ABBR_NAME_: formData['ORG_ABBR_NAME_']
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
								let returnValue = res.data.org;

								that.$emit('updateOrgListeners', returnValue);
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
			_close() {
				this._closeUpdateOrgDialog();
			}
        }
	}
</script>

<style scoped>

</style>