<template>
    <div class="form">
        <el-form
                ref="dailyForm"
                :model="dailyForm"
                :label-width="dailyForm.style.formLabelWidth"
                style="margin:10px;width:auto;">
            <el-form-item prop='REQ_CODE_' label="需求编码:"
                          :rules="[{ required: true, message: '需求编码不能为空' ,trigger: 'blur' },{ type: 'string', max: 40, message: '内容不能超过40位', trigger: 'blur' }]">
                <el-input v-model="dailyForm.REQ_CODE_"></el-input>
            </el-form-item>

            <el-form-item prop='REQ_NAME_' label="需求名称:"
                          :rules="[{ required: true, message: '需求名称不能为空' ,trigger: 'blur' },{ type: 'string', max: 100, message: '内容不能超过100位', trigger: 'blur' }]">
                <el-input v-model="dailyForm.REQ_NAME_"></el-input>
            </el-form-item>
            <el-form-item prop='ORIGIN_' label="需求来源:"
                          :rules="[{ type: 'string', max: 60, message: '内容不能超过60位', trigger: 'blur' }]">
                <el-input v-model="dailyForm.ORIGIN_"></el-input>
            </el-form-item>
            <el-form-item prop='RAISER_NAME_' label="提出人名称:">
                <el-input v-model="dailyForm.RAISER_NAME_"
                          :rules="[{ type: 'string', max: 40, message: '内容不能超过40位', trigger: 'blur' }]"></el-input>
            </el-form-item>
            <el-form-item prop='RAISER_CP_' label="提出人联系方式:">
                <el-input v-model="dailyForm.RAISER_CP_"
                          :rules="[{ type: 'string', max: 60, message: '内容不能超过60位', trigger: 'blur' }]"></el-input>
            </el-form-item>
            <el-form-item prop='RAISE_DATE_' label="提出日期:"
                          :rules="[{ required: true, message: '提出时间不能为空' ,trigger: 'blur' }]">
                <el-date-picker
                        v-model="dailyForm.RAISE_DATE_"
                        type="date"
                        value-format="yyyy-MM-dd"
                        placeholder="选择提出时间">
                </el-date-picker>
            </el-form-item>
            <el-form-item prop='MEMO_' label="备注:"
                          :rules="[{ type: 'string', max: 1000, message: '备注长度不能超过1000' ,trigger: 'blur' }]">
                <el-input type="textarea" v-model="dailyForm.MEMO_"></el-input>
            </el-form-item>

            <el-form-item class="text_right">
                <el-button @click="_close()">关闭</el-button>
                <el-button type="primary" @click='_insertDaily("dailyForm")'  v-bind:disabled="buttonStatus.saveStatus">保存</el-button>
            </el-form-item>
        </el-form>



    </div>
</template>

<script>
	export default {
		name: "preInsertDaily"
	}
</script>

<style scoped>

</style>
