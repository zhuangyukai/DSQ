<template>
        <div class="statistics common-content">
            <el-table ref="multipleTable"
                      :data="orgList"
                      border style="width: 50%;" size="medium"
                      highlight-current-row
                      :row-class-name="rowClassNameHandler"
                      row-key="PARTY_ID_">
                <el-table-column label="职务名称" width="300" align="left" show-overflow-tooltip  fixed>
                    <template slot-scope="scope">
                        <span :style="{marginLeft: scope.row.level * 23 + 'px'}">&ensp;</span>
                        <i v-if="scope.row.showChildren"
                           :class="{'fa fa-folder-open':scope.row.showChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <i v-else :class="{'fa fa-folder':scope.row.hasChildren, 'fa fa-file-o':!scope.row.hasChildren}"
                           @click="onExpand(scope.row)"
                           :style="{cursor:scope.row.hasChildren ? 'pointer' : 'normal'}"></i>
                        <span :data-level="scope.row.level"
                              :style="{marginLeft: 4 + 'px'}">{{ scope.row.PARTY_NAME_ }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="ADDR_" label="地址" width="150"align="left"></el-table-column>
                <el-table-column prop="MEMO_" width="150" label="备注" align="left"></el-table-column>
                <el-table-column
                        prop="operation"
                        align='center'
                        label="操作"
                        fixed="right"
                        width="300">
                    <template slot-scope='scope'>
                        <el-button
                                type="warning"
                                icon='insert'
                                size="mini"
                                @click='(scope.row)'
                        >新增下级节点
                        </el-button>
                        <el-button
                                type="warning"
                                icon='edit'
                                size="mini"
                                @click='(scope.row)'
                        >编辑
                        </el-button>
                        <el-button
                                type="danger"
                                icon='delete'
                                size="mini"
                                @click='(scope.row,scope.$index)'
                        >删除
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
         </div>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils'
	export default {

		data() {
			return {
				orgList: [],/*查询机构的数据*/
			}
		},

		mounted() {
			let self = this
			self.loadOrgList()
		},
		methods: {
			_processLevelStatisticData(dataArray) {
				let self = this

				let resultArray = [] // 一级栏目
				let level = 1
				for (let i = 0; i < dataArray.length; i++) {
					let item = dataArray[i]
					// 查找一级分类
					if (item.PARENT_PARTY_ID_ == null) {
						item['level'] = level
						resultArray.push(item)
						self._loadChildrenData(resultArray, dataArray, item, level + 1)
					}
				}
				return resultArray
			},

			_loadChildrenData(resultArray, originArray, item, level) {
				let self = this

				let deployed = 0
				let undeployed = 0
				let edit = 0
				let completed = 0
				for (let i = 0; i < originArray.length; i++) {
					let originItem = originArray[i]
					// 判断是否是item项的子项
					if (originItem.PARENT_PARTY_ID_ == item.PARTY_ID_) {
						item['hasChildren'] = true
						item['showChildren'] = false

						originItem['level'] = level
						originItem['visible'] = false // 子项默认隐藏
						originItem['hiddenByCategory'] = false

						resultArray.push(originItem)
						self._loadChildrenData(
							resultArray,
							originArray,
							originItem,
							level + 1
						)
					}
				}

			},

			search() {
				this.loadOrgList()
			},

			loadOrgList() {
				let self = this

				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectParty.do',
					data: {
						PARTY_TYPE_: 0,
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
					let result = res.data.partyList;
					console.log("11");
					console.log(result);
					let resultArray = self._processLevelStatisticData(result);
					that.orgList = resultArray
				})

			},
			rowClassNameHandler({row, rowIndex}) {
				let className = 'pid-' + row.PARENT_PARTY_ID_
				if (
					row.PARENT_PARTY_ID_ !== null &&
					(row['visible'] !== true || row['hiddenByCategory'] === true)
				) {
					className += ' hiddenRow'
				}
				return className
			},

			onExpand(row) {
				let self = this
				let isShowChildren = !row['showChildren']
				row['showChildren'] = isShowChildren
				self._loadAllSubItems(row, true, isShowChildren)
			},

			_loadAllSubItems(item, isFirstLevlChildren, isShowChilren) {
				let self = this
				let dataArray = []
				for (let i = 0; i < self.orgList.length; i++) {
					let tempItem = self.orgList[i]
					if (tempItem.PARENT_PARTY_ID_ === item.PARTY_ID_) {
						if (isFirstLevlChildren) {
							tempItem['visible'] = !tempItem['visible']
						}
						tempItem['hiddenByCategory'] = !isShowChilren

						dataArray.push(tempItem)
						let subItemArray = self._loadAllSubItems(
							tempItem,
							false,
							isShowChilren
						)
						dataArray = dataArray.concat(subItemArray)
					}
				}
				return dataArray
			}
		}
	}
</script>

<style lang="less">
    .statistics {
        padding: 10px;
        .hiddenRow {
            display: none;
        }
        .searchForm {
            padding: 10px;
            span.label {
                margin-right: 10px;
            }
            span.attention {
                color: #e50021;
            }
        }

    }
</style>