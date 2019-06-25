/**
*@author: fugy-updated
*@date: 2018.10.12
*@info: 朵朵报修的下拉的弹框
 */
<template>
    <!--选择报修问题，报修地点和报修设备都复用此文件，进行选择-->
    <transition name="dialogBgdShow" mode="out-in">
        <div v-show="isDialogShow" class="dialog" @touchstart.prevent="blackClose" @touchmove.prevent="'null'">
            <transition name="dialogShow" mode="out-in">
                <div class="selectMes" v-show="isDialogShow" @touchmove.prevent="'null'">
                    <div class="sureOrCancel" @touchmove.prevent="'null'">
                        <span @touchstart.prevent="closeDialog">取消</span>
                        <span @touchstart.prevent="sureToChoose">确定</span>
                    </div>
                    <div class="choosePlace" @touchmove.prevent="'null'">
                        <div class="placeMes">
                            <span>{{discribe?discribe.left:''}}</span>
                            <span>{{discribe?discribe.right:''}}</span>
                        </div>
                        <mt-picker :slots="linkage" @change="onValuesChange"></mt-picker>
                    </div>
                </div>
            </transition>
        </div>
    </transition>
</template>
<script>
import { Picker } from 'mint-ui'
import { mapActions, mapGetters } from 'vuex'
export default {
    name: 'custom-dialog',
    props: ['isDialogShow', 'renderArr'],
    data() {
        return {
            discribe: null, //选择时的描述信息
            linkage: [
                {
                    flex: 3,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                },
                {
                    flex: 7,
                    values: [],
                    className: 'slot3',
                    textAlign: 'center'
                }
            ],
            repairMes: {
                //回填数据
                wrapId: 0,
                leftVal: '',
                insetId: 0,
                rightVal: ''
            }
        }
    },
    // computed: {
    //     ...mapGetters(['spaceMes'])
    // },
    methods: {
        blackClose(e) {
            if (e.target.className == 'dialog') {
                this.closeDialog()
            }
        },
        // ...mapActions(['SaveSpaceMes']),
        onValuesChange(picker, values) {
            //当左侧的选择改变的时候，触发这个函数
            let leftVal = values[0] //values是两侧数据组成的数组，第一项就是左侧的内容
            if (this.renderArr) {
                //筛选出左侧内容对应的child
                let valse = this.renderArr.filter(item => {
                    return item.name == leftVal
                })[0]
                if (!valse) {
                    return
                }
                // 筛选右侧的数据
                let rightList = valse.child.map(item => {
                    return item.name
                })
                picker.setSlotValues(1, rightList)
                // 保存回调数据----to ---emit-----------------------------
                if (values[0] && values[1] && valse.child && valse.child.length) {
                    this.repairMes.wrapId = valse.id
                    this.repairMes.leftVal = values[0]
                    let rightObj = valse.child.filter(item => {
                        return item.name == values[1]
                    })[0]
                    if (rightObj) {
                        this.repairMes.insetId = rightObj.id
                    }
                    this.repairMes.rightVal = values[1]
                } else {
                    return false
                }
            }
        },
        sureToChoose() {
            //将选择的信息提交给repair页
            this.$emit('renderCont', this.repairMes)
            //关闭弹窗
            this.closeDialog()
        },
        closeDialog() {
            this.$emit('closeDialog')
        }
    },
    watch: {
        renderArr(val) {
            this.linkage[0].values = val.map(item => {
                return item.name
            })
            this.discribe = {
                left: val.left,
                right: val.right
            }
        }
    }
}
</script>
<style lang="less">
@rem: 30rem;
.dialogBgdShow-enter-active,
.dialogBgdShow-leave-active {
    transition: all 0.5s;
}

.dialogBgdShow-enter,
.dialogBgdShow-leave-active {
    opacity: 0;
}

.dialogShow-enter-active,
.dialogShow-leave-active {
    transition: all 0.5s;
}

.dialogShow-enter,
.dialogShow-leave-active {
    transform: translateY(600 / @rem);
    opacity: 0;
}

.dialog {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 1;
    background-color: rgba(0, 0, 0, 0.5);
}

.selectMes {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 600 / @rem;
    background: #fff;
    overflow: hidden;
    .sureOrCancel {
        width: 100%;
        height: 80 / @rem;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #dce0e2;
        span {
            display: block;
            padding: 0 32 / @rem;
            height: 100%;
            line-height: 80 / @rem;
        }
        span:last-of-type {
            color: #44b197;
        }
    }
    .choosePlace {
        width: 100%;
        height: calc(~'100% - 2.66666667rem');
        .placeMes {
            background-color: #f3f6f7;
            font-size: 26 / @rem;
            height: 60 / @rem;
            line-height: 60 / @rem;
            display: flex;
            justify-content: space-around;
            border-bottom: 1px solid #dce0e2;
            span {
                text-align: center;
            }
            span:nth-of-type(1) {
                flex: 3;
            }
            span:nth-of-type(2) {
                flex: 7;
            }
        }
        .picker {
            height: calc(~'100% - 2rem');
            .picker-items {
                height: 100%;
            }
        }
        .picker-center-highlight {
            top: 90px;
        }
        .picker-selected {
            background-color: #fff;
            color: #44b197;
        }
        .slot1 {
            background-color: #f8f8f8;
            height: 100%;
        }
    }
}
</style>
