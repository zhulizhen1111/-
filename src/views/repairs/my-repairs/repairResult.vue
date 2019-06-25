/**
*@author: fugy-updated
*@date: 2018.10.15
*@info: 朵朵报修的报修结果
 */
<template>
    <!--报修处理结果-->
    <div class="repairSuccess">
        <div>
            <span>
                <img src="../../../assets/complete.png" />
            </span>
            <span>您的报修已提交成功</span>
        </div>
        <div>
            <span @click.prevent="turnToSelectBuilding">继续报修</span>
            <span @click.prevent="turnToRepairsRecord">查看详情</span>
        </div>
    </div>
</template>
<script type="ecmascript-6">
export default {
    name: 'repairResult',
    data() {
        return {
            orderId: null //订单id
        }
    },
    methods: {
        turnToSelectBuilding() {
            this.$router.push({ path: 'selectBuilding' })
        },
        turnToRepairsRecord() {
            this.$router.push({ path: 'repairsRecord' })
        }
    },
    created() {
        document.title = '朵朵报修'
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
.repairSuccess {
    height: 100%;
    div:nth-of-type(1) {
        height: 417 / @rem;
        padding-top: 102 / @rem;
        span:first-of-type {
            display: flex;
            margin: 0 auto;
            width: 140 / @rem;
            height: 140 / @rem;
            background-color: #d1d3db;
            border-radius: 50%;
            img {
                width: 100%;
                height: 100%;
            }
        }
        span:last-of-type {
            display: block;
            height: 126 / @rem;
            line-height: 126 / @rem;
            text-align: center;
            font-size: 28 / @rem;
        }
    }
    div:nth-of-type(2) {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 231 / @rem;
        span {
            display: block;
            width: 100%;
            height: 100 / @rem;
            text-align: center;
            line-height: 100 / @rem;
        }
        span:nth-of-type(1) {
            background-color: #44b197;
            color: #fff;
        }
        span:nth-of-type(2) {
            background-color: #fff;
            color: #000;
        }
    }
}
</style>