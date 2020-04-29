<template>

    <div class="fillcontain">
        <el-form
                ref="updateDevOpsDeptForm"
                :model="updateDevOpsDeptForm"
                style="margin:10px;width:auto; "
        >
            <el-form-item prop='ORG_ID_' label="单位ID:"  label-width="100px" v-if="idFlag"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDeptForm.ORG_ID_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='DEPT_CODE_' label="作业区代码:"  label-width="100px"
                          :rules="[{ required: true, message: '机构代码为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDeptForm.DEPT_CODE_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item prop='DEPT_NAME_' label="作业区名字:"  label-width="100px"
                          :rules="[{ required: true, message: '机构名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                <el-input v-model="updateDevOpsDeptForm.DEPT_NAME_" style="width: 100%"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button type="primary" @click='_updateDevOpsDept("updateDevOpsDeptForm")'>保 存</el-button>
            </el-form-item>
        </el-form>

    </div>
    
</template>

<script>
	import axios from 'axios';
	export default {
		name: "preUpdateDevOpsDept",
        data() {
			return {
				preUpdateDevOpsDeptForm: {
					DEPT_ID_: ''
				},
				updateReportinggDeptFormLoading: false,
				updateDevOpsDeptForm: {
					DEPT_ID_: '',
					ORG_ID_: '',
					DEPT_CODE_: '',
					DEPT_NAME_: ''

				},

            }
        },

        created() {

        },

        methods : {
			//赋值
			setUpdateDevOpsDeptForm(){
				this.updateReportinggDeptFormLoading = true;
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadDevOpsDept.do?DEPT_ID_=' + this.preUpdateDevOpsDeptForm.DEPT_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let devOpsDeptMap = res.data.devOpsDeptMap;

						that.updateDevOpsDeptForm.ORG_ID_ = devOpsDeptMap.ORG_ID_;
						that.updateDevOpsDeptForm.DEPT_CODE_ = devOpsDeptMap.DEPT_CODE_;
						that.updateDevOpsDeptForm.DEPT_NAME_ = devOpsDeptMap.DEPT_NAME_;

						that.updateReportinggDeptFormLoading = false;

					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateReportinggDeptFormLoading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateReportinggDeptFormLoading = false;
				});
			},

			//点击保存
			_updateDevOpsDept (updateDevOpsDeptForm){
				this.$refs[updateDevOpsDeptForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateDevOpsDeptForm];

						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateDevOpsDept.do',
							data: {
								DEPT_ID_: that.preUpdateDevOpsDeptForm.DEPT_ID_,
								DEPT_CODE_: formData['DEPT_CODE_'],
								DEPT_NAME_: formData['DEPT_NAME_'],

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
								let returnValue = res.data.devOpsDept;

								that.$emit('updateDevOpsDeptListeners', returnValue);
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