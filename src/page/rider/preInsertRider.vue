<template>
    <div class="form">
        <el-upload
                class="upload-demo"
                ref="upload"
                action="https://jsonplaceholder.typicode.com/posts/"
                :file-list="fileList"
                :auto-upload="false">
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
        </el-upload>
    </div>
</template>
<script>
	import * as mutils from 'utils/mUtils'
	import axios from 'axios';
	export default {
		data() {
			return {
				riderForm: {
					style: {
						formLabelWidth: '120px'
					},
					RIDER_ID_: '',
					ID_: '',
					TYPE_: '',
					RIDER_: '',
					RIDER_NAME_: '',
					RIDER_LENGTH_: ''
				},
                riderList : []
            }
        }
	}
</script>
