<template>
    <div class="temp-list">
        <el-row>
            <div style="height: 400px;">
                <div class="grid-content bg-purple">
                    <el-scrollbar>
                        <div style="height: 500px">

                            <el-tree
                                    :data="moduleTree.moduleList"
                                    :props="moduleTree.defaultProps"
                                    :style="moduleTree.style"
                                    v-loading="moduleTree.gridLoading"
                                    :expand-on-click-node="false"
                                    default-expand-all
                                    highlight-current
                            >
                            <span class="custom-tree-node" slot-scope="{ node, data }">
                                <span>{{ node.label }}</span>
                                <span>
                                    <el-button
                                            type="warning"
                                            size="mini"
                                            style="height: 25px; margin-top: 5px"
                                            @click='_chooseModule(node, data)'
                                    >选择
                                    </el-button>
                                </span>
                            </span>
                            </el-tree>

                        </div>
                    </el-scrollbar>
                </div>
            </div>
        </el-row>
    </div>
</template>

<script>
	import axios from 'axios';
	export default {
		name: "preChooseMoveModule",
		data() {
			return {
				moduleQueryForm: {
					PROJECT_ID_: '',
					MODULE_ID_: ''
				},
				moduleTree: {
					moduleList: [],
					gridLoading: true,
					defaultProps: {
						children: 'children',
						label: 'MODULE_NAME_'
					},
					style: {
						height: '350px'
					}
				},
                moduleIdList: []
			}
		},
		methods: {
			getList() {
				let that = this;
				that.moduleTree.gridLoading = true;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectModule.do',
					data: {
						PROJECT_ID_: this.moduleQueryForm.PROJECT_ID_,
						notModuleStatus: "0"
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
						that.moduleTree.moduleList = res.data.children;
						that.moduleTree.gridLoading = false;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					/*请求失败*/
					that.$message.error('系统错误请联系管理员');
					that.moduleTree.gridLoading = false;
				})
			},
			getModuleId(){
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectModuleNew.do',
					data: {
						MODULE_ID_: that.moduleQueryForm.MODULE_ID_
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
                        that.moduleIdList = res.data.MODULE_ID_LIST;
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作失败请重试')
				})
            },
			_chooseModule(node, data) {
				for(let i = 0; i < this.moduleIdList.length; i++){
					if(data.MODULE_ID_ == this.moduleIdList[i].MODULE_ID_){
						this.$message.warning("不能选择自己或者自己的下级");
						return;
                    }
                }
                let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'moveModule.do',
					data: {
						MODULE_ID_: that.moduleQueryForm.MODULE_ID_,
                        PARENT_MODULE_ID_: data.MODULE_ID_
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
						let returnValue = res.data.module;

						that.$emit('chooseModuleListeners', returnValue);
					} else {
						that.$message.error(res.data.message);
					}
				}).catch(function (err) {
					that.$message.error('操作失败请重试')
				})
			},
		}
	}
</script>

<style scoped>
    .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }
</style>
