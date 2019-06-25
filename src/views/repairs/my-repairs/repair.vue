/**
*@author: fugy-updated
*@date: 2018.10.15
*@info: 朵朵报修的报修主页
 */
<template>
    <!--填写报修信息页-->
    <div class="repair">
        <div class="getPositionLoading" v-show="getPositionLoading">
            <mt-spinner type="fading-circle" color="#fff" :size="80"></mt-spinner>
        </div>
        <ul class="repairMes">
            <!--报修信息-->
            <li @touchstart.prevent="getBuildingMes">
                <span>
                    <em>*</em>
                    <i class="icon iconfont icon-building"></i>
                    报修建筑
                </span>
                <span :class="{noData:selectBuilding=='请先选择建筑'}">
                    {{selectBuilding}}
                </span>
                <span>
                    <i class="icon iconfont icon-dayuhao"></i>
                </span>
            </li>

            <li class="splitHead">
                <h4>
                    报修详情
                </h4>
                <!-- 扫描二维码 -->
                <div class="scan_code">
                    <scan-code @scan-QR-code="scanQRCodeHandle"></scan-code>
                </div>
            </li>

            <li @touchstart.prevent="getPlaceData">
                <span>
                    <em>*</em>
                    <i class="icon iconfont icon-icon"></i>
                    报修地点
                </span>
                <span :class="{noData:repairPlace=='请选择报修问题所在的地点'}">
                    {{repairPlace}}
                </span>
                <span>
                    <i class="icon iconfont icon-dayuhao"></i>
                </span>
            </li>

            <transition name="equipment">
                <li @touchstart.prevent="getEquipmentData" v-show="isEquipmentShow">
                    <span>
                        <em></em>
                        <i class="icon iconfont icon-baoxiushebei"></i>
                        报修设备
                    </span>
                    <span :class="{noData:repairEquipment=='请选择报修的设备(选填)'}">
                        {{repairEquipment}}
                    </span>
                    <span>
                        <i class="icon iconfont icon-dayuhao"></i>
                    </span>
                </li>
            </transition>

            <li @touchstart.prevent="getIssueData">
                <span>
                    <em>*</em>
                    <i class="icon iconfont icon-issue"></i>
                    报修问题
                </span>
                <span :class="{noData:repairIssue=='请尽量选择报修类型'}">
                    {{repairIssue}}
                </span>
                <span>
                    <i class="icon iconfont icon-dayuhao"></i>
                </span>
            </li>
            <li>
                <span>
                    <em>*</em>
                    <i class="icon iconfont icon-dianhua"></i>
                    联系方式
                </span>
                <span>
                    <input type="number" v-model.number="userPhone" placeholder="请填写您的手机号" />
                </span>
            </li>
        </ul>
        <div class="remarks">
            <evaluate-input :placeholders="placeholders" @limitinput="limitinput">
                <h4 slot="remark">添加备注</h4>
            </evaluate-input>
        </div>
        <div class="submitRepair">
            <!--提交报修-->
            <input :class="submitclass" type="button" value="提交报修" @click.prevent="submitRepairMes" />
        </div>
        <custom-dialog :renderArr="renderArr" :isDialogShow="isDialogShow" @renderCont="renderCont" @closeDialog="closeDialog"></custom-dialog>
    </div>
</template>
<script type="ecmascript-6">
import { Toast, MessageBox, Spinner } from 'mint-ui'
import coordtransform from 'coordtransform'
// 工具类
import { weChatConfig } from 'api/global'
import tools from 'utils/tools'
import {
    getQrcodeInfo, //二维码信息
    getBuildingArr, //获取建筑信息
    getRepairPlaceArr, //获取报修地点的数据列表
    getEquipmentArr, //获取设备的数据信息
    getRepairTypeArr, //获取报修问题的数据列表
    submitRepair //提交报修
} from 'api/repair'
// 引入组件
import CustomDiaLog from './CustomDialog'
import scanCode from 'views/repairs/common/scan'
import evaluateInput from '../common/evaluateInput'

export default {
    components: {
        'scan-code': scanCode,
        'custom-dialog': CustomDiaLog,
        'evaluate-input': evaluateInput
    },
    data() {
        return {
            buildingMes: null, //建筑信息
            //展示部分
            placeholders: '建议填写设备问题的描述信息，以便我们提供更好的服务。',
            repairPlace: '请选择报修问题所在的地点', //报修地点
            repairIssue: '请尽量选择报修类型', //报修问题
            repairEquipment: '请选择报修的设备(选填)', //报修设备
            userPhone: '', //联系电话
            limitInput: '', //用户输入的备注信息
            getPositionLoading: true, //控制loading展示的
            //扫码缓存建筑和空间数据
            scanBuildArr: [],
            scanSpaceArr: [],
            //数据交互部分
            isDialogShow: false, //dialog是否展示
            renderArr: null, //渲染数据的数组，选择地点时，是地点的数组，选择问题时是问题的数组
            isEquipmentShow: false,
            placeId: 0, //保存地点id，通过地点获取
            repairId: 0, //保存问题id，通过地点获取
            equipmentId: '', //保存设备id，通过地点获取
            //最终提交的数据
            mesForAdd: {
                projectId: '',
                spaceId: '',
                equipmentId: '',
                problemId: '',
                phone: '',
                remark: ''
            },
            isSubmit: false
        }
    },
    computed: {
        submitclass() {
            if (this.placeId && this.repairId && this.userPhone != '') {
                return 'submit'
            }
            return 'cannotsubmit'
        },
        selectBuilding() {
            if (this.buildingMes) {
                //获取到的信息里包含distance信息
                return this.buildingMes.projLocalName
            } else {
                return '请先选择建筑'
            }
        }
    },
    methods: {
        // 跳转报修建筑列表
        getBuildingMes() {
            //如果赋值成功，说明带距离信息的列表拿到了
            this.$router.replace({
                path: 'selectBuilding'
            })
        },
        //扫描二维码
        async scanQRCodeHandle(sign) {
            let params = {
                getParams: {
                    sign: sign
                }
            }
            let { result, content } = await getQrcodeInfo(params)
            if (result === 'success') {
                // content---{projectId: "pj100000",objectId: "Sp110107035345353"}
                // 扫码回填事件
                this.getBuildingAndSpaceInfo(content)
            }
        },
        // 获取建筑信息和空间信息
        async getBuildingAndSpaceInfo({ projectId, objectId }) {
            if (objectId.substring(0, 2) == 'Eq') {
                Toast('不支持的二维码')
                return false
            }
            this.isSubmit = false
            // 获取建筑信息
            let { result, content } = await getBuildingArr()
            if (result === 'success' && content.length) {
                this.buildingMes = content.filter((item, index) => {
                    return item.projId == projectId
                })[0]
            }
            // 获取空间信息
            this.placeId = objectId
            let params = {
                getParams: {
                    projectId: projectId
                }
            }
            let res = await getRepairPlaceArr(params)
            if (res.result === 'success') {
                let floorName = null
                let spaceName = null
                res.content.forEach((item, index) => {
                    if (item.space && item.space.length) {
                        let spaceArr = item.space.filter((ele, ind) => {
                            return ele.id == objectId
                        })
                        if (spaceArr.length > 0) {
                            ;(floorName = item.name), (spaceName = spaceArr[0].name)
                        }
                    }
                })
                this.repairPlace = floorName + ' - ' + spaceName
            }
            // 让设备显示
            this.repairEquipment = ''
            this.equipmentId = null
            this.isEquipmentShow = true
        },

        // 获取报修地点信息
        async getPlaceData() {
            this.isSubmit = false
            //获取建筑id
            if (!this.buildingMes) {
                return Toast('请先选择建筑')
            }
            this.isDialogShow = true
            let params = {
                getParams: {
                    projectId: this.buildingMes.projId
                }
            }
            //通过建筑id获取位置信息
            let { result, content } = await getRepairPlaceArr(params)
            if (result === 'success') {
                this.renderArr = content.map((item, index) => {
                    return {
                        id: item.id,
                        name: item.name,
                        child: item.space
                    }
                })
                this.renderArr.left = '楼层 '
                this.renderArr.right = '地点'
                this.renderArr.repairType = 'place' //报修地点标识;
            }
        },
        // 获取报修设备信息
        async getEquipmentData() {
            this.isSubmit = false
            this.renderArr = []
            //获取设备的信息，根据选择地点之后的的id获取
            let params = {
                getParams: {
                    spaceId: this.placeId
                }
            }
            let { result, content } = await getEquipmentArr(params)
            if (result === 'success') {
                this.isDialogShow = true
                this.renderArr = content.map(item => {
                    return {
                        id: item.category,
                        name: item.name,
                        child: item.equipments
                    }
                })
                this.renderArr.repairType = 'equipments'
                this.renderArr.left = '类别'
                this.renderArr.right = '设备'
            }
        },
        //报修问题
        async getIssueData() {
            this.isSubmit = false
            if (!this.buildingMes) {
                return Toast('请先选择建筑')
            }
            let params = {
                projectId: this.buildingMes.projId || undefined,
                spaceId: this.placeId || undefined,
                equipId: this.equipmentId || undefined
            }
            let { result, content } = await getRepairTypeArr(params)
            if (result === 'success') {
                if (!content) {
                    Toast('暂无报修问题')
                    return false
                }
                this.isDialogShow = true
                this.renderArr = content.map((item, index) => {
                    return {
                        id: item.index,
                        name: item.type,
                        child: item.problem
                    }
                })
                this.renderArr.repairType = 'issue'
                this.renderArr.left = '类别'
                this.renderArr.right = '报修项目'
            }
        },
        // 提交保存赋值数据（prevent）
        submitRepairMes() {
            if (!this.buildingMes) {
                return false
            }
            //点击提交报修
            if (this.buildingMes.projId && this.placeId && this.repairId) {
                //保存用户输入信息
                if (this.userPhone == '') {
                    return Toast('请输入电话号')
                } else if (!tools.verifyPhone(this.userPhone)) {
                    return Toast('输入电话号码格式不正确')
                }
                this.mesForAdd.projectId = this.buildingMes.projId //建筑id
                this.mesForAdd.spaceId = this.placeId //地点空间id
                if (this.equipmentId) {
                    //报修设备id可选
                    this.mesForAdd.equipmentId = this.equipmentId
                }
                this.mesForAdd.problemId = this.repairId //报修问题的id
                this.mesForAdd.phone = this.userPhone //联系电话
                this.mesForAdd.remark = this.limitInput //备注
                this.submit()
            } else {
                Toast('有必填项没有填写')
            }
        },
        // 提交保存
        async submit() {
            if (this.isSubmit) {
                Toast('请勿重复提交')
                return false
            }
            this.isSubmit = true
            let params = {
                postParams: this.mesForAdd
            }
            let res = await submitRepair(params)
            if (res.result == 'success') {
                this.$router.push({
                    path: 'repairResult'
                })
            } else {
                this.isSubmit = false
                Toast(res.message)
            }
        },
        /***********components events********************************************************** */
        // 关闭dialog弹窗
        closeDialog() {
            this.isDialogShow = false
        },
        // dialog回填事件
        async renderCont(obj) {
            this.isSubmit = false
            //拿到要渲染和提交的地点信息
            if (this.renderArr.repairType == 'place') {
                //拼接要显示的地点信息
                this.repairPlace = `${obj.leftVal} - ${obj.rightVal}`
                let eqParams = {
                    getParams: {
                        spaceId: obj.insetId
                    }
                }
                let { result, content } = await getEquipmentArr(eqParams)
                if (result === 'success') {
                    this.repairEquipment = ''
                    this.equipmentId = null
                    this.repairIssue = ''
                    this.repairId = null
                    this.isEquipmentShow = !!content.length
                }
                this.placeId = obj.insetId
            } else if (this.renderArr.repairType == 'equipments') {
                //报修设备要显示的信息
                this.repairEquipment = `${obj.leftVal} - ${obj.rightVal}`
                //保存添加的设备的id
                this.equipmentId = obj.insetId
                this.repairIssue = ''
                this.repairId = null
            } else if (this.renderArr.repairType == 'issue') {
                //报修问题要显示的信息
                this.repairIssue = `${obj.leftVal} - ${obj.rightVal}`
                //保存repairId到要添加的数据
                this.repairId = obj.insetId
            } else {
            }
        },
        //文本区域框的回填事件
        limitinput(val) {
            this.isSubmit = false
            this.limitInput = val
        }
    },
    created() {
        document.title = '朵朵报修'
        this.isSubmit = false
        weChatConfig()
        //关闭loading
        this.getPositionLoading = false
        this.isDialogShow = false
        // 点击选择建筑进来的
        let obj = this.$route.query.obj
        if (typeof obj == 'string') {
            // 通过手机的返回键进入，忽略
        } else {
            this.buildingMes = obj
            this.getPlaceData()
        }
    }
}
</script>
<style scoped lang="less">
@rem: 30rem;
@lh: 110 / @rem;

/*loading动画*/

.repair {
    height: 100%;
}

.getPositionLoading {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 2;
    display: flex;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    span {
        margin: 400 / @rem auto;
    }
}

/*报修信息*/

.repairMes {
    background-color: #f4f4f6;
    li {
        height: @lh;
        background-color: #fff;
        line-height: @lh;
        overflow: hidden;
        border-bottom: 1px solid #ecf2f4;
        display: flex;
        align-items: center;
        span:nth-of-type(1) {
            display: inline-block;
            vertical-align: baseline;
            width: 246 / @rem;
            height: @lh;
            line-height: @lh;
            color: #9597a0;
            font-size: 30 / @rem;
            i {
                display: inline-block;
                margin: 0 10 / @rem;
                line-height: @lh;
                vertical-align: baseline;
                color: #d1d5db;
            }
            em {
                display: inline-block;
                width: 9 / @rem;
                margin-left: 20 / @rem;
                line-height: @lh;
                vertical-align: baseline;
                /*vertical-align: -3/@rem;*/
                color: #44b197;
            }
        }
        span:nth-of-type(2) {
            display: inline-block;
            width: 460 / @rem;
            height: @lh;
            line-height: @lh;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            input {
                width: 100%;
                height: 115 / @rem;
                border: none;
                padding-left: 9 / @rem;
                vertical-align: baseline;
            }
            input::-webkit-input-placeholder {
                vertical-align: baseline;
                font-size: 30 / @rem;
                color: #9597a0;
            }
            @media (min-device-width: 375px) and (max-device-width: 667px) and (-webkit-min-device-pixel-ratio: 2) {
                /*iphone 6*/
                input {
                    width: 100%;
                    height: @lh;
                    border: none;
                    vertical-align: baseline;
                    padding-left: 9 / @rem;
                    font-size: 30 / @rem;
                }
                input::-webkit-input-placeholder {
                    height: @lh;
                    line-height: 38 / @rem;
                    vertical-align: baseline;
                    font-size: 30 / @rem;
                    color: #9597a0;
                }
            }
            @media (min-device-width: 414px) and (max-device-width: 736px) and (-webkit-min-device-pixel-ratio: 3) {
                /*iphone 6 plus*/
                input::-webkit-input-placeholder {
                    height: @lh;
                    line-height: 30 / @rem;
                    padding-bottom: 40 / @rem;
                    font-size: 32 / @rem;
                    color: #9597a0;
                }
            }
        }
        span:nth-of-type(3) {
            height: @lh;
            line-height: @lh;
            i {
                color: #b4b4b4;
                font-size: 24 / @rem;
            }
        }
        .noData {
            color: #9597a0;
            font-size: 30 / @rem;
        }
    }
    li:nth-of-type(1),
    li:nth-of-type(2) {
        border-bottom: none;
        height: 100 / @rem;
    }
    li:nth-of-type(2) {
        justify-content: space-between;
        padding-top: 30 / @rem;
    }
    /*报修详情*/
    .splitHead {
        height: 100 / @rem;
        background-color: #f4f4f6;
        h4 {
            height: 68 / @rem;
            line-height: 68 / @rem;
            font-size: 26 / @rem;
            padding-left: 40 / @rem;
            color: #929499;
        }
        /*扫描二维码*/
        .scan_code {
            height: 68 / @rem;
            overflow: hidden;
            background-color: #fff;
            border-bottom: 1px solid #ecf2f4;
            .scan {
                height: 68 / @rem;
            }
        }
    }
    .equipment-enter-active,
    .equipment-leave-active {
        transition: all 0.5s ease-out;
    }
    .equipment-enter,
    .equipment-leave-active {
        height: 0;
        opacity: 0;
    }
}

.remarks {
    padding-bottom: @lh + 10 / @rem;
}

.submitRepair {
    position: fixed;
    bottom: 0;
    width: 100%;
    height: 100 / @rem;
    input {
        border: none;
        width: 100%;
        height: 100%;
        font-size: 34 / @rem;
    }
    .submit {
        color: #fff;
        background-color: #44b197;
    }
    .cannotsubmit {
        color: #fff;
        background-color: #8e8f99;
    }
}
</style>