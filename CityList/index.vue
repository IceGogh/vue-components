<template>
  <el-form ref="form" :model="form" label-width="100px">
    <el-form-item  label="所在地区：">
      <el-cascader v-model="form.selectedOptions" :options="CityInfo" @change="handleChange"
                   :change-on-select="true" :clearable="true"
                   :filterable="true"></el-cascader>
      <!--<span>所选地区：{{ prov }} {{city}} {{area}}</span>-->
    </el-form-item>
  </el-form>
</template>
<script>
  const CityInfo = require('static/city-data.js')
  export default {
    data() {
      return {
        CityInfo: CityInfo['default'],
        form: {
          city: '',
          erae: '',
          minerae: '',
          selectedOptions: []
        }
      }
    },
    methods: {
      handleChange(value) {
        this.form.city = this.form.selectedOptions[0]
        this.form.erae = this.form.selectedOptions[1]
        this.form.minerae = this.form.selectedOptions[2]
        if (this.area) {
          this.$emit('sendCityData', { prov: this.prov, city: this.city, area: this.area })
        }
      }
    },
    computed: {
      prov: function() {
        const Prov = this.form.city
        for (var y in CityInfo['default']) {
          if (CityInfo['default'][y].value === Prov) {
            return CityInfo['default'][y].label
          }
        }
      },
      city: function() {
        const City = this.form.erae
        for (var y in CityInfo['default']) {
          for (var z in CityInfo['default'][y].children) {
            if (CityInfo['default'][y].children[z].value === City && City !== undefined) {
              return CityInfo['default'][y].children[z].label
            }
          }
        }
      },
      area: function() {
        const Area = this.form.minerae
        for (var y in CityInfo['default']) {
          for (var z in CityInfo['default'][y].children) {
            for (var i in CityInfo['default'][y].children[z].children) {
              if (CityInfo['default'][y].children[z].children[i].value === Area && Area !== undefined) {
                return CityInfo['default'][y].children[z].children[i].label
              }
            }
          }
        }
      }
    }
  }
</script>
