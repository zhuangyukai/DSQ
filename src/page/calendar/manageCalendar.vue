<template>

    <el-calendar>
        <template
                slot="dateCell"
                slot-scope="{date,data}">
            <p :id="data.day.split('-').slice(1).join('-')">
                {{ data.day.split('-').slice(1).join('-') }}
            </p>
            <p style="color: #e50021">
                {{getSpecialVal(data.day)}}
            </p>
        </template>
    </el-calendar>
</template>

<script>
	import axios from 'axios';
	import * as mutils from 'utils/mUtils';
	export default {
		data() {
			return {
				calendarDaily:[ {
					DAILY_ID_: '',
					PROJECT_ID_: '',
					MODULE_ID_: '',
					FINISHED_WORK_: '',
					UNFINISHED_WORK_: '',
					MEMO_: '',
					WORKING_HOURS_: '',
					DRAFTOR_ID_: '',
					DRAFT_DATE_: '',
					DAILY_DATE_: ''
                }],
			}
		},
		created() {
		 	this.doSyncMethod();
		},
        methods: {
			getSpecialVal(_val){
				var result = "";
				this.calendarDaily.forEach(data => {
					var dailyDate = data.DAILY_DATE_.substr(0,10);
					console.log(dailyDate);
					if(dailyDate == _val){
						//result = data.FINISHED_WORK_ + "-" + data.UNFINISHED_WORK_;
                        result = '已提交';
					}else{
						//result = '未提交';
						// this.$("#"+data.DAILY_DATE_.split('-').slice(1).join('-')+"").parent().css("background-color","#A6FFBD");
                    }
				});
				return result;
			},
			async doSyncMethod() {
				await this._selectCalendarDaily();
				//this.changeCalendarColor();
			},
			_selectCalendarDaily() {
				/*获取登录人ID*/
				let userinfo = mutils.getStore('userinfo')
				let EMP_ID_ = userinfo.empId
				let that = this;
				axios({
					method: 'POST',
					url: this.baseUrl + 'selectCalendarDaily.do',
					data: {
						DRAFTOR_ID_: EMP_ID_
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
					that.calendarDaily = res.data.calendarDailyList;


				}).catch(function (err) {
					/!*请求失败*!/
					that.$message.error('系统错误请联系管理员')
				})
			},
/*            changeCalendarColor(_val){
				this.calendarDaily.forEach(data => {
					var dailyDate = data.DAILY_DATE_.substr(0,10);
					if(dailyDate === _val){
                        this.$("#"+data.DAILY_DATE_.split('-').slice(1).join('-')+"").parent().css("background-color","#A6FFBD");
					}else{
					}
				});
            }*/
        }
	}
</script>

<style scoped>

</style>