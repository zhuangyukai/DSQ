<template>
    <div class="site-content">
        <div class="section">
            <!--  <div><img src="../style/images/banner03_bg.jpg" ></div>-->
            <div class="index_o" >
                <div class="index_o_o">
                    <p >项目管理</p>
                </div>
                <div class="index_o_s"  >
                    <ul class="clearfix" >
                        <li class="fl"  @mouseover="mouseoverWait()" @mouseout="mouseoutWait()" ref="liStyleWait">
                            <div><img src="../style/images/index_hx2.png" alt="待办任务" width="62" height="42"></div>
                            <span >待办任务</span>
                            <p>匠心工程,让我们看看待办吧!</p>
                            <a v-on:click="WaitButton" ref="aStyleWait">点击进入</a>
                        </li>
                        <li class="fl" @mouseover="mouseoverCompleted ()" @mouseout="mouseoutCompleted()" ref="liStyleCompleted">
                            <div ><img src="../style/images/index_hx1.png" alt="已办任务" width="62" height="62" ></div>
                            <span >已办任务</span>
                            <p>人生是一个赌场，我们随时都在下注，或输或赢，或悲或喜</p>
                            <a v-on:click="CompletedButton" ref="aStyleCompleted">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverManagement()" @mouseout="mouseoutManagement()" ref="liStyleManagement">
                            <div><img src="../style/images/index_hx3.png" alt="项目管理" width="53" height="59"></div>
                            <span >项目管理</span>
                            <p>其实很多时候，我们都被心动骗了</p>
                            <a v-on:click="ManagementButton" ref="aStyleManagement">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverDevelopment()" @mouseout="mouseoutDevelopment()" ref="liStyleDevelopment">
                            <div><img src="../style/images/index_hx5.png" alt="汇报日报（开发）" width="62" height="48">
                            </div>
                            <span >汇报日报（开发）</span>
                            <p>书籍能够改变人的一生</p>
                            <a v-on:click="developmentButton" ref="aStyleDevelopment">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverImplementation()" @mouseout="mouseoutImplementation()" ref="liStyleImplementation">
                            <div><img src="../style/images/index_hx6.png" alt="汇报日报（实施）" width="55" height="56">
                            </div>
                            <span >汇报日报（实施）</span>
                            <p>紧紧抓着伤痛不放，你就只是给那些伤害你的人力量，让他们控制你</p>
                            <a v-on:click="ImplementationButton" ref="aStyleImplementation">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverOperations()" @mouseout="mouseoutOperations()" ref="liStyleOperations">
                            <div><img src="../style/images/index_hx8.png" alt="汇报日报（运维）" width="58" height="57"></div>
                            <span >汇报日报（运维）</span>
                            <p>月色与雪色之间，你是第三种绝色</p>
                            <a v-on:click="operationsButton" ref="aStyleOperations">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverSelect()" @mouseout="mouseoutSelect()" ref="liStyleSelect">
                            <div><img src="../style/images/index_hx4.png" alt="查询日报" width="55" height="56"></div>
                            <span >查询日报</span>
                            <p>我喜欢的样子，你都有</p>
                            <a v-on:click="selectButton" ref="aStyleSelect">点击进入</a>
                        </li>
                        <li class="fl"  @mouseover="mouseoverManageWeekWork()" @mouseout="mouseoutManageWeekWork()" ref="liStyleManageWeekWork">
                            <div><img src="../style/images/index_hx7.png" alt="管理周报" width="62" height="62"></div>
                            <span >管理周报</span>
                            <p>你送我的暖，我放在心口。每一刻都没有离开过心窝的位置</p>
                            <a v-on:click="manageWeekWorkButton" ref="aStyleManageWeekWork">点击进入</a>
                        </li>

                        <li class="fl"  @mouseover="mouseoverInfoModify()" @mouseout="mouseoutInfoModify()" ref="liStyleInfoModify">
                            <div><img src="../style/images/index_hx9.png" alt="修改信息" width="56" height="56"></div>
                            <span >修改信息</span>
                            <p>你丢了我，我就是别人的小公主了</p>
                            <a v-on:click="infoModifyButton" ref="aStyleInfoModify">点击进入</a>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
	export default {
		data() {
			return {
				running: false,
				awards: [],
				currentAward: 0,
				result: [],
				players: [],
				batchPlayers: [],
				members: [],
			}
		},
		methods: {
			mouseoverCompleted(){
				this.$refs.aStyleCompleted.style.display='block';
				this.$refs.liStyleCompleted.style.bottom='20px';
			},
			mouseoutCompleted(){
				this.$refs.aStyleCompleted.style.display='none';
				this.$refs.liStyleCompleted.style.bottom='0px';
			},
			mouseoverWait(){
				this.$refs.aStyleWait.style.display='block';
				this.$refs.liStyleWait.style.bottom='20px';
			},
			mouseoutWait(){
				this.$refs.aStyleWait.style.display='none';
				this.$refs.liStyleWait.style.bottom='0px';
			},
			mouseoverManagement(){
				this.$refs.aStyleManagement.style.display='block';
				this.$refs.liStyleManagement.style.bottom='20px';
			},
			mouseoutManagement(){
				this.$refs.aStyleManagement.style.display='none';
				this.$refs.liStyleManagement.style.bottom='0px';
			},
			mouseoverDevelopment(){
				this.$refs.aStyleDevelopment.style.display='block';
				this.$refs.liStyleDevelopment.style.bottom='20px';
			},
			mouseoutDevelopment(){
				this.$refs.aStyleDevelopment.style.display='none';
				this.$refs.liStyleDevelopment.style.bottom='0px';
			},
			mouseoverImplementation(){
				this.$refs.aStyleImplementation.style.display='block';
				this.$refs.liStyleImplementation.style.bottom='20px';
			},
			mouseoutImplementation(){
				this.$refs.aStyleImplementation.style.display='none';
				this.$refs.liStyleImplementation.style.bottom='0px';
			},mouseoverOperations(){
				this.$refs.aStyleOperations.style.display='block';
				this.$refs.liStyleOperations.style.bottom='20px';
			},
			mouseoutOperations(){
				this.$refs.aStyleOperations.style.display='none';
				this.$refs.liStyleOperations.style.bottom='0px';
			},
			mouseoverSelect(){
				this.$refs.aStyleSelect.style.display='block';
				this.$refs.liStyleSelect.style.bottom='20px';
			},
			mouseoutSelect(){
				this.$refs.aStyleSelect.style.display='none';
				this.$refs.liStyleSelect.style.bottom='0px';
			},
			mouseoverManageWeekWork(){
				this.$refs.aStyleManageWeekWork.style.display='block';
				this.$refs.liStyleManageWeekWork.style.bottom='20px';
			},
			mouseoutManageWeekWork(){
				this.$refs.aStyleManageWeekWork.style.display='none';
				this.$refs.liStyleManageWeekWork.style.bottom='0px';
			},
			mouseoverInfoModify(){
				this.$refs.aStyleInfoModify.style.display='block';
				this.$refs.liStyleInfoModify.style.bottom='20px';
			},
			mouseoutInfoModify(){
				this.$refs.aStyleInfoModify.style.display='none';
				this.$refs.liStyleInfoModify.style.bottom='0px';
			},
			CompletedButton() {
				this.$router.push('/personCenter/completedDoTasks');
			},
			WaitButton() {
				this.$router.push('/personCenter/toDoTasks');
			},
			ManagementButton() {
				this.$router.push('/project/manageProject');
			},
			developmentButton() {
				this.$router.push('/daily/reportDaily');
			},
			ImplementationButton() {
				this.$router.push('/daily/reportImplementDaily');
			},
			operationsButton() {
				this.$router.push('/daily/reportDevOpsDaily');
			},
			selectButton() {
				this.$router.push('/daily/manageDaily');
			},
			manageWeekWorkButton() {
				this.$router.push('/weekWork/manageWeekWork');
			},
			infoModifyButton() {
				this.$router.push('/infoModify');
			}
		}
	}

</script>

<style lang="less" >

    @import "../style/indexCss/common.css";
    @import "../style/indexCss/style.css";

    #app2 {
        margin-top: -5px;
    }

</style>

