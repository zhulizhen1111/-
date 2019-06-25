/**
*@author: fugy-updated
*@date: 2018.10.12
*@info: 朵朵报修的扫描
 */
<template>
    <!--扫描组件-->
    <div class="scan" @touchstart.prevent="scanQRCodeView">
        <span class="repairscan">
            <i class="icon iconfont icon-saoma-"></i>
            扫码定位设备
        </span>
    </div>
</template>
<script type="ecmascript-6">
import { scanQRCode, weChatReady } from 'api/global'
import { Toast } from 'mint-ui'
export default {
    name: 'scan',
    methods: {
        scanQRCodeView() {
            //扫描二维码点击
            /**
             * Md5二维码    http://qrcode.sagacloud.cn?md5=12313123123123123
             * 旧二维码     http://weixin.qq.com/q/890237492739234234
             * [停用]广电二维码： http://meos.sagacloud.cn/scan/?objId=eq123132124234&proId=Pj112342342&objLocalId=新风机
             * 数据平台生成二维码： http://meos.sagacloud.cn/scan?key=Eqasdadsdfdsfsdfsfssdf | Sp2342342343424 | 很多
             */
            weChatReady().then(() => {
                scanQRCode()
                    .then(res => {
                        // 旧的
                        if (res.indexOf('http://weixin.qq.com/q/') == 0) {
                            let scanArr = res.split('/')
                            let old1 = scanArr[4]
                            this.$emit('scan-QR-code', old1)
                        } else {
                            let scanArr = res.split('?')
                            let domain = scanArr[0]
                            switch (domain) {
                                case 'http://qrcode.sagacloud.cn':
                                    let md = scanArr[1].split('=')
                                    let md1 = md[1]
                                    this.$emit('scan-QR-code', md1)
                                    break
                                case 'http://meos.sagacloud.cn/scan/':
                                    Toast('不支持的二维码')
                                    break
                                case 'http://meos.sagacloud.cn/scan':
                                    let key = scanArr[1].split('=')
                                    let key1 = key[1]
                                    this.$emit('scan-QR-code', key1)
                                    break
                                default:
                                    Toast('不支持的二维码')
                            }
                        }
                    })
                    .catch(err => {
                        console.error(err)
                    })
            })
        }
    }
}
</script>
<style scoped lang="less">
/*转换rem*/

@rem: 30rem;
.scan {
    width: 100%;
    height: 125 / @rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .icon-saomiao {
        color: #5d5d5d;
        font-size: 46 / @rem;
        vertical-align: -2px;
    }
    i {
        display: inline-block;
        /*font-size:40/@rem;*/
        margin-right: 30 / @rem;
    }
    span {
        flex: 4;
        font-size: 32 / @rem;
        i {
            margin-left: 30 / @rem;
            margin-right: 10 / @rem;
            vertical-align: -3 / @rem;
        }
    }
    .repairscan {
        background-color: #f4f4f6;
        color: #44b197;
        font-size: 28 / @rem;
        vertical-align: baseline;
        padding-right: 30 / @rem;
        i {
            color: #44b197;
            vertical-align: baseline;
            font-size: 28 / @rem;
        }
    }
}
</style>