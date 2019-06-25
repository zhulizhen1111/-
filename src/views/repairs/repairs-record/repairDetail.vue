/**
*@author: fugy-updated
*@date: 2018.10.17
*@info: 朵朵报修的报修详情
 */
<template>
    <!--报修详情-->
    <div class="repairDetail">
        <!--报修信息的头部-->
        <header class="clear" v-if="repairState">
            <div class="fl">
                <i v-if="repairState.icon" :class="repairState.icon"></i>
                <span :class="!repairState.icon?'addmargin':''">{{repairState.cont}}</span>
            </div>
            <div v-if="repairState.position=='FINISH-NOEVA'" class="fl" @touchstart.prevent="toEvaluate">
                <span>
                    去评价
                </span>
            </div>
        </header>
        <section>
            <h4>报修详情</h4>
            <div class="repairDetailInfo">
                <ul class="maintainMesList">
                    <li>
                        <span>报修建筑</span>
                        <span>{{repairBuilding}}</span>
                    </li>
                    <li>
                        <span>报修地点</span>
                        <span>{{repairPlace}}</span>
                    </li>
                    <li>
                        <span>报修问题</span>
                        <span>{{repairIssue}}</span>
                    </li>
                    <li>
                        <span>报修时间</span>
                        <span>{{repairTime}}</span>
                    </li>
                    <li>
                        <span>联系方式</span>
                        <span>{{repairPhone}}</span>
                    </li>
                    <li>
                        <span>添加备注</span>
                        <span>{{repairRemark}}</span>
                    </li>
                </ul>
            </div>
        </section>
        <footer v-if="principal&&principal.length">
            <h4>维修信息</h4>
            <ul class="maintainMes">
                <!--维修信息-->
                <li class="clear">
                    <div>
                        <i class="icon iconfont icon-dianligongchengshi"></i>
                        <span>维修人</span>
                    </div>
                    <div class="name">
                        <span v-for="(item,index) in principal" :key="index">
                            <!--负责人-->
                            {{item.name}}
                        </span>
                    </div>
                </li>
                <li v-if="startTime">
                    <div>
                        <i class="icon iconfont icon-kaishishijian"></i>
                        <span>开始时间</span>
                    </div>
                    <div>
                        {{startTime}}
                    </div>
                </li>
                <li v-if="endTime">
                    <div>
                        <i class="icon iconfont icon-zhi"></i>
                        <span>结束时间</span>
                    </div>
                    <div>
                        {{endTime}}
                    </div>
                </li>
            </ul>
        </footer>
    </div>
</template>
<script type="ecmascript-6">
// api
import { getRepairDetail } from 'api/repair'
// utils
import tools from 'utils/tools'
export default {
    data() {
        return {
            id: null, //id
            orderId: null, //orderId
            // 订单状态
            repairState: null, //工单状态
            repairBuilding: '', //报修的建筑
            repairPlace: '', //报修的地点
            repairIssue: '', //报修问题
            repairTime: 0, //报修时间
            repairPhone: 0, //报修联系电话
            repairRemark: '', //备注信息
            // 维修师傅
            principal: null, //负责人（对象）
            startTime: 0, //起始时间
            endTime: 0, //结束时间
            // 枚举值
            repairStatus: [
                {
                    //枚举状态 //本地工单状态：1-新建NEW 2-抢单中ROBBINGORDER 3-待开始WAITINGSTART 4-执行中EXECUTING 5-待审核VERIFIED 6-延期完成DELAYFINISH 7-工单完成FINISH 8-工单关闭（中止）ABORT
                    position: 'NEW',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '新建'
                },
                {
                    position: 'ROBBINGORDER',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '抢单中'
                },
                {
                    position: 'WAITINGSTART',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '待开始'
                },
                {
                    position: 'EXECUTING',
                    icon: 'icon iconfont icon-Wrench',
                    cont: '执行中'
                },
                {
                    position: 'VERIFIED',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '待审核'
                },
                {
                    position: 'DELAYFINISH',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '延期完成'
                },
                {
                    position: 'FINISH-NOEVA',
                    icon: 'icon iconfont icon-issue',
                    cont: '去评价'
                },
                {
                    position: 'FINISH-EVA',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '已完成'
                },
                {
                    position: 'ABORT',
                    icon: 'icon iconfont icon-shoulizhong',
                    cont: '已关闭'
                }
            ]
        }
    },
    methods: {
        toEvaluate() {
            let orderId = this.orderId
            this.$router.push({
                path: 'evaluate',
                query: {
                    orderId: this.orderId
                }
            })
        },
        // 获取报修详情
        async getRepairDetails() {
            let params = {
                getParams: {
                    id: this.id
                }
            }
            let res = await getRepairDetail(params)
            if ((res.result = 'success')) {
                this.dataHandle(res.content)
            }
        },
        // 数据处理
        dataHandle(content) {
            switch (content.fmStatus) { //枚举状态 //本地工单状态：1-新建NEW 2-抢单中ROBBINGORDER 3-待开始WAITINGSTART 4-执行中EXECUTING 5-待审核VERIFIED 6-延期完成DELAYFINISH 7-工单完成FINISH 8-工单关闭（中止）ABORT
                case 'NEW':
                    this.repairState = this.repairStatus[0]
                    break
                case 'ROBBINGORDER':
                    this.repairState = this.repairStatus[1]
                    break
                case 'WAITINGSTART':
                    this.repairState = this.repairStatus[2]
                    break
                case 'EXECUTING':
                    this.repairState = this.repairStatus[3]
                    break
                case 'VERIFIED':
                    this.repairState = this.repairStatus[4]
                    break
                case 'DELAYFINISH':
                    this.repairState = this.repairStatus[5]
                    break
                case 'FINISH':
                    if (content.localRemarkStatus == 0) {
                        this.repairState = this.repairStatus[6]
                    } else {
                        this.repairState = this.repairStatus[7]
                    }
                    break
                case 'ABORT':
                    this.repairState = this.repairStatus[8]
                    break
            }

            this.repairBuilding = content.projLocalName
            this.repairPlace = content.spaceName
            this.repairIssue = content.problemName
            this.repairTime = tools.formatDate(content.createTime)
            this.repairPhone = content.phone
            this.repairRemark = content.remark
            // 维修师傅
            this.principal = content.executors
            this.startTime = content.repairStartTime ? tools.formatDate(content.repairStartTime) : '---'
            this.endTime = content.repairEndTime ? tools.formatDate(content.repairEndTime) : '---'
        }
    },
    created() {
        document.title = '报修详情'
    },
    mounted() {
        this.id = this.$route.query.id
        this.orderId = this.$route.query.orderId
        // 获取报修详情
        this.getRepairDetails()
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
.repairDetail {
    width: 100%;
    .addmargin {
        margin-left: 20 / @rem;
    }
}

.repairDetail h4 {
    padding-top: 25 / @rem;
    padding-left: 42 / @rem;
    height: 84 / @rem;
    line-height: 64 / @rem;
    font-size: 24 / @rem;
    font-weight: normal;
    color: #6d6d6d;
}

.repairDetail header {
    background-color: #fff;
    height: 111 / @rem;
    line-height: 111 / @rem;
    padding-left: 21 / @rem;
    div:first-of-type {
        width: 549 / @rem;
        i {
            display: inline-block;
            margin: 10 / @rem 21 / @rem;
            width: 50 / @rem;
            height: 50 / @rem;
            background-color: #e7ecf0;
            color: #000;
            line-height: 54 / @rem;
            text-align: center;
            border-radius: 4px;
        }
        span {
            display: inline-block;
            font-size: 32 / @rem;
            color: #1c1c20;
        }
    }
    div:nth-of-type(2) {
        height: 100%;
        display: flex;
        span {
            display: block;
            width: 150 / @rem;
            margin: auto;
            height: 50 / @rem;
            line-height: 50 / @rem;
            color: #fff;
            background-color: #44b197;
            text-align: center;
            border-radius: 25 / @rem;
        }
    }
}

.repairDetailInfo {
    width: 100%;
    background-color: #fff;
    .maintainMesList {
        padding: 20 / @rem;
        li {
            span {
                font-size: 27 / @rem;
                line-height: 60 / @rem;
                display: inline-block;
            }
            span:first-of-type {
                padding: 0 32 / @rem;
                height: 60 / @rem;
                color: #9597a0;
                vertical-align: top;
            }
            span:nth-of-type(2) {
                max-width: 510 / @rem;
            }
        }
    }
}

.repairImgs {
    padding-left: 30 / @rem;
    padding-bottom: 30 / @rem;
    img {
        float: left;
        margin-left: 10 / @rem;
        width: 160 / @rem;
        height: 160 / @rem;
        border-radius: 4px;
    }
}

.maintainMes {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    padding: 20 / @rem 0;
    li {
        display: flex;
        align-items: center;
        height: 75 / @rem;
        div {
            line-height: 75 / @rem;
            font-size: 27 / @rem;
        }
        div:nth-of-type(1) {
            color: #9597a0;
            padding-left: 18 / @rem;
            i {
                display: inline-block;
                vertical-align: baseline;
                margin: 0 18 / @rem;
            }
        }
        div:nth-of-type(2) {
            max-width: 510 / @rem;
            margin-left: 20 / @rem;
        }
        div:nth-of-type(2).name {
            color: #44b197;
        }
    }
}
</style>