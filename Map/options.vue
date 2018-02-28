<template>
  <div class="map-operator">
    <div @click="showMarker">
      <div>{{vMarkerClustererStatus ? '隐藏markers' : '显示markers'}}</div>
    </div>
    <div @click="bind">
      <div>step：{{step}}</div>
    </div>
    <div @click="submitArea">
      <div>提交(区域)</div>
    </div>
    <div @click="submitLine">
      <div>提交(线路)</div>
    </div>
    <div @click="tuning">
      <div>微调</div>
    </div>
    <div @click="update">
      <div>上传数据</div>
    </div>
    <div @click="allClear">
      <div>重置</div>
    </div>
    <div @click="fullScreen">
      <div>{{fullStatus ? '适应屏' : '全屏'}}</div>
    </div>
  </div>
</template>
<script>
  import AMap from 'AMap'
  import AMapBus from '@/components/Map/bus'
  export default {
    props: [
      'map',
      'fullStatus',
      'vMarkerClustererStatus',
      'prePolygonArr'
    ],
    data() {
      return {
        edtPrePolygonStatus: false,
        clickListener: '',
        ListenerStatus: false,
        markerArray: [],
        markerArraylatlng: [],
        editorType: '',
        editorStatus: false,
        step: 0,
        polyline: [],
        PolygonGroup: {},
        PolylineGroup: {},
        submitStatus: false,
        prePolygon: [],
        drawPolygon: [],
        drawPolyline: [],
        startAndEndDot: {}
      }
    },
    created() {
      // 监听 页面传入 初始的 覆盖区域 的 经纬度 二重数组
      const _this = this
      AMapBus.$on('clrPrePolygon', target => {
        // 清空调整前的 覆盖区域(视图)
        for (let i = 0; i < this.prePolygon.length; i++) {
          // console.log('this.prePolygon', this.prePolygon)
        }
      })
      AMapBus.$on('edtPrePolygon', target => {
        if (_this.edtPrePolygonStatus) {
          this.prePolygon[target].editor.close()
          const path = this.prePolygon[target].obj.Pg.path
          const Arr = []
          for (let i = 0; i < path.length; i++) {
            Arr.push([path[i].lng, path[i].lat])
          }
          // 关闭 调整后, 将 数组传回给调用页面
          AMapBus.$emit('confirmPrePloygon', Arr)
        } else {
          this.prePolygon[target].editor.open()
        }
        _this.edtPrePolygonStatus = !_this.edtPrePolygonStatus
      })
    },
    mounted() {
      // 渲染 页面传入的 初始覆盖区域
      const _this = this
      this.$nextTick(() => {
        for (let i = 0; i < _this.prePolygonArr.length; i++) {
          const _polygon = new AMap.Polygon({
            map: _this.map,
            path: _this.prePolygonArr[i],
            strokeColor: '#0000ff',
            strokeOpacity: 1,
            strokeWeight: 3,
            fillColor: '#f5deb3',
            fillOpacity: 0.35
          })
          // 增加 调整属性给每一个区域对象
          if (!AMap.PolyEditor) {
            AMap.plugin(['AMap.PolyEditor'])
          }
          _this.prePolygon.push({
            obj: _polygon,
            editor: new AMap.PolyEditor(_this.map, _polygon)
          })
        }
      })
    },
    methods: {
      showMarker() {
        this.$emit('showMarker')
      },

      // 添加 marker点
      addMarker(iconImage, position) {
        const _this = this
        return new AMap.Marker({
          icon: new AMap.Icon({
            image: iconImage,
            size: new AMap.Size(24, 24)
          }),
          offset: new AMap.Pixel(-10, -25),
          position,
          title: '标注点：' + (Number(_this.step) + 1),
          map: _this.map
        })
      },
      // 绘制 线路
      drawLine(map, path, strokeColor, strokeOpacity, strokeWeight, strokeStyle, strokeDasharray) {
        return new AMap.Polyline({
          map,
          path,
          strokeColor,
          strokeOpacity,
          strokeWeight,
          strokeStyle,
          strokeDasharray
        })
      },
      // 监听 click
      bind() {
        const _this = this
        if (this.submitStatus) {
          return true
        }
        if (_this.ListenerStatus) {
          _this.remove()
          _this.ListenerStatus = false
        } else {
          _this.ListenerStatus = true
          _this.clickListener = AMap.event.addListener(_this.map, 'click', function(e) {
            let image = ''
            if (_this.step === 0) {
              image = 'http://webapi.amap.com/theme/v1.3/markers/n/start.png'
            } else {
              image = 'http://vdata.amap.com/icons/b18/1/2.png'
            }
            _this.markerArray[_this.step] = _this.addMarker(image, e.lnglat)
            const Lat = e.lnglat.lat
            const Lng = e.lnglat.lng
            _this.drawing(Lng, Lat)
            _this.step ++
          })
        }
      },
      //  绘制
      drawing(Lng, Lat) {
        const _this = this
        _this.markerArraylatlng[_this.step] = ''
        _this.markerArraylatlng[_this.step] = [Lng, Lat]
        _this.polyline[_this.step] = _this.drawLine(_this.map, _this.markerArraylatlng, 'red', 1, 1, 'dashed', [10, 5])
      },
      // 移除监听
      remove() {
        const _this = this
        if (_this.clickListener) {
          AMap.event.removeListener(_this.clickListener)
        }
      },
      clear() {
        this.remove()
        this.map.remove(this.markerArray)
        this.map.remove(this.polyline)
        this.clickListener = ''
        this.step = 0
        this.markerArraylatlng = []
        this.ListenerStatus = false
      },
      clearMarker() {
        const _this = this
        this.map.remove(_this.startAndEndDot.start)
        this.map.remove(_this.startAndEndDot.end)
        this.startAndEndDot = {}
      },
      submitArea() {
        if (this.submitStatus) {
          return true
        }
        this.remove()
        this.submitStatus = true
        const _this = this
        _this.PolygonGroup._polygon = new AMap.Polygon({
          map: _this.map,
          path: _this.markerArraylatlng,
          strokeColor: '#0000ff',
          strokeOpacity: 0.5,
          strokeWeight: 2,
          strokeStyle: 'dashed',
          fillColor: '#f5deb3',
          fillOpacity: 0.3
        })
        this.clear()
        if (!AMap.PolyEditor) {
          AMap.plugin(['AMap.PolyEditor'])
        }
        this.editorType = 'polygon'
        this.PolygonGroup._polygonEditor = new AMap.PolyEditor(_this.map, _this.PolygonGroup._polygon)
      },
      submitLine() {
        if (this.submitStatus) {
          return true
        }
        this.remove()
        this.submitStatus = true
        const _this = this
        this.PolylineGroup._polyline = this.drawLine(_this.map, _this.markerArraylatlng, '#FF33FF', 1, 3, 'solid')
        this.startAndEndDot.start = this.addMarker('http://webapi.amap.com/theme/v1.3/markers/n/start.png', [_this.markerArraylatlng[0].lng, _this.markerArraylatlng[0].lat])
        this.startAndEndDot.end = this.addMarker('http://webapi.amap.com/theme/v1.3/markers/n/end.png', _this.markerArraylatlng[_this.markerArraylatlng.length - 1])
        this.clear()
        if (!AMap.PolyEditor) {
          AMap.plugin(['AMap.PolyEditor'])
        }
        this.editorType = 'polyline'
        this.PolylineGroup._polylineEditor = new AMap.PolyEditor(_this.map, _this.PolylineGroup._polyline)
      },
      tuning() {
        if (this.editorStatus) {
          if (this.editorType === 'polyline') {
            this.PolylineGroup._polylineEditor.close()
          } else if (this.editorType === 'polygon') {
            this.PolygonGroup._polygonEditor.close()
          }
        } else {
          if (this.editorType === 'polyline') {
            this.PolylineGroup._polylineEditor.open()
          } else if (this.editorType === 'polygon') {
            this.PolygonGroup._polygonEditor.open()
          }
        }
        this.editorStatus = !this.editorStatus
      },
      update() {
        const _this = this
        let data = {}
        if (this.editorStatus) {
          this.$notify({
            title: '失败',
            message: '请关闭微调状态',
            type: 'error',
            duration: 2000
          })
          return true
        }
        if (this.editorType === 'polygon') {
          const baseArray = this.PolygonGroup._polygon.Pg.path
          const Arr = {
            locationArr: [],
            area: 0
          }
          for (let i = 0; i < baseArray.length; i++) {
            if (Array.isArray(baseArray[i])) {
              Arr.locationArr.push(baseArray[i])
            } else {
              Arr.locationArr.push([baseArray[i].lng, baseArray[i].lat])
            }
          }
          this.drawPolygon.push(Arr)
          data = {
            arr: _this.drawPolygon,
            type: 'polygon'
          }
        } else if (this.editorType === 'polyline') {
          const baseArray = this.PolylineGroup._polyline.Pg.path
          const Arr = []
          for (let i = 0; i < baseArray.length; i++) {
            if (Array.isArray(baseArray[i])) {
              Arr.push(baseArray[i])
            } else {
              Arr.push([baseArray[i].lng, baseArray[i].lat])
            }
          }
          this.drawPolyline.push(Arr)
          data = {
            arr: _this.drawPolyline,
            type: 'polyline'
          }
          this.clearMarker()
        }
        this.$emit('updateData', data)
        // 回调提示语
        this.$notify({
          title: '成功',
          message: 'response.data.error_info',
          type: 'success',
          duration: 2000
        })
        this.allClear()
      },
      allClear() {
        if (this.editorStatus) {
          this.$notify({
            title: '失败',
            message: '请关闭微调状态',
            type: 'error',
            duration: 2000
          })
          return true
        }
        this.clear()
        if (this.PolygonGroup._polygon) {
          this.map.remove(this.PolygonGroup._polygon)
        }
        if (this.PolygonGroup._polygonEditor) {
          this.map.remove(this.PolygonGroup._polygonEditor)
        }
        if (this.PolylineGroup._polyline) {
          this.map.remove(this.PolylineGroup._polyline)
        }
        if (this.PolylineGroup._polylineEditor) {
          this.map.remove(this.PolylineGroup._polylineEditor)
        }
        this.markerArray = []
        this.polyline = []
        this.PolygonGroup = {}
        this.PolylineGroup = {}
        this.submitStatus = false
        this.clearMarker()
      },
      fullScreen() {
        this.$emit('fullScreen')
      }
    }
  }
</script>
<style scoped>
  .map-operator {
    position: absolute;
    top: 10px;
    right: 10px;
    width: 450px;
    height: 85px;
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
  }
  .map-operator > div {
    background-color: rgba(10, 10, 10, .4);
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
