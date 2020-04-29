<template>

    <div class="fillcontain">
        <el-form
                ref="insertDevOpsOrgForm"
                :model="insertDevOpsOrgForm"
                style="margin:10px;width:auto; "
        >
            <el-form-item prop='ORG_CODE_' label="机构代码:"  label-width="100px"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertDevOpsOrgForm.ORG_CODE_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='ORG_NAME_' label="机构名称:"  label-width="100px"
                          :rules="[{ required: true, message: '机构名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="insertDevOpsOrgForm.ORG_NAME_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='ORG_TYPE_' label="机构类型:" label-width="100px"
                          :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                <el-select v-model="insertDevOpsOrgForm.ORG_TYPE_" placeholder="请选择" style="width: 50%">
                    <el-option
                            v-for="item in orgTypeList"
                            :key="item.CODE_"
                            :label="item.NAME_"
                            :value="item.CODE_">
                    </el-option>
                </el-select>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_insertDevOpsOrg("insertDevOpsOrgForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
    
</template>

<script>
	import axios from 'axios';
	export default {
		name: "preInsertDevOpsOrg",
        data () {
			return {
				orgTypeList: [],
				insertDevOpsOrgForm: {
					ORG_CODE_: '',
					ORG_NAME_: '',
					ORG_TYPE_: ''
				},
            }
        },

		created() {
			this.doSyncMethod();
		},

        methods: {
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
			//进页面赋空值
			setInsertDevOpsOrgForm() {
				this.insertDevOpsOrgForm.ORG_CODE_ = '';
				this.insertDevOpsOrgForm.ORG_NAME_ = '';
				this.insertDevOpsOrgForm.ORG_TYPE_ = '';

			},
			//点击保存按钮
			_insertDevOpsOrg(insertDevOpsOrgForm) {
				this.$refs[insertDevOpsOrgForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertDevOpsOrgForm];

						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertDevOpsOrg.do',//'insertProjectPerson.do',
							data: {
								ORG_CODE_: formData['ORG_CODE_'],
								ORG_NAME_: formData['ORG_NAME_'],
								ORG_TYPE_: formData['ORG_TYPE_'],


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
								let returnValue = res.data.devOpsOrgList;

								that.$emit('insertDevOpsOrgListeners', returnValue);
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
        }
	}
</script>

<style scoped>

</style>