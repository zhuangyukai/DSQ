<template>
    <div class="fillcontain">
        <div class="search_container">
            <el-form
                    :inline="true"
                    :model='search_data'
                    ref="search_data"
                    class="demo-form-inline search-form">

                <el-form-item>
                    <el-date-picker
                            v-model="search_data.startDate"
                            type="date"
                            placeholder="选择开始时间">
                    </el-date-picker>
                    --
                    <el-date-picker
                            v-model="search_data.endDate"
                            type="date"
                            placeholder="选择结束时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item>
                    <el-button type="primary" size="mini" icon="search" @click='selectDeptWeekWork("search_data")'>筛选
                    </el-button>
                </el-form-item>

                <el-form-item class="btnRight">
                    <el-button type="primary" size="mini" icon="view" @click='onAdd()'>添加</el-button>
                </el-form-item>

            </el-form>
        </div>
        <div class="table_container">
            <el-table
                    v-loading="mainloading"
                    :data="tableData"
                    :style="tableStyle"
                    :height="tableStyle.height"
                    align='center'
                    ref="weekWorkGridRef">
                <el-table-column
                        v-if="idFlag"
                        prop="WEEK_WORK_ID_"
                        label="周工作报告ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="weekWorkContentId"
                        label="周工作内容ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="nextWeekWorkContentId"
                        label="下周工作内容ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        v-if="idFlag"
                        prop="weekWorkOtherId"
                        label="上级交办的其他工作ID"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="DEPT_NAME_"
                        label="部门名称"
                        align='center'
                        width="220">
                </el-table-column>
                <el-table-column
                        prop="DEPT_MANAGER_NAME_"
                        label="部门负责人"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="WEEK_START_DATE_"
                        label="本周开始时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_START_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WEEK_END_DATE_"
                        label="本周结束时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.WEEK_END_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="WEEK_"
                        label="年周数"
                        align='center'
                        width="150">
                </el-table-column>
                <el-table-column
                        prop="DRAFTOR_NAME_"
                        label="起草人姓名"
                        align='center'
                        width="180">
                </el-table-column>
                <el-table-column
                        prop="WEEK_END_DATE_"
                        label="本周结束时间"
                        align='center'
                        width="250"
                        sortable>
                    <template slot-scope="scope">
                        <el-icon name="time"></el-icon>
                        <span style="margin-left: 10px;color:#66ccff">{{ scope.row.DRAFT_DATE_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="180">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='onEdit(scope.row)'
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='onDelete(scope.row,scope.$index)'
                        >删除
                        </el-button>
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
                :title="dialog.title"
                :visible.sync="dialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
        >
            <div class="form">
                <el-form
                        ref="form"
                        :model="form"
                        :label-width="dialog.formLabelWidth"
                        style="margin:10px;width:auto;"
                        v-loading="diagloading"
                >
                    <el-tabs v-model="activeName" type="card">
                        <el-tab-pane label="周工作报告" name="weekWork">
                            <el-form-item prop='WEEK_WORK_ID_' label="周工作报告id:" v-if="idFlag">
                                <el-input type="WEEK_WORK_ID_" v-model="form.WEEK_WORK_ID_"></el-input>
                            </el-form-item>
                            <el-form-item prop='DEPT_NAME_' label="部门:"
                                          :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                <el-input type="DEPT_NAME_" v-model="form.DEPT_NAME_"></el-input>
                            </el-form-item>

                            <el-form-item prop='DEPT_MANAGER_NAME_' label="部门负责人:"
                                          :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                <el-input type="DEPT_MANAGER_NAME_" v-model="form.DEPT_MANAGER_NAME_"></el-input>
                            </el-form-item>

                            <el-form-item prop='POSI_NAME_' label="岗位名称:"
                                          :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                <el-input type="POSI_NAME_" v-model="form.POSI_NAME_"></el-input>
                            </el-form-item>

                            <el-form-item prop='WEEK_' label="本周时间:" label-width="13.3%"
                                          :rules="[{ required: true, message: '请选择那一周' ,trigger: 'blur' }]">
                                <el-date-picker
                                        v-model="form.WEEK_"
                                        type="week"
                                        name="WEEK_"
                                        format="yyyy 第 WW 周"
                                        placeholder="选择周"
                                        @change="onChangeWeek"
                                >
                                </el-date-picker>
                                <span style="color: #BEBEBE; font-size: 12px">周一{{form.WEEK_START_DATE_}}  至  周日{{form.WEEK_END_DATE_}}</span>
                            </el-form-item>

                            <el-form-item prop='WEEK_START_DATE_' label="本周开始时间:" style="display: none">
                                <el-date-picker type="date" value-format="yyyy-MM-dd"
                                                v-model.date="form.WEEK_START_DATE_"
                                                :picker-options="pickerStartDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='WEEK_END_DATE_' label="本周结束时间:" style="display: none">
                                <el-date-picker type="date" value-format="yyyy-MM-dd" v-model.date="form.WEEK_END_DATE_"
                                                :picker-options="pickerEndDate"></el-date-picker>
                            </el-form-item>

                            <el-form-item prop='DEPT_RESP_' label="部门职能:"
                                          :rules="[{ min: 0, max: 120, message: '不能超出120个字符', trigger: 'blur' }]">
                                <el-input type="textarea" v-model="form.DEPT_RESP_"></el-input>
                            </el-form-item>

                            <el-form-item prop='DEPT_WORK_' label="部门工作综述:"
                                          :rules="[{ min: 0, max: 120, message: '不能超出120个字符', trigger: 'blur' }]">
                                <el-input type="textarea" v-model="form.DEPT_WORK_"></el-input>
                            </el-form-item>

                            <el-form-item prop='DEPT_TARGET_' label="部门产值目标:"
                                          :rules="[{ min: 0, max: 120, message: '不能超出120个字符', trigger: 'blur' }]">
                                <el-input type="textarea" v-model="form.DEPT_TARGET_"></el-input>
                            </el-form-item>

                            <el-form-item class="text_right">
                                <el-button @click="dialog.show = false">关闭</el-button>
                                <el-button type="primary" @click='onWeekWorkSubmit("form")'>保存</el-button>
                            </el-form-item>
                        </el-tab-pane>

                        <el-tab-pane label="工作情况及考评" name="deptWeekWorkPersonEval" :disabled="openDisabled">
                            <el-form class="deptWeekWorkPersonEvalForm" :model="deptWeekWorkPersonEvalForm"
                                     :inline="true"
                                     ref="deptWeekWorkPersonEvalForm">
                                <el-row v-for="(item,index) in deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList"
                                        :key="index">
                                    <el-form-item label="人员名称" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.EMP_NAME_'"
                                                  :rules="[{ required: true, message: '人员不能为空' ,trigger: 'change' }, { min: 0, max: 20, message: '不能超出20个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.EMP_NAME_"
                                                  @focus="_preChooseDeptWeekWorkPersonEvalPerson(index)"
                                                  style="width:175px"
                                                  readonly
                                                  placeholder="请选择人员"></el-input>
                                    </el-form-item>
                                    <el-form-item label="产值目标" label-width="90px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.TARGET_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TARGET_" style="width: 175px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="目标完成情况" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.TARGET_COMPLETION_STATUS_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TARGET_COMPLETION_STATUS_"
                                                  style="width: 182px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="综合素质评价" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.COMPREHENSIVE_QUALITY_EVAL_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.COMPREHENSIVE_QUALITY_EVAL_"
                                                  placeholder="选项:有待改进;一般;较好;很好;指出需要改进之处"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="技术能力" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.TECHNOLOGICAL_CAPABILITY_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TECHNOLOGICAL_CAPABILITY_"
                                                  placeholder="选项:有待改进;一般;较好;很好;指出需要改进之处"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="业务能力" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.PROFESSIONAL_CAPABILITY_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROFESSIONAL_CAPABILITY_"
                                                  placeholder="选项:有待改进;一般;较好;很好;指出需要改进之处"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="总体评价结果" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.GENERAL_EVALUATION_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.GENERAL_EVALUATION_"
                                                  placeholder="选项:有待改进;一般;较好;很好;指出需要改进之处"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="主要工作内容" label-width="100px"
                                                  :prop="'deptWeekWorkPersonEvalList.' + index + '.WORK_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input type="textarea" v-model="item.WORK_"
                                                  style="width: 750px"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" @click="removeWeekWorkContentRow(index)"
                                               style="margin-left: 795px; margin-top: -10px; margin-bottom: 4px">移除
                                    </el-button>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addWeekWorkContentRow" style="float:left; margin-top: 4px">新增
                                    </el-button>
                                    <el-form-item style="float: left;margin-top: 4px; margin-left: 668px">
                                        <el-button @click="dialog.show = false">关闭</el-button>
                                        <el-button type="primary"
                                                   @click='onWeekWorkContentSubmit("deptWeekWorkPersonEvalForm")'>保存
                                        </el-button>
                                    </el-form-item>
                                </el-row>

                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="项目情况" name="deptWeekWorkProject" :disabled="openDisabled">
                            <el-form class="deptWeekWorkProjectForm" :model="deptWeekWorkProjectForm" :inline="true"
                                     ref="deptWeekWorkProjectForm">
                                <el-row v-for="(item,index) in deptWeekWorkProjectForm.deptWeekWorkProjectList"
                                        :key="index">
                                    <el-form-item label="项目名称" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PROJECT_NAME_'"
                                                  :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }, { min: 1, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROJECT_NAME_"
                                                  @focus="_preChooseDeptWeekWorkProject(index)"
                                                  style="width:180px"
                                                  readonly
                                                  placeholder="请选择项目"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目负责人" label-width="100px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PROJECT_LEADER_'"
                                                  :rules="[{ min: 0, max: 20, message: '不能超出20个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROJECT_LEADER_"
                                                  @focus="_preChooseDeptWeekWorkPersonEvalLeader(index)"
                                                  style="width:175px"
                                                  readonly
                                                  placeholder="请选择项目负责人"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="开始时间" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.START_DATE_'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="计划完成时间" label-width="100px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PLAN_END_DATE_'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd"
                                                        v-model="item.PLAN_END_DATE_"
                                                        style="width: 176px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="实际完成时间" label-width="98px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.END_DATE_'">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                        style="width: 178px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="参与开发人员" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PARTICIPANT_'"
                                                  :rules="[{ min: 0, max: 1000, message: '不能超出1000个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PARTICIPANT_"
                                                  style="width:700px"
                                                  placeholder="请选择参与开发人员"></el-input>
                                        <el-button type="primary"  @click="_preChooseDeptWeekWorkPersonEvalParticipant(index)"
                                                   >选择
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item label="项目进度及情况" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PROCESS_'"
                                                  :rules="[{ min: 0, max: 1000, message: '不能超出1000个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROCESS_" style="width: 760px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="项目问题描述" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.MEMO_'"
                                                  :rules="[{ min: 0, max: 1000, message: '不能超出1000个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.MEMO_" style="width: 760px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="项目总体评价" label-width="110px"
                                                  :prop="'deptWeekWorkProjectList.' + index + '.PROJECT_EVAL_'"
                                                  :rules="[{ min: 0, max: 1000, message: '不能超出1000个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROJECT_EVAL_" style="width: 760px"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" @click="removeDeptWeekWorkProjectRow(index)"
                                               style="margin-left: 815px; margin-top: -10px; margin-bottom: 4px">移除
                                    </el-button>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addDeptWeekWorkProjectRow"
                                               style="float: left;margin-top: 4px">新增
                                    </el-button>

                                    <el-form-item style="float: left;margin-top: 4px; margin-left: 688px">
                                        <el-button @click="dialog.show = false">关闭</el-button>
                                        <el-button type="primary"
                                                   @click='onDeptWeekWorkProjectFormSubmit("deptWeekWorkProjectForm")'>保
                                            存
                                        </el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="下周工作内容" name="nextWeekWorkContent" :disabled="openDisabled">
                            <el-form class="nextWeekWorkContentForm" :model="nextWeekWorkContentForm" :inline="true"
                                     ref="nextWeekWorkContentForm">
                                <el-row v-for="(item,index) in nextWeekWorkContentForm.nextWeekWorkContentList"
                                        :key="index">
                                    <el-form-item label="项目名称"
                                                  :prop="'nextWeekWorkContentList.' + index + '.PROJECT_NAME_'"
                                                  :rules="[{ required: true, message: '项目名称不能为空' ,trigger: 'change' }, { min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROJECT_NAME_"
                                                  @focus="_preChooseNextWeekWorkContentProject(index)"
                                                  style="width:180px"
                                                  readonly
                                                  placeholder="请选择项目"></el-input>
                                    </el-form-item>
                                    <el-table-column
                                            :prop="'nextWeekWorkContentList.' + index + '.PROJECT_ID_'"
                                            style="display: none"
                                            label="项目ID"
                                            align='center'
                                            width="200"
                                            sortable>
                                    </el-table-column>
                                    <el-form-item label="功能模块" :prop="'nextWeekWorkContentList.' + index + '.MODULAR_'"
                                                  :rules="[{ required: true, message: '功能模块不能为空' ,trigger: 'change' }]">
                                        <el-input v-model="item.MODULAR_"
                                                  @focus="_preChooseNextWeekWorkContentModule(index)"
                                                  style="width:180px"
                                                  readonly
                                                  placeholder="请选择项目"></el-input>
                                    </el-form-item>
                                    <el-table-column
                                            :prop="'nextWeekWorkContentList.' + index + '.MODULE_ID_'"
                                            style="display: none"
                                            label="模块ID"
                                            align='center'
                                            width="200"
                                            sortable>
                                    </el-table-column>
                                    <el-form-item label="任务" :prop="'nextWeekWorkContentList.' + index + '.TASK_'"
                                                  :rules="[{ required: true, message: '任务不能为空' ,trigger: 'change' }, { min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TASK_" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间"
                                                  :prop="'nextWeekWorkContentList.' + index + '.START_DATE_'"
                                                  :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" :prop="'nextWeekWorkContentList.' + index + '.END_DATE_'"
                                                  :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目前进度" label-width="79px"
                                                  :prop="'nextWeekWorkContentList.' + index + '.CURRENT_PROGRESS_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.CURRENT_PROGRESS_" style="width: 791px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="目标进度" label-width="79px"
                                                  :prop="'nextWeekWorkContentList.' + index + '.TARGET_PROGRESS_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TARGET_PROGRESS_" style="width: 791px"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" @click="removeNextWeekWorkContentRow(index)"
                                               style="margin-left: 815px; margin-top: -10px; margin-bottom: 4px">移除
                                    </el-button>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addNextWeekWorkContentRow"
                                               style="float: left;margin-top: 4px">新增
                                    </el-button>

                                    <el-form-item style="float: left; margin-top: 4px; margin-left: 689px">
                                        <el-button @click="dialog.show = false">关闭</el-button>
                                        <el-button type="primary"
                                                   @click='onNextWeekWorkContentSubmit("nextWeekWorkContentForm")'>保存
                                        </el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                        <el-tab-pane label="上级交办的其他工作" name="weekWorkOther" :disabled="openDisabled">
                            <el-form class="weekWorkOtherForm" :model="weekWorkOtherForm" :inline="true"
                                     ref="weekWorkOtherForm">
                                <el-row v-for="(item,index) in weekWorkOtherForm.weekWorkOtherList" :key="index">
                                    <el-form-item label="代办事项" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.TODO_WORK_'"
                                                  :rules="[{ min: 0, max: 40, message: '不能超出40个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.TODO_WORK_" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="进展情况" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.PROGRESS_'"
                                                  :rules="[{ min: 0, max: 20, message: '不能超出20个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.PROGRESS_" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="其他参与人" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.OTHER_PARTICIPANT_'"
                                                  :rules="[{ min: 0, max: 20, message: '不能超出20个字符', trigger: 'blur' }]">
                                        <el-input v-model="item.OTHER_PARTICIPANT_" style="width: 180px"></el-input>
                                    </el-form-item>
                                    <el-form-item label="开始时间" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.START_DATE_'"
                                                  :rules="[{ required: true, message: '开始时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.START_DATE_"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="结束时间" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.END_DATE_'"
                                                  :rules="[{ required: true, message: '结束时间不能为空' ,trigger: 'change' }]">
                                        <el-date-picker type="date" value-format="yyyy-MM-dd" v-model="item.END_DATE_"
                                                        style="width: 180px"></el-date-picker>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="参与事项" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.PARTICIPATION_MATTERS_'">
                                        <el-input v-model="item.PARTICIPATION_MATTERS_" style="width: 770px"></el-input>
                                    </el-form-item>
                                    <br/>
                                    <el-form-item label="备注" label-width="100px"
                                                  :prop="'weekWorkOtherList.' + index + '.MEMO_'">
                                        <el-input type="textarea" v-model="item.MEMO_" style="width: 770px"></el-input>
                                    </el-form-item>
                                    <el-button type="primary" @click="removeWeekWorkOtherRow(index)"
                                               style="margin-left: 815px; margin-top: -10px; margin-bottom: 4px">移除
                                    </el-button>
                                    <hr/>
                                </el-row>
                                <el-row>
                                    <el-button type="primary" @click="addWeekWorkOtherRow" style="float: left;margin-top: 4px">新增
                                    </el-button>

                                    <el-form-item style="float: left; margin-top: 4px; margin-left: 688px">
                                        <el-button @click="dialog.show = false">关闭</el-button>
                                        <el-button type="primary"
                                                   @click='onWeekWorkOtherSubmit("weekWorkOtherForm")'>保存
                                        </el-button>
                                    </el-form-item>
                                </el-row>
                            </el-form>
                        </el-tab-pane>

                    </el-tabs>
                </el-form>
            </div>
        </el-dialog>

        <!--工作情况及考评打开人员的窗口-->
        <el-dialog
                :title="choosePersonDialog.title"
                :visible.sync="choosePersonDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="choosePersonDialog.style"
                :width="choosePersonDialog.width"
                @close="closeChoosePersonDialog"
        >
            <template>
                <choosePersonCom ref="choose_Person_ref" v-if="choosePersonDialog.dialogVisible"
                                 @choosePersonListeners="_completeChooseWeekWorkContentPerson">
                </choosePersonCom>
            </template>
        </el-dialog>

        <!--项目情况打开项目-->
        <el-dialog
                :title="chooseProjectDialog.title"
                :visible.sync="chooseProjectDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseProjectDialog.style"
                :width="chooseProjectDialog.width"
                @close="closeChooseProjectDialog"
        >
            <template>
                <chooseProjectCom ref="choose_project_ref" v-if="chooseProjectDialog.dialogVisible"
                                  @chooseProjectListeners="_completeChooseWeekWorkContentProject">
                </chooseProjectCom>
            </template>
        </el-dialog>

        <!-- 项目情况打开负责人 -->
        <el-dialog
                :title="chooseLeaderDialog.title"
                :visible.sync="chooseLeaderDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseLeaderDialog.style"
                :width="chooseLeaderDialog.width"
                @close="closeChooseLeaderDialog"
        >
            <template>
                <choosePersonCom ref="choose_Leader_ref" v-if="chooseLeaderDialog.dialogVisible"
                                 @chooseLeaderListeners="_completeChooseWeekWorkContentLeader">
                </choosePersonCom>
            </template>
        </el-dialog>

        <!-- 项目情况打开开发人 -->
        <el-dialog
                :title="chooseParticipantDialog.title"
                :visible.sync="chooseParticipantDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseParticipantDialog.style"
                :width="chooseParticipantDialog.width"
                @close="closeChooseParticipantDialog"
        >
            <template>
                <choosePersonComCs ref="choose_Participant_ref" v-if="chooseParticipantDialog.dialogVisible"
                                   @chooseParticipantListeners="_completeChooseWeekWorkContentParticipant">
                </choosePersonComCs>
            </template>
        </el-dialog>

        <!--下周选择项目-->
        <el-dialog
                :title="chooseNextProjectDialog.title"
                :visible.sync="chooseNextProjectDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseNextProjectDialog.style"
                :width="chooseNextProjectDialog.width"
                @close="closeChooseNextProjectDialog"
        >
            <template>
                <chooseProjectCom ref="choose_project_ref" v-if="chooseNextProjectDialog.dialogVisible"
                                  @chooseProjectListeners="_completeChooseNextWeekWorkContentProject">
                </chooseProjectCom>
            </template>
        </el-dialog>

        <!--下周选择模块-->
        <el-dialog
                :title="chooseModuleDialog.title"
                :visible.sync="chooseModuleDialog.show"
                :close-on-click-modal='false'
                :close-on-press-escape='false'
                :modal-append-to-body="false"
                :modal="true"
                :style="chooseModuleDialog.style"
                :width="chooseModuleDialog.width"
                @close="closeChooseModuleDialog"
        >
            <template>
                <chooseModuleCom ref="choose_module_ref" v-if="chooseModuleDialog.dialogVisible"
                                 @listeners="_completeChooseNextWeekWorkContentModule">
                </chooseModuleCom>
            </template>
        </el-dialog>

    </div>


</template>

<script>
	import dtime from 'time-formater'
	import * as mutils from 'utils/mUtils'
	//import {axios} from 'utils/'
	import axios from 'axios';
	import choosePersonComCs from '../page/emp/preChooseEmpCS.vue'
	import choosePersonCom from '../page/emp/chooseCurrentPerson.vue'
	import chooseProjectCom from '../page/project/preChooseProject.vue';
	import chooseModuleCom from "../page/module/preChooseModule.vue";

	export default {
		components: {choosePersonCom, choosePersonComCs, chooseProjectCom, chooseModuleCom},
		data() {
			return {
				tableStyle: {
					width: '100%',
					height: window.screen.height / 2 + 200
				},
				diagloading: false,
				mainloading: false,
				tableData: [],
				tableHeight: '',
				idFlag: false,
				sortnum: 0,
				search_data: {
					startDate: '',
					endDate: '',
					startDatePage: '',
					endDatePage: ''
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
				dialog: {
					width: '400px',
					show: false,
					title: '修改周工作报告信息',
					formLabelWidth: '120px'
				},
				tab: {},
				form: {
					selfEvaluation: '',
					proposal: '',
					DEPT_NAME_: '',
					WEEK_START_DATE_: '',
					WEEK_END_DATE_: '',
					WEEK_WORK_ID_: '',
					DRAFT_DATE_: '',
					POSI_NAME_: '',
					POSI_RESP_: '',
					DEPT_RESP_: '',
					DEPT_TARGET_: '',
					DEPT_WORK_: '',
					WEEK_: ''
				},
				item: {
					projectCode: ''
				},
				pickerStartDate: {
					disabledDate: (time) => {
						/*if (this.form.WEEK_END_DATE_ != "") {
							return time.getTime() > Date.now() || time.getTime() > this.form.WEEK_END_DATE_;
						} else {
							return time.getTime() > Date.now();
						}*/

					}
				},
				pickerEndDate: {
					disabledDate: (time) => {
						return time.getTime() < this.form.WEEK_START_DATE_;
						//return time.getTime() > this.form.WEEK_START_DATE_;
					}
				},
				deptWeekWorkPersonEvalForm: {
					deptWeekWorkPersonEvalList: [{
						DEPT_WEEK_WORK_PERSON_EVAL_ID_: '',
						WEEK_WORK_ID_: '',
						EMP_NAME_: '',
						WORK_: '',
						TARGET_: '',
						TARGET_COMPLETION_STATUS_: '',
						COMPREHENSIVE_QUALITY_EVAL_: '',
						TECHNOLOGICAL_CAPABILITY_: '',
						PROFESSIONAL_CAPABILITY_: '',
						GENERAL_EVALUATION_: ''
					}]
				},
				deptWeekWorkProjectForm: {
					deptWeekWorkProjectList: [{
						WEEK_WORK_ID_: '',
						PROJECT_NAME_: '',
						PROJECT_LEADER_: '',
						PARTICIPANT_: '',
						START_DATE_: '',
						PLAN_END_DATE_: '',
						END_DATE_: '',
						PROCESS_: '',
						MEMO_: '',
						PROJECT_EVAL_: ''
					}]
				},
				nextWeekWorkContentForm: {
					nextWeekWorkContentList: [{
						NEXT_WEEK_WORK_CONTENT_ID_: '',
						WEEK_WORK_ID_: '',
						SERIAL_: '',
						PROJECT_NAME_: '',
						MODULAR_: '',
						TASK_: '',
						CURRENT_PROGRESS_: '',
						START_DATE_: '',
						END_DATE_: '',
						TARGET_PROGRESS_: ''
					}]
				},
				weekWorkOtherForm: {
					weekWorkOtherList: [{
						WEEK_WORK_OTHER_ID_: '',
						TODO_WORK_: '',
						PROGRESS_: '',
						START_DATE_: '',
						END_DATE_: '',
						OTHER_PARTICIPANT_: '',
						PARTICIPATION_MATTERS_: '',
						MEMO_: ''
					}]
				},
				deptWeekWork: {},
				deptWeekWorkPersonEvalPersonindex: '',
				//工作情况及考评打开人员的窗口
				choosePersonDialog: {
					width: '400px',
					show: false,
					title: '选择人员',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				deptWeekWorkProjectindex: '',
				//项目情况打开项目的窗口
				chooseProjectDialog: {
					width: '700px',
					show: false,
					title: '选择项目',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				deptWeekWorkPersonEvalLeaderindex: '',
				deptWeekWorkPersonEvalParticipantindex: '',
				nextWeekWorkContentProjectIndex: '',
				//下周工作打开项目的窗口
				chooseNextProjectDialog: {
					width: '700px',
					show: false,
					title: '选择项目',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				nextWeekWorkContentModuleIndex: '',
				//下周工作打开模块的窗口
				chooseModuleDialog: {
					width: '640px',
					show: false,
					title: '选择模块',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				//项目情况负责人窗口
				chooseLeaderDialog: {
					width: '400px',
					show: false,
					title: '选择人员',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
				//项目情况开发人窗口
				chooseParticipantDialog: {
					width: '750px',
					show: false,
					title: '选择人员',
					dialogVisible: true,
					formLabelWidth: '120px'
				},
			}
		},
		mounted() {
			//加载数据之前，先加载theme颜色
			this.getList({
				fun: () => {
				}
			});
		},
		methods: {
			onChangeWeek(date) {
				this.form.WEEK_START_DATE_ = mutils.formatDate(date).substring(0, 10);
				this.form.WEEK_END_DATE_ = mutils.formatDate(new Date(new Date(date).setDate(date.getDate() + 6))).substring(0, 10);
			},
			/**
			 * 改变页码和当前页时需要拼装的路径方法
			 * @param {string} field 参数字段名
			 * @param {string} value 参数字段值
			 */
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

				//let formData = this[search_data];
				let formData = this.search_data;

				let FROM_START_DATE_ = formData['startDatePage'];
				let TO_START_DATE_ = formData['endDatePage'];
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId;
				if (mutils.isEmpty(FROM_START_DATE_)) {
					FROM_START_DATE_ = "";
				} else {
					FROM_START_DATE_ = mutils.formatDate(new Date(FROM_START_DATE_)); // 毫秒数，时间戳
				}
				if (mutils.isEmpty(TO_START_DATE_)) {
					TO_START_DATE_ = "";
				} else {
					TO_START_DATE_ = mutils.formatDate(new Date(TO_START_DATE_));
				}

				// 封装  get,path,params,fn,errfn
				let that = this;
				this.$ajax.post(
					this.baseUrl + 'selectDeptWeekWork.do?FROM_START_DATE_=' + FROM_START_DATE_ + '&TO_START_DATE_=' + TO_START_DATE_ + '&DRAFTOR_ID_=' + EMP_ID_ + '&DEPT_STATUS_=' + '1' + '&limit=' + this.paginations.page_size + '&page=' + this.paginations.page_index + ''
				).then(function (res) {
					if (res.data.success) {
						that.paginations.total = res.data.total;
						that.tableData = [];
						res.data.deptWeekWorkList.forEach((item, index) => {
							const tableItem = {
								sortnum: that.sortnum + (index + 1),
								WEEK_WORK_ID_: item.WEEK_WORK_ID_,
								WEEK_START_DATE_: dtime(item.WEEK_START_DATE_).format('YYYY-MM-DD '),
								WEEK_END_DATE_: dtime(item.WEEK_END_DATE_).format('YYYY-MM-DD '),
								DEPT_NAME_: item.DEPT_NAME_,
								DEPT_MANAGER_NAME_: item.DEPT_MANAGER_NAME_,
								POSI_NAME_: item.POSI_NAME_,
								DRAFTOR_NAME_: item.DRAFTOR_NAME_,
								WEEK_NUM_: item.WEEK_NUM_,
								WEEK_: item.WEEK_,
								DRAFT_DATE_: dtime(item.DRAFT_DATE_).format('YYYY-MM-DD ')
							}
							that.tableData.push(tableItem);

						})
						that.mainloading = false;
					} else {
						that.$message.error(res.data.message);
					}
				})
					.catch(function (res) {
						that.mainloading = false;
					})

			},
			// 操作方法
			onEdit(row) {
				this.diagloading = true;
				this.openDisabled = false;
				this.activeName = 'weekWork';
				this.form = {
					selfEvaluation: '',
					proposal: '',
					DEPT_NAME_: '',
					WEEK_START_DATE_: '',
					WEEK_END_DATE_: '',
					WEEK_WORK_ID_: '',
					posiResp: '',
					DRAFT_DATE_: '',
					POSI_NAME_: '',
					DEPT_RESP_: '',
					DEPT_TARGET_: '',
					DEPT_WORK_: '',
					WEEK_: ''
				},
					this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList = [{
						DEPT_WEEK_WORK_PERSON_EVAL_ID_: '',
						WEEK_WORK_ID_: '',
						EMP_NAME_: '',
						WORK_: '',
						TARGET_: '',
						TARGET_COMPLETION_STATUS_: '',
						COMPREHENSIVE_QUALITY_EVAL_: '',
						TECHNOLOGICAL_CAPABILITY_: '',
						PROFESSIONAL_CAPABILITY_: '',
						GENERAL_EVALUATION_: ''
					}];
				this.deptWeekWorkProjectForm.deptWeekWorkProjectList = [{
					WEEK_WORK_ID_: '',
					PROJECT_NAME_: '',
					PROJECT_LEADER_: '',
					PARTICIPANT_: '',
					START_DATE_: '',
					PLAN_END_DATE_: '',
					END_DATE_: '',
					PROCESS_: '',
					MEMO_: '',
					PROJECT_EVAL_: ''
				}];
				this.nextWeekWorkContentForm.nextWeekWorkContentList = [{
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					WEEK_WORK_ID_: '',
					SERIAL_: '',
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					CURRENT_PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					TARGET_PROGRESS_: ''
				}];

				this.weekWorkOtherForm.weekWorkOtherList = [{
					WEEK_WORK_OTHER_ID_: '',
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: '',
					END_DATE_: '',
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				}];

				let that = this
				//编辑部门工作报告
				this.$ajax.post(
					this.baseUrl + 'selectDeptWeekWorkInforNew.do?WEEK_WORK_ID_=' + row.WEEK_WORK_ID_ + ''
				).then(function (res) {
					if (res.data.success) {
						let deptWeekWork = res.data.deptWeekWorkInforNew.deptWeekWork;
						that.form.WEEK_WORK_ID_ = row.WEEK_WORK_ID_;
						that.form.DEPT_NAME_ = deptWeekWork.DEPT_NAME_;
						that.form.DEPT_MANAGER_NAME_ = deptWeekWork.DEPT_MANAGER_NAME_;
						that.form.POSI_NAME_ = deptWeekWork.POSI_NAME_;
						that.form.WEEK_START_DATE_ = deptWeekWork.WEEK_START_DATE_;
						that.form.WEEK_END_DATE_ = deptWeekWork.WEEK_END_DATE_;
						that.form.DEPT_RESP_ = deptWeekWork.DEPT_RESP_;
						that.form.DEPT_TARGET_ = deptWeekWork.DEPT_TARGET_;
						that.form.DEPT_WORK_ = deptWeekWork.DEPT_WORK_;
						that.form.WEEK_ = deptWeekWork.WEEK_START_DATE_;

						let deptWeekWorkPersonEvalList = res.data.deptWeekWorkInforNew.deptWeekWorkPersonEvalList;
						for (let i = 0; i < deptWeekWorkPersonEvalList.length; i++) {
							if (i != 0) {
								that.addWeekWorkContentRow();
							}
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].EMP_NAME_ = deptWeekWorkPersonEvalList[i].EMP_NAME_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].WORK_ = deptWeekWorkPersonEvalList[i].WORK_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].TARGET_ = deptWeekWorkPersonEvalList[i].TARGET_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].TARGET_COMPLETION_STATUS_ = deptWeekWorkPersonEvalList[i].TARGET_COMPLETION_STATUS_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].COMPREHENSIVE_QUALITY_EVAL_ = deptWeekWorkPersonEvalList[i].COMPREHENSIVE_QUALITY_EVAL_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].TECHNOLOGICAL_CAPABILITY_ = deptWeekWorkPersonEvalList[i].TECHNOLOGICAL_CAPABILITY_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].PROFESSIONAL_CAPABILITY_ = deptWeekWorkPersonEvalList[i].PROFESSIONAL_CAPABILITY_;
							that.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[i].GENERAL_EVALUATION_ = deptWeekWorkPersonEvalList[i].GENERAL_EVALUATION_;
						}

						let deptWeekWorkProjectList = res.data.deptWeekWorkInforNew.deptWeekWorkProjectList;
						for (let i = 0; i < deptWeekWorkProjectList.length; i++) {
							if (i != 0) {
								that.addDeptWeekWorkProjectRow();
							}
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PROJECT_NAME_ = deptWeekWorkProjectList[i].PROJECT_NAME_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PROJECT_LEADER_ = deptWeekWorkProjectList[i].PROJECT_LEADER_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PARTICIPANT_ = deptWeekWorkProjectList[i].PARTICIPANT_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].START_DATE_ = deptWeekWorkProjectList[i].START_DATE_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PLAN_END_DATE_ = deptWeekWorkProjectList[i].PLAN_END_DATE_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].END_DATE_ = deptWeekWorkProjectList[i].END_DATE_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PROCESS_ = deptWeekWorkProjectList[i].PROCESS_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].MEMO_ = deptWeekWorkProjectList[i].MEMO_;
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[i].PROJECT_EVAL_ = deptWeekWorkProjectList[i].PROJECT_EVAL_;
						}

						let nextWeekWorkContentList = res.data.deptWeekWorkInforNew.nextWeekWorkContentList;
						for (let i = 0; i < nextWeekWorkContentList.length; i++) {
							if (i != 0) {
								that.addNextWeekWorkContentRow();
							}
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].PROJECT_NAME_ = nextWeekWorkContentList[i].PROJECT_NAME_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].MODULAR_ = nextWeekWorkContentList[i].MODULAR_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].TASK_ = nextWeekWorkContentList[i].TASK_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].START_DATE_ = nextWeekWorkContentList[i].START_DATE_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].END_DATE_ = nextWeekWorkContentList[i].END_DATE_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].CURRENT_PROGRESS_ = nextWeekWorkContentList[i].CURRENT_PROGRESS_;
							that.nextWeekWorkContentForm.nextWeekWorkContentList[i].TARGET_PROGRESS_ = nextWeekWorkContentList[i].TARGET_PROGRESS_;
						}

						let weekWorkOtherList = res.data.deptWeekWorkInforNew.weekWorkOtherList;
						for (var i in weekWorkOtherList) {
							if (i != 0) {
								that.addWeekWorkOtherRow();
							}
							that.weekWorkOtherForm.weekWorkOtherList[i].TODO_WORK_ = weekWorkOtherList[i].TODO_WORK_;
							that.weekWorkOtherForm.weekWorkOtherList[i].PROGRESS_ = weekWorkOtherList[i].PROGRESS_;
							that.weekWorkOtherForm.weekWorkOtherList[i].OTHER_PARTICIPANT_ = weekWorkOtherList[i].OTHER_PARTICIPANT_;
							that.weekWorkOtherForm.weekWorkOtherList[i].START_DATE_ = weekWorkOtherList[i].START_DATE_;
							that.weekWorkOtherForm.weekWorkOtherList[i].END_DATE_ = weekWorkOtherList[i].END_DATE_;
							that.weekWorkOtherForm.weekWorkOtherList[i].PARTICIPATION_MATTERS_ = weekWorkOtherList[i].PARTICIPATION_MATTERS_;
							that.weekWorkOtherForm.weekWorkOtherList[i].MEMO_ = weekWorkOtherList[i].MEMO_;
						}
						that.diagloading = false;
					} else {
						that.$message.error(res.data.message);
					}

				});

				this.dialog.title = '修改部门周报告';
				this.dialog.show = true;
			},
			onDelete(row, index) {
				//根据id来删除数据
				let that = this;

				let data = {
					WEEK_WORK_ID_: row.WEEK_WORK_ID_
				}
				this.$confirm('是否删除', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					let that = this;
					axios({
						method: 'POST',
						url: this.baseUrl + 'deleteDeptWeekWork.do',
						data: {
							WEEK_WORK_ID_: row.WEEK_WORK_ID_
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
							that.tableData.splice(index, 1);
						} else {
							that.$message.error(res.data.message);
						}
					}).catch(function (err) {
						/*请求失败*/
						that.$message.error('删除失败请重试')
					})
				})
			},
			onAdd() {
				this.diagloading = false;
				this.openDisabled = true;
				this.form.WEEK_WORK_ID_ = '';
				this.form.DEPT_RESP_ = '';
				this.form.DEPT_TARGET_ = '';
				this.form.DEPT_WORK_ = '';
				this.activeName = 'weekWork';
				const formdata = this.form;
				let userinfo = mutils.getStore('userinfo')
				let poseEmpId = userinfo.posiEmpId

				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				let that = this;
				this.$ajax.post(
					this.baseUrl + 'loadPosiEmpManager.do?POSI_EMP_ID_=' + poseEmpId + ''
				).then(function (res) {
					if (res.data.success) {
						formdata.DEPT_NAME_ = res.data.managerInfo.ORG_NAME_;
						formdata.DEPT_MANAGER_NAME_ = res.data.managerInfo.EMP_NAME_;
						formdata.POSI_NAME_ = userinfo.posiName;
						formdata.WEEK_START_DATE_ = mutils.formatDate(new Date(m_time)).substring(0, 10);
						formdata.WEEK_END_DATE_ = mutils.formatDate(new Date(m_time + oneDayLong * 6)).substring(0, 10);
						formdata.POSI_RESP_ = res.data.managerInfo.ONESELF_POSI_MEMO_;
						formdata.WEEK_ = new Date();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('加载失败请联系韩澎')
				});

				this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList = [{
					DEPT_WEEK_WORK_PERSON_EVAL_ID_: '',
					WEEK_WORK_ID_: '',
					EMP_NAME_: '',
					WORK_: '',
					TARGET_: '',
					TARGET_COMPLETION_STATUS_: '',
					COMPREHENSIVE_QUALITY_EVAL_: '',
					TECHNOLOGICAL_CAPABILITY_: '',
					PROFESSIONAL_CAPABILITY_: '',
					GENERAL_EVALUATION_: ''
				}];

				this.deptWeekWorkProjectForm.deptWeekWorkProjectList = [{
					WEEK_WORK_ID_: '',
					PROJECT_NAME_: '',
					PROJECT_LEADER_: '',
					PARTICIPANT_: '',
					START_DATE_: '',
					PLAN_END_DATE_: '',
					END_DATE_: '',
					PROCESS_: '',
					MEMO_: '',
					PROJECT_EVAL_: ''
				}];

				this.dialog.title = '新增部门周报告';
				this.dialog.show = true;

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
			//修改周工作报告
			editWeekWork(data) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateDeptWeekWork.do',
					data: {
						WEEK_WORK_ID_: data.WEEK_WORK_ID_,
						DEPT_NAME_: data.DEPT_NAME_,
						DEPT_MANAGER_NAME_: data.DEPT_MANAGER_NAME_,
						POSI_NAME_: data.POSI_NAME_,
						WEEK_START_DATE_: data.WEEK_START_DATE_,
						WEEK_END_DATE_: data.WEEK_END_DATE_,
						DEPT_RESP_: data.DEPT_RESP_,
						DEPT_TARGET_: data.DEPT_TARGET_,
						DEPT_WORK_: data.DEPT_WORK_
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
						that.paginations.total = data.count;
						that.getList({
							fun: () => {
							}
						});
						that.dialog.show = true;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('修改失败请重试')
				})

			},
			//新增周工作报告
			addWeekWork(data) {
				let userinfo = mutils.getStore('userinfo');
				let DRAFTOR_ID_ = userinfo.empId;
				let DRAFTOR_NAME_ = userinfo.username;

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'insertDeptWeekWorkNew.do',
					data: {
						DEPT_NAME_: data.DEPT_NAME_,
						DEPT_MANAGER_NAME_: data.DEPT_MANAGER_NAME_,
						POSI_NAME_: data.POSI_NAME_,
						POSI_RESP_: data.POSI_RESP_,
						WEEK_START_DATE_: data.WEEK_START_DATE_,
						WEEK_END_DATE_: data.WEEK_END_DATE_,
						DRAFTOR_ID_: DRAFTOR_ID_,
						DRAFTOR_NAME_: DRAFTOR_NAME_,
						DEPT_RESP_: data.DEPT_RESP_,
						DEPT_TARGET_: data.DEPT_TARGET_,
						DEPT_WORK_: data.DEPT_WORK_,
						WEEK_: document.getElementsByName('WEEK_')[0].value
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
						that.form.WEEK_WORK_ID_ = res.data.deptWeekWork.WEEK_WORK_ID_;
						that.deptWeekWork = res.data.deptWeekWork;
						that.$message.success('新增成功');
						that.openDisabled = false;
						that.getList({
							fun: () => {
							}
						});
						that.setInsertNextWeekWorkContentForm();
						that.setInsertWeekWorkOtherForm();
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('新增失败请重试')
				})
			},
			setInsertNextWeekWorkContentForm() {
				let nowStartTemp = new Date(this.deptWeekWork.WEEK_START_DATE_);//当前时间
				let oneStartDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_start_time = nowStartTemp.getTime();//当前时间的毫秒时间
				let c_start_day = nowStartTemp.getDay() || 7;//当前时间的星期几
				let m_start_time = c_start_time - (c_start_day - 1) * oneStartDayLong;//当前周一的毫秒时间

				let nowEndTemp = new Date(this.deptWeekWork.WEEK_END_DATE_);//当前时间
				let oneEndDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_end_time = nowEndTemp.getTime();//当前时间的毫秒时间
				let c_end_day = nowEndTemp.getDay() || 7;//当前时间的星期几
				let m_end_time = c_end_time - (c_end_day - 1) * oneEndDayLong;//当前周一的毫秒时间

				this.nextWeekWorkContentForm.nextWeekWorkContentList = [{
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					SERIAL_: 1,
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					CURRENT_PROGRESS_: '',
					START_DATE_: new Date(m_start_time + oneStartDayLong * 7),
					END_DATE_: new Date(m_end_time + oneEndDayLong * 13),
					TARGET_PROGRESS_: ''
				}];
			},
			setInsertWeekWorkOtherForm() {
				this.weekWorkOtherForm.weekWorkOtherList = [{
					WEEK_WORK_OTHER_ID_: '',
					SERIAL_: 1,
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: new Date(this.deptWeekWork.WEEK_START_DATE_),
					END_DATE_: new Date(this.deptWeekWork.WEEK_END_DATE_),
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: ''
				}];
			},
			//周工作报告的增加与修改
			onWeekWorkSubmit(form) {
				this.$refs[form].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[form];
						let data = {};

						data.WEEK_WORK_ID_ = formData['WEEK_WORK_ID_'];
						data.DEPT_NAME_ = formData['DEPT_NAME_'];
						data.DEPT_MANAGER_NAME_ = formData['DEPT_MANAGER_NAME_'];
						data.POSI_NAME_ = formData['POSI_NAME_'];
						data.POSI_RESP_ = formData['POSI_RESP_'];
						data.DEPT_RESP_ = formData['DEPT_RESP_'];
						data.DEPT_TARGET_ = formData['DEPT_TARGET_'];
						data.DEPT_WORK_ = formData['DEPT_WORK_'];
						if (mutils.isEmpty(formData['WEEK_START_DATE_'])) {
							data.WEEK_START_DATE_ = "";
						} else {
							data.WEEK_START_DATE_ = mutils.formatDate(new Date(formData['WEEK_START_DATE_'])); // 毫秒数，时间戳
						}
						if (mutils.isEmpty(formData['WEEK_END_DATE_'])) {
							data.WEEK_END_DATE_ = "";
						} else {
							data.WEEK_END_DATE_ = mutils.formatDate(new Date(formData['WEEK_END_DATE_']));
						}
						data.WEEK_ = formData['WEEK_'];
						if (formData['WEEK_WORK_ID_'] != "") {
							this.editWeekWork(data)
						} else {
							this.addWeekWork(data)
						}

					}
				})
			},
			//部门周报增加和修改
			onWeekWorkContentSubmit(deptWeekWorkPersonEvalForm) {
				this.$refs[deptWeekWorkPersonEvalForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[deptWeekWorkPersonEvalForm].deptWeekWorkPersonEvalList;

						let SERIAL_LIST = new Array();
						let EMP_NAME_LIST = new Array();
						let WORK_LIST = new Array();
						let TARGET_LIST = new Array();
						let TARGET_COMPLETION_STATUS_LIST = new Array();
						let COMPREHENSIVE_QUALITY_EVAL_LIST = new Array();
						let TECHNOLOGICAL_CAPABILITY_LIST = new Array();
						let PROFESSIONAL_CAPABILITY_LIST = new Array();
						let GENERAL_EVALUATION_LIST = new Array();

						for (let i = 0; i < formData.length; i++) {
							SERIAL_LIST.push(Number(i) + 1);
							EMP_NAME_LIST.push({
								EMP_NAME_: formData[i].EMP_NAME_
							});
							WORK_LIST.push({
								WORK_: formData[i].WORK_
							});
							TARGET_LIST.push({
								TARGET_: formData[i].TARGET_
							});
							TARGET_COMPLETION_STATUS_LIST.push({
								TARGET_COMPLETION_STATUS_: formData[i].TARGET_COMPLETION_STATUS_
							});
							COMPREHENSIVE_QUALITY_EVAL_LIST.push({
								COMPREHENSIVE_QUALITY_EVAL_: formData[i].COMPREHENSIVE_QUALITY_EVAL_
							});
							TECHNOLOGICAL_CAPABILITY_LIST.push({
								TECHNOLOGICAL_CAPABILITY_: formData[i].TECHNOLOGICAL_CAPABILITY_
							});
							PROFESSIONAL_CAPABILITY_LIST.push({
								PROFESSIONAL_CAPABILITY_: formData[i].PROFESSIONAL_CAPABILITY_
							});
							GENERAL_EVALUATION_LIST.push({
								GENERAL_EVALUATION_: formData[i].GENERAL_EVALUATION_
							});
						}
						this.editWeekWorkContent(this.form.WEEK_WORK_ID_, SERIAL_LIST, EMP_NAME_LIST, WORK_LIST, TARGET_LIST, TARGET_COMPLETION_STATUS_LIST, COMPREHENSIVE_QUALITY_EVAL_LIST, TECHNOLOGICAL_CAPABILITY_LIST, PROFESSIONAL_CAPABILITY_LIST, GENERAL_EVALUATION_LIST)

					}
				})
			},
			//项目情况增加和修改
			onDeptWeekWorkProjectFormSubmit(deptWeekWorkProjectForm) {
				this.$refs[deptWeekWorkProjectForm].validate((valid) => {
					if (valid) {//表单数据验证完成之后，提交数据;
						let formData = this[deptWeekWorkProjectForm].deptWeekWorkProjectList;

						let SERIAL_LIST = new Array();
						let PROJECT_NAME_LIST = new Array();
						let PROJECT_LEADER_LIST = new Array();
						let PARTICIPANT_LIST = new Array();
						let START_DATE_LIST = new Array();
						let PLAN_END_DATE_LIST = new Array();
						let END_DATE_LIST = new Array();
						let PROCESS_LIST = new Array();
						let MEMO_LIST = new Array();
						let PROJECT_EVAL_LIST = new Array();

						for (let i = 0; i < formData.length; i++) {
							SERIAL_LIST.push(Number(i) + 1);
							PROJECT_NAME_LIST.push({
								PROJECT_NAME_: formData[i].PROJECT_NAME_
							});
							PROJECT_LEADER_LIST.push({
								PROJECT_LEADER_: formData[i].PROJECT_LEADER_
							});
							PARTICIPANT_LIST.push({
								PARTICIPANT_: formData[i].PARTICIPANT_
							});
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								START_DATE_LIST.push(null);
							} else {
								START_DATE_LIST.push(mutils.formatDate(new Date(formData[i].START_DATE_)));
							}
							if (mutils.isEmpty(formData[i].PLAN_END_DATE_)) {
								PLAN_END_DATE_LIST.push(null);
							} else {
								PLAN_END_DATE_LIST.push(mutils.formatDate(new Date(formData[i].PLAN_END_DATE_)));
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								END_DATE_LIST.push(null);
							} else {
								END_DATE_LIST.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							PROCESS_LIST.push({
								PROCESS_: formData[i].PROCESS_
							});
							MEMO_LIST.push({
								MEMO_: formData[i].MEMO_
							});
							PROJECT_EVAL_LIST.push({
								PROJECT_EVAL_: formData[i].PROJECT_EVAL_
							});
						}
						this.editDeptWeekWorkProject(this.form.WEEK_WORK_ID_, SERIAL_LIST, PROJECT_NAME_LIST, PROJECT_LEADER_LIST, PARTICIPANT_LIST, START_DATE_LIST, PLAN_END_DATE_LIST, END_DATE_LIST, PROCESS_LIST, MEMO_LIST, PROJECT_EVAL_LIST)

					}
				})
			},
			editDeptWeekWorkProject(WEEK_WORK_ID_, SERIAL_LIST, PROJECT_NAME_LIST, PROJECT_LEADER_LIST, PARTICIPANT_LIST, START_DATE_LIST, PLAN_END_DATE_LIST, END_DATE_LIST, PROCESS_LIST, MEMO_LIST, PROJECT_EVAL_LIST) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateDeptWeekWorkProjectNew.do',
					data: {
						WEEK_WORK_ID_: WEEK_WORK_ID_,
						SERIAL_LIST: SERIAL_LIST,
						PROJECT_NAME_LIST: JSON.stringify(PROJECT_NAME_LIST),
						PROJECT_LEADER_LIST: JSON.stringify(PROJECT_LEADER_LIST),
						PARTICIPANT_LIST: JSON.stringify(PARTICIPANT_LIST),
						START_DATE_LIST: START_DATE_LIST,
						PLAN_END_DATE_LIST: PLAN_END_DATE_LIST,
						END_DATE_LIST: END_DATE_LIST,
						PROCESS_LIST: JSON.stringify(PROCESS_LIST),
						MEMO_LIST: JSON.stringify(MEMO_LIST),
						PROJECT_EVAL_LIST: JSON.stringify(PROJECT_EVAL_LIST)
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
						that.$message.success('保存成功');
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			editWeekWorkContent(WEEK_WORK_ID_, SERIAL_LIST, EMP_NAME_LIST, WORK_LIST, TARGET_LIST, TARGET_COMPLETION_STATUS_LIST, COMPREHENSIVE_QUALITY_EVAL_LIST, TECHNOLOGICAL_CAPABILITY_LIST, PROFESSIONAL_CAPABILITY_LIST, GENERAL_EVALUATION_LIST) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateDeptWeekWorkPersonEvalNew.do',
					data: {
						WEEK_WORK_ID_: WEEK_WORK_ID_,
						SERIAL_LIST: SERIAL_LIST,
						EMP_NAME_LIST: JSON.stringify(EMP_NAME_LIST),
						WORK_LIST: JSON.stringify(WORK_LIST),
						TARGET_LIST: JSON.stringify(TARGET_LIST),
						TARGET_COMPLETION_STATUS_LIST: JSON.stringify(TARGET_COMPLETION_STATUS_LIST),
						COMPREHENSIVE_QUALITY_EVAL_LIST: JSON.stringify(COMPREHENSIVE_QUALITY_EVAL_LIST),
						TECHNOLOGICAL_CAPABILITY_LIST: JSON.stringify(TECHNOLOGICAL_CAPABILITY_LIST),
						PROFESSIONAL_CAPABILITY_LIST: JSON.stringify(PROFESSIONAL_CAPABILITY_LIST),
						GENERAL_EVALUATION_LIST: JSON.stringify(GENERAL_EVALUATION_LIST)
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
						that.$message.success('保存成功');
						that.getList({
							fun: () => {
							}
						});
						that.dialog.show = true;
					} else {
						that.$message.error(res.data.message);
					}
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
						let projectIdList = new Array();
						let moduleIdList = new Array();

						for (let i = 0; i < formData.length; i++) {
							serialList.push(Number(i) + 1);
							projectNameList.push({
								PROJECT_NAME_: formData[i].PROJECT_NAME_
							});
							modularList.push({
								MODULAR_: formData[i].MODULAR_
							});
							taskList.push({
								TASK_: formData[i].TASK_
							});
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								startDateList.push(null);
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].START_DATE_))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								endDateList.push(null);
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							currentProgressList.push({
								CURRENT_PROGRESS_: formData[i].CURRENT_PROGRESS_
							});
							targetProgressList.push({
								TARGET_PROGRESS_: formData[i].TARGET_PROGRESS_
							});
							projectIdList.push({
								PROJECT_ID_: formData[i].PROJECT_ID_
							});
							moduleIdList.push({
								MODULE_ID_: formData[i].MODULE_ID_
							})
						}

						this.editNextWeekWorkContent(this.form.WEEK_WORK_ID_, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList, projectIdList, moduleIdList)

					}
				})
			},
			editNextWeekWorkContent(WEEK_WORK_ID_, serialList, projectNameList, modularList, taskList, startDateList, endDateList, currentProgressList, targetProgressList, projectIdList, moduleIdList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateNextWeekWorkContentNew.do',
					data: {
						WEEK_WORK_ID_: WEEK_WORK_ID_,
						SERIAL_LIST: serialList,
						PROJECT_NAME_LIST: JSON.stringify(projectNameList),
						MODULAR_LIST: JSON.stringify(modularList),
						TASK_LIST: JSON.stringify(taskList),
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						CURRENT_PROGRESS_LIST: JSON.stringify(currentProgressList),
						TARGET_PROGRESS_LIST: JSON.stringify(targetProgressList),
						PROJECT_ID_LIST: JSON.stringify(projectIdList),
						MODULE_ID_LIST: JSON.stringify(moduleIdList)
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
						that.$message.success('保存成功');
					} else {
						that.$message.error(res.data.message);
					}
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
							todoWorkList.push({
								TODO_WORK_: formData[i].TODO_WORK_
							});
							progressList.push({
								PROGRESS_: formData[i].PROGRESS_
							});
							otherParticipantList.push({
								OTHER_PARTICIPANT_: formData[i].OTHER_PARTICIPANT_
							});
							if (mutils.isEmpty(formData[i].START_DATE_)) {
								startDateList = "";
							} else {
								startDateList.push(mutils.formatDate(new Date(formData[i].START_DATE_))); // 毫秒数，时间戳
							}
							if (mutils.isEmpty(formData[i].END_DATE_)) {
								endDateList = "";
							} else {
								endDateList.push(mutils.formatDate(new Date(formData[i].END_DATE_)));
							}
							participationMattersList.push({
								PARTICIPATION_MATTERS_: formData[i].PARTICIPATION_MATTERS_
							});
							memoList.push({
								MEMO_: formData[i].MEMO_
							});
						}

						this.editWeekWorkOther(this.form.WEEK_WORK_ID_, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList)

					}
				})
			},
			editWeekWorkOther(WEEK_WORK_ID_, serialList, todoWorkList, progressList, otherParticipantList, startDateList, endDateList, participationMattersList, memoList) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'updateWeekWorkOtherNew.do',
					data: {
						WEEK_WORK_ID_: WEEK_WORK_ID_,
						TODO_WORK_LIST: JSON.stringify(todoWorkList),
						SERIAL_LIST: serialList,
						PROGRESS_LIST: JSON.stringify(progressList),
						START_DATE_LIST: startDateList,
						END_DATE_LIST: endDateList,
						OTHER_PARTICIPANT_LIST: JSON.stringify(otherParticipantList),
						PARTICIPATION_MATTERS_LIST: JSON.stringify(participationMattersList),
						MEMO_LIST: JSON.stringify(memoList)
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
						that.$message.success('保存成功');
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('保存失败请重试')
				})
			},
			//筛选
			selectDeptWeekWork(search_data) {
				this.search_data.startDatePage = this.search_data.startDate;
				this.search_data.endDatePage = this.search_data.endDate;

				this.getList({
					fun: () => {
					}
				});
			},
			//新增工作考核页面模块
			addWeekWorkContentRow() {
				this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList.push({
					DEPT_WEEK_WORK_PERSON_EVAL_ID_: '',
					WEEK_WORK_ID_: '',
					EMP_NAME_: '',
					WORK_: '',
					TARGET_: '',
					TARGET_COMPLETION_STATUS_: '',
					COMPREHENSIVE_QUALITY_EVAL_: '',
					TECHNOLOGICAL_CAPABILITY_: '',
					PROFESSIONAL_CAPABILITY_: '',
					GENERAL_EVALUATION_: ''
				})
			},
			//新增项目情况模块
			addDeptWeekWorkProjectRow() {
				this.deptWeekWorkProjectForm.deptWeekWorkProjectList.push({
					WEEK_WORK_ID_: '',
					PROJECT_NAME_: '',
					PROJECT_LEADER_: '',
					PARTICIPANT_: '',
					START_DATE_: '',
					PLAN_END_DATE_: '',
					END_DATE_: '',
					PROCESS_: '',
					MEMO_: '',
					PROJECT_EVAL_: ''
				})
			},
			//新增下周工作内容数量
			addNextWeekWorkContentRow() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间
				this.nextWeekWorkContentForm.nextWeekWorkContentList.push({
					NEXT_WEEK_WORK_CONTENT_ID_: '',
					PROJECT_NAME_: '',
					MODULAR_: '',
					TASK_: '',
					START_DATE_: new Date(m_time + oneDayLong * 7),
					END_DATE_: new Date(m_time + oneDayLong * 13),
					CURRENT_PROGRESS_: '',
					TARGET_PROGRESS_: '',
				})
			},
			//新增上级交办其他工作数量
			addWeekWorkOtherRow() {
				let nowTemp = new Date();//当前时间
				let oneDayLong = 24 * 60 * 60 * 1000;//一天的毫秒数
				let c_time = nowTemp.getTime();//当前时间的毫秒时间
				let c_day = nowTemp.getDay() || 7;//当前时间的星期几
				let m_time = c_time - (c_day - 1) * oneDayLong;//当前周一的毫秒时间

				this.weekWorkOtherForm.weekWorkOtherList.push({
					WEEK_WORK_OTHER_ID_: '',
					TODO_WORK_: '',
					PROGRESS_: '',
					START_DATE_: new Date(m_time),
					END_DATE_: new Date(m_time + oneDayLong * 6),
					OTHER_PARTICIPANT_: '',
					PARTICIPATION_MATTERS_: '',
					MEMO_: '',
				})
			},
			//移除周工作内容
			removeWeekWorkContentRow(index) {
				if (this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList.length > 1) {
					this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}

			},
			//移除下周工作内容
			removeNextWeekWorkContentRow(index) {
				if (this.nextWeekWorkContentForm.nextWeekWorkContentList.length > 1) {
					this.nextWeekWorkContentForm.nextWeekWorkContentList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//移除上级交办的其他工作哦
			removeWeekWorkOtherRow(index) {
				if (this.weekWorkOtherForm.weekWorkOtherList.length > 1) {
					this.weekWorkOtherForm.weekWorkOtherList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//移除项目情况模块
			removeDeptWeekWorkProjectRow(index) {
				if (this.deptWeekWorkProjectForm.deptWeekWorkProjectList.length > 1) {
					this.deptWeekWorkProjectForm.deptWeekWorkProjectList.splice(index, 1);
				} else {
					this.$message.warning('至少有一条');
				}
			},
			//工作情况及考评选择人员
			_preChooseDeptWeekWorkPersonEvalPerson(index) {
				let userinfo = mutils.getStore('userinfo')
				this.deptWeekWorkPersonEvalPersonindex = index;
				this.choosePersonDialog.show = true;
				this.choosePersonDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_Person_ref.chooseCurrentPersonForm.ORG_ID_ = userinfo.posiEmpId;
					this.$refs.choose_Person_ref.selectEmp();
				})
			},
			//赋人名
			_completeChooseWeekWorkContentPerson(row) {
				this.choosePersonDialog.show = false;
				this.deptWeekWorkPersonEvalForm.deptWeekWorkPersonEvalList[this.deptWeekWorkPersonEvalPersonindex].EMP_NAME_ = row.EMP_NAME_;
			},
			//项目情况选择项目
			_preChooseDeptWeekWorkProject(index) {
				this.deptWeekWorkProjectindex = index;
				this.chooseProjectDialog.show = true;
				this.chooseProjectDialog.dialogVisible = true;
			},
			//项目情况选择赋项目
			_completeChooseWeekWorkContentProject(returnValue) {
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectProjectPerson.do',
					data: {
						PROJECT_ID_: returnValue.PROJECT_ID_,
						PROJECT_ROLE_: 'MANAGER'
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
						let result = res.data.projectPersonList;
						console.log(result);
						if(result.length > 0){
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[that.deptWeekWorkProjectindex].PROJECT_LEADER_ = result[0].EMP_NAME_;
                        }else{
							that.deptWeekWorkProjectForm.deptWeekWorkProjectList[that.deptWeekWorkProjectindex].PROJECT_LEADER_ = '';
                        }
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作失败请重试')
				});


				that.chooseProjectDialog.show = false;
				that.deptWeekWorkProjectForm.deptWeekWorkProjectList[that.deptWeekWorkProjectindex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
			},
			//项目情况选择负责人
			_preChooseDeptWeekWorkPersonEvalLeader(index) {
				let userinfo = mutils.getStore('userinfo')
				this.deptWeekWorkPersonEvalLeaderindex = index;
				this.chooseLeaderDialog.show = true;
				this.chooseLeaderDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_Leader_ref.chooseCurrentPersonForm.ORG_ID_ = userinfo.posiEmpId;
					this.$refs.choose_Leader_ref.selectEmp();
				})
			},
			//赋项目负责人
			_completeChooseWeekWorkContentLeader(row) {
				this.chooseLeaderDialog.show = false;
				this.deptWeekWorkProjectForm.deptWeekWorkProjectList[this.deptWeekWorkPersonEvalLeaderindex].PROJECT_LEADER_ = row.EMP_NAME_;
			},
			//项目情况选择开发人
			_preChooseDeptWeekWorkPersonEvalParticipant(index) {
				let userinfo = mutils.getStore('userinfo')
				this.deptWeekWorkPersonEvalParticipantindex = index;
				this.chooseParticipantDialog.show = true;
				this.chooseParticipantDialog.dialogVisible = true;
				// this.$nextTick(_ => {
				// 	this.$refs.choose_Participant_ref.chooseCurrentPersonForm.ORG_ID_ = userinfo.posiEmpId;
				// 	this.$refs.choose_Participant_ref.selectEmp();
				// })

				this.$nextTick(_ => {
					//this.$refs.choose_Participant_ref.doSyncMethod();
					//this.$refs.choose_Participant_ref.empForm.ORG_ID_ = userinfo.ORG_ID_;
					this.$refs.choose_Participant_ref.temOrgId = userinfo.ORG_ID_;

					//this.$refs.choose_Participant_ref.selectEmp();
				})
			},
			//赋项目开发人
			_completeChooseWeekWorkContentParticipant(empList) {
				console.log(empList);
				this.chooseParticipantDialog.show = false;
				let participant = ''
				for(let i = 0; i < empList.length; i++){
					if( i == empList.length - 1 ){
						participant += empList[i].EMP_NAME_;
                    }else{
						participant += empList[i].EMP_NAME_ + ","
                    }
                }
				//this.deptWeekWorkProjectForm.deptWeekWorkProjectList[this.deptWeekWorkPersonEvalParticipantindex].PARTICIPANT_ = row.EMP_NAME_;
				this.deptWeekWorkProjectForm.deptWeekWorkProjectList[this.deptWeekWorkPersonEvalParticipantindex].PARTICIPANT_ = participant;
			},
			//下周工作内容选择项目
			_preChooseNextWeekWorkContentProject(index) {
				this.nextWeekWorkContentProjectIndex = index;
				this.chooseNextProjectDialog.show = true;
				this.chooseNextProjectDialog.dialogVisible = true;
			},
			//下周赋项目
			_completeChooseNextWeekWorkContentProject(returnValue) {
				this.chooseNextProjectDialog.show = false;
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_ID_ = returnValue.PROJECT_ID_;
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_NAME_ = returnValue.PROJECT_NAME_;
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULE_ID_ = "";
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].MODULAR_ = "";
			},
			//下周工作选择模块
			_preChooseNextWeekWorkContentModule(index) {
				this.nextWeekWorkContentModuleIndex = index;
				if (this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].PROJECT_NAME_ == "") {
					this.$message.warning("请先完成选择项目");
					return;
				}
				this.chooseModuleDialog.show = true;
				this.chooseModuleDialog.dialogVisible = true;
				this.$nextTick(_ => {
					this.$refs.choose_module_ref.moduleQueryForm.PROJECT_ID_ = this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentProjectIndex].PROJECT_ID_;
					this.$refs.choose_module_ref.getList();
				})
			},
			//赋模块
			_completeChooseNextWeekWorkContentModule(returnValue) {
				this.chooseModuleDialog.show = false;
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULE_ID_ = returnValue.MODULE_ID_;
				this.nextWeekWorkContentForm.nextWeekWorkContentList[this.nextWeekWorkContentModuleIndex].MODULAR_ = returnValue.MODULE_NAME_;
			},
			//关闭监听
			closeChoosePersonDialog() {
				this.choosePersonDialog.dialogVisible = false;
			},
			closeChooseProjectDialog() {
				this.chooseProjectDialog.dialogVisible = false;
			},
			closeChooseLeaderDialog() {
				this.chooseLeaderDialog.dialogVisible = false;
			},
			closeChooseParticipantDialog() {
				this.chooseParticipantDialog.dialogVisible = false;
			},
			closeChooseNextProjectDialog() {
				this.chooseNextProjectDialog.dialogVisible = false;
			},
			closeChooseModuleDialog() {
				this.chooseModuleDialog.dialogVisible = false;
			}

		},
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

</style>


