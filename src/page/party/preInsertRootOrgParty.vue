<template>
    <el-form
            ref="insertRootOrgForm"
            :model="insertRootOrgForm"
            style="margin:10px;width:auto;"
    >
        <el-form-item prop='PARTY_CODE_' label="机构编码:"
                      :rules="[{ required: true, message: '机构编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 10, message: '机构编码不能超过10位', trigger: 'blur' }]">
            <el-input v-model="insertRootOrgForm.PARTY_CODE_"></el-input>
        </el-form-item>
        <el-form-item prop='PARTY_NAME_' label="机构名称:"
                      :rules="[{ required: true, message: '机构名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '机构名称不能超过60位', trigger: 'blur' }]">
            <el-input v-model="insertRootOrgForm.PARTY_NAME_"></el-input>
        </el-form-item>
        <el-form-item prop='ADDR_' label="地址:"
                      :rules="[{ type: 'string', max: 100, message: '地址长度不能超过100' ,trigger: 'blur' }]">
            <el-input type="textarea" v-model="insertRootOrgForm.ADDR_"></el-input>
        </el-form-item>
        <el-form-item prop='MEMO_' label="备注:"
                      :rules="[{ type: 'string', max: 100, message: '备注长度不能超过100' ,trigger: 'blur' }]">
            <el-input type="textarea" v-model="insertRootOrgForm.MEMO_"></el-input>
        </el-form-item>

        <el-form-item class="text_right">
            <el-button type="primary" @click='_insertRootOrgForm("insertRootOrgForm")'>保 存</el-button>
            <el-button @click="_close()">关闭</el-button>
        </el-form-item>
    </el-form>

</template>

<script>
	import axios from 'axios';

	export default {
		data() {
			return {
				insertRootOrgForm: {
					PARTY_CODE_: '',
					PARTY_NAME_: '',
					PARTY_TYPE_: '',
					ADDR_: '',
					MEMO_: ''
				},
				buttonStatus: {
					saveStatus: false
				}
			}
		},
		props: {
			_closePreInsertRootOrgPartyDialog: {
				type: Function,
				default: null
			}
		},
		mounted() {
			this.buttonStatus.saveStatus = false;
		},
		methods: {
			_insertRootOrgForm(insertRootOrgForm) {
				this.$refs[insertRootOrgForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[insertRootOrgForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertParty.do',
							data: {
								PARTY_NAME_: formData['PARTY_NAME_'],
								PARTY_TYPE_: 0,
								PARTY_CODE_: formData['PARTY_CODE_'],
								ADDR_: formData['ADDR_'],
								MEMO_: formData['MEMO_']
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
								let returnValue = res.data.party;

								that.buttonStatus.saveStatus = true;
								that.$emit('listeners', returnValue);
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
			_close() {
				this._closePreInsertRootOrgPartyDialog();
			}
		}
	}
</script>

<style scoped>

</style>