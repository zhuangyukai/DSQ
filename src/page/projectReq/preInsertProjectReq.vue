<template>
    <div class="form">
        <el-form
                ref="projectReqForm"
                :model="projectReqForm"
                :label-width="projectReqForm.style.formLabelWidth"
                style="margin:10px;width:auto;">
            <el-form-item prop='REQ_CODE_' label="需求编码:"
                          :rules="[{ required: true, message: '需求编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 40, message: '内容不能超过40位', trigger: 'blur' }]">
                <el-input v-model="projectReqForm.REQ_CODE_"></el-input>
            </el-form-item>

            <el-form-item prop='REQ_NAME_' label="需求名称:"
                          :rules="[{ required: true, message: '需求名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '内容不能超过100位', trigger: 'blur' }]">
                <el-input v-model="projectReqForm.REQ_NAME_"></el-input>
            </el-form-item>
            <el-form-item prop='ORIGIN_' label="需求来源:"
                          :rules="[{ type: 'string', max: 60, message: '内容不能超过60位', trigger: 'blur' }]">
                <el-input v-model="projectReqForm.ORIGIN_"></el-input>
            </el-form-item>
            <el-form-item prop='RAISER_NAME_' label="提出人名称:">
                <el-input v-model="projectReqForm.RAISER_NAME_"
                          :rules="[{ type: 'string', max: 40, message: '内容不能超过40位', trigger: 'blur' }]"></el-input>
            </el-form-item>
            <el-form-item prop='RAISER_CP_' label="提出人联系方式:">
                <el-input v-model="projectReqForm.RAISER_CP_"
                          :rules="[{ type: 'string', max: 60, message: '内容不能超过60位', trigger: 'blur' }]"></el-input>
            </el-form-item>
            <el-form-item prop='RAISE_DATE_' label="提出日期:"
                          :rules="[{ required: true, message: '提出时间不能为空' ,trigger: 'blur' }]">
                <el-date-picker
                        v-model="projectReqForm.RAISE_DATE_"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择提出时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop='MEMO_' label="备注:"
                          :rules="[{ type: 'string', max: 1000, message: '备注长度不能超过1000' ,trigger: 'blur' }]">
                <el-input type="textarea" v-model="projectReqForm.MEMO_"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button @click="_close()">关闭</el-button>
                <el-button type="primary" @click='_insertProjectReq("projectReqForm")'  v-bind:disabled="buttonStatus.saveStatus">保存</el-button>
            </el-form-item>
        </el-form>
    </div>
</template>
<script>
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';

	export default {
		data() {
			return {
				projectReqForm: {
					style: {
						formLabelWidth: '120px'
					},
					REQ_ID_: '',
					PROJECT_ID_: '',
					REQ_CODE_: '',
					REQ_NAME_: '',
					ORIGIN_: '',
					MEMO_: '',
					MANAGER_ID_: '',
					RAISER_NAME_: '',
					RAISER_CP_: '',
					RAISE_DATE_: '',
					END_DATE_: '',
					STATUS_: ''

				},
				projectReq: {
					REQ_ID_: '',
					PROJECT_ID_: '',
					REQ_CODE_: '',
					REQ_NAME_: '',
					ORIGIN_: '',
					MEMO_: '',
					MANAGER_ID_: '',
					RAISER_NAME_: '',
					RAISER_CP_: '',
					RAISE_DATE_: '',
					END_DATE_: '',
					STATUS_: ''
				},
                buttonStatus:{
					saveStatus : false
                }
			}
		},
		props: {
			_closePreInsertReqDialog: {
				type: Function,
				default: null
			}
		},
		mounted() {
			this.buttonStatus.saveStatus = false;
		},
		methods: {
			_insertProjectReq(projectReqForm) {
				this.$refs[projectReqForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[projectReqForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertProjectReq.do',
							data: {
								PROJECT_ID_: that.projectReqForm.PROJECT_ID_,
								REQ_CODE_: formData['REQ_CODE_'],
								REQ_NAME_: formData['REQ_NAME_'],
								ORIGIN_: formData['ORIGIN_'],
								MEMO_: formData['MEMO_'],
								RAISER_NAME_: formData['RAISER_NAME_'],
								RAISER_CP_: formData['RAISER_CP_'],
								RAISE_DATE_: formData['RAISE_DATE_'] == '' ? '' : mutils.formatDate(new Date(formData['RAISE_DATE_']))
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
								let returnValue = res.data.projectReq;

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
				this._closePreInsertReqDialog();
			}
		}
	}


</script>
