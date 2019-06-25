/**
*@author: fugy-updated
*@date: 2018.10.16
*@info: 朵朵报修的报修列表
 */
<template>
    <!-- 报修记录 -->
    <div class="repairsRecord">
        <nav ref="statesChange">
            <span :class="{active:activeClass==0}" @touchstart.prevent="switchTab">进行中</span>
            <span :class="{active:activeClass==1}" @touchstart.prevent="switchTab">已完成</span>
        </nav>
        <div class="repairsRecordListWrap">
            <mt-loadmore :top-method="loadTop" :autoFill="false" :bottom-method="loadBottom" :bottom-all-loaded="allLoaded" ref="loadmore">
                <ul class="repairsRecordList">
                    <li v-for="(item,index) in listData" :key="index" class="clear" @click.prevent="toRepairDetail(item)">
                        <div class="repairImg fl">
                            <img src="../../../assets/imgleft.jpg" />
                        </div>
                        <div class="repairMes fl">
                            <h4>
                                <span>
                                    {{item.projLocalName}}
                                </span>
                                <span v-if="item.repairStatus.position=='EXECUTING'" class="repairing">
                                    {{item.repairStatus.cont}}
                                </span>
                                <span v-else-if="item.repairStatus.position=='FINISH-NOEVA'" clss="otherStatus">
                                    {{"已完成"}}
                                </span>
                                <span v-else clss="otherStatus">
                                    {{item.repairStatus.cont}}
                                </span>
                            </h4>
                            <div class="repairMesBtm clear">
                                <div class="discLeft fl">
                                    <span>
                                        报修地点: {{item.spaceName}}
                                    </span>
                                    <span>
                                        工单名称: {{item.orderName}}
                                    </span>
                                    <span>
                                        报修时间: {{item.repairTime}}
                                    </span>
                                </div>
                                <div class="discRight fl">
                                    <span v-if="item.repairStatus.position =='FINISH-NOEVA'" @click.prevent.stop="toEvaluate(item)">
                                        去评价
                                    </span>
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </mt-loadmore>
        </div>
    </div>
</template>
<script type="ecmascript-6">
// utils
import tools from 'utils/tools'
// api
import {
    executingdDetail, //进行中的报修记录
    finishDetail //已完成的报修记录
} from 'api/repair'
import { Indicator } from 'mint-ui'
export default {
    data() {
        return {
            activeClass: 0, //决定显示的那个数组，如果是已完成，该值为1
            allLoaded: false, //是否全部加载完毕
            page: 1,
            size: 10, //每页显示多少条
            count: 11, //一共多少条(默认size + 1)
            listData: [], //列表数据,
            repairStatus: [
                {
                    //枚举状态 //本地工单状态：1-新建NEW 2-抢单中ROBBINGORDER 3-待开始WAITINGSTART 4-执行中EXECUTING 5-待审核VERIFIED 6-延期完成DELAYFINISH 7-工单完成FINISH 8-工单关闭（中止）ABORT
                    position: 'NEW',
                    cont: '新建'
                },
                {
                    position: 'ROBBINGORDER',
                    cont: '抢单中'
                },
                {
                    position: 'WAITINGSTART',
                    cont: '待开始'
                },
                {
                    position: 'EXECUTING',
                    cont: '执行中'
                },
                {
                    position: 'VERIFIED',
                    cont: '待审核'
                },
                {
                    position: 'DELAYFINISH',
                    cont: '延期完成'
                },
                {
                    position: 'FINISH-NOEVA',
                    cont: '去评价'
                },
                {
                    position: 'FINISH-EVA',
                    cont: '已完成'
                },
                {
                    position: 'ABORT',
                    cont: '已关闭'
                }
            ]
        }
    },
    methods: {
        //去往评价页
        toEvaluate(obj) {
            let orderId = obj.orderId
            this.$router.push({
                path: 'evaluate',
                query: {
                    orderId: orderId
                }
            })
        },
        //去详情页
        toRepairDetail(obj) {
            let id = obj.id
            let orderId = obj.orderId
            //跳转时传递给报修详情页
            this.$router.push({
                path: 'repairDetail',
                query: {
                    id: id,
                    orderId: orderId
                }
            })
        },
        // 切换tab页面
        switchTab() {
            // mint ui 加载更多的样式问题
            let loadMoreDom = document.getElementsByClassName('mint-loadmore-top')[0]
            loadMoreDom.style.marginTop = '-50px'
            // js
            this.activeClass = this.activeClass == 0 ? 1 : 0
            this.page = 1
            this.listData = []
            this.allLoaded = false
            this.diffFetchData(this.page)
        },
        // 上拉刷新
        loadTop() {
            // mint ui 加载更多的样式问题
            // let loadMoreDom = document.getElementsByClassName("mint-loadmore-top")[0];
            // if(loadMoreDom.style.marginTop == "0px"){
            // 	loadMoreDom.style.marginTop = "-50px";
            // }
            this.listData = []
            this.page = 1
            this.diffFetchData(this.page)
            this.allLoaded = false
            this.$refs.loadmore.onTopLoaded()
        },
        // 下拉加载更多
        loadBottom() {
            let endPage = this.count / this.size + 1
            this.page++
            if (this.page < endPage) {
                this.diffFetchData(this.page)
            } else {
                this.allLoaded = true // 若数据已全部获取完毕
            }
            this.$refs.loadmore.onBottomLoaded()
        },
        // 分别获取数据
        diffFetchData(page) {
            Indicator.open({
                text: '加载中...',
                spinnerType: 'fading-circle'
            }) //开启loading
            if (this.activeClass == 0) {
                //进行中
                this.getUnderWayData(page)
            } else {
                //已完成
                this.getCompleteData(page)
            }
        },
        // 获取进行中的报修记录
        async getUnderWayData(page) {
            let params = {
                postParams: {
                    criteria: {},
                    page: page,
                    size: this.size
                }
            }
            let { result, content, count } = await executingdDetail(params)
            Indicator.close() //关闭loading
            if (result === 'success' && content.length) {
                this.count = count
                this.handleData(content)
            }
        },
        // 获取已完成的保修记录
        async getCompleteData(page) {
            let params = {
                postParams: {
                    criteria: {},
                    page: page,
                    size: this.size
                }
            }
            let { result, content, count } = await finishDetail(params)
            Indicator.close() //关闭loading
            if (result === 'success' && content.length) {
                this.count = count
                this.handleData(content)
            }
        },
        // 数据处理函数
        handleData(content) {
            // listData
            let arr = content.map((item, index) => {
                let repairStatus = null
                //枚举状态 //本地工单状态：1-新建NEW 2-抢单中ROBBINGORDER 3-待开始WAITINGSTART 4-执行中EXECUTING 5-待审核VERIFIED 6-延期完成DELAYFINISH 7-工单完成FINISH 8-工单关闭（中止）ABORT
                switch (item.fmStatus) {
                    case 'NEW':
                        repairStatus = this.repairStatus[0]
                        break
                    case 'ROBBINGORDER':
                        repairStatus = this.repairStatus[1]
                        break
                    case 'WAITINGSTART':
                        repairStatus = this.repairStatus[2]
                        break
                    case 'EXECUTING':
                        repairStatus = this.repairStatus[3]
                        break
                    case 'VERIFIED':
                        repairStatus = this.repairStatus[4]
                        break
                    case 'DELAYFINISH':
                        repairStatus = this.repairStatus[5]
                        break
                    case 'FINISH':
                        if (item.localRemarkStatus == 0) {
                            repairStatus = this.repairStatus[6]
                        } else {
                            repairStatus = this.repairStatus[7]
                        }
                        break
                    case 'ABORT':
                        repairStatus = this.repairStatus[8]
                        break
                    default:
                        repairStatus = '---'
                        break
                }
                let time = ''
                time = tools.formatDate(item.repairTime)
                return {
                    id: item.id,
                    orderId: item.orderId,
                    projId: item.projId,
                    projLocalName: item.projLocalName,
                    spaceName: item.spaceName,
                    orderName: item.orderName,
                    repairTime: time,
                    localRemarkStatus: item.localRemarkStatus,
                    repairStatus: repairStatus
                }
            })
            this.listData = this.listData.concat(arr)
        }
    },
    created() {
        document.title = '报修记录'
    },
    mounted() {
        this.allLoaded = false
        Indicator.open({
            text: '加载中...',
            spinnerType: 'fading-circle'
        })
        // mint ui 加载更多的样式问题
        // let loadMoreDom = document.getElementsByClassName("mint-loadmore-top")[0];
        // loadMoreDom.style.marginTop = "0";
        // 获取进行中的报修记录
        this.getUnderWayData(1)
        // loadMoreDom.style.marginTop = "-50px";
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
@h: 120 / @rem;
@ph: 50 / @rem;
.repairsRecord {
    width: 100%;
    height: 100%;
    overflow: hidden;
    nav {
        width: 100%;
        height: @h;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #ecf2f4;
        position: fixed;
        left: 0;
        top: 0;
        background-color: #fff;
        span {
            width: 50%;
            height: @h;
            line-height: @h;
            text-align: center;
        }
        span.active {
            background-color: #44b197;
            color: #fff;
        }
    }
}

.repairsRecordListWrap {
    margin-top: @h+10 / @rem;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
    padding-bottom: 50px;
}

.repairsRecordList {
    li {
        background-color: #fff;
        width: 100%;
        height: 284 / @rem;
        border-bottom: 1px solid #ecf2f4;
        padding-top: 40 / @rem;
    }
    .repairImg {
        /*报修图片*/
        width: 110 / @rem;
        padding: 0 20 / @rem 0 30 / @rem;
        img {
            width: 60 / @rem;
            height: 60 / @rem;
            border-radius: 4px;
        }
    }
    .repairMes {
        /*报修信息*/
        width: 610 / @rem;
        h4 {
            display: flex;
            justify-content: space-between;
            align-items: center;
            font-weight: normal;
            span:nth-of-type(1) {
                display: inline-block;
                height: 60 / @rem;
                line-height: 60 / @rem;
                font-size: 34 / @rem;
                color: #000;
                max-width: 340 / @rem;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
            span:nth-of-type(2) {
                display: inline-block;
                width: 94 / @rem;
                height: 34 / @rem;
                color: #9597a0;
                line-height: normal;
                border: 1px solid #dbdcde;
                border-radius: 3px;
                font-size: 22 / @rem;
                text-align: center;
                margin-right: 15 / @rem;
            }
            span:nth-of-type(2).repairing {
                color: #ffb515;
                border-color: #ffb515;
            }
        }
        .repairMesBtm {
            .discLeft {
                width: 490 / @rem;
                display: flex;
                flex-direction: column;
                justify-content: space-around;
                span {
                    display: inline-block;
                    width: 100%;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    overflow: hidden;
                    height: 184 / @rem / 4;
                    line-height: 184 / @rem / 4;
                    color: #9597a0;
                    font-size: 28 / @rem;
                }
            }
            .discRight {
                padding-top: 90 / @rem;
                span {
                    display: block;
                    width: 120 / @rem;
                    height: @ph;
                    padding: 6 / @rem 0;
                    border-radius: @ph / 2;
                    font-size: 28 / @rem;
                    color: #fff;
                    text-align: center;
                    background-color: #44b197;
                }
            }
        }
    }
}
</style>