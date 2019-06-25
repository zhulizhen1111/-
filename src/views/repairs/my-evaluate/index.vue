<template>
    <!-- 我要评价 -->
    <div class="repairsRecord">
        <div class="repairsRecordListWrap" v-setHeight ref="loadMore">
            <ul class="repairsRecordList">
                <li v-for="(item, index) in hasCompletedData" class="clear" @click.prevent="toRepairDetail(item.repairId)" :key="index">
                    <div class="repairImg fl">
                        <img src="../../../assets/imgleft.jpg" />
                    </div>
                    <div class="repairMes fl">
                        <h4>
                            <span>
                                {{item.repairBuilding}}
                            </span>
                            <span v-if="item.repairStatus=='维修中'" class="repairing">
                                {{item.repairStatus}}
                            </span>
                            <span v-else clss="otherStatus">
                                {{item.repairStatus}}
                            </span>
                        </h4>
                        <div class="repairMesBtm clear">
                            <div class="discLeft fl">
                                <span>
                                    报修地点: {{item.repairPlace}}
                                </span>
                                <span>
                                    报修问题: {{item.repairIssue}}
                                </span>
                                <span>
                                    报修时间: {{item.repairTiem}}
                                </span>
                            </div>
                            <div class="discRight fl">
                                <span v-if="item.repairStatus=='待评价'" @click.prevent.stop="toEvaluate(item.repairId)">
                                    评价
                                </span>
                            </div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>
<script type="ecmascript-6">
import { toEvaluateRecord } from 'api/repair'
import tools from 'utils/tools'
import { mapActions } from 'vuex'
import BScroll from 'better-scroll'
export default {
    props: ['myEvaluate'],
    data() {
        return {
            hasCompletedData: [], //保存已完成数据
            underWayDatas: [], //进行中的数据
            hcpage: 1, //已完成的page数
            loadMore: true,
            scroll: null
        }
    },
    watch: {
        hasCompletedData(val, oldVal) {
            this.$nextTick(() => {
                this.scroll.refresh()
                this.loadMore = true
            })
        }
    },
    directives: {
        setHeight(el, binding) {
            const elMargin = el.getBoundingClientRect().top
            el.style.height = window.innerHeight - elMargin + 'px'
        }
    },
    methods: {
        ...mapActions(['SaveJobId']),
        getCompDatas(page) {
            //获取已完成的数据
            this.loadMore = false
            toEvaluateRecord(page).then(res => {
                if (res.data.Result == 'success') {
                    let newDatas = res.data.Content.map(item => {
                        return {
                            repairId: item.id,
                            repairBuilding: item.projectName,
                            repairPlace: item.place,
                            repairIssue: item.question,
                            repairTiem: tools.getDates(item.time),
                            repairStatus: item.status
                        }
                    })
                    console.log(res.data.Content)
                    this.hasCompletedData = this.hasCompletedData.concat(newDatas)
                }
            })
        },
        toEvaluate(id) {
            //去往评价页
            this.$router.push({ name: 'evaluate', params: { id } })
        },
        toRepairDetail(id) {
            //保存id到vuex
            this.SaveJobId(id)
            //跳转时传递给报修详情页
            this.$router.push({ name: 'repairDetail', params: { id } })
        }
    },
    created() {
        document.title = '我要评价'
        this.getCompDatas(this.hcpage)
    },
    mounted() {
        let wrap = this.$refs.loadMore
        const mH = wrap.getBoundingClientRect().top
        const wrapH = wrap.getBoundingClientRect().height
        let ul = wrap.firstElementChild
        this.scroll = new BScroll(wrap, {
            startX: 0,
            startY: 0,
            probeType: 3,
            click: true
        })
        this.scroll.on('scroll', pos => {
            // pos是位置信息对象
            let ulH = ul.scrollHeight
            if (!~~(ulH - wrapH + mH + pos.y) && this.loadMore) {
                this.hcpage += 1
                this.getCompDatas(this.hcpage)
            }
        })
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
        border-bottom: 1PX solid #ecf2f4;
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
    margin-top: 10 / @rem;
    overflow-x: hidden;
    overflow-y: auto;
    position: relative;
}
.repairsRecordList {
    li {
        background-color: #fff;
        width: 100%;
        height: 284 / @rem;
        border-bottom: 1PX solid #ecf2f4;
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