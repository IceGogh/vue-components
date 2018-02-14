<template>
  <div class="clearfix">
    <div class="choose">
      <div class="title">
        <label>
          <input type="checkbox" @change="checkAll" :checked="chkAllStatus"/>
          <span>所有</span>
        </label>
      </div>
      <div class="list">
        <div v-for="item in list">
          <div v-if="item.type ==='department' && item.children.length > 0">
            <label>
              <i :class="item.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click.stop.prevent="openNext(item)"></i>
              <input :data-name="item.name" :data-level="item.level" type="checkbox"  @change="selectItem" :checked="item.checked"/>
              <span>{{item.name}}</span>
            </label>
            <div v-show="item.open" v-for="childItem in item.children">
              <div class="child" v-if="childItem.type ==='department' && childItem.children.length > 0">
                <label>
                  <i :class="childItem.open ? 'el-icon-caret-bottom' : 'el-icon-caret-right'" @click.stop.prevent="openNext(childItem)"></i>
                  <input :data-name="childItem.name" :data-level="childItem.level" type="checkbox"  @change="selectItem" :checked="childItem.checked"/>
                  <span>{{childItem.name}}</span>
                </label>
                <div v-show="childItem.open" v-for="thirdItem in childItem.children">
                  <div class="third" v-if="thirdItem.type ==='department' && thirdItem.children.length > 0">
                    <label>
                      <i class="el-icon-caret-right"></i>
                      <input :data-name="thirdItem.name" :data-level="thirdItem.level" type="checkbox" @change="selectItem" :checked="thirdItem.checked"/>
                      <span>{{thirdItem.name}}</span>
                    </label>
                  </div>
                  <div class="humanItem" v-else-if="thirdItem.type === 'human' && thirdItem.children.length === 0">
                    <label>
                      <input :data-name="thirdItem.name" :data-level="thirdItem.level" type="checkbox"  @change="selectItem" :checked="thirdItem.checked"/>
                      <span>{{thirdItem.name}}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="humanItem" v-else-if="childItem.type === 'human' && childItem.children.length === 0">
                <label>
                  <input :data-name="childItem.name" :data-level="childItem.level" type="checkbox" @change="selectItem" :checked="childItem.checked"/>
                  <span>{{childItem.name}}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="humanItem single" v-else-if="item.type === 'human' && item.children.length === 0">
            <label>
              <input :data-name="item.name" :data-level="item.level" type="checkbox" @change="selectItem" :checked="item.checked"/>
              <span>{{item.name}}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
    <div class="selected">
      <div class="title">
        <label>
          <!--<input type="checkbox" @change="checkAll" :checked="chkAllStatus"/>-->
          <span>选中:</span>
        </label>
      </div>
      <div class="list">
        <div v-for="item in list">
          <div v-if="item.type ==='department' && item.children.length > 0">
            <label>
              <!--<i class="el-icon-caret-right" @click.stop.prevent="openNext"></i>-->
              <input :data-name="item.name" :data-level="item.level" type="checkbox"  @change="selectItem" :checked="item.checked" v-show="item.checked"/>
              <span v-show="item.checked">{{item.name}}(全体)</span>
            </label>
            <div v-show="!item.checked" v-for="childItem in item.children">
              <div class="child" v-if="childItem.type ==='department' && childItem.children.length > 0">
                <label>
                  <!--<i class="el-icon-caret-right"></i>-->
                  <input :data-name="childItem.name" :data-level="childItem.level" type="checkbox"  @change="selectItem" :checked="childItem.checked"  v-show="childItem.checked"/>
                  <span v-show="childItem.checked">{{childItem.name}}(全体)</span>
                </label>
                <div v-show="!childItem.checked" v-for="thirdItem in childItem.children">
                  <div class="third" v-if="thirdItem.type ==='department' && thirdItem.children.length > 0">
                    <label>
                      <!--<i class="el-icon-caret-right"></i>-->
                      <input :data-name="thirdItem.name" :data-level="thirdItem.level" type="checkbox" @change="selectItem" :checked="thirdItem.checked"  v-show="thirdItem.checked"/>
                      <span v-show="thirdItem.checked">{{thirdItem.name}}</span>
                    </label>
                  </div>
                  <div class="humanItem" v-else-if="thirdItem.type === 'human' && thirdItem.children.length === 0">
                    <label>
                      <input :data-name="thirdItem.name" :data-level="thirdItem.level" type="checkbox"  @change="selectItem" :checked="thirdItem.checked"  v-show="thirdItem.checked"/>
                      <span v-show="thirdItem.checked">{{thirdItem.name}}</span>
                    </label>
                  </div>
                </div>
              </div>
              <div class="humanItem" v-else-if="childItem.type === 'human' && childItem.children.length === 0">
                <label>
                  <input :data-name="childItem.name" :data-level="childItem.level" type="checkbox" @change="selectItem" :checked="childItem.checked" v-show="childItem.checked"/>
                  <span  v-show="childItem.checked">{{childItem.name}}</span>
                </label>
              </div>
            </div>
          </div>
          <div class="humanItem" v-else-if="item.type === 'human' && item.children.length === 0">
            <label>
              <input :data-name="item.name" :data-level="item.level" type="checkbox" @change="selectItem" :checked="item.checked" v-show="item.checked"/>
              <span v-show="item.checked">{{item.name}}</span>
            </label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import organizationData from './fake'
  export default {
    name: 'organization-tree',
    data() {
      return {
        list: [],
        chkAllStatus: false
      }
    },
    created() {
      // 初始化数据 加入 level键标记
      for (let i = 0; i < organizationData.length; i++) {
        organizationData[i].level = 1
        organizationData[i].open = false
        if (organizationData[i].children.length > 0) {
          for (let j = 0; j < organizationData[i].children.length; j++) {
            organizationData[i].children[j].level = 2
            organizationData[i].children[j].open = false
            if (organizationData[i].children[j].children.length > 0) {
              for (let k = 0; k < organizationData[i].children[j].children.length; k++) {
                organizationData[i].children[j].children[k].level = 3
                organizationData[i].children[j].children[k].open = false
              }
            }
          }
        }
      }
      this.list = organizationData
    },
    watch: {
      list: {
        handler: function(val, oldVal) {
          const _this = this
          // 监听一级
          if ((val.every(function(item) {
            return item.checked
          }))) {
            this.chkAllStatus = true
          } else {
            this.chkAllStatus = false
          }
          // 监听二级
          for (let i = 0; i < val.length; i++) {
            // 独立一级跳过every监听二级的步骤
            if (val[i].type === 'department') {
              if ((val[i].children.every(function(item) {
                return item.checked
              }))) {
                this.$set(_this.list[i], 'checked', true)
              } else {
                this.$set(_this.list[i], 'checked', false)
              }
            }
          }
        },
        deep: true
      }
    },
    computed: {
      selectArray() {
        const Array = []
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].checked) {
            Array.push(this.list[i])
          } else {
            for (let j = 0; j < this.list[i].children.length; j++) {
              if (this.list[i].children[j].checked) {
                Array.push(this.list[i].children[j])
              } else {
                for (let k = 0; k < this.list[i].children[j].children.length; k++) {
                  if (this.list[i].children[j].children[k].checked) {
                    Array.push(this.list[i].children[j].children[k])
                  }
                }
              }
            }
          }
        }
        return Array
      }
    },
    methods: {
      checkAll(e) {
        const Status = e.target.checked
        const _this = this
        for (let i = 0; i < this.list.length; i++) {
          this.$set(_this.list[i], 'checked', Status)
          for (let j = 0; j < this.list[i].children.length; j++) {
            this.$set(_this.list[i].children[j], 'checked', Status)
            for (let k = 0; k < this.list[i].children[j].children.length; k++) {
              this.$set(_this.list[i].children[j].children[k], 'checked', Status)
            }
          }
        }
      },
      selectItem(e) {
        const level = e.target.dataset.level
        const words = e.target.dataset.name
        const Status = e.target.checked
        const _this = this
        if (level === '1') {
          for (let i = 0; i < this.list.length; i++) {
            // 勾选/取消 当前 1级节点 及 所包含的 2、3级节点
            if (this.list[i].name === words) {
              this.$set(_this.list[i], 'checked', Status)
              if (this.list[i].children.length > 0) {
                for (let j = 0; j < this.list[i].children.length; j++) {
                  this.$set(_this.list[i].children[j], 'checked', Status)
                  for (let k = 0; k < this.list[i].children[j].children.length; k++) {
                    this.$set(_this.list[i].children[j].children[k], 'checked', Status)
                  }
                }
              }
            }
          }
        } else if (level === '2') {
          // 勾选/取消 当前 2级节点 及 所包含的 3级节点
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].children.length > 0) {
              for (let j = 0; j < this.list[i].children.length; j++) {
                if (this.list[i].children[j].name === words) {
                  this.$set(_this.list[i].children[j], 'checked', Status)
                  for (let k = 0; k < this.list[i].children[j].children.length; k++) {
                    this.$set(_this.list[i].children[j].children[k], 'checked', Status)
                  }
                }
              }
            }
          }
        } else if (level === '3') {
          // 勾选/取消 当前 3级节点
          for (let i = 0; i < this.list.length; i++) {
            if (this.list[i].children.length > 0) {
              for (let j = 0; j < this.list[i].children.length; j++) {
                if (this.list[i].children[j].children.length > 0) {
                  for (let k = 0; k < this.list[i].children[j].children.length; k++) {
                    // 监听三级
                    if (this.list[i].children[j].children[k].name === words) {
                      this.$set(_this.list[i].children[j].children[k], 'checked', Status)
                      if (this.list[i].children[j].children.every(function(item) {
                        return item.checked
                      })) {
                        this.$set(_this.list[i].children[j], 'checked', true)
                      } else {
                        this.$set(_this.list[i].children[j], 'checked', false)
                      }
                    }
                  }
                }
              }
            }
          }
        }
      },
      openNext(e) {
        const _this = this
        const words = e.name
        const OpenStatus = !e.open
        for (let i = 0; i < this.list.length; i++) {
          if (this.list[i].name === words) {
            this.$set(_this.list[i], 'open', OpenStatus)
          } else {
            for (let j = 0; j < this.list[i].children.length; j++) {
              if (this.list[i].children[j].name === words) {
                this.$set(_this.list[i].children[j], 'open', OpenStatus)
              }
            }
          }
        }
      }
    }
  }
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
  .choose .child, .choose .third{
    padding-left: 10px;
  }
  .choose .humanItem {
    padding-left: 28px;
  }
  .choose .single {
    padding-left: 18px;
  }
  label {
    vertical-align: middle;
    i {
      cursor: pointer;
    }
  }
  input {
    position: relative;
    top: 1px;
  }
  .title {
    height: 40px;
    line-height: 40px;
    background-color: #f5f7fa;
    padding-left: 10px;
    box-sizing: border-box;
  }
  .selected, .choose {
    float: left;
    width: 48%;
    border: 1px solid #ebeef5;
    border-radius: 4px;
  }
  .selected {
    float: right
  }
  .list {
    padding-left: 10px;
  }
</style>
