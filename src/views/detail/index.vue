<template>
    <div class='detail'>
        <mt-navbar v-model='selecteValue'>
            <mt-tab-item id='1'>风险值超限</mt-tab-item>
            <mt-tab-item id='2'>风险值未超限</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model='selecteValue'>
            <mt-tab-container-item id='1'>
                <div class='line' v-for='(item,index) in detailArr' :key='index' @click='changeProject(item)'>
                    <div class='line-left'>
                        <p class='one-p'>{{item.name}}</p>
                        <mt-progress :value='item.value' :bar-height='6'></mt-progress>
                        <span>{{item.value}}万元</span>
                    </div>
                    <div class='line-right'>
                        <i class='iconfont icon-ic_arrow_r' @click='this.router.push("/")'></i>
                    </div>
                </div>
            </mt-tab-container-item>
            <mt-tab-container-item id='2'>
                <div class='line' v-for='(item,index) in detailArr' :key='index' @click='changeProject(item)'>
                    <div class='line-left'>
                        <p class='one-p'>{{item.name}}</p>
                        <mt-progress :value='item.value' :bar-height='6'></mt-progress>
                        <span>{{item.value}}万元</span>
                    </div>
                    <div class='line-right'>
                        <i class='iconfont icon-ic_arrow_r' @click='this.router.push("/")'></i>
                    </div>
                </div>
            </mt-tab-container-item>
        </mt-tab-container>
        <floating-layer :isShowModal.sync='popupVisible' :itemValue='itemValue'></floating-layer>
    </div>
</template>
<script>
import floatingLayer from './floatinglayer'
export default {
    components: {
        floatingLayer
    },
    data() {
        return {
            selected: '1',
            popupVisible: false,
            selecteValue: '1',
            itemValue: '',
            popup: false,
            detailArr: [
                {
                    name: '1#中央供冷系统-室内温度过高风险',
                    value: 4,
                    size: 40
                },
                {
                    name: '1#会议室-室内温度过高风险',
                    value: 7,
                    size: 40
                },
                {
                    name: '1#空调末端系统-室内温度过高风险',
                    value: 8,
                    size: 40
                }
            ]
        }
    },
    computed: {
        modalShow: {
            get() {
                return this.isShowModal
            },

            set(val) {
                this.$emit('update:isShowModal', val)
            }
        }
    },
    mounted() {},

    methods: {
        changeProject(itemValue) {
            this.itemValue = itemValue
            // document.querySelector('.mask').style.display='block';
            this.popupVisible = true
        },
    }
}
</script>

<style scoped lang="less" style="text/less">
.detail {
    .line {
        display: flex;
        justify-content: space-between;
        height: 120px;
        border-bottom: 1PX solid #efeff4;
        padding: 0 32px;
        background: #fff;
        .line-left {
            position: relative;
            width: 628px;
            margin-top: 18px;
            height: 84px;
            p {
                padding: 0;
                height: 42px;
                color: #212128;
                font-size: 30px;
            }
            span {
                font-size: 24px;
                color: #777d95;
                position: absolute;
                right: 0;
                bottom: 0;
            }
        }
        .line-right {
            padding: 40px 0;
            .icon-ic_arrow_r {
                width: 12px;
                height: 20px;
                font-size: 12px;
                color: #d5d7e7;
            }
        }
    }
}
</style>
<style lang="less">
.detail {
    .line .mt-progress {
        width: 548px;
        height: 6px;
        margin-top: 22px;
    }
    .mint-navbar {
        height: 120px;
        background: #f3f3f6;
        letter-spacing:px;
        padding: 20px 146px;
        .mint-tab-item {
            width: 228px;
            height: 60px;
            text-align: center;
            margin-top: 10px;
            padding: 15px 28px 10px 28px;
            color: #4c8bd8;
            font-size: 28px;
            display: inline-block;
            border: 1PX solid #4c8bd8;
        }
        .mint-tab-item:nth-of-type(1) {
            border-radius: 10px 0 0 10px;
        }
        .mint-tab-item:nth-of-type(2) {
            border-radius: 0 10px 10px 0px;
        }
        .mint-tab-item-label {
            font-size: 28px;
            letter-spacing: -1px;
        }
        .is-selected {
            background: #4c8bd8;
            color: #fff;
            position: relative;
        }
        .is-selected:after {
            display: none;
        }
    }
    .mint-popup {
        width: 100%;
        height: 80%;
        overflow: scroll;
    }
    .popup-box {
        .mint-tab-item {
            flex: none;
            padding-left: 10px;
        }
        .mint-navbar {
            text-align: left;
        }
        .is-selected {
            border: none;
        }
    }
}
</style>


