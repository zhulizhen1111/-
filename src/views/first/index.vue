<template>
  <div class="first">
    <div class="container">
      <!-- 风险提示 -->
      <div class="prompt">
        <mt-cell class="title-top" title="业主督办事项" to="/risk" is-link value></mt-cell>
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
      </div>
      <!-- 年化风险价值 -->
      <risk-warning></risk-warning>
      <!-- 人员 -->
      <personnel-page v-if="personInfo" :personInfo="personInfo"></personnel-page>
      <!-- 工单 -->
      <bill v-if="Object.keys(workOrder).length>0" :workOrder="workOrder"></bill>
      <!-- 环境 -->
      <environ-mental :environment="environment"></environ-mental>
      <!-- 能耗 -->
      <enery v-if="Object.keys(getAnnualEnergy).length>0" :getAnnualEnergy="getAnnualEnergy"></enery>
      <!-- 跳转方式 -->
      <jump></jump>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import riskWarning from "./Riskwarning/index";
import personnelPage from "./personnel"; //人员
import bill from "./bill"; //工单
import environMental from "./environmental"; //环境
import enery from "./enery"; //能耗
import jump from "./jump"; //跳转方式
import axios from "axios";
import { querySummaryData, executingdDetail } from "@/api/repair.js";
import { mapGetters, mapMutations } from "vuex";
export default {
  components: {
    riskWarning,
    personnelPage,
    bill,
    environMental,
    enery,
    jump
  },
  props: {},
  data() {
    return {
      isActive: false,
      popupVisible: false,
      // 业主督办事项
      riskData: [
        {
          info: "环境品质风险超限环境品质风险超限环境品质风险超限",
          name: "江郭溯",
          time: "2019.05.02"
        },
        {
          info: "环境品质风险超限环境品质风险超限环境品质风险超限",
          name: "徐淼淼",
          time: "2019.05.02"
        },
        {
          info: "环境品质风险超限环境品质风险超限环境品质风险超限",
          name: "徐淼淼",
          time: "2019.05.02"
        }
      ],
      //人员
      personInfo: {
        // planOnJobCount: 4,
        // actualOnJobCount: 9,
        // tempera3: [
        //     //人员
        //     {
        //         name: '龚冲驰',
        //         tel: '15205043365'
        //     },
        //     {
        //         name: '戴秀兰',
        //         tel: '15065240928'
        //     },
        //     {
        //         name: '戴冰冰',
        //         tel: '15092364945'
        //     }
        // ]
      },
      // 工单
      workOrder: {
        // createOrderNum: 209, //今日新发工单
        // finishOrderNum: 200, //今日完成工单
        // repairOrderNum: 5, //维修工单数量，没有则返回0
        // maintainOrderNum: 5, //维保工单数量，没有则返回0
        // inspectOrderNum: 5, //巡检工单数量，没有则返回0
        // runOrderNum: 5, //运行工单数量，没有则返回0
        // lastDayRepairOrderNum: 5, //昨天维修工单数量，没有则返回0
        // lastDayMaintainOrderNum: 5, //昨天维保工单数量，没有则返回0
        // lastDayInspectOrderNum: 5, //昨天巡检工单数量，没有则返回0
        // lastDayRunOrderNum: 5
      },
      //环境
      environment: {
        averageTdb: 26.5,
        averageCo2: 458.3,
        maxTdbValue: 28.6,
        minTdbValue: 20.6,
        maxCo2Value: 558.3,
        minCo2Value: 358.6
      },
      //能耗
      getAnnualEnergy: {
        averageTodayEnergy: 123,
        averageLastDayEnergy: 123,
        data: []
      }
    };
  },

  computed: {
    ...mapGetters(["projectId"])
  },

  mounted() {
    this.querySummaryData();
    this.queryEnery();
  },

  methods: {
    xianqin() {
      this.popupVisible = true;
    },
    infospan(index) {
      this.isActive = index + 1;
    },
    // 人员 工单 环境
    querySummaryData() {
      let params = {
        getParams: {}
      };
      querySummaryData(params).then(res => {
        // console.log(res)
        if (res.result == "success") {
          this.personInfo = res.content.personInfo.data;
          this.workOrder = res.content.workOrder;
          this.environment = res.content.environment;
        }
      });
    },
    // 能耗
    queryEnery() {
      let params = {
        getParams: {}
      };
      executingdDetail(params).then(res => {
        if (res.result == "success") {
          this.getAnnualEnergy = res.content;
        }
      });
    }
  }
};
</script>

<style scoped lang="less" style="text/less">
.first {
  .container {
    width: 100%;
  }
  .prompt {
    margin-bottom: 20px;
    background: #fff;
  }
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
      position: relative;
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
        }
        span:nth-of-type(1) {
          width: 324px;
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
      .mint-popup .mint-popup-left {
        width: 100px;
        p {
          width: 200px;
          height: 100px;
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
<style lang="less" style="text/less">
.prompt {
  color: #212128;
  .title-top {
    .mint-cell-text {
      font-size: 34px;
      color: #212128;
    }
  }
  .mint-cell-wrapper {
    font-size: 30px;
    padding: 0 32px;
    color: #212128;
    line-height: 42px;
    letter-spacing: -1px;
    .mint-cell-value {
      color: #212128;
    }
  }
  .mint-cell-allow-right::after {
    border: solid 4px #d5d7e7;
    border-bottom-width: 0;
    border-left-width: 0;
    content: " ";
    top: 50%;
    right: 40px;
    position: absolute;
    width: 20px;
    height: 20px;
    -webkit-transform: translateY(-50%) rotate(45deg);
    transform: translateY(-50%) rotate(45deg);
  }
}
</style>

