<template>
    <div class='popup-box'>
        <mt-popup v-model='modalShow' position='bottom' modal='true'>
            <div class='float-layer'>
                <div class='head'>
                    <span>{{itemValue.name}}</span>
                    <span>{{itemValue.value}}万</span>
                </div>
                <div class='float-content'>
                    <div class='float-nav'>
                        <span
                            v-for='(item,index) in title'
                            :key='index'
                            :class='{active:active==index}'
                            @click='jump(item,index)'
                            v-show='item.isShow'
                        >{{item.name}}</span>
                    </div>
                    <div class='float-bottom popup1' v-if='isShowContent.popup1'>
                        <p class='grren-nav'>{{detailPop.fxzly}}</p>
                        <div class='grren-count'>
                            <div class='count-t'>
                                <span>Pr,e</span>
                            </div>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.detailPopup' :key='index'>
                                    <span>P{{index+1}}、{{item.num}}</span>
                                    <span>P{{index+1}} = {{item.count}}</span>
                                    <i @click='isShowPopup(1)' v-if='item.type!=""' class='iconfont icon-ic_arrow_r'></i>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                    </div>
                    <div class='float-bottom popup2' v-if='isShowContent.popup2'>
                        <p class='grren-nav'>设备</p>
                        <div class='grren-count'>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.equipments' :key='index'>
                                    <span># {{index+1}}、{{item.num}}</span>
                                    <span>P = {{item.count}}</span>
                                    <i @click='isShowPopup(2)' v-if='item.type==""' class='iconfont icon-ic_arrow_r'></i>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                    </div>
                    <div class='float-bottom popup3' v-if='isShowContent.popup3'>
                        <p class='grren-nav'>{{detailPop.fxzly}}</p>
                        <div class='grren-count'>
                            <div class='count-t'>
                                <span>Pr,e</span>
                            </div>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.detailPopup' :key='index'>
                                    <span>P{{index+1}}、{{item.num}}</span>
                                    <span>P{{index+1}} = {{item.count}}</span>
                                    <i @click='isShowPopup(3)' v-if='item.type!=""' class='iconfont icon-ic_arrow_r'></i>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                        <p class='grren-nav'>设备</p>
                        <div class='grren-count'>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.equipments' :key='index'>
                                    <span># {{index+1}}、{{item.num}}</span>
                                    <span>P = {{item.count}}</span>
                                    <!-- <i @click='isShowPopup(3)' v-if='item.type==""' class='iconfont icon-ic_arrow_r'></i> -->
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                        <p class='grren-nav'>系统</p>
                        <div class='grren-count'>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.systems' :key='index'>
                                    <span># {{index+1}}、{{item.num}}</span>
                                    <span>P = {{item.count}}</span>
                                    <i @click='isShowPopup(3)' v-if='item.type==""' class='iconfont icon-ic_arrow_r'></i>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                    </div>
                    <div class='float-bottom popup4' v-if='isShowContent.popup4'>
                        <p class='grren-nav'>设备</p>
                        <div class='grren-count'>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.equipments' :key='index'>
                                    <span>P{{index+1}}、{{item.num}}</span>
                                    <span>P{{index+1}} = {{item.count}}</span>
                                    <i @click='isShowPopup(4)' v-if='item.type==""' class='iconfont icon-ic_arrow_r'></i>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                        <div class='grren-count'>
                            <div class='count-t else'>
                                <span>系统</span>
                            </div>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.systems' :key='index'>
                                    <span>P{{index+1}}、{{item.num}}</span>
                                    <span>P{{index+1}} = {{item.count}}</span>
                                </p>
                            </div>
                        </div>
                    </div>
                    <div class='float-bottom popup5' v-if='isShowContent.popup5'>
                        <p class='grren-nav'>{{detailPop.fxzly}}</p>
                        <div class='grren-count'>
                            <div class='count-t'>
                                <span>Pr,e</span>
                            </div>
                            <div class='count-b'>
                                <p v-for='(item,index) in detailPop.detailPopup' :key='index'>
                                    <span>P{{index+1}}、{{item.num}}</span>
                                    <span>P{{index+1}} = {{item.count}}</span>
                                </p>
                                <p class='none'></p>
                            </div>
                        </div>
                    </div>
                </div>
                <div style='width:100%;height:50px;margin-bottom:50px;'></div>
                <div class='foot' @click='close'>
                    <span>关闭</span>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
export default {
  props: ["isShowModal", "itemValue"],
  data() {
    return {
      selected: "1",
      // selecteValue: "1",
      isShowContent: {
        popup1: true,
        popup2: false,
        popup3: false,
        popup4: false,
        popup5: false
      },
      detailArr: [
        {
          name: "1#中央供冷系统-室内温度过高风险",
          value: 40,
          size: 40
        },
        {
          name: "1#会议室-室内温度过高风险",
          value: 70,
          size: 40
        },
        {
          name: "1#空调末端系统-室内温度过高风险",
          value: 80,
          size: 40
        }
      ],
      active: "",
      title: [
        { name: "第一级", isShow: true },
        { name: "第二级", isShow: false },
        { name: "第三级", isShow: false },
        { name: "第四级", isShow: false },
        { name: "第五级", isShow: false }
      ],
      detailPop: {
        ggfx: "1#中央供冷系统-室内温度过高风险",
        fxzly: "风险值计算涞源",
        shebei: "设备",
        xitong: "系统",
        jyfkcs: "建议风控措施",
        yxgdcd: "运行工单催单",
        detailPopup: [
          { num: "运行：", count: "1", type: "" },
          { num: "维保：", count: "1", type: "" },
          { num: "维修：", count: "0", type: "" },
          { num: "改造：", count: "0", type: "" },
          { num: "培训：", count: "0.2", type: "" },
          { num: "人力：", count: "0", type: "" },
          { num: "巡检：", count: "0.7", type: "" },
          { num: "投诉：", count: "0", type: "" },
          { num: "物联网：", count: "0.8", type: "" },
          { num: "供电单元：", count: "0.8", type: "equipment" },
          { num: "控制单元：", count: "0.8", type: "equipment" },
          { num: "系统下元设备集合：", count: "0.8", type: "system" }
        ],
        equipments: [
          //2
          { num: "设备名称", count: "0.8", type: "" },
          { num: "设备名称", count: "0.8", type: "" },
          { num: "设备名称", count: "0.8", type: "" },
          { num: "设备名称", count: "0.8", type: "equipment" }
        ],
        systems: [
          //2
          { num: "系统名称", count: "0.8", type: "" },
          { num: "系统名称", count: "0.8", type: "system" }
        ]
      }
    };
  },

  computed: {
    //关闭弹框
    modalShow: {
      get() {
        return this.isShowModal;
      },

      set(val) {
        this.$emit("update:isShowModal", val);
      }
    }
  },
  created() {},
  mounted() {},
  methods: {
    initState() {
      this.isShowPopup(0);
      this.isShowTag(0);
    },
    close() {
      this.modalShow = false;
      this.initState();
    },
    //点击事件
    jump(ele, i) {
      this.active = i;
      switch (i) {
        case 0:
          this.isShowTag(i);
          this.isShowPopup(i);
          break;
        case 1:
          this.isShowTag(i);
          this.isShowPopup(i);
          break;
        case 2:
          this.isShowTag(i);
          this.isShowPopup(i);
          break;
        case 3:
          this.isShowTag(i);
          this.isShowPopup(i);
          break;
        case 4:
          this.isShowTag(i);
          this.isShowPopup(i);
        default:
          console.log("xxxx");
          break;
      }
    },
    isShowTag(i) {
      this.active = i;
      for (let j in this.title) {
        if (j <= i) {
          this.title[j].isShow = true;
        } else {
          this.title[j].isShow = false;
        }
      }
    },
    isShowPopup(i) {
      this.isShowContent.popup1 = false;
      this.isShowContent.popup2 = false;
      this.isShowContent.popup3 = false;
      this.isShowContent.popup4 = false;
      this.isShowContent.popup5 = false;
      if (i == 0) {
        this.isShowContent.popup1 = true;
      } else if (i == 1) {
        this.isShowContent.popup2 = true;
      } else if (i == 2) {
        this.isShowContent.popup3 = true;
      } else if (i == 3) {
        this.isShowContent.popup4 = true;
      } else if (i == 4) {
        this.isShowContent.popup5 = true;
      }
      this.isShowTag(i);
    }
  }
};
</script>

<style scoped lang="less" style="text/less">
.popup-box {
  letter-spacing: 2px;
  width: 100%;
  height: 100%;
  overflow: scroll;
  .mint-popup {
    height: 80%;
    .float-layer {
      width: 100%;
      overflow: scroll;
      height: 100%;
      //标题
      .head {
        padding: 0 32px;
        width: 100%;
        height: 120px;
        background: rgba(255, 255, 255, 1);
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px solid #f6f7fc;
        span {
          height: 48px;
          font-size: 34px;
          letter-spacing: -1px;
        }
      }
      // 层级
      .float-content {
        .float-nav {
          height: 70px;
          width: 100%;
          padding: 0 32px;
          display: flex;
          align-items: center;
          span {
            width: 72px;
            height: 34px;
            font-size: 24px;
            letter-spacing: -1px;
            margin-right: 48px;
            color: #212128;
          }
        }
        .float-bottom {
          width: 100%;
          .grren-nav {
            padding: 0 32px;
            height: 70px;
            background: rgba(246, 247, 252, 1);
            display: flex;
            align-items: center;
            color: #777d95;
            font-size: 24px;
            letter-spacing: -1px;
          }
          .grren-count {
            .count-t {
              display: flex;
              align-items: center;
              height: 96px;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 1px 0px 0px rgba(231, 232, 241, 1);
              span {
                padding: 0 32px;
                font-size: 30px;
                font-family: PingFangSC;
                color: rgba(33, 33, 40, 1);
                letter-spacing: -1px;
                font-weight: bold;
              }
            }
            .else {
              box-shadow: none;
            }
            .count-b {
              position: relative;
              :last-child {
                border-bottom: 0;
              }
              p {
                height: 80px;
                padding: 0 96px 0 0;
                border-bottom: 1px solid #e7e8f1;
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-left: 32px;
                span {
                  font-size: 24px;
                  letter-spacing: -1px;
                }
              }
              .none {
                position: absolute;
                bottom: 0;
                left: 0;
              }
              i {
                position: absolute;
                right: 32px;
              }
            }
          }
        }
      }
      // 底部
      .foot {
        width: 100%;
        height: 102px;
        background: rgba(250, 250, 252, 1);
        box-shadow: 0px 0.5px 0px 0px rgba(230, 230, 230, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        border-top: 1px solid #e7e8f1;
        position: absolute;
        bottom: 0;
        left: 0;
        span {
          width: 80px;
          height: 50px;
          font-size: 36px;
        }
      }
    }
  }
}
</style>
<style lang="less">
.popup-box {
  overflow: scroll;
  .v-modal{
      // background: rgba(0, 0, 0, 0.8);
      opacity: 0.8!important;
    }
  .mt-progress-runway {
    background: #ccc;
  }
  .mint-popup {
    width: 100%;
    height: 100%;
    border-radius: 16px 16px 0 0;
    .float-nav {
      .active {
        color: #4c8bd8 !important;
      }
    }
  }
  .v-modal {
    opacity: 0.07;
  }
}
</style>