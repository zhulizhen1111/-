<template>
    <div class="personInfo">
        <header class="clear">
            <div class="personInfoLeft fl">
                <h3>{{name}}</h3>
                <div>
                    <span>
                        <i class="icon iconfont icon-dianhua"></i>
                    </span> {{phone}}
                </div>
            </div>
            <div class="personInfoRight fl">
                <img :src="picUrl||'../../../../favicon.ico'" />
            </div>
        </header>
        <div class="capacity">
            <h4>能力级1别</h4>
            <ul>
                <li v-for="(item,index) in capacity" :key="index">
                    <span>{{item.name}}</span>
                    <span>{{item.level}}级</span>
                </li>
            </ul>

        </div>
        <div class="evaluate">
            <h4>能力级别</h4>
            <ul>
                <li class="clear">
                    <span class="fl">质量</span>
                    <span class="fl" v-if="evaluate.qualityScore" v-start="evaluate.qualityScore">
                        <i v-for="(item,index) in 5" :key="index" class="icon iconfont icon-xingxing">

                        </i>
                    </span>
                    <span v-else>
                        暂无评分
                    </span>
                </li>
                <li class="clear">
                    <span class="fl">速度</span>
                    <span class="fl" v-if="evaluate.speedScore" v-start="evaluate.speedScore">
                        <i v-for="(item,index) in 5" :key="index" class="icon iconfont icon-xingxing">

                        </i>
                    </span>
                    <span v-else>
                        暂无评分
                    </span>
                </li>
                <li class="clear">
                    <span class="fl">态度</span>
                    <span class="fl" v-if="evaluate.attitudeScore" v-start="evaluate.attitudeScore">
                        <i v-for="(item,index) in 5" :key="index" class="icon iconfont icon-xingxing">

                        </i>
                    </span>
                    <span v-else>
                        暂无评分
                    </span>
                </li>

            </ul>
        </div>
    </div>
</template>
<script type="ecmascript-6">
import { workerDetail, workerScore } from 'api/repair'
export default {
    name: 'personInfo',
    data() {
        return {
            id: 0,
            name: '',
            phone: '',
            picUrl: '',
            capacity: null, //能力
            evaluate: {
                attitudeScore: 0,
                qualityScore: 0,
                speedScore: 0
            } //评价
        }
    },
    directives: {
        start(el, binding) {
            let childs = el.children
            for (let i = 0; i < binding.value; i++) {
                if (i < binding.value) {
                    childs[i].classList.add('active')
                }
            }
        }
    },
    created() {
        document.title = '师傅信息'
        let projectId = this.$route.params.obj.projectId
        let workerId = this.$route.params.obj.id
        workerDetail({
            projectId,
            workerId
        }).then(res => {
            console.log(res)
            if (res.data.result == 'success') {
                const data = res.data.Content
                this.name = data.name
                this.phone = data.phoneNum || '--'
                this.capacity = data.levels.map(item => {
                    return {
                        name: item.levelDesc.split('-')[0],
                        level: item.level
                    }
                })
            }
        })
        workerScore({
            projectId,
            workerId
        }).then(res => {
            if (res.data.result == 'success') {
                const data = res.data
                this.evaluate.attitudeScore = data.attitudeScore || 3
                this.evaluate.qualityScore = data.qualityScore || 1
                this.evaluate.speedScore = data.speedScore || 5
            }
        })
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
.personInfo {
    h4 {
        padding-top: 25 / @rem;
        padding-left: 42 / @rem;
        height: 84 / @rem;
        line-height: 64 / @rem;
        font-size: 26 / @rem;
        font-weight: normal;
        color: #6d6d6d;
    }
    header {
        background-color: #fff;
        height: 162 / @rem;
        .personInfoLeft {
            width: 627 / @rem;
            padding-left: 39 / @rem;
            h3 {
                margin-top: 15 / @rem;
                line-height: 60 / @rem;
            }
            div {
                line-height: 72 / @rem;
                font-size: 30 / @rem;
                color: #9597a0;
                span {
                    display: inline-block;
                    width: 45 / @rem;
                    height: 45 / @rem;
                    border-radius: 50%;
                    background-color: #44b197;
                    vertical-align: 3 / @rem;
                    i {
                        display: block;
                        width: 100%;
                        line-height: 45 / @rem;
                        color: #fff;
                        text-align: center;
                        font-size: 24 / @rem;
                    }
                }
            }
        }
        .personInfoRight {
            width: 100 / @rem;
            display: flex;
            margin-top: 30 / @rem;
            img {
                width: 100 / @rem;
                height: 100 / @rem;
                border-radius: 50%;
            }
        }
    }
    .capacity {
        ul {
            background-color: #fff;
            padding: 10 / @rem 0;
        }
        li {
            line-height: 90 / @rem;
            padding-left: 40 / @rem;
            span {
                display: inline-block;
                margin: 0 5 / @rem;
            }
            span:nth-of-type(1) {
                color: #9597a0;
            }
            span:nth-of-type(2) {
                color: #000;
            }
        }
    }
    .evaluate {
        ul {
            background-color: #fff;
            padding: 10 / @rem 0;
        }
        li {
            line-height: 90 / @rem;
            padding-left: 40 / @rem;
            span {
                display: inline-block;
                margin: 0 5 / @rem;
            }
            span:nth-of-type(1) {
                color: #9597a0;
            }
            span:nth-of-type(2) {
                width: 400 / @rem;
                display: flex;
                height: 90 / @rem;
                line-height: 90 / @rem;
                margin-left: 20 / @rem;
                justify-content: space-around;
                i {
                    display: inline-block;
                    width: 80 / @rem;
                    text-align: center;
                    color: #979898;
                }
                i.active {
                    color: #ffb515;
                }
            }
        }
    }
}
</style>