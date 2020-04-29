<template>
    <div>
        <div>
            <el-form
                    ref="insertRootOrgForm"
                    :model="insertRootOrgForm"
                    style="margin:10px;width:auto;"
            >

                <el-form-item prop='ORG_CODE_' label="公司编码:"
                              :rules="[{ required: true, message: '公司编码不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="insertRootOrgForm.ORG_CODE_"></el-input>
                </el-form-item>

                <el-form-item prop='ORG_NAME_' label="公司名称:"
                              :rules="[{ required: true, message: '公司名称不能为空' ,trigger: 'blur' }]">
                    <el-input v-model="insertRootOrgForm.ORG_NAME_"></el-input>
                </el-form-item>

                <el-form-item prop='ORG_ABBR_NAME_' label="公司简称:">
                    <el-input v-model="insertRootOrgForm.ORG_ABBR_NAME_"></el-input>
                </el-form-item>

                <el-form-item class="text_right">
                    <el-button type="primary" @click='_insertRootOrg("insertRootOrgForm")'>保 存</el-button>
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
				insertRootOrgForm: {
					ORG_CODE_: '',
					ORG_NAME_: '',
					ORG_ABBR_NAME_: ''
				},
            }
        },
		props: {
			_closeInsertRootOrgDialog: {
				type: Function,
				default: null
			}
		},
        methods: {
			//赋空值
			setInsertRootOrg(){
				this.insertRootOrgForm.ORG_CODE_ = '';
				this.insertRootOrgForm.ORG_NAME_ = '';
				this.insertRootOrgForm.ORG_ABBR_NAME_ = '';
            },
            //点击保存按钮
			_insertRootOrg(insertRootOrgForm){
				this.$refs[insertRootOrgForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertRootOrgForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertOrg.do',
							data: {
								ORG_CODE_: formData['ORG_CODE_'],
								ORG_NAME_: formData['ORG_NAME_'],
								ORG_ABBR_NAME_: formData['ORG_ABBR_NAME_'],
								ORG_TYPE_: "1",
								ORG_BIZ_TYPE_: "99"
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
								let returnValue = res.data.org;

								that.$emit('insertRootOrgListeners', returnValue);
							} else {
								that.$message.error(res.data.message);
							}
						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
            },
            //关闭按钮
			_close() {
				this._closeInsertRootOrgDialog();
			}
        }
	}
</script>

<style scoped>

</style>