<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
	export default {}
</script>

<style lang="less">
    @import './style/element-ui';
    @import './style/font-awesome.min.css';
    @import './style/common';


    .el-table--border th.gutter:last-of-type {
        display: block!important;
        width: 17px!important;
    }

</style>
