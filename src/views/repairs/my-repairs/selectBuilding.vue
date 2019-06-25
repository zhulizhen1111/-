/**
*@author: fugy-updated
*@date: 2018.10.14
*@info: 朵朵报修的选择建筑
 */
<template>
    <!--选择建筑-->
    <div class="selectBuilding">
        <!-- loading -->
        <div class="getPositionLoading" v-show="getPositionLoading">
            <mt-spinner type="fading-circle" color="#fff" :size="80"></mt-spinner>
        </div>
        <!-- header -->
        <header>
            <form onsubmit="return false" class="topForm">
                <input type="text" v-model.trim="projectName" ref="searchBuilding" @blur="isSearch=!isSearch" />
                <span @click.prevent="beSearch" v-show="isSearch">
                    <i class="icon iconfont icon-search"></i>
                    搜索建筑名称
                </span>
            </form>
        </header>
        <!-- content -->
        <div class="mesListWrap">
            <ul class="mesList" v-if="searchingArr && searchingArr.length">
                <!--buildingArrs要改成  searchingArr-->
                <li v-for="(item,index) in searchingArr" :key="index" @click.prevent="toRepair(item)" :class="distanceClass(item.distanceCount, item.distance)">
                    <div class="mesListLeft fl">
                        <img src="../../../assets/imgleft.jpg" />
                    </div>
                    <div class="mesListRight fl">
                        <div>
                            <span>{{item.projLocalName}}</span>
                            <span v-if="toggleDistance(item.distanceCount, item.distance)" class="cantRepairs">
                                超过 {{item.distance || "---"}} 米，不能报修
                            </span>
                            <span v-else class="canRepairs">
                                可以报修
                            </span>
                        </div>
                        <div class="fr">
                            <span>{{calcDistance(item.distanceCount, item.distance)}}</span>
                        </div>
                    </div>
                </li>
            </ul>
            <p class="nodata" v-else>暂无数据</p>
        </div>
    </div>
</template>
<script type="ecmascript-6">
import { Toast } from 'mint-ui'
import coordtransform from 'coordtransform'
// 工具类
import tools from 'utils/tools'
import { getBuildingArr } from 'api/repair'
import { weChatConfig, weChatReady, getLocation } from 'api/global'

export default {
    data() {
        return {
            isSpitslot: false,
            isSearch: true,
            projectName: '',
            searchingArr: null,
            buildingArr: null,
            getPositionLoading: true
        }
    },
    methods: {
        // 选中跳转
        toRepair(obj) {
            if (this.toggleDistance(obj.distanceCount, obj.distance)) {
                Toast('您当前所在位置无法报修')
                return false
            }
            // 跳转到报修页
            this.$router.replace({
                path: '/index',
                query: {
                    obj: obj
                }
            })
        },
        // 判断当前位置与建筑位置是否符合指定的距离
        toggleDistance(distanceCount, distance) {
            //如果距离不存在或者距离 大于 后台给定的距离（目前是500） 返回 true
            return !distanceCount || distanceCount > distance
        },
        // 根据距离设置class
        distanceClass(distanceCount, distance) {
            if (this.toggleDistance(distanceCount, distance)) {
                //如果距离不存在或者距离大于后台给的距离（目前是500），就给li添加class
                return 'beyondDistance'
            }
        },
        fetchData(projLocalName) {
            if (projLocalName) {
                //获取建筑列表
                this.searchingArr = this.buildingArr.filter(building => {
                    if (building.projLocalName.includes(projLocalName)) {
                        return building
                    }
                })
            } else {
                this.searchingArr = this.buildingArr
                return
            }
        },
        // 计算各个建筑与定位所在地的距离
        roundDistance(tempBuildArr, result) {
            //tempBuildArr楼层数组   result本楼层所在的位置
            let fromLatitude = null
            let fromLongitude = null
            let toLatitude = null
            let toLongitude = null
            if (result && result.latitude) {
                //fromLatitude：用户地理位置信息中的纬度(6位小数)
                fromLatitude = Number.parseFloat(result.latitude)
            }
            if (result && result.longitude) {
                //fromLongitude：用户地理位置信息中的经度(6位小数)
                fromLongitude = Number.parseFloat(result.longitude)
            }
            tempBuildArr = tempBuildArr.map(eachBuild => {
                let distance = null
                if (fromLatitude && fromLongitude) {
                    // 用户经纬度
                    toLatitude = Number.parseFloat(eachBuild.latitude)
                    toLongitude = Number.parseFloat(eachBuild.longitude)
                    // 坐标转换 转成国测局坐标
                    let bd09togcj02 = coordtransform.bd09togcj02(toLongitude, toLatitude)
                    toLongitude = bd09togcj02[0]
                    toLatitude = bd09togcj02[1]
                    //fromLatitude,fromLongitude,toLatitude,toLongitude
                    //用户的纬度，用户的经度，建筑的纬度，建筑的经度
                    distance = tools.getDistance(fromLatitude, fromLongitude, toLatitude, toLongitude)
                }
                return {
                    distance: eachBuild.distance,
                    latitude: eachBuild.latitude,
                    longitude: eachBuild.longitude,
                    projId: eachBuild.projId,
                    projLocalName: eachBuild.projLocalName,
                    projName: eachBuild.projName,
                    distanceCount: distance
                }
            })
            tempBuildArr.sort((a, b) => {
                if (a.distance && b.distance) {
                    return Number.parseFloat(a.distanceCount) - Number.parseFloat(b.distanceCount)
                }
            })
            return tempBuildArr
        },
        // 获取建筑位置和中转距离数据
        fetchLocation(buildingArray, locationRes) {
            //关闭loading
            this.getPositionLoading = false
            //重整数组，将距离计算出来，返回依据距离排序过后的[{distance:100,id:}]或：[distance:null,id:]
            this.buildingArr = this.roundDistance(buildingArray, locationRes)
            this.searchingArr = this.buildingArr
        },
        // 计算距离
        calcDistance(distanceCount, distance) {
            if (distanceCount && !isNaN(distanceCount)) {
                if (isNaN(distanceCount)) {
                    return '--m'
                }
                if (distanceCount < 100) {
                    return '<100m'
                } else if (distanceCount < distance) {
                    return Number.parseInt(distanceCount * 10) / 10 + 'm'
                } else {
                    return Number.parseInt(distanceCount / 10) / 100 + 'km'
                }
            } else {
                return '--m'
            }
        },
        beSearch() {
            //点击span，让它隐藏，让搜索框获取焦点
            this.isSearch = false
            this.$refs.searchBuilding.focus()
        },
        // wx内置定位
        getDistances() {
            //获取用户位置信息
            return new Promise((resolve, reject) => {
                weChatReady().then(() => {
                    getLocation()
                        .then(locationRes => {
                            resolve(locationRes)
                        })
                        .catch(err => {
                            //获取位置信息失败
                            reject('getLocation' + err)
                        })
                })
            })
        },
        async fetchBuildingMes() {
            let { result, content } = await getBuildingArr()
            let buildingArrs = content || []
            //位置信息
            let distance = await this.getDistances()
            this.fetchLocation(buildingArrs, distance)
        }
    },
    watch: {
        projectName(val) {
            this.fetchData(val)
        }
    },
    created() {
        document.title = '选择建筑'
        weChatConfig()
    },
    mounted() {
        this.fetchBuildingMes()
    }
}
</script>
<style scoped lang='less'>
/*转换rem*/

@rem: 30rem;
.selectBuilding > * {
    background-color: #fff;
}
.getPositionLoading {
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 100;
    display: flex;
    overflow: hidden;
    background-color: rgba(0, 0, 0, 0.5);
    span {
        margin: 400 / @rem auto;
    }
}
.selectBuilding header {
    position: fixed;
    width: 100%;
    top: 0;
    left: 0;
    background-color: white;
    z-index: 99;
}

.topForm {
    width: 100%;
    height: 88 / @rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;
    border-bottom: 1px solid #eeeeee;
    input {
        width: 688 / @rem;
        height: 56 / @rem;
        border: none;
        border: 1px solid #efefef;
        border-radius: 4px;
        padding-left: 20 / @rem;
    }
    span {
        position: absolute;
        width: 688 / @rem;
        height: 56 / @rem;
        left: (750 / @rem - 688 / @rem)/2;
        top: 16 / @rem;
        background-color: #efefef;
        text-align: center;
        line-height: 56 / @rem;
        border-radius: 4px;
        font-size: 26 / @rem;
        color: #9597a0;
    }
}

.mesListWrap {
    margin-top: 102 / @rem;
    .nodata {
        text-align: center;
    }
}

.mesList li {
    position: relative;
    .mesListLeft {
        width: 140 / @rem;
        height: 140 / @rem;
        border-radius: 4px;
        overflow: hidden;
        margin: 30 / @rem;
        img {
            width: 100%;
        }
    }
    .mesListRight {
        width: calc(~'100% - ' 200 / @rem);
        height: 200 / @rem;
        border-bottom: 1px solid #ecf2f4;
        position: relative;
        div:nth-of-type(1) {
            width: calc(~'100% - ' 80 / @rem);
            overflow-x: hidden;
            line-height: 56 / @rem;
            padding-top: 30 / @rem;
            span {
                display: inline-block;
            }
            span:nth-of-type(1) {
                width: 100%;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
                font-size: 32 / @rem;
                color: #000;
            }
            span.canRepairs {
                width: 120 / @rem;
                font-size: 22 / @rem;
                color: #44b197;
                border: 1px solid #44b197;
                border-radius: 3px;
                text-align: center;
                line-height: 38 / @rem;
                height: 38 / @rem;
            }
            span.needVerify {
                font-size: 24 / @rem;
                color: #9597a0;
            }
            span.cantRepairs {
                color: #bbbcc2;
                font-size: 24 / @rem;
            }
        }
        div:nth-of-type(2) {
            position: absolute;
            text-align: right;
            right: 30 / @rem;
            top: 117 / @rem;
            color: #9597a0;
            font-size: 24 / @rem;
        }
    }
}

.mesList .beyondDistance {
    background-color: #f4f4f6;
}

.mesList .beyondDistance:before {
    content: '';
    position: absolute;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(190, 190, 190, 0.1);
    opacity: 0.3;
    -webkit-blur: (2px);
}
</style>
