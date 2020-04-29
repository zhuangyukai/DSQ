<template>
    <div>
        <div>
            <el-form
                    :inline="true"
                    :model='project_Query_Date'
                    ref="search_data"
                    class="demo-form-inline search-form">
                <el-form-item>
                    项目名称:
                    <el-input v-model="project_Query_Date.PROJECT_NAME_" style="width: 200px" placeholder="请输入项目名称"
                              clearable>
                    </el-input>
                    项目编码:
                    <el-input v-model="project_Query_Date.PROJECT_CODE_" style="width: 200px" placeholder="请输入项目编码"
                              clearable>
                    </el-input>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="el-icon-search" @click='selectProject()'>筛选
                    </el-button>
                    <el-button type="primary" size="mini" icon="el-icon-plus" @click='preInsertProject()'>添加</el-button>
                    <el-button type="primary" size="mini" icon="el-icon-edit" :disabled="BUTTON_STATUS.preUpdateProject"
                               @click='_preUpdateProject()'>编辑
                    </el-button>
                    <el-button type="primary" size="mini" icon="search" :disabled="BUTTON_STATUS.manageProjectReq"
                               @click='_manageProjectReq()'>管理需求
                    </el-button>
                    <el-button type="primary" size="mini" icon="search" :disabled="BUTTON_STATUS.manageProjectDesign"
                               @click='_manageProjectDesign()'>设计文档
                    </el-button>
                    <el-button type="primary" size="mini"  :disabled="BUTTON_STATUS.manageProjectPerson"
                               @click='_manageProjectPerson()'>管理人员
                    </el-button>
                    <el-button type="primary" size="mini"  :disabled="BUTTON_STATUS.manageModule"
                               @click='_manageProjectPersonAllot()'>管理任务
                    </el-button>
                    <el-button type="success" size="mini" icon="el-icon-check" :disabled="BUTTON_STATUS.completeProject"
                               @click='_completeProject()'>立项
                    </el-button>
                    <el-button type="danger" size="mini" icon="el-icon-delete" :disabled="BUTTON_STATUS.deleteProject"
                               @click='_deleteProject()'>删除
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
        <div>
            <el-table
                    v-loading="mainloading"
                    :data="tableData"
                    :style="gridTableStyle"
                    :height="gridTableStyle.height"
                    align='center'
                    :max-height="tableHeight"
                    ref="projectGridRef"
                    @select="handleSelection"
                    @select-all="handleSelectionAll"
                    @selection-change="handleSelectionChange"
                    @row-click="clickRow"
                    :cell-style="projectCellStyle"
            >
                <el-table-column type="selection" width="55">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="PROJECT_ID_"
                        label="项目ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="PROJECT_CODE_"
                        label="项目编码"
                        align='center'
                        width="220"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_NAME_"
                        label="项目名称"
                        align='center'
                        width="300"
                        sortable>
                </el-table-column>
                <el-table-column
                        prop="PROJECT_TYPE_CODE_"
                        label="项目类型"
                        align='center'
                        width="240"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row._async_label }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="DRAFT_DATE_"
                        label="起草时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.DRAFT_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="HOURS_"
                        label="累计工时"
                        align='center'
                        width="100"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.HOURS_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="MEMO_"
                        label="备注"
                        align='center'>
                </el-table-column>
                <el-table-column
                        prop="STATUS_DESC_"
                        label="状态"
                        align='center'
                        width="240"
                        :cell-style="getCellStyle"
                        sortable>
                    <template slot-scope="scope">
                        <span>{{ scope.row.STATUS_DESC_ }}</span>
                    </template>
                </el-table-column>
            </el-table>
            <el-row>
                <el-col :span="24">
                    <div class="pagination">
                        <el-pagination
                                v-if='paginations.total > 0'
                                :page-sizes="paginations.page_sizes"
                                :page-size="paginations.page_size"
                                :layout="paginations.layout"
                                :total="paginations.total"
                                :current-page='paginations.page_index'
                                @current-change='handleCurrentChange'
                                @size-change='handleSizeChange'>
                        </el-pagination>
                    </div>
                </el-col>
            </el-row>
        </div>
        <el-dialog
                :title="insertDialog.title"
                :visible.sync="insertDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false">
            <div class="form">
                <el-form
                        ref="insertForm"
                        :model="insertForm"
                        :label-width="insertDialog.formLabelWidth"
                        style="margin:10px;width:auto;"
                >
                    <el-form-item prop='PROJECT_CODE_' label="项目编码:"
                                  :rules="[{ required: true, message: '项目编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                        <el-input v-model="insertForm.PROJECT_CODE_"></el-input>
                    </el-form-item>

                    <el-form-item prop='PROJECT_NAME_' label="项目名称:"
                                  :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                        <el-input v-model="insertForm.PROJECT_NAME_"></el-input>
                    </el-form-item>

                    <el-form-item prop='PROJECT_TYPE_CODE_' label="项目类型:"
                                  :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                        <el-select v-model="insertForm.PROJECT_TYPE_CODE_" placeholder="请选择">
                            <el-option
                                    v-for="item in projectTypeList"
                                    :key="item.CODE_"
                                    :label="item.NAME_"
                                    :value="item.CODE_">
                            </el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item prop='MEMO_' label="备注:"
                                  :rules="[{ type: 'string', max: 1000, message: '备注长度不能超过1000' ,trigger: 'blur' }]">
                        <el-input type="textarea" v-model="insertForm.MEMO_"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button @click="insertDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='_insertProject("insertForm")'>保 存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog
                :title="updateDialog.title"
                :visible.sync="updateDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false">
            <div class="form">
                <el-form
                        ref="updateForm"
                        :model="updateForm"
                        :label-width="updateDialog.formLabelWidth"
                        style="margin:10px;width:auto;"
                >
                    <el-form-item prop='PROJECT_ID_' v-if="idFlag" label="项目ID:">
                        <el-input type="PROJECT_ID_" v-model="updateForm.PROJECT_ID_"></el-input>
                    </el-form-item>
                    <el-form-item prop='PROJECT_CODE_' label="项目编码:"
                                  :rules="[{ required: true, message: '项目编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 60, message: '编码不能超过60位', trigger: 'blur' }]">
                        <el-input v-model="updateForm.PROJECT_CODE_"></el-input>
                    </el-form-item>

                    <el-form-item prop='PROJECT_NAME_' label="项目名称:"
                                  :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '名称不能超过60位', trigger: 'blur' }]">
                        <el-input v-model="updateForm.PROJECT_NAME_"></el-input>
                    </el-form-item>

                    <el-form-item prop='PROJECT_TYPE_CODE_' label="项目类型:"
                                  :rules="[{ required: true, message: '项目类型不能为空' ,trigger: 'blur' }]">
                        <el-select v-model="updateForm.PROJECT_TYPE_CODE_" placeholder="请选择">
                            <el-option
                                    v-for="item in projectTypeList"
                                    :key="item.CODE_"
                                    :label="item.NAME_"
                                    :value="item.CODE_">
                            </el-option>
                        </el-select>
                    </el-form-item>


                    <el-form-item prop='MEMO_' label="备注:"
                                  :rules="[{ type: 'string', max: 1000, message: '备注长度不能超过1000' ,trigger: 'blur' }]">
                        <el-input type="textarea" v-model="updateForm.MEMO_"></el-input>
                    </el-form-item>

                    <el-form-item class="text_right">
                        <el-button @click="updateDialog.show = false">取 消</el-button>
                        <el-button type="primary" @click='_updateProject("updateForm")'>保 存</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-dialog>
        <el-dialog
                :title="manageProjectPersonDialog.title"
                :visible.sync="manageProjectPersonDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
        >
            <div class="temp-list">
                <el-button
                        size="small"
                        type="primary"
                        icon="el-icon-circle-plus-outline"
                        @click="_preInsertProjectPerson">添加
                </el-button>
                <el-table
                        class="template-list"
                        :data="projectPersonList"
                        v-loading="manageProjectPersonDialog.mppLoading"
                        style="width: 100%;height: 600px">
                    <el-table-column
                            label="人员姓名">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.editing">
                                <span>{{ scope.row.EMP_NAME_ }}</span>
                            </div>
                            <div v-else>
                                <el-input v-model="scope.row.EMP_NAME_"
                                          @focus="_preChooseEmp(scope.$index, scope.row)"
                                          placeholder="请选择人员"></el-input>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="项目角色">
                        <template slot-scope="scope">
                            <div v-if="!scope.row.editing">
                                <span>{{ scope.row.PROJECT_ROLE_NAME_ }}</span>
                            </div>
                            <div v-else>
                                <el-select v-model="scope.row.PROJECT_ROLE_" placeholder="请选择项目角色">
                                    <el-option
                                            v-for="item in projectRoleList"
                                            :key="item.CODE_"
                                            :label="item.NAME_"
                                            :value="item.CODE_">
                                    </el-option>
                                </el-select>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column
                            label="操作"
                            fixed="right"
                            align="center"
                    >
                        <template slot-scope="scope">
                            <div class="operate-groups">
                                <el-button
                                        type="primary"
                                        size="mini"
                                        v-if="!scope.row.editing"
                                        icon="el-icon-edit-outline"
                                        @click="_preUpdateProjectPerson(scope.$index, scope.row)">编辑
                                </el-button>
                                <el-button
                                        type="primary"
                                        size="mini"
                                        v-if="scope.row.editing"
                                        icon="el-icon-success"
                                        @click="_insertProjectPerson(scope.$index, scope.row)">保存
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="danger"
                                        v-if="!scope.row.editing"
                                        icon="el-icon-delete"
                                        @click="_deleteProjectPerson(scope.$index, scope.row)">删除
                                </el-button>
                                <el-button
                                        size="mini"
                                        type="warning"
                                        v-if="scope.row.editing"
                                        icon="el-icon-warning"
                                        @click="_cancelProjectPerson(scope.$index, scope.row)">取消
                                </el-button>
                            </div>
                        </template>
                    </el-table-column>


                </el-table>
            </div>
        </el-dialog>
        <!--选择人员 DIALOG-->
        <el-dialog
                :title="empDialog.title"
                :visible.sync="empDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :width="empDialog.width"
        >
            <div class="temp-list">
                <el-form
                        :inline="true"
                        :model='empQueryDate'
                        ref="search_data"
                        class="demo-form-inline search-form"
                >
                    <el-form-item>
                        项目名称:
                        <el-input v-model="empQueryDate.EMP_NAME_" style="width: 200px" placeholder="请输入人员名称"
                                  clearable>
                        </el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button circle type="success" size="medium" icon="el-icon-search"
                                   @click='_selectEmpByButton()'>
                        </el-button>
                        <el-button circle type="danger" size="medium" icon="el-icon-circle-close"
                                   @click='_closeChooseEmpDialog()'>
                        </el-button>
                    </el-form-item>
                </el-form>
                <el-row>
                    <div style="border: 1px solid #BDC0C0;height: 400px;">
                        <el-col :span="12">
                            <div class="grid-content bg-purple">
                                <div>
                                    <el-tree
                                            :data="orgList"
                                            :props="defaultProps"
                                            :expand-on-click-node="false"
                                            default-expand-all
                                            highlight-current
                                            @node-click="_orgOnClick"
                                    ></el-tree>
                                </div>

                            </div>
                        </el-col>
                        <el-col :span="12">
                            <div class="grid-content bg-purple-light">
                                <el-table
                                        highlight-current-row
                                        v-loading="empDialog.empLoading"
                                        :data="empList"
                                        :style="empTableStyle"
                                        :height="empTableStyle.height"
                                        align='center'
                                        :max-height="tableHeight">
                                    <el-table-column
                                            v-if="idFlag"
                                            prop="EMP_CODE_"
                                            label="人员编码"
                                            align='center'
                                            width="220">
                                    </el-table-column>
                                    <el-table-column
                                            prop="EMP_NAME_"
                                            label="人员名称"
                                            align='center'
                                            width="220">
                                    </el-table-column>
                                    <el-table-column
                                            prop="operation"
                                            align='left'
                                            label="操作"
                                            fixed="right"
                                            width="70">
                                        <template slot-scope='scope'>
                                            <el-button
                                                    type="warning"
                                                    icon='edit'
                                                    size="mini"
                                                    @click='_chooseEmp(scope.row)'
                                            >选择
                                            </el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                            </div>
                        </el-col>
                    </div>
                </el-row>

            </div>
        </el-dialog>
        <!--管理项目需求 DIALOG-->
        <el-dialog
                :title="projectReq.title"
                :visible.sync="projectReq.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                :width="projectReq.width"
                @closed="_closeProjectReq"
        >
            <template>
                <projectReqCom ref="project_req_ref" v-if="projectReq.dialogVisible"></projectReqCom>
            </template>
        </el-dialog>
        <!--管理项目设计 DIALOG-->
        <el-dialog
                :title="projectDesign.title"
                :visible.sync="projectDesign.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                :width="projectDesign.width"
                @closed="_closeProjectDesign"
        >
            <template>
                <riderCom ref="project_design_ref" v-if="projectDesign.dialogVisible"></riderCom>
            </template>
        </el-dialog>
        <!--分配人员 DIALOG-->
        <el-dialog
                :title="projectPersonAllot.title"
                :visible.sync="projectPersonAllot.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="false"
                width="1550px"
                style="margin-left: 200px"
                @closed="_closeProjectPersonAllot"
        >
            <div style="width: 1200px;height: 600px">
                <template>
                    <projectPersonAllotCom ref="project_person_allot_ref" v-if="projectPersonAllot.dialogVisible"></projectPersonAllotCom>
                </template>
            </div>
        </el-dialog>

    </div>
</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	//import {axios} from 'utils/'
	import axios from 'axios';
	import projectReqCom from './projectReq/manageProjectReq.vue';
	import riderCom from './rider/manageRider.vue';
	import Promise from "vue-resource/src/lib/promise";
	import projectPersonAllotCom from './modulePersonAllot/manageModulePersonAllot.vue';

	//axios.defaults.withCredentials = true; //意思是携带cookie信息,保持每次请求session的一致性

	export default {
		components: {projectReqCom, riderCom, projectPersonAllotCom},
		data() {
			return {
				rowStyle :{
				  background : '#000000'
                },
				projectReq: {
					show: false,
					title: '管理项目需求',
					projectReqLoading: false,
					dialogVisible: true,
					params: {
						PROJECT_ID_: ''
					}
				},
				projectDesign: {
					show: false,
					title: '管理设计文档',
					loading: false,
					dialogVisible: true,
					params: {
						PROJECT_ID_: ''
					}
				},
				projectPersonAllot: {
					style: {
						height: window.screen.height / 2 + 500,
                    },
					show: false,
					title: '任务人员分配',
					projectPersonAllotLoading: false,
					dialogVisible : true,
					params: {
						PROJECT_ID_ : ''
					}
				},
				projectPerson: {
					tempDate: {
						PROJECT_ID_: '',
						EMP_NAME_: '',
						EMP_ID_: ''
					},
					insertOrUpdate: false,
					PROJECT_ID_: '',
					tempIndex: ''
				},
				empList: [],
				empQueryDate: {
					EMP_NAME_: ''
				},
				projectRoleList: [],
				projectTypeList: [],
				PROJECT_STATUS_CODE_LIST: [],
				manageProjectPersonDialog: {
					show: false,
					title: '管理相关人员',
					mppLoading: false
				},
                CODE_LIST : [],
				projectTypeCodeMapList: {},
				projectRoleCodeMapList: {},
				projectStatusCodeMapList:{},
				gridTableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				empTableStyle: {
					width: '100%',
					height: '400px',
					borderLeft: '3px solid #000'
				},
				orgList: [],
				defaultProps: {
					children: 'children',
					label: 'ORG_NAME_'
				},
				diagloading: false,
				mainloading: false,
				tableData: [],
				projectPersonList: [],
				sel: null,//选中行
				tableHeight: '',
				idFlag: false,
				sortnum: 0,
				project_Query_Date: {
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					FROM_DRAFT_DATE_: ''
				},
				activeName: 'weekWork',
				openDisabled: true,
				weekWork: {},
				//需要给分页组件传的信息
				paginations: {
					page_index: 1,  // 当前位于哪页
					total: 0,        // 总数
					page_size: 20,   // 1页显示多少条
					page_sizes: [5, 10, 15, 20],  //每页显示多少条
					layout: "total, sizes, prev, pager, next, jumper"   // 翻页属性
				},
				//详情弹框信息
				insertDialog: {
					width: '300px',
					show: false,
					title: '新增项目',
					formLabelWidth: '120px'
				},
				empDialog: {
					width: '640px',
					show: false,
					title: '选择人员',
					formLabelWidth: '120px',
					empLoading: false,
				},
				updateDialog: {
					width: '300px',
					show: false,
					title: '修改项目',
					formLabelWidth: '120px'
				},
				updateDiagloading: false,
				tab: {},
				insertForm: {
					PROJECT_ID_: '',
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					PROJECT_TYPE_CODE_: '',
					MEMO_: ''
				},
				updateForm: {
					PROJECT_ID_: '',
					PROJECT_CODE_: '',
					PROJECT_NAME_: '',
					PROJECT_TYPE_CODE_: '',
					MEMO_: ''
				},
				item: {
					projectCode: ''
				},
				pickerStartDate: {
					disabledDate: (time) => {
						/*if (this.form.weekEndDate != "") {
							return time.getTime() > Date.now() || time.getTime() > this.form.weekEndDate;
						} else {
							return time.getTime() > Date.now();
						}*/

					}
				},
				pickerEndDate: {
					disabledDate: (time) => {
						return time.getTime() < this.form.weekStartDate;
						//return time.getTime() > this.form.weekStartDate;
					}
				},
				numbers: [],
				multipleSelection: [],
				BUTTON_STATUS: {
					preUpdateProject: true,
					manageProjectReq: true,
					manageProjectDesign: true,
					manageProjectPerson: true,
					manageModule : true,
					deleteProject: true,
					completeProject: true
				},
			}
		},
		// mounted() {
		// 	//加载数据之前，先加载theme颜色
		// 	this._selectOrg();
		// 	this.doSyncMethod();//此方法为同步方法
		// 	this.getList({
		// 		fun: () => {
		// 		}
		// 	});
		// },
		created() {
			this.doSyncMethod();
		},
		methods: {
			/**
			 * 改变页码和当前页时需要拼装的路径方法
			 * @param {string} field 参数字段名
			 * @param {string} value 参数字段值
			 */
			async doSyncMethod() {
				await this._selectCode();
				await this._selectOrg();
				this.getList();
			},
			getRowStyle(row, rowIndex) {
				if (row.row.STATUS_== '9') {
					return { background : '#67C23A'	 };
				}
				return { background : '#FFFFFF'	 };
			},
			getCellStyle(row, rowIndex) {
				if (row.row.STATUS_== '9') {
					return { background : '#67C23A'	 };
				}
				return { background : '#FFFFFF'	 };
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
					that.CODE_LIST = res.data.codeList;
					for(let i = 0; i<that.CODE_LIST.length; i++){
						if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_TYPE'){
							that.projectTypeList.push(that.CODE_LIST[i]);
							that.projectTypeCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						}
						if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_ROLE'){
							that.projectRoleList.push(that.CODE_LIST[i]);
							that.projectRoleCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						}
						if(that.CODE_LIST[i].CATEGORY_ == 'PROJECT_STATUS'){
							that.PROJECT_STATUS_CODE_LIST.push(that.CODE_LIST[i]);
							that.projectStatusCodeMapList[that.CODE_LIST[i].CODE_] = that.CODE_LIST[i].NAME_;
						}
					}
				}).catch(function (err) {
				});
            },
			handleSelection(selection, row) {
				// 表单绑定的数据
				this.tableData.forEach((item, i) => {
					if (item.PROJECT_ID_ == row.PROJECT_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
						}
					}
				});
			},
			handleSelectionAll(selection) {
				this.multipleSelection = selection;
				this.numbers = [];
				if (this.multipleSelection.length != 0) {
					for (let i = 0; i < this.tableData.length; i++) {
						this.numbers.push(i);
					}
				}
			},
			handleSelectionChange(val) {
				this.multipleSelection = val;
				this._setButtonStatus();
			},
			clickRow(row) {
				this.$refs.projectGridRef.toggleRowSelection(row, true);

				this.tableData.forEach((r, i) => {
					if (r.PROJECT_ID_ == row.PROJECT_ID_) {
						if (this.numbers.indexOf(i) == -1) {
							this.numbers.push(i);
						} else {
							this.numbers.splice(this.numbers.indexOf(i), 1);
							this.$refs.projectGridRef.toggleRowSelection(row, false);
						}
					}
				});

				//this._setButtonStatus();
			},
			_setButtonStatus() {
				if (this.multipleSelection.length == 1 && this.multipleSelection[0].STATUS_ == '1') {
					this.BUTTON_STATUS.preUpdateProject = false;
					this.BUTTON_STATUS.manageProjectReq = false;
					this.BUTTON_STATUS.manageProjectDesign = false;
					this.BUTTON_STATUS.manageProjectPerson = false;
					this.BUTTON_STATUS.manageModule = false;
					this.BUTTON_STATUS.deleteProject = false;
					this.BUTTON_STATUS.completeProject = false;
				}else if(this.multipleSelection.length == 1 && this.multipleSelection[0].STATUS_ == '9' ) {
					this.BUTTON_STATUS.manageProjectReq = false;
					this.BUTTON_STATUS.manageProjectDesign = false;
					this.BUTTON_STATUS.manageProjectPerson = false;
					this.BUTTON_STATUS.manageModule = false;
                }else if (this.multipleSelection.length > 0) {
					let deleteStatus = false;
					this.BUTTON_STATUS.preUpdateProject = true;
					this.BUTTON_STATUS.manageProjectReq = true;
					this.BUTTON_STATUS.manageProjectDesign = true;
					this.BUTTON_STATUS.manageProjectPerson = true;
					this.BUTTON_STATUS.manageModule = true;
					for (let i = 0; i < this.multipleSelection.length; i++) {
						if (this.multipleSelection[i].STATUS_ == '9') {
							deleteStatus = true;
						}
					}
					if (deleteStatus) {
						this.BUTTON_STATUS.deleteProject = true;
						this.BUTTON_STATUS.completeProject = true;
					} else {
						this.BUTTON_STATUS.deleteProject = false;
						this.BUTTON_STATUS.completeProject = false;
					}
				}
				else {
					this.BUTTON_STATUS.preUpdateProject = true;
					this.BUTTON_STATUS.manageProjectReq = true;
					this.BUTTON_STATUS.manageProjectDesign = true;
					this.BUTTON_STATUS.manageProjectPerson = true;
					this.BUTTON_STATUS.manageModule = true;
					this.BUTTON_STATUS.deleteProject = true;
					this.BUTTON_STATUS.completeProject = true;
				}
			},
			_closeChooseEmpDialog() {
				this.empDialog.show = false;
			},
			_selectEmpByButton() {
				this.empDialog.empLoading = true;
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						EMP_NAME_: this.empQueryDate.EMP_NAME_
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
					that.empList = res.data.empList;
					that.empDialog.empLoading = false;
				}).catch(function (err) {
					that.empDialog.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			_orgOnClick(data) {
				let that = this;
				that.empDialog.empLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectEmp.do',
					data: {
						ORG_ID_: data.ORG_ID_
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
					that.empList = res.data.empList;
					that.empDialog.empLoading = false;
				}).catch(function (err) {
					that.empDialog.empLoading = false;
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			_selectOrg() {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectOrg.do',
					data: {},
					transformRequest: [function (data) {
						let ret = ''
						for (let it in data) {
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
					headers: {'Content-Type': "application/x-www-form-urlencoded"}
				}).then(function (res) {
					that.orgList = res.data.children;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
			},
			_preChooseEmp(index, row) {
				this.empDialog.show = true;
				this.projectPerson.tempIndex = index;

			},
			_chooseEmp(row) {
				this.projectPersonList[this.projectPerson.tempIndex].EMP_ID_ = row.EMP_ID_;
				this.projectPersonList[this.projectPerson.tempIndex].EMP_NAME_ = row.EMP_NAME_;

				//this.projectPerson.tempDate.EMP_NAME_ = row.EMP_NAME_;
				//this.projectPerson.tempDate.EMP_ID_ = row.EMP_ID_;
				this._closeChooseEmpDialog();
			},
			_preInsertProjectPerson() {
				for (let i = 0; i < this.projectPersonList.length; i++) {
					if (this.projectPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				//this.projectPerson.tempDate.EMP_NAME_ = '';
				this.projectPerson.insertOrUpdate = true;
				this.projectPersonList = this.projectPersonList || []
				this.projectPersonList.push({
					PROJECT_PERSON_ID_: "",
					PROJECT_ID_: "",
					EMP_ID_: "",
					PROJECT_ROLE_: "",
					ENABLE_DATE_: "",
					DISABLE_DATE_: "",
					STATUS_: "",
					EMP_NAME_: "",
					editing: true
				});
			},
			// 编辑
			_preUpdateProjectPerson($index, row) {
				for (let i = 0; i < this.projectPersonList.length; i++) {
					if (this.projectPersonList[i].editing) {
						this.$message.warning("请先完成保存");
						return;
					}
				}

				this.projectPerson.insertOrUpdate = false;
				this.$set(this.projectPersonList[$index], 'editing', true)
				this.projectPerson.tempDate.EMP_NAME_ = row.EMP_NAME_;
				this.projectPerson.tempDate.EMP_ID_ = row.EMP_ID_;
			},
			// 保存
			_insertProjectPerson(index, row) {
				//localStorage.setItem('tempList', JSON.stringify(this.tempList))
				if (row.PROJECT_PERSON_ID_ == '') {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'insertProjectPerson.do',
						data: {
							PROJECT_ID_: that.projectPerson.PROJECT_ID_,
							EMP_ID_: that.projectPersonList[index].EMP_ID_,
							PROJECT_ROLE_: row.PROJECT_ROLE_
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
						let projectPerson = res.data.projectPerson;
						that.$set(that.projectPersonList[index], 'editing', false);
						that.$set(that.projectPersonList[index], 'PROJECT_PERSON_ID_', projectPerson.PROJECT_PERSON_ID_);
						that.$set(that.projectPersonList[index], 'EMP_ID_', projectPerson.EMP_ID_);
						that.$set(that.projectPersonList[index], 'PROJECT_ID_', projectPerson.PROJECT_ID_);
						that.$set(that.projectPersonList[index], 'PROJECT_ROLE_', projectPerson.PROJECT_ROLE_);
						that.$set(that.projectPersonList[index], 'ENABLE_DATE_', projectPerson.ENABLE_DATE_);
						that.$set(that.projectPersonList[index], 'DISABLE_DATE_', projectPerson.DISABLE_DATE_);
						that.$set(that.projectPersonList[index], 'STATUS_', projectPerson.STATUS_);
						that.$set(that.projectPersonList[index], 'EMP_NAME_', projectPerson.EMP_NAME_);
						that.$set(that.projectPersonList[index], 'PROJECT_ROLE_NAME_', that.projectRoleCodeMapList[projectPerson.PROJECT_ROLE_]);
						//this._selectProjectPerson(this.projectPerson.tempDate.PROJECT_ID_);

						that.$message.success("添加成功");
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				} else {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'updateProjectPerson.do',
						data: {
							PROJECT_PERSON_ID_: row.PROJECT_PERSON_ID_,
							EMP_ID_: row.EMP_ID_,
							PROJECT_ROLE_: row.PROJECT_ROLE_
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
						let projectPerson = res.data.projectPerson;
						that.$set(that.projectPersonList[index], 'editing', false);
						that.$set(that.projectPersonList[index], 'PROJECT_PERSON_ID_', projectPerson.PROJECT_PERSON_ID_);
						that.$set(that.projectPersonList[index], 'EMP_ID_', projectPerson.EMP_ID_);
						that.$set(that.projectPersonList[index], 'PROJECT_ID_', projectPerson.PROJECT_ID_);
						that.$set(that.projectPersonList[index], 'PROJECT_ROLE_', projectPerson.PROJECT_ROLE_);
						that.$set(that.projectPersonList[index], 'ENABLE_DATE_', projectPerson.ENABLE_DATE_);
						that.$set(that.projectPersonList[index], 'DISABLE_DATE_', projectPerson.DISABLE_DATE_);
						that.$set(that.projectPersonList[index], 'STATUS_', projectPerson.STATUS_);
						that.$set(that.projectPersonList[index], 'EMP_NAME_', projectPerson.EMP_NAME_);
						that.$set(that.projectPersonList[index], 'PROJECT_ROLE_NAME_', that.projectRoleCodeMapList[projectPerson.PROJECT_ROLE_]);
						//this._selectProjectPerson(this.projectPerson.tempDate.PROJECT_ID_);

						that.$message.success("修改成功");
					}).catch(function (err) {
						that.$message.error('操作失败请重试')
					})
				}


			},
			// 取消
			_cancelProjectPerson(index, row) {
				this.$set(this.projectPersonList[index], 'editing', false);
				if (this.projectPerson.insertOrUpdate) {
					this.projectPersonList.splice(index, 1);
				} else {
					this.projectPersonList[index].EMP_ID_ = this.projectPerson.tempDate.EMP_ID_;
					this.projectPersonList[index].EMP_NAME_ = this.projectPerson.tempDate.EMP_NAME_;
				}
			},
			// 删除
			_deleteProjectPerson(index, row) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'deleteProjectPerson.do',
					data: {
						PROJECT_PERSON_ID_: row.PROJECT_PERSON_ID_
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
						that.projectPersonList.splice(index, 1);
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('删除失败请重试')
				})
			},
			setPath(field, value) {
				var path = this.$route.path,
					query = Object.assign({}, this.$route.query);
				if (typeof field === 'object') {
					query = field;
				} else {
					query[field] = value;
				}
				this.$router.push({
					path,
					query
				});
			},
			getList({
						page,
						page_size,
						where,
						fun
					} = {}) {
				this.multipleSelection = [];
				this.numbers = [];
				this.BUTTON_STATUS.preUpdateProject = true;
				this.BUTTON_STATUS.manageProjectReq = true;
				this.BUTTON_STATUS.manageProjectDesign = true;
				this.BUTTON_STATUS.manageProjectPerson = true;
				this.BUTTON_STATUS.manageModule = true;
				this.BUTTON_STATUS.deleteProject = true;
				this.BUTTON_STATUS.completeProject = true;


				this.mainloading = true;
				var query = this.$route.query;
				this.paginations.page_index = page || parseInt(query.page) || 1;
				this.paginations.page_size = page_size || parseInt(query.page_size) || this.paginations.page_size;
				var data = {
					pageIndex: this.paginations.page_index,
					pageSize: this.paginations.page_size
				};
				if (where) {
					data = Object.assign(data, where || {});
				}

				let that = this;
				axios({
					method: 'POST',
					//url: this.baseUrl + 'selectProject.do',
					url: this.baseUrl + 'selectProject.do',
					data: {
						PROJECT_CODE_: this.project_Query_Date.PROJECT_CODE_,
						PROJECT_NAME_: this.project_Query_Date.PROJECT_NAME_,
						limit: this.paginations.page_size,
						page: this.paginations.page_index
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
					that.paginations.total = res.data.total;
					that.tableData = [];

					let projectList = res.data.projectList;

					for (let i = 0; i < projectList.length; i++) {
						const tableItem = {
							sortnum: that.sortnum + (i + 1),
							PROJECT_ID_: projectList[i].PROJECT_ID_,
							PROJECT_CODE_: projectList[i].PROJECT_CODE_,
							PROJECT_NAME_: projectList[i].PROJECT_NAME_,
							PROJECT_TYPE_CODE_: projectList[i].PROJECT_TYPE_CODE_,
							DRAFT_DATE_: dtime(projectList[i].DRAFT_DATE_).format('YYYY-MM-DD '),
							HOURS_ : projectList[i].HOURS_,
							MEMO_: projectList[i].MEMO_,
							STATUS_: projectList[i].STATUS_,
                            STATUS_DESC_ : that.projectStatusCodeMapList[projectList[i].STATUS_],
							_async_label: that.projectTypeCodeMapList[projectList[i].PROJECT_TYPE_CODE_]
						};
						that.tableData.push(tableItem);
					}
					that.mainloading = false;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('操作失败请重试')
					that.mainloading = false;
				})
			},
			_manageProjectReq() {
				this.projectReq.show = true;
				this.projectReq.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_req_ref.projectReqForm.PROJECT_ID_ = this.multipleSelection[0].PROJECT_ID_;
					this.$refs.project_req_ref.getList();
				})
			},
			//管理设计
			_manageProjectDesign() {
				this.projectDesign.show = true;
				this.projectDesign.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_design_ref.riderForm.ID_ = this.multipleSelection[0].PROJECT_ID_;
					this.$refs.project_design_ref.riderForm.TYPE_ = 'DESIGN';
					this.$refs.project_design_ref.getList();
				})
			},
			// 操作方法

			_manageProjectPerson(row) {
				this.manageProjectPersonDialog.show = true;
				this.projectPerson.PROJECT_ID_ = this.multipleSelection[0].PROJECT_ID_;
				this._selectProjectPerson(this.multipleSelection[0].PROJECT_ID_);
			},

			_selectProjectPerson(PROJECT_ID_) {
				let that = this;
				that.manageProjectPersonDialog.mppLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectPerson.do',
					data: {
						PROJECT_ID_: PROJECT_ID_,
						STATUS_: '1'
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
						that.projectPersonList = [];
						let projectPersonListTemp = res.data.projectPersonList;

						for (let i = 0; i < projectPersonListTemp.length; i++) {
							const tableItem = {
								PROJECT_PERSON_ID_: projectPersonListTemp[i].PROJECT_PERSON_ID_,
								PROJECT_ID_: projectPersonListTemp[i].PROJECT_ID_,
								EMP_ID_: projectPersonListTemp[i].EMP_ID_,
								PROJECT_ROLE_: projectPersonListTemp[i].PROJECT_ROLE_,
								EMP_NAME_: projectPersonListTemp[i].EMP_NAME_,
								PROJECT_ROLE_NAME_: that.projectRoleCodeMapList[projectPersonListTemp[i].PROJECT_ROLE_],
								isSet: false
							}
							that.projectPersonList.push(tableItem);
						}
					} else {
						that.$message.error(res.data.message);
					}

					that.manageProjectPersonDialog.mppLoading = false;
				}).catch(function (err) {
					that.manageProjectPersonDialog.mppLoading = false;
					that.$message.error('系统错误请联系管理员')
				})
			},
			_preUpdateProject() {
				this.updateDialog.show = true;
				this.updateDiagloading = true;

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadProject.do?PROJECT_ID_=' + this.multipleSelection[0].PROJECT_ID_ + ''
				).then(function (res) {
					if (res.data.success == true) {
						let project = res.data.project;

						that.updateForm.PROJECT_ID_ = project.PROJECT_ID_;
						that.updateForm.PROJECT_CODE_ = project.PROJECT_CODE_;
						that.updateForm.PROJECT_NAME_ = project.PROJECT_NAME_;
						that.updateForm.PROJECT_TYPE_CODE_ = project.PROJECT_TYPE_CODE_;
						that.updateForm.MEMO_ = project.MEMO_;

						that.updateDiagloading = false;
					} else {
						/*请求失败*/
						that.$message.error('加载失败请联系韩澎');
						that.updateDiagloading = false;
					}

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎');
					that.updateDiagloading = false;
				});
			},
			_deleteProject() {
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.mainloading = true;
					let PROJECT_ID_LIST = [];
					for (let i = 0; i < this.multipleSelection.length; i++) {
						PROJECT_ID_LIST.push(this.multipleSelection[i].PROJECT_ID_);
					}

					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteProject.do',
						data: {
							PROJECT_ID_LIST: PROJECT_ID_LIST
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

							that.getList();
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						that.$message.error('删除失败请重试')
						that.mainloading = false;
					})
				});
			},
			_completeProject(){
				let PROJECT_ID_LIST = [];
				for(let i = 0; i<this.multipleSelection.length; i++){
					PROJECT_ID_LIST.push(this.multipleSelection[i].PROJECT_ID_);
				}

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'completeProject.do',
					data: {
						PROJECT_ID_LIST: PROJECT_ID_LIST
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
					that.$message.success('操作成功');



					that.getList();
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员')
				})
            },
			onDelete(row) {
				//根据id来删除数据
				let that = this;

				let data = {
					weekWorkId: row.weekWorkId
				}
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteWeekWork.do',
						data: {
							WEEK_WORK_ID_: row.weekWorkId
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
						that.$message('删除成功'),
							that.getList({
								fun: () => {
								}
							});
					}).catch(function (err) {
						/*请求失败*/
						that.$message.error('删除失败请重试')
					})
				})


			},
			preInsertProject() {
				this.insertDialog.show = true;
			},
			// 每页多少条切换
			handleSizeChange(page_size) {
				this.getList({
					page_size,
					fun: () => {
						this.setPath('page_size', page_size);
					}
				});
			},
			// 上下分页
			handleCurrentChange(page) {
				this.sortnum = this.paginations.page_size * (page - 1);
				this.getList({
					page,
					fun: () => {
						this.setPath('page', page);
					}
				});
			},
			//新增项目
			insertProject(data) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'insertProject.do',
					data: {
						PROJECT_CODE_: data.PROJECT_CODE_,
						PROJECT_NAME_: data.PROJECT_NAME_,
						MEMO_: data.MEMO_
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
					that.form.weekWorkId = res.data.weekWork.WEEK_WORK_ID_;
					that.$message('新增成功'),
						//that.openDisabled = false;
						that.paginations.total = data.count;
					that.getList({
						fun: () => {
						}
					});
					that.dialog.show = true;

				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('新增失败请重试')
				})
			},
			_insertProject(form) {
				this.$refs[form].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[form];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'insertProject.do',
							data: {
								PROJECT_CODE_: formData['PROJECT_CODE_'],
								PROJECT_NAME_: formData['PROJECT_NAME_'],
								PROJECT_TYPE_CODE_: formData['PROJECT_TYPE_CODE_'],
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
							that.$message.success('新增成功');
							let project = res.data.project;
							let tempProject = {};
							for (let key in project) {//装载被修改数据到页面
								tempProject[key] = project[key];
							}
							tempProject['_async_label'] = that.projectTypeCodeMapList[project.PROJECT_TYPE_CODE_];
							tempProject['STATUS_DESC_'] = that.projectStatusCodeMapList[project.STATUS_];

							that.tableData.push(tempProject);
							that.insertDialog.show = false;

						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('新增失败请重试');
						})

					}
				})
			},
			_updateProject(updateForm) {
				this.$refs[updateForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[updateForm];
						let that = this;
						axios({
							method: 'POST',
							header: '',
							url: this.baseUrl + 'updateProject.do',
							data: {
								PROJECT_ID_: formData['PROJECT_ID_'],
								PROJECT_CODE_: formData['PROJECT_CODE_'],
								PROJECT_NAME_: formData['PROJECT_NAME_'],
								PROJECT_TYPE_CODE_: formData['PROJECT_TYPE_CODE_'],
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
								that.$message.success('成功');
								let project = res.data.project;

								for (let key in project) {//装载被修改数据到页面
									(that.tableData[that.numbers[0]][key] != null) ? that.tableData[that.numbers[0]][key] = project[key] : '';
									//给选中的那条数据改值,防止错误,谨慎!!
									(that.multipleSelection[0][key] != null) ? that.multipleSelection[0][key] = project[key] : '';
								}
								that.tableData[that.numbers[0]]._async_label = that.projectTypeCodeMapList[project.PROJECT_TYPE_CODE_];
                                //
								// that.getList({
								// 	fun: () => {
								// 	}
								// });
							} else {
								that.$message.error(res.data.message);
							}
							that.updateDialog.show = false;

						}).catch(function (err) {
							/*请求失败*/
							that.$message.error('系统错误请联系管理员');
						})

					}
				})
			},
			//项目的增加与修改
			_preSubmitProject(form) {
				this.$refs[form].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[form];
						let data = {};

						data.PROJECT_ID_ = formData['PROJECT_ID_'];
						data.PROJECT_CODE_ = formData['PROJECT_CODE_'];
						data.PROJECT_NAME_ = formData['PROJECT_NAME_'];
						data.PROJECT_TYPE_CODE_ = formData['PROJECT_TYPE_CODE_'];
						data.MEMO_ = formData['MEMO_'];
						if (formData['PROJECT_ID_'] != "") {
							this.editWeekWork(data)
						} else {
							this.insertProject(data)
						}

					}
				})
			},
			//周工作内容的增加与修改
			onWeekWorkContentSubmit(weekWorkContentForm) {
				this.$refs[weekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[weekWorkContentForm].weekWorkContentList;

						let serialList = new Array();
						let projectCodeList = new Array();
						let projectNameList = new Array();
						let progressList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let contentList = new Array();
						let memoList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							projectCodeList.push(formData[i].projectCode);
							projectNameList.push(formData[i].projectName);
							progressList.push(formData[i].progress);
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList.push(null);
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList.push(null);
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							contentList.push(formData[i].content);
							memoList.push(formData[i].memo);
						}
						this.editWeekWorkContent(this.form.weekWorkId, serialList, projectCodeList, projectNameList, progressList, startDateList, endDateList, contentList, memoList)

					}
				})
			},
			editWeekWorkContent(weekWorkId, serialList, projectCodeList, projectNameList, progressList, startDateList, endDateList, contentList, memoList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkContentNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
						SERIAL_LIST: serialList,
						PROJECT_CODE_LIST: projectCodeList,
						PROJECT_NAME_LIST: projectNameList,
						PROGRESS_LIST: progressList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						CONTENT_LIST: contentList,
						MEMO_LIST: memoList
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
					that.$message('保存成功'),
						that.getList({
							fun: () => {
							}
						});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//下周工作内容的增加与修改
			onNextWeekWorkContentSubmit(nextWeekWorkContentForm) {
				this.$refs[nextWeekWorkContentForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[nextWeekWorkContentForm].nextWeekWorkContentList;

						let serialList = new Array();
						let projectNameList = new Array();
						let modularList = new Array();
						let taskList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let currentProgressList = new Array();
						let targetProgressList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							projectNameList.push(formData[i].projectName);
							modularList.push(formData[i].modular);
							taskList.push(formData[i].task)
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							currentProgressList.push(formData[i].currentProgress);
							targetProgressList.push(formData[i].targetProgress);
						}

						this.editNextWeekWorkContent(this.form.weekWorkId, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList)

					}
				})
			},
			editNextWeekWorkContent(weekWorkId, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateNextWeekWorkContentNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
						SERIAL_LIST: serialList,
						PROJECT_NAME_LIST: projectNameList,
						MODULAR_LIST: modularList,
						TASK_LIST: taskList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						CURRENT_PROGRESS_LIST: currentProgressList,
						TARGET_PROGRESS_LIST: targetProgressList
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
					that.$message('保存成功'),
						that.getList({
							fun: () => {
							}
						});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//上级交办的其他工作的增加与修改
			onWeekWorkOtherSubmit(weekWorkOtherForm) {
				this.$refs[weekWorkOtherForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[weekWorkOtherForm].weekWorkOtherList;

						let serialList = new Array();
						let todoWorkList = new Array();
						let progressList = new Array();
						let otherParticipantList = new Array();
						let startDateList = new Array();
						let endDateList = new Array();
						let participationMattersList = new Array();
						let memoList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							todoWorkList.push(formData[i].todoWork);
							progressList.push(formData[i].progress);
							otherParticipantList.push(formData[i].otherParticipant)
							if (mutils.isEmpty(formData[i].startDate)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].startDate))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].endDate)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].endDate)));
							}
							participationMattersList.push(formData[i].participationMatters);
							memoList.push(formData[i].memo);
						}

						this.editWeekWorkOther(this.form.weekWorkId, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList)

					}
				})
			},
			editWeekWorkOther(weekWorkId, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkOtherNew.do',
					data: {
						WEEK_WORK_ID_: weekWorkId,
						TODO_WORK_LIST: todoWorkList,
						SERIAL_LIST: serialList,
						PROGRESS_LIST: progressList,
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						OTHER_PARTICIPANT_LIST: otherParticipantList,
						PARTICIPATION_MATTERS_LIST: participationMattersList,
						MEMO_LIST: memoList
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
					that.$message('保存成功'),
						that.getList({
							fun: () => {
							}
						});
					that.dialog.show = true;
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//筛选
			selectProject() {
				this.getList();
			},
			_closeProjectReq() {
				this.projectReq.dialogVisible = false;
			},
            _closeProjectDesign() {
				this.projectDesign.dialogVisible = false;
			},
            _closeProjectPersonAllot(){
				this.projectPersonAllot.dialogVisible = false;
            },
			//管理模块
			_manageProjectPersonAllot(){
				this.projectPersonAllot.show = true;
				this.projectPersonAllot.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.project_person_allot_ref.projectPersonAllotForm.PROJECT_ID_ = this.multipleSelection[0].PROJECT_ID_;
					this.$refs.project_person_allot_ref._selectProject();
				})
			},
			projectCellStyle(row, column, rowIndex, columnIndex){
				if(row.column.label == `状态`){
					if(row.row.STATUS_ == `9`){
						return `background : #67C23A`
                    }else{
						return `background : pink`
                    }
                }
            }
		}
	}
</script>

<style lang="less" scoped>
    .btnRight {
        float: right;
        margin-right: 0px !important;
    }

    .search-form {
        width: 100%;
        min-width: 750px;
        .el-form-item {
            margin-bottom: 10px !important;
            .el-date-editor {
                width: 200px;
                .el-input__inner {
                    height: 36px !important;
                }
            }
        }
    }

    .el-dialog--small {
        width: 600px !important;
    }

    .pagination {
        text-align: left;
        margin-top: 10px;
    }

    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }

    .el-col {
        border-radius: 4px;
    }

    .bg-purple-dark {
        background: #99a9bf;
    }

    .bg-purple {
        background: #d3dce6;
    }

    .bg-purple-light {
        background: #e5e9f2;
    }

    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }

    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }

</style>


