<template>
  <div :class="fullScreenStatus ? 'map-wrap-full' : 'map-wrap'" :style="'width:' + mapWidth + '; height:' + mapHeight">
    <div id="eden-map" :class="fullScreenStatus ? 'map-full' : ''"></div>
    <v-options :map="map" v-show="options" @fullScreen="fullScreen" :fullStatus="fullScreenStatus" @showMarker="changeShowMarker" :vMarkerClustererStatus="vMarkerClustererStatus"></v-options>
  </div>
</template>
<script>
import AMap from 'AMap'
import vOptions from './options'
import points from './points'
export default {
  mounted() {
    this.mapInit()
  },
  components: {
    vOptions
  },
  data() {
    return {
      map: '',
      fullScreenStatus: false,
      MarkerClustererMarker: '',
      vMarkerClustererMarkers: [],
      vMarkerClustererStatus: true
    }
  },
  props: ['mapWidth', 'mapHeight', 'options'],
  methods: {
    mapInit() {
      const _this = this
      this.map = new AMap.Map('eden-map', {
        resizeEnable: true,
        center: [105, 34],
        zoom: 5,
        mapStyle: 'amap://styles/fresh'
      })
      for (let i = 0; i < points.length; i++) {
        _this.vMarkerClustererMarkers.push(new AMap.Marker({
          position: points[i]['lnglat'],
          content: '<div style="background-color: hsla(180, 100%, 50%, 0.7); height: 24px; width: 24px; border: 1px solid hsl(180, 100%, 40%); border-radius: 12px; box-shadow: hsl(180, 100%, 50%) 0px 0px 1px;"></div>',
          offset: new AMap.Pixel(-15, -15)
        }))
      }
      AMap.plugin(['AMap.ToolBar', 'AMap.MouseTool', 'AMap.MarkerClusterer'])
      _this.map.addControl(new AMap.ToolBar())
      _this.map.addControl(new AMap.MouseTool())
      _this.map.addControl(_this.MarkerClustererMarker = new AMap.MarkerClusterer(_this.map, _this.vMarkerClustererMarkers, { gridSize: 80 }))
    },
    fullScreen() {
      this.fullScreenStatus = !this.fullScreenStatus
    },
    changeShowMarker() {
      this.vMarkerClustererStatus = !this.vMarkerClustererStatus
      const edenMap = document.getElementById('eden-map')
      const markers = edenMap.getElementsByClassName('amap-markers')[0]
      if (this.vMarkerClustererStatus) {
        markers.style.display = 'block'
        const _this = this
        _this.MarkerClustererMarker = new AMap.MarkerClusterer(_this.map, _this.vMarkerClustererMarkers, { gridSize: 80 })
      } else {
        markers.style.display = 'none'
        this.MarkerClustererMarker.clearMarkers()
      }
    }
  }
}
</script>
<style scoped>
  .map-wrap {
    width: 100%;
    height: 200px;
    position: relative;
    z-index: 2020;
  }
  .map-wrap-full {
    position: fixed;
    width: 100% !important;
    height: 100% !important;
    z-index: 2020;
    top: 0;
    left: 0;
  }
  .map-full {
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
  }
  .map-wrap #eden-map {
    width: 100%;
    height: 100%;
  }
  .map-operator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 200px;
    height: 85px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .map-operator > div {
    position: relative;
    width: 52px;
    height: 52px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 50px;
    cursor: pointer;
  }
  .map-operator .drawing {
    background-image: url('icon/draw.png');
    color: #fe6579;
  }
  .map-operator .submit {
    background-image: url('icon/submit.png');
    color: #a9ea0a;
  }
  .map-operator .clear {
    background-image: url('icon/clear.png');
    color: #b8c5cd;
  }
  .map-operator > div > div {
    position: absolute;
    width: 52px;
    height: 22px;
    line-height: 22px;
    left: 0;
    bottom: -22px;
    font-size: 14px;
  }
</style>
