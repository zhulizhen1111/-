<template>
    <div class="worth">
        <mt-navbar v-model="selecteValue">
            <mt-tab-item id="1">年化风险价值</mt-tab-item>
            <mt-tab-item id="2">风险损失量评估</mt-tab-item>
            <mt-tab-item id="3">风险防控措施</mt-tab-item>
        </mt-navbar>
        <mt-tab-container v-model="selecteValue">
            <mt-tab-container-item id="1">
                <!-- 风险价值 -->
                <value-risk :tempera1="tempera1"></value-risk>
            </mt-tab-container-item>
            <mt-tab-container-item id="2">
                <risk-assess></risk-assess>
            </mt-tab-container-item>
            <mt-tab-container-item id="3">
                <risk-control></risk-control>
            </mt-tab-container-item>
        </mt-tab-container>
    </div>
</template>

<script>
import valueRisk from "./valuerisk.vue"; //风险价值
import riskAssess from "./riskAssess.vue";
import riskControl from "./riskControl.vue";
export default {
  components: {
    valueRisk,
    riskAssess,
    riskControl
  },
  data() {
    return {
      selected: "1",
      selecteValue: "1",
      tempera1: [
        //风险价值
        {
          type: "事故风险价值：98万元",
          compans: [
            {
              class: "icon-xiaofang3",
              num: "0.69",
              company: "消防"
            },
            {
              class: "icon-zhengcehegui3",
              num: "89",
              company: "政策合规"
            },
            {
              class: "icon-renshenshanghai3",
              num: "66",
              company: "人身伤害"
            },
            {
              class: "icon-jichufuwudamianjizhongduan3",
              num: "69",
              company: "服务服务大面积中断"
            },
            {
              class: "icon-zhongdianjichufuwuzhongduan3",
              num: "89",
              company: "重点基础服务中断"
            }
          ]
        },
        {
          type: "品质风险价值：98万元",
          compans: [
            {
              class: "icon-huanjingpinzhi3",
              num: "69",
              company: "环境品质"
            },
            {
              class: "icon-jichufuwuzhongduan3",
              num: "89",
              company: "基础服务局部中断"
            },
            {
              class: "icon-sheshiguzhang3",
              num: "66",
              company: "设施故障或缺失"
            },
            {
              class: "icon-fuwupinzhi3",
              num: "69",
              company: "服务品质"
            }
          ]
        },
        {
          type: "成本风险价值：98万元",
          compans: [
            {
              class: "icon-chaoyusuan3",
              num: "69",
              company: "超预算"
            },
            {
              class: "icon-chengbenbuhelizengjia3",
              num: "89",
              company: "成本不合理增加"
            },
            {
              class: "icon-shebeishoumingsuoduan3",
              num: "66",
              company: "设备寿命缩短"
            },
            {
              class: "icon-fuwufeiyongjisuanshizhun3",
              num: "0.69",
              company: "服务费用计算失准"
            }
          ]
        }
      ]
    };
  },

  computed: {},

  mounted() {},

  methods: {}
};
</script>

<style scoped lang="less" style="text/less">
.worth {
  width: 100%;
}
</style>
<style lang="less">
.oneMenu-left {
  .mt-progress {
    width: 544px;
    height: 6px;
    padding-top: 16px;
    padding-left: 0;
  }
}
.line .mt-progress {
  width: 548px;
  height: 6px;
  margin-top: 22px;
  padding-left: 0;
}
.mt-progress-runway {
  border-radius: 10px;
}
.mt-progress-progress {
  background: -webkit-linear-gradient(left, #4c8bd8 30%, #93b9e8 100%);
  border-radius: 10px;
}
.worth {
  .mint-tab-container{
    overflow:inherit;
  }
  .mint-cell {
    height: 120px;
    border-bottom: 1PX solid #efeff4;
  }
  .mint-navbar {
    height: 102px;
    background: #f3f3f6;
    letter-spacing: -1px;
    padding: 8px 32px;
    border-radius: 4px 0 0 4px;
    .mint-tab-item {
      width: 228px;
      height: 60px;
      text-align: center;
      padding-top: 15px;
      color: #4c8bd8;
      font-size: 28px;
      display: inline-block;
      border: 1PX solid #4c8bd8;
    }
    .mint-tab-item:nth-of-type(1) {
      border-radius: 8px 0 0 8px;
    }
    .mint-tab-item:nth-of-type(2) {
      border-right: none;
      border-left:none;
    }
    .mint-tab-item:nth-of-type(3) {
      border-radius: 0 8px 8px 0;
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
}
</style>
