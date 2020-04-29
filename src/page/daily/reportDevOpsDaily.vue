<template>

<div class="fillcontain">

    <div class="search_container">
        <el-form
                :inline="true"
                :model='devOpsDailyQueryForm'
                ref="devOpsDailyQueryForm"
                class="demo-form-inline search-form">
            <el-form-item>
                <el-date-picker
                        v-model="devOpsDailyQueryForm.CREATE_DATE_"
                        @change="selectDaily()"
                        type="date"
                        placeholder="创建日期">
                </el-date-picker>

                <el-button type="primary" size="mini" icon="el-icon-plus" @click='_preInsertDevOpsDaily()'>新增
                </el-button>
                <el-button type="primary" size="mini" icon="el-icon-edit" @click='_preUpdateDevOpsDaily()' :disabled="BUTTON_STATUS.preUpdateDevOpsDaily">修改
                </el-button>
                <el-button type="danger" size="mini" icon="el-icon-delete" @click='_preDeleteDevOpsDaily()' :disabled="BUTTON_STATUS.preDeleteDevOpsDaily">删除
                </el-button>

                <el-button type="success" size="mini" icon="search" @click='_exportDailyDevOps'>下载模板
                </el-button>

                <el-button type="success" size="mini" icon="search" @click='_uploadDailyDevOps'>上传文件
                </el-button>

            </el-form-item>
        </el-form>
    </div>

    <div class="table_container">
        <el-table
                class="template-list"
                :data="devOpsDailyGrid.devOpsDailyList"
                v-loading="devOpsDailyGrid.devOpsDailyGridLoading"
                :style="devOpsDailyGrid.gridTableStyle"
                :height="devOpsDailyGrid.gridTableStyle.height"
                highlight-current-row
                @current-change="handCurrentChange"
                @row-click="clickRow">
            <el-table-column
                    v-if="idFlag"
                    prop="DAILY_ID_"
                    label="日报ID"
                    align='center'
                    width="120">
            </el-table-column>
            <el-table-column
                    v-if="idFlag"
                    prop="ORG_ID_"
                    label="报修单位ID"
                    align='center'
                    width="120">
            </el-table-column>
            <el-table-column
                    v-if="idFlag"
                    prop="DEPT_ID_"
                    label="作业区ID"
                    align='center'
                    width="120">
            </el-table-column>
            <el-table-column
                    v-if="idFlag"
                    prop="SYSTEM_ID_"
                    label="系统名称ID"
                    align='center'
                    width="120">
            </el-table-column>
            <el-table-column
                    prop="ORG_NAME_"
                    label="报修单位"
                    align='left'
                    width="120"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="DEPT_NAME_"
                    label="作业区"
                    align='left'
                    width="120"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="SYSTEM_NAME_"
                    label="系统名称"
                    align='left'
                    width="120"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="APPLICANT_"
                    label="报修人"
                    align='left'
                    width="120"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="TEL_"
                    label="电话"
                    align='left'
                    width="120"
                    sortable>
            </el-table-column>
            <el-table-column
                    prop="CREATE_DATE_"
                    label="创建日期"
                    align='left'
                    width="120"
                    sortable>
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px;color:#66ccff">{{ scope.row.CREATE_DATE_ }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="FINISH_DATE_"
                    label="完成日期"
                    align='left'
                    width="120"
                    sortable>
                <template slot-scope="scope">
                    <el-icon name="time"></el-icon>
                    <span style="margin-left: 10px;color:#66ccff">{{ scope.row.FINISH_DATE_ }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="FAULT_PHENOMENON_"
                    label="故障现象"
                    align='left'>
            </el-table-column>
            <el-table-column
                    prop="SOLUTION_"
                    label="解决方案"
                    align='left'>
            </el-table-column>
            <el-table-column
                    prop="FAULT_TYPE_"
                    label="故障类型"
                    align='left'
                    width="120"
                    sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row._async_fault }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="WORKING_HOURS_"
                    label="累计工时"
                    align='left'
                    width="120"
                    sortable>
                <template slot-scope="scope">
                    <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WORKING_HOURS_ }}小时</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="WECHAT_"
                    label="用微信插入知识库"
                    align='left'
                    width="150"
                    sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row._async_wechat }}</span>
                </template>
            </el-table-column>
            <el-table-column
                    prop="DEVELOPMENT_"
                    label="是否需要开发"
                    align='left'
                    width="120"
                    sortable>
                <template slot-scope="scope">
                    <span>{{ scope.row._async_development }}</span>
                </template>
            </el-table-column>

        </el-table>

        <!--新增-->
        <el-dialog
                :title="insertDevOpsDailyDialog.title"
                :visible.sync="insertDevOpsDailyDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="insertDevOpsDailyDialog.style"
                :width="insertDevOpsDailyDialog.width"
                @close="closeInsertDevOpsDaily"
        >
            <template>
                <insertDevOpsDailyCom ref="insert_daily_ref" v-if="insertDevOpsDailyDialog.dialogVisible"
                                    @insertDevOpsDailyListeners="_completeInsertDevOpsDaily"></insertDevOpsDailyCom>
            </template>
        </el-dialog>

        <!--修改-->
        <el-dialog
                :title="updateDevOpsDailyDialog.title"
                :visible.sync="updateDevOpsDailyDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="updateDevOpsDailyDialog.style"
                :width="updateDevOpsDailyDialog.width"
                @close="closeUpdateDevOpsDaily"
        >
            <template>
                <updateDevOpsDailyCom ref="update_daily_ref" v-if="updateDevOpsDailyDialog.dialogVisible"
                                      @updateDevOpsDailyListeners="_completeUpdateDevOpsDaily"></updateDevOpsDailyCom>
            </template>
        </el-dialog>

        <!--上传文件-->
        <el-dialog
                :title="perUploadDevOps.title"
                :visible.sync="perUploadDevOps.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                :style="perUploadDevOps.style"
                :width="perUploadDevOps.width"
        >
            <div  v-loading="riderGrid.gridLoading">
                <el-scrollbar>
                    <el-upload
                            class="upload-demo"
                            drag
                            name="file"
                            ref="upload"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            :before-remove="beforeRemove"
                            multiple
                            :file-list="riderGrid.riderList"
                            :before-upload="beforeAvatarUpload"
                            :on-change="OnChange"
                            :auto-upload="false">
                        <i class="el-icon-upload"></i>
                        <div   class="el-upload__text">将文件拖到此处，或<em>点击选取</em></div>

                    </el-upload>
                    <el-button style="margin-left: 10px;" size="mini" type="primary" @click="submitUpload">上传</el-button>
                </el-scrollbar>
            </div>
        </el-dialog>

    </div>


</div>
    
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'

	import insertDevOpsDailyCom from "../daily/preInsertDevOpsDaily.vue";
	import updateDevOpsDailyCom from "../daily/preUpdateDevOpsDaily.vue";
	export default {
		components: {insertDevOpsDailyCom, updateDevOpsDailyCom},
		name: "reportDevOpsDaily.vue",
        data() {
			return {
				idFlag: false,
				dailyTable: {
					dailyTableLoading: false,
					currentRow : null
				},
				devOpsDailyQueryForm: {
					CREATE_DATE_: new Date()
                },
				devOpsDailyGrid: {
					sortNum: 0,
					devOpsDailyList: [],
					devOpsDailyGridLoading: false,
					gridTableStyle: {
						width: '100%',
						height: window.screen.height / 2 + 200
					},
					pagination: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
				riderGrid: {
					sortNum: 0,
					gridLoading: false,
					riderList: [],
					gridTableStyle: {
						width: '100%',
						height:'400px'
					},
					pagination: {
						page_index: 1,  // 当前位于哪页
						total: 0,        // 总数
						page_size: 20,   // 1页显示多少条
						page_sizes: [5, 10, 15, 20],  //每页显示多少条
						layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
					},
				},
				faultTypeCodeMapList: {},
				wdCodeMapList: {},
				//新增窗口
				insertDevOpsDailyDialog: {
					show: false,
					title: '新增日报',
					insertDevOpsDailyDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '800px'
				},

				//修改窗口
				updateDevOpsDailyDialog: {
					show: false,
					title: '修改日报',
					updateDevOpsDailyDialogLoading: false,
					dialogVisible : true,
					formLabelWidth: '120px',
					width: '800px'
				},
                //定义按钮
				BUTTON_STATUS: {
					preUpdateDevOpsDaily: true,
					preDeleteDevOpsDaily: true,
				},
				DAILY_ID_: '',

				perUploadDevOps: {
					width: '530px',
					style: {
						height: '500px',
					},
					show: false,
					title: '上传文件',
					windowLoading: false,
					dialogVisible: true
				},
				exportDailyForm: {
					buttonLoading: false,
				},
				fileList: [],

            }

        },

        created() {
			this.doSyncMethod();

        },

        methods : {
			async doSyncMethod() {
				await this._selectCode();
				this.getDailyList();
			},
			async _selectCode(){
				let that = this;
				await axios({
					method: 'POST',
					url: this.baseUrl + 'selectCode.do',
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
						that.CODE_LIST = res.data.codeList;
						for(let i = 0; i<that.CODE_LIST.length; i++){
							if(that.CODE_LIST[i].CATEGORY_ == 'FAULT_TYPE_'){
								that.faultTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
							if(that.CODE_LIST[i].CATEGORY_ == 'BOOLEAN'){
								that.wdCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
							}
						}
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
				});
			},
			//点击查询按钮
			selectDaily(){
				this.getDailyList();
			},
			//查询方法
			getDailyList(){
				this.devOpsDailyGrid.devOpsDailyGridLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectDaily.do',
					data: {
						CREATE_DATE_ : mutils.formatDate(new Date(that.devOpsDailyQueryForm.CREATE_DATE_)),
						DRAFTOR_ID_ : mutils.getStore('userinfo').empId,
						DAILY_TYPE_: 'yw'
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
						that.devOpsDailyGrid.devOpsDailyList = [];
						let dailyList = res.data.dailyList;

						for (let i = 0; i < dailyList.length; i++) {
							const tableItem = {
								DAILY_ID_: dailyList[i].DAILY_ID_,
								ORG_ID_: dailyList[i].ORG_ID_,
								DEPT_ID_: dailyList[i].DEPT_ID_,
								SYSTEM_ID_: dailyList[i].SYSTEM_ID_,
								ORG_NAME_: dailyList[i].ORG_NAME_,
								DEPT_NAME_: dailyList[i].DEPT_NAME_,
								APPLICANT_: dailyList[i].APPLICANT_,
								TEL_: dailyList[i].TEL_,
								CREATE_DATE_: dailyList[i].CREATE_DATE_,
								FINISH_DATE_: dailyList[i].FINISH_DATE_,
								SYSTEM_NAME_: dailyList[i].SYSTEM_NAME_,
								FAULT_PHENOMENON_: dailyList[i].FAULT_PHENOMENON_,
								SOLUTION_: dailyList[i].SOLUTION_,
								FAULT_TYPE_: dailyList[i].FAULT_TYPE_,
								WORKING_HOURS_: dailyList[i].WORKING_HOURS_,
								WECHAT_: dailyList[i].WECHAT_,
								DEVELOPMENT_: dailyList[i].DEVELOPMENT_,
								_async_fault: that.faultTypeCodeMapList[dailyList[i].FAULT_TYPE_],
								_async_wechat: that.wdCodeMapList[dailyList[i].WECHAT_],
								_async_development: that.wdCodeMapList[dailyList[i].DEVELOPMENT_],
							}
							that.devOpsDailyGrid.devOpsDailyList.push(tableItem);
						}

						that.devOpsDailyGrid.devOpsDailyGridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
					that.devOpsDailyGrid.devOpsDailyGridLoading = false;

				}).catch(function (err) {
					that.$message.error('系统错误请联系管理员')
				})
			},

			handCurrentChange(val) {
				this.dailyTable.currentRow = val;
				//this._setButtonStatus();
			},

			clickRow(row, column, event) {
				this.DAILY_ID_ = row.DAILY_ID_;
				this.BUTTON_STATUS.preUpdateDevOpsDaily = false;
				this.BUTTON_STATUS.preDeleteDevOpsDaily = false;
			},

			//点击添加按钮(添加单位)
			_preInsertDevOpsDaily(){
				this.insertDevOpsDailyDialog.show = true;
				this.insertDevOpsDailyDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.insert_daily_ref.insertDevOpsDailyForm.DAILY_DATE_ = this.devOpsDailyQueryForm.CREATE_DATE_;
					this.$refs.insert_daily_ref.setInsertDevOpsDailyForm();
				})
			},
			//关闭监听
			closeInsertDevOpsDaily(){
				this.insertDevOpsDailyDialog.dialogVisible = false;
			},
			//新增之后页面的变化
			_completeInsertDevOpsDaily(returnValue){
				this.insertDevOpsDailyReqTemp = returnValue;
				let that = this;
				const tableItem = {

					DAILY_ID_: this.insertDevOpsDailyReqTemp.DAILY_ID_,
					ORG_ID_: this.insertDevOpsDailyReqTemp.ORG_ID_,
					DEPT_ID_: this.insertDevOpsDailyReqTemp.DEPT_ID_,
					SYSTEM_ID_: this.insertDevOpsDailyReqTemp.SYSTEM_ID_,
					ORG_NAME_: this.insertDevOpsDailyReqTemp.ORG_NAME_,
					DEPT_NAME_: this.insertDevOpsDailyReqTemp.DEPT_NAME_,
					APPLICANT_: this.insertDevOpsDailyReqTemp.APPLICANT_,
					TEL_: this.insertDevOpsDailyReqTemp.TEL_,
					CREATE_DATE_: this.insertDevOpsDailyReqTemp.CREATE_DATE_,
					FINISH_DATE_: this.insertDevOpsDailyReqTemp.FINISH_DATE_,
					SYSTEM_NAME_: this.insertDevOpsDailyReqTemp.SYSTEM_NAME_,
					FAULT_PHENOMENON_: this.insertDevOpsDailyReqTemp.FAULT_PHENOMENON_,
					SOLUTION_: this.insertDevOpsDailyReqTemp.SOLUTION_,
					FAULT_TYPE_: this.insertDevOpsDailyReqTemp.FAULT_TYPE_,
					WORKING_HOURS_: this.insertDevOpsDailyReqTemp.WORKING_HOURS_,
					WECHAT_: this.insertDevOpsDailyReqTemp.WECHAT_,
					DEVELOPMENT_: this.insertDevOpsDailyReqTemp.DEVELOPMENT_,
					_async_fault: that.faultTypeCodeMapList[this.insertDevOpsDailyReqTemp.FAULT_TYPE_],
					_async_wechat: that.wdCodeMapList[this.insertDevOpsDailyReqTemp.WECHAT_],
					_async_development: that.wdCodeMapList[this.insertDevOpsDailyReqTemp.DEVELOPMENT_],

				};
				this.devOpsDailyGrid.devOpsDailyList.push(tableItem);
				this.insertDevOpsDailyDialog.show = false;
			},

			//点击修改按钮
			_preUpdateDevOpsDaily(){
				this.updateDevOpsDailyDialog.show = true;
				this.updateDevOpsDailyDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.update_daily_ref.updateDevOpsDailyForm.DAILY_ID_ = this.DAILY_ID_;
					this.$refs.update_daily_ref.setUpdateDevOpsDailyForm();
				})
			},
			//关闭监听
			closeUpdateDevOpsDaily(){
				this.updateDevOpsDailyDialog.dialogVisible = false;
			},
			//修改之后页面的变化
			_completeUpdateDevOpsDaily(returnValue){
				this.updateDevOpsDailyReqTemp = returnValue;
				let that = this;
				for (let key in that.updateDevOpsDailyReqTemp) {//装载被修改数据到页面
					//给选中的那条数据改值,防止错误,谨慎!!
					(that.dailyTable.currentRow[key] != null) ? that.dailyTable.currentRow[key] = that.updateDevOpsDailyReqTemp[key] : '';
				}
				that.dailyTable.currentRow._async_fault = that.faultTypeCodeMapList[that.updateDevOpsDailyReqTemp.FAULT_TYPE_],
				that.dailyTable.currentRow._async_wechat = that.wdCodeMapList[that.updateDevOpsDailyReqTemp.WECHAT_],
				that.dailyTable.currentRow._async_development = that.wdCodeMapList[that.updateDevOpsDailyReqTemp.DEVELOPMENT_],

				this.updateDevOpsDailyDialog.show = false;
			},
            //删除按钮
			_preDeleteDevOpsDaily(){
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					that.devOpsDailyGrid.devOpsDailyGridLoading = true;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDaily.do',
						data: {
							DAILY_ID_: this.DAILY_ID_
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
							that.$message.success('删除成功');
							that.getDailyList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.devOpsDailyGrid.devOpsDailyGridLoading = false;
					})
				});
            },

			_uploadDailyDevOps() {
				this.perUploadDevOps.show = true;
				this.perUploadDevOps.dialogVisible = true;
			},
			_exportDailyDevOps() {

						let that = this;
						///this.exportDailyForm.buttonLoading = true;
							//下载维护记录模板
							axios({
								method: 'POST',
								url: this.baseUrl + 'downloadResource.do',
								data: {
									url : 'dailyDevOps.xls'

								},
								transformRequest: [function (data) {
									let ret = ''
									for (let it in data) {
										ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
									}
									return ret
								}],
								headers: {'Content-Type': "application/x-www-form-urlencoded"},
								responseType: 'blob'
							}).then(function (res) {
								that.download(res.data);
								//that.exportDailyForm.buttonLoading = false;
								//that.getProjectList();
							}).catch(function (err) {
								/*请求失败*/
								that.$message.error('系统错误请联系管理员')
								//that.exportDailyForm.buttonLoading = false;
							})
			},

			// 下载文件
			download(data) {
				if (!data) {
					return
				}
				let url = window.URL.createObjectURL(new Blob([data]))
				let link = document.createElement('a')
				link.style.display = 'none'
				link.href = url
				link.setAttribute('download', '维护记录模板.xls')

				document.body.appendChild(link)
				link.click()
			},

            //导入文件
			handleRemove(file, fileList) {
				console.log(file, fileList);
			},

			handlePreview(file) {
				if (file.response.status) {
					alert("此文件导入成功");
				} else {
					alert("此文件导入失败");
				}

			},

			beforeRemove(file, fileList) {
				return this.$confirm(`确定移除 ${ file.name }？`);
			},
			OnChange(file,fileList){
				this.fileList=fileList;
			},

			// 上传前对文件的大小的判断
			beforeAvatarUpload(file) {
				const extension = file.name.split(".")[1] === "xls";
				const extension2 = file.name.split(".")[1] === "xlsx";
				// const extension3 = file.name.split(".")[1] === "doc";
				// const extension4 = file.name.split(".")[1] === "docx";
				const isLt2M = file.size / 1024 / 1024 < 10;
				if (!extension && !extension2 ) {
					alert("上传模板只能是 xls、xlsx 格式!");
				}
				// if (!isLt2M) {
				// 	console.log("上传模板大小不能超过 10MB!");
				// }
				//return extension || extension2 || extension3 || (extension4 && isLt2M);
				return extension || extension2
			},
			submitUpload(){
				if(this.fileList.length == 0){
					this.$message.warning('请选择文件');
                    return;
                }
				if(this.fileList.length > 1){
					this.$message.warning('暂不支持批量文件操作');
					return;
				}

				this.riderGrid.gridLoading = true;
				let param = new FormData(); //创建form对象
				//param.append('files',f.file);//通过append向form对象添加数据

				for(let i=0;i<this.fileList.length;i++){
					param.append("excelFile",this.fileList[i].raw);
				}
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'importDevOpsDaily.do',
					data: param,
					// transformRequest: [function (data) {
					// 	let ret = ''
					// 	for (let it in data) {
					// 		ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					// 	}
					// 	return ret
					// }],
					headers: {'Content-Type': 'multipart/form-data'}
				}).then(function (res) {
					if (res.data.success) {
						//that.getList();
						that.$refs.upload.clearFiles();

						that.riderGrid.gridLoading = false;
						that.perUploadDevOps.show = false;
						that.$message.success("操作成功");
						that.getDailyList();
					} else {
						that.$message.error('系统错误,请检查文件是否过大');

					}
				}).catch(function (err) {
					/*请求失败*/
					//that.getList();
					that.$message.error('操作失败请重试');
					that.riderGrid.gridLoading = false;
				})
			},



        }
	}
</script>

<style scoped>
    .bot {}

</style>