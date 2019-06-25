<template>
    <div class="risk">
        <div class="prompt">
            <div class="prompt-title">
                <span>事项</span>
                <span>责任人</span>
                <span>计划完成日期</span>
            </div>
            <div class="prompt-top">
                <p v-for="(item,index) in this.riskData" :key="index">
                    <span :class="{active:index+1==isActive}" @click="infospan(index)">
                        <i class="iconfont icon-dian"></i>
                        {{item.info}}
                    </span>
                    <span>{{item.name}}</span>
                    <span>{{item.time}}</span>
                </p>
            </div>
            <p class="p-bottom">仅显示近三天内的风险提示</p>
        </div>
    </div>
</template>

<script>
export default {
    components: {},
    props: {},
    data() {
        return {
            isActive: false,
            riskData: [
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '江郭溯',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '徐淼淼',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '潘晴晴',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '江郭溯',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '徐淼淼',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '潘晴晴',
                    time: '2019.05.02'
                },
                {
                    info: '环境品质风险超限环境品质风险超限环境品质风险超限',
                    name: '江郭溯',
                    time: '2019.05.02'
                }
            ]
        }
    },

    computed: {},

    mounted() {},

    methods: {
        infospan(index) {
            this.isActive = index + 1
        }
    }
}
</script>

<style scoped lang="less" style="text/less">
.risk {
    background: #f3f3f6;
    .prompt {
        .prompt-title {
            letter-spacing: -1px;
            padding: 0 32px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            width: 100%;
            height: 70px;
            background-color: #f6f7fc;
            text-align: left;
            span {
                font-size: 24px;
                color: #777d95;
            }
            span:nth-of-type(1) {
                width: 334px;
            }
            span:nth-of-type(2) {
                width: 76px;
            }
            span:nth-of-type(3) {
                width: 152px;
            }
        }
        .prompt-top {
            letter-spacing: -1px;
            padding: 0 32px 0 0;
            background-color: #ffffff;
            .explain {
                position: absolute;
                z-index: 99;
                display: inline-block;
                padding: 5px;
                background: #40455a;
                padding: 20px;
                left: 50px;
                top: 50px;
                border-radius: 4px;
                color: #fff;
                display: none;
            }
            p {
                display: flex;
                justify-content: space-between;
                align-items: center;
                // height: 96px;
                padding: 25px 0;
                border-bottom: 1PX solid #f3f3f6;
                margin-left: 32px;
                span {
                    font-size: 30px;
                    color: #212128;
                    display: inline-block;
                }
                span:nth-of-type(1) {
                    width: 324px;
                    // word-break: break-all;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    i {
                        color: #51ba2c;
                    }
                    &.active {
                        width: 324px;
                        overflow: visible;
                        white-space: normal;
                    }
                }
                span:nth-of-type(3) {
                    width: 152px;
                }
            }
        }

        .p-bottom {
            width: 280px;
            height: 34px;
            font-size: 24px;
            color: #777d95;
            letter-spacing: -1px;
            margin: 18px auto;
        }
    }
}
</style>