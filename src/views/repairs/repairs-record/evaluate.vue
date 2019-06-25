/**
*@author: fugy-updated
*@date: 2018.10.15
*@info: 朵朵报修的报修评价
 */
<template>
    <!--评价页-->
    <div class="evaluate">
        <evaluate-input :placeholders="placeholders" @limitinput="limitinput">
        </evaluate-input>
        <ul class="grade">
            <!--评分-->
            <li class="clear" v-for="(item,index) in grade" :key="index">
                <span class="fl">{{item.dis}}</span>
                <div class="stars fl">
                    <i v-for="(item0,index) in 5" :key="index" v-star="{index:index,type:item.type}" @click.prevent="gradeForSubmit({index:index,type:item.type})" class="icon iconfont icon-xingxing setStar">
                    </i>
                </div>
            </li>
        </ul>
        <div class="submitEvaluate">
            <span @click.prevent="submitEvaluate">提交评价</span>
        </div>
    </div>
</template>
<script type="ecmascript-6">
import { Toast } from 'mint-ui'
import { saveEvaluate } from 'api/repair'
import evaluateInput from '../common/evaluateInput'
export default {
    components: {
        'evaluate-input': evaluateInput
    },
    data() {
        return {
            orderId: null, //订单id
            placeholders: '请填写您对此次服务的评价',
            limitInput: '', //提交的编辑的内容
            grade: [
                {
                    dis: '维修质量',
                    type: 'zl'
                },
                {
                    dis: '维修速度',
                    type: 'sd'
                },
                {
                    dis: '服务态度',
                    type: 'td'
                }
            ],
            gradeMes: {
                //提交的评分的分数
                zl: 0,
                sd: 0,
                td: 0
            },
            objForSubmit: {
                //提交对象
                orderId: null,
                quality: null,
                attitude: null,
                speed: null,
                contents: []
            }
        }
    },
    directives: {
        star: {
            bind(el, binding) {
                //没有解决的问题，无法找到this
                el.onclick = function() {
                    let val = binding.value
                    let allEle = this.parentNode.children
                    for (let i = 0; i < allEle.length; i++) {
                        i <= val.index ? allEle[i].classList.add('active') : allEle[i].classList.remove('active')
                    }
                }
            }
        }
    },
    methods: {
        limitinput(val) {
            this.limitInput = val
        },
        async submitEvaluate() {
            //提交将要保存的信息
            this.objForSubmit.orderId = this.orderId
            this.objForSubmit.quality = this.gradeMes.zl || 5 //质量
            this.objForSubmit.attitude = this.gradeMes.td || 5 //态度
            this.objForSubmit.speed = this.gradeMes.sd || 5 //速度
            this.objForSubmit.contents[0] = { content: this.limitInput } //输入的内容
            if (this.limitInput.length) {
                // console.log(this.objForSubmit)
                let params = {
                    postParams: this.objForSubmit
                }
                //提交信息到后台
                let { result } = await saveEvaluate(params)
                if (result === 'success') {
                    Toast('评价成功')
                    setTimeout(() => {
                        this.$router.push('repairsRecord')
                    }, 500)
                } else {
                    Toast('失败了')
                }
            } else {
                Toast('先说点什么吧？')
            }
        },
        gradeForSubmit(obj) {
            this.gradeMes[obj.type] = obj.index + 1
        }
    },
    mounted() {
        //提交评价的时候，需要用到这个里面的id
        this.orderId = this.$route.query.orderId
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
.grade {
    margin-top: 15 / @rem;
    background-color: #fff;
    height: 300 / @rem;
    padding: 15 / @rem 40 / @rem;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    li {
        span {
            display: inline-block;
            height: 90 / @rem;
            line-height: 90 / @rem;
            font-size: 27 / @rem;
            color: #9597a0;
        }
        .stars {
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
            }
        }
    }
}

.setStar {
    font-size: 30 / @rem;
    color: #979898;
}

.active {
    color: #ffb515;
}

.submitEvaluate {
    width: 100%;
    height: 100 / @rem;
    margin-top: 105 / @rem;
    span {
        display: block;
        width: 100%;
        height: 100 / @rem;
        line-height: 100 / @rem;
        font-size: 32 / @rem;
        color: #fff;
        background-color: #44b197;
        text-align: center;
    }
}
</style>