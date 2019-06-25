/**
*@author: fugy-updated
*@date: 2018.10.12
*@info: 朵朵报修的评价
 */
<template>
    <div class="addRemark">
        <!--添加编辑内容-->
        <slot name="remark"></slot>
        <div class="editRemark">
            <!--文本域-->
            <textarea :placeholder="placeholders" class="editMes" rows="2" v-model="limitInput"></textarea>
            <div class="addStatus">
                <!--计算文字数量的-->
                <span></span>
                <span>{{limitInput.length}}/200</span>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'evaluateInput',
    props: ['placeholders'],
    data() {
        return {
            limitInput: ''
        }
    },
    watch: {
        limitInput(val) {
            if (val.length > 200) {
                this.limitInput = val.slice(0, 200)
            }
            this.$emit('limitinput', this.limitInput)
        }
    }
}
</script>
<style lang="less">
@rem: 30rem;
@phoneH: 330 / @rem;
.addRemark * {
    color: #333333;
}

.addRemark {
    margin-top: 20 / @rem;
    h4 {
        height: 68 / @rem;
        line-height: 68 / @rem;
        font-size: 26 / @rem;
        padding-left: 40 / @rem;
        color: #929499;
    }
}

.editRemark {
    background: #fff;
    padding: 30 / @rem 40 / @rem 0;
    .editMes {
        width: 100%;
        border: none;
        text-align: left;
        line-height: 50 / @rem;
        font-size: 30 / @rem;
        color: #333333;
    }
    .addStatus {
        width: 100%;
        height: 50 / @rem;
        color: #9597a0;
        line-height: 50 / @rem;
        display: flex;
        justify-content: space-between;
        span {
            color: #cacaca;
            font-size: 24 / @rem;
        }
    }
}
</style>