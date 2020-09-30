<!--
 * @Description: In User Settings Edit
 * @Author: jiangxiangdan
 * @LastEditors: Please set LastEditors
 * @Date: 2019-05-10 11:41:25
 * @LastEditTime: 2019-06-17 16:39:00
 -->
<template>
  <div v-clickoutside="handleClose" class="el-dist-picker">
    <div class="value-show" @click="ulShow">
      <section>
        <div class="title">
          <div>已选结果</div>
          <div><a href="javascript:;" @click="clearAll">清空</a></div>
        </div>
        <div class="content">
          <div class="wrapper" v-if="selected.length">
            <div class="select-item" v-for="(item, index) in selected" :key="index">
              {{ item.name }}<Icon type="error" :size="15" color="#ccc" @click="selectedDel(index)"></Icon>
            </div>
          </div>
          <div class="wrapper" v-else>
            <div class="select-item">全部</div>
          </div>
        </div>
      </section>
    </div>
    <div class="search-ul" :class="ulClass" @scroll="searchUlScroll">
      <transition name="silde">
        <ul class="search-ul-wrap">
          <li
            v-for="(item, index) in reginMap"
            :key="item._id"
            @click="mainClick(item, index)"
            :class="{ active: mainIndex === index }"
          >
            <span
              @click="mainRadioClick(item, index)"
              class="radio appstore-iconfont"
              :class="{
                'appstore-iconcheckbox-weixuan': item.selected === undefined || item.selected === 'unselected',
                'appstore-iconcheckbox-xuanzhongbufen': item.selected && item.selected === 'expand',
                'appstore-iconios-checkbox': item.selected && item.selected === 'selected'
              }"
            >
              <input class="inputClasses" type="checkbox" />
            </span>
            {{ item.name }}
            <span class="arrow appstore-iconfont appstore-iconpreviewright" v-if="item.children.length"></span>
          </li>
        </ul>
      </transition>
      <transition name="silde">
        <ul class="search-ul-wrap" v-if="secMenu.length">
          <li
            v-for="(item, index) in secMenu"
            :key="item._id"
            @click="subClick(item, index)"
            :class="{ active: subIndex === index }"
          >
            <span
              @click="subRadioClick(item, index)"
              class="radio appstore-iconfont"
              :class="{
                'appstore-iconcheckbox-weixuan': item.selected === undefined || item.selected === 'unselected',
                'appstore-iconcheckbox-xuanzhongbufen': item.selected && item.selected === 'expand',
                'appstore-iconios-checkbox': item.selected && item.selected === 'selected'
              }"
            >
              <input class="inputClasses" type="checkbox" />
            </span>
            {{ item.name }}
            <span class="arrow appstore-iconfont appstore-iconpreviewright" v-if="item.children.length"></span>
          </li>
        </ul>
      </transition>
      <transition name="silde">
        <ul class="search-ul-wrap" v-if="thirdMenu.length">
          <li
            v-for="(item, index) in thirdMenu"
            :key="item._id"
            @click="thirdClick(item, index)"
            :class="{ active: thirdIndex === index }"
          >
            <span
              class="radio appstore-iconfont"
              :class="{
                'appstore-iconcheckbox-weixuan': item.selected === undefined || item.selected === 'unselected',
                'appstore-iconcheckbox-xuanzhongbufen': item.selected && item.selected === 'expand',
                'appstore-iconios-checkbox': item.selected && item.selected === 'selected'
              }"
            >
              <input class="inputClasses" type="checkbox" />
            </span>
            {{ item.name }}
            <span class="arrow appstore-iconfont appstore-iconpreviewright" v-if="item.children.length"></span>
          </li>
        </ul>
      </transition>
    </div>
  </div>
</template>

<script>
import Icon from '_c/icon'
import { deepCopy } from '@/utils/assist'
import Clickoutside from '@/mixins/clickoutside'
// eslint-disable-next-line camelcase
import { api_global } from '@/api'
import { style, Emitter, domScroll } from '@/mixins'

export default {
  name: 'ElDistPicker',
  mixins: [style, Emitter, domScroll],
  props: {
    value: [String, Number, Array, Object],
    pretext: {
      type: [String, Number],
      default: '搜索省，市，行政区，商圈或具体地点'
    },
    height: {
      // type: Number,
      default: 36
    },
    defaultItems: {
      type: [Array, Object, String],
      default: null
    },
    type: {
      // 标识朋友圈还是公众号 0：朋友圈 1：公众号
      type: Number,
      default: 0
    },
    scrollLoad: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      pageInfo: {
        type: 0,
        page: 1,
        row: 10,
        totalPage: 0,
        mainMenu: null,
        getRegionUrl: '/ad/wx/region/getRegion.json'
      },
      reginMap: [],
      isShow: false,
      selected: [],
      secMenu: [],
      mainIndex: -1,
      subIndex: -1,
      thirdIndex: -1,
      mainSelect: [],
      subSelect: [],
      thirdSelect: [],
      thirdMenu: [],
      handleIn: false,
      selectItem: [],
      hoverIndex: -1
    }
  },
  computed: {
    placeHolder() {
      return '搜索省，市，行政区，商圈或具体地点'
    },
    IconSyles() {
      let styles = {
        'line-height': this.height - (10 * 2 + 1 * 2) + 'px'
      }
      return styles
    },
    items() {
      if (this.defaultItems) {
        let { data } = this.defaultItems
        return data
      }
      return []
    },
    ulClass() {
      let upClass = [this.isShow ? '' : 'none']
      return upClass
    }
  },
  components: {
    Icon
  },
  watch: {
    defaultItems(val) {
      this.reginMap = deepCopy(val)
      this.secMenu = []
      this.thirdMenu = []
      this.mainIndex = -1
      this.subIndex = -1
      this.thirdIndex = -1
      this.sysncShow()
    },
    type(val) {
      this.pageInfo.type = val
    }
  },
  directives: {
    Clickoutside,
    scrollLoad: {
      bind: (el, binding) => {
        let val = binding.value
        el.addEventListener('scroll', async () => {
          if (el.scrollTop + el.offsetHeight >= el.scrollHeight) {
            if (val.page < val.totalPage) {
              val.page = val.page + 1
              let data = {
                type: val.type,
                page: val.page
              }
              let options = {
                url: val.getRegionUrl,
                data
              }
              let res = await api_global.getMessage(options)
              let _data = val.mainMenu
              _data.concat(res.data)
              val.mainMenu = _data
            }
          }
        })
      }
    }
  },
  methods: {
    async searchUlScroll(el) {
      let target = el.target
      if (target.scrollTop + target.offsetHeight >= target.scrollHeight) {
        if (this.pageInfo.page < this.pageInfo.totalPage) {
          this.pageInfo.page = this.pageInfo.page + 1
          let data = {
            type: this.pageInfo.type,
            page: this.pageInfo.page
          }
          let options = {
            url: this.pageInfo.getRegionUrl,
            data
          }
          let res = await api_global.getMessage(options)
          let _data = this.pageInfo.mainMenu
          this.$set(this.pageInfo, 'mainMenu', _data.concat(res.data))
          // this.pageInfo.mainMenu = _data;
        }
      }
    },
    ulShow() {
      this.isShow = true
    },
    handleClose() {
      this.isShow = false
    },
    handleMouseEnter(index) {
      this.hoverIndex = index
    },
    handleMouseLeave() {
      this.hoverIndex = -1
    },
    expandMenu() {
      for (let i = 0; i < this.reginMap.length; i++) {
        let item = this.reginMap[i]
        for (let j = 0; j < item.children.length; j++) {
          let sub = item.children[j]
          if (sub.selected === 'selected' && item.selected !== 'selected') {
            item.selected = 'expand'
          }
          for (let k = 0; k < sub.children.length; k++) {
            let third = sub.children[k]
            if (third.selected === 'selected' && sub.selected !== 'selected') {
              sub.selected = 'expand'
              item.selected = 'expand'
            }
          }
        }
      }
    },
    sysncShow() {
      let result = []
      function getArr(arr) {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i].selected === 'selected') {
            result.push(arr[i])
          }
          if (arr[i].children.length) {
            getArr(arr[i].children)
          }
        }
      }
      getArr(deepCopy(this.reginMap))
      let _key = []
      for (let i = 0; i < result.length; i++) {
        let item = result[i]
        for (let j = i; j < result.length; j++) {
          let cur = result[j]
          if (item._id === cur.parentId) {
            _key.push(j)
          }
        }
      }
      let sortNum = (a, b) => a - b
      _key.sort(sortNum)
      for (let i = _key.length; i > 0; i--) {
        result.splice(_key[i - 1], 1)
      }
      this.selected = result
      this.$emit('modelUpdate', this.selected)
    },
    mainClick(item, index) {
      if (this.mainIndex === index) {
        return
      }
      this.mainIndex = index
      this.subIndex = -1
      this.thirdIndex = -1
      if (item.selected && item.selected === 'selected') {
        item.children.forEach(val => {
          this.$set(val, 'selected', 'selected')
        })
      }
      this.subSelect = item.children.filter(item => item.selected === 'selected')
      this.thirdMenu = []
      if (item.children && item.children.length) {
        this.secMenu = item.children
      } else {
        this.secMenu = []
        this.subSelect = []
      }
    },
    mainRadioClick(item) {
      //   let arr = this.mainSelect
      //   let cur = arr.filter(val => {
      //     return val._id === item._id
      //   })
      if (!item.selected) {
        this.$set(item, 'selected', 'selected')
        item.children.forEach(val => {
          this.$set(val, 'selected', 'selected')
          val.children.forEach(child => {
            this.$set(child, 'selected', 'selected')
          })
        })
      } else {
        if (item.selected === 'selected') {
          item.selected = 'unselected'
          item.children.forEach(val => {
            this.$set(val, 'selected', 'unselected')
            val.children.forEach(child => {
              this.$set(child, 'selected', 'unselected')
            })
          })
        } else {
          item.selected = 'selected'
          item.children.forEach(val => {
            this.$set(val, 'selected', 'selected')
            val.children.forEach(child => {
              this.$set(child, 'selected', 'selected')
            })
          })
        }
      }
      this.sysncShow()
    },
    subClick(item, index) {
      if (this.subIndex === index) {
        return
      }
      this.subIndex = index
      this.thirdIndex = -1
      if (item.selected && item.selected === 'selected') {
        item.children.forEach(val => {
          this.$set(val, 'selected', 'selected')
        })
      }
      this.thirdSelect = item.children.filter(item => item.selected === 'selected')
      if (item.children && item.children.length) {
        this.thirdMenu = item.children
      }
    },
    subRadioClick(item) {
      //   let arr = this.subSelect
      //   let cur = arr.filter(val => {
      //     return val._id === item._id
      //   })
      if (!item.selected) {
        this.$set(item, 'selected', 'selected')
        item.children.forEach(val => {
          this.$set(val, 'selected', 'selected')
        })
      } else {
        if (item.selected === 'selected') {
          item.selected = 'unselected'
          item.children.forEach(val => {
            this.$set(val, 'selected', 'unselected')
          })
        } else {
          item.selected = 'selected'
          item.children.forEach(val => {
            this.$set(val, 'selected', 'selected')
          })
        }
      }
      this.subSelect = this.secMenu.filter(xxx => xxx.selected === 'selected')
      let obj = this.reginMap[this.mainIndex]
      if (this.subSelect.length === this.secMenu.length) {
        obj.selected = 'selected'
        this.$set(this.reginMap, this.mainIndex, obj)
      } else if (this.subSelect.length) {
        obj.selected = 'expand'
        this.$set(this.reginMap, this.mainIndex, obj)
      } else if (!this.subSelect.length && this.secMenu.length === 1 && this.secMenu[0].selected === 'expand') {
        obj.selected = 'expand'
        this.$set(this.reginMap, this.mainIndex, obj)
      } else {
        obj.selected = 'unselected'
        this.$set(this.reginMap, this.mainIndex, obj)
      }
      let curD = this.reginMap.filter(xxx => {
        return xxx.selected === 'selected'
      })
      this.mainSelect = curD
      this.sysncShow()
      this.expandMenu()
    },
    thirdClick(item, index) {
      this.thirdIndex = index
      if (!item.selected) {
        this.$set(item, 'selected', 'selected')
      } else {
        if (item.selected === 'selected') {
          this.$set(item, 'selected', 'unselected')
        } else {
          this.$set(item, 'selected', 'selected')
        }
      }
      this.thirdSelect = this.thirdMenu.filter(_cur => _cur.selected === 'selected')
      let obj = this.secMenu[this.subIndex]
      if (this.thirdSelect.length === this.thirdMenu.length) {
        obj.selected = 'selected'
        this.$set(this.secMenu, this.subIndex, obj)
      } else if (this.thirdSelect.length) {
        obj.selected = 'expand'
        this.$set(this.secMenu, this.subIndex, obj)
      } else if (!this.thirdSelect.length) {
        obj.selected = 'unselected'
        this.$set(this.secMenu, this.subIndex, obj)
      }
      let __arr = this.secMenu.filter(xxx => {
        return xxx.selected === 'selected'
      })
      this.subSelect = __arr
      let _obj = this.reginMap[this.mainIndex]
      if (__arr.length === this.secMenu.length) {
        _obj.selected = 'selected'
        this.$set(this.reginMap, this.mainIndex, _obj)
      } else if (this.subSelect.length) {
        _obj.selected = 'expand'
        this.$set(this.reginMap, this.mainIndex, _obj)
      } else if (!this.subSelect.length && this.secMenu.length === 1 && this.secMenu[0].selected === 'expand') {
        _obj.selected = 'expand'
        this.$set(this.reginMap, this.mainIndex, _obj)
      } else {
        _obj.selected = 'unselected'
        this.$set(this.reginMap, this.mainIndex, _obj)
      }
      let curD = this.reginMap.filter(xxx => {
        return xxx.selected === 'selected'
      })
      this.mainSelect = curD
      this.sysncShow()
      this.expandMenu()
    },
    selectedDel(index) {
      let item = this.selected[index]

      for (let i = 0; i < this.reginMap.length; i++) {
        let cur = this.reginMap[i]
        if (cur._id === item._id) {
          this.$set(cur, 'selected', 'unselected')
          this.selected.splice(index, 1)
          this.mainSelect = this.reginMap.filter(_d => _d.selected === 'selected')
          this.secMenu.forEach(_d => {
            this.$set(_d, 'selected', 'unselected')
          })
          this.thirdMenu.forEach(_d => {
            this.$set(_d, 'selected', 'unselected')
          })
          this.subSelect = []
          this.thirdSelect = []
          this.$emit('modelUpdate', this.selected)
          return
        }
        if (cur.children.length) {
          for (let j = 0; j < cur.children.length; j++) {
            let sub = cur.children[j]
            if (sub._id === item._id) {
              this.$set(sub, 'selected', 'unselected')
              this.selected.splice(index, 1)
              this.mainSelect = this.reginMap.filter(_d => _d.selected === 'selected')
              this.subSelect = this.secMenu.filter(_d => _d.selected === 'selected')
              this.thirdSelect = this.thirdMenu.filter(_d => _d.selected === 'selected')
              this.$emit('modelUpdate', this.selected)
              return
            }
            if (sub.children.length) {
              for (let k = 0; k < sub.children.length; k++) {
                let third = sub.children[k]
                if (item._id === third._id) {
                  this.$set(third, 'selected', 'unselected')
                  this.selected.splice(index, 1)
                  this.mainSelect = this.reginMap.filter(_d => _d.selected === 'selected')
                  this.subSelect = this.secMenu.filter(_d => _d.selected === 'selected')
                  this.thirdSelect = this.thirdMenu.filter(_d => _d.selected === 'selected')
                  this.$emit('modelUpdate', this.selected)
                  return
                }
              }
            }
          }
        }
      }
    },
    clearAll() {
      if (!this.selected.length) {
        return
      }
      this.selected = []
      this.reginMap.forEach(item => {
        item.selected = 'unselected'
        if (item.children && item.children.length) {
          item.children.forEach(sub => {
            sub.selected = 'unselected'
            if (sub.children && sub.children.length) {
              sub.children.forEach(third => {
                third.selected = 'unselected'
              })
            }
          })
        }
      })
      this.$emit('modelUpdate', this.selected)
      this.mainSelect = []
      this.subSelect = []
      this.thirdSelect = []
      this.secMenu = []
      this.thirdMenu = []
      this.mainIndex = -1
      this.subIndex = -1
      this.thirdIndex = -1
    }
  },
  model: {
    event: 'modelUpdate'
  }
}
</script>

<style lang="scss">
.el-dist-picker {
  position: relative;
  width: 100%;
  display: flex;
  border-radius: 2px;
  align-items: center;
  flex-direction: column;
  background-color: #fff;
  .value-show {
    width: 100%;
    padding: 8px 12px;
    box-sizing: border-box;
    // margin-bottom: 8px;
    box-shadow: inset 0 0 0 1px #e3e4e6;
    border-radius: 3px;
    section {
      display: block;
      .title {
        display: -ms-flexbox;
        display: flex;
        -ms-flex-pack: justify;
        justify-content: space-between;
        font-size: 13px;
        color: #65676e;
        margin-bottom: 4px;
        a {
          color: #1473cc;
          text-decoration: none;
        }
      }
      .content {
        padding-left: 8px;
        overflow-y: scroll;
        overflow-x: hidden;
        height: 100px;
        &::-webkit-scrollbar {
          width: 10px;
          height: 6px;
        }
        &::-webkit-scrollbar-track {
          background: #fff;
        }
        &::-webkit-scrollbar-thumb {
          background-color: #c0c1c2;
          border: 2px solid #fff;
          border-radius: 15px;
        }
        .wrapper {
          display: inline-block;
          vertical-align: top;
          box-sizing: border-box;
          height: 28px;
          font-size: 13px;
          line-height: 28px;
          color: #24262e;
          white-space: nowrap;
          border-radius: 3px;
          cursor: default;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          user-select: none;
          font-size: 14px;
          background-color: #fff;
          box-shadow: none;
          padding: 0px 4px;
          margin-bottom: 0px;
          margin-right: 0px;
          display: flex;
          flex-wrap: wrap;
          i {
            margin-left: 4px;
            cursor: pointer;
          }
        }
      }
    }
  }
  .search-box {
    width: 100%;
    height: 36px;
    background-color: #ffffff;
    border-radius: 2px;
    border: solid 1px #dfe2e6;
    padding: 10px 12px;
    display: flex;
    input[type='text'] {
      flex: 1;
      padding-left: 10px;
      -webkit-appearance: none;
      background-image: none;
      background-color: #ffffff;
      box-sizing: border-box;
      font-size: 14px;
      color: #354052;
      display: inline-block;
      outline: none;
      transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
      cursor: pointer;
      border-radius: 2px;
      border: none;
      caret-color: #2198f0;
    }
  }
  .none {
    display: none;
  }
  .search-ul {
    width: 550px;
    overflow: hidden;
    background-color: #ffffff;
    border-radius: 2px;
    position: absolute;
    height: 250px;
    left: 0;
    bottom: -10px;
    transform: translateY(100%);
    z-index: 10;
    display: flex;
  }
}

div {
  box-sizing: border-box;
}
.select-item {
  border: 1px solid #ddd;
  border-radius: 20px;
  padding: 0 15px;
  text-align: center;
  background: #eee;
  margin-left: 5px;
  margin-bottom: 5px;
  i {
    display: none;
  }
  &:hover {
    padding-left: 5px;
    padding-right: 5px;
    i {
      display: inline-block;
    }
  }
}
.search-ul-wrap {
  flex: 1;
  padding: 5px 0;
  width: 150px;
  height: 250px;
  border: 1px solid #eee;
  overflow-x: hidden;
  overflow-y: auto;
  &:nth-child(2) {
    border-left: none;
  }
  &:nth-child(3) {
    border-left: none;
  }
  li {
    line-height: 28px;
    padding-left: 10px;
    overflow: hidden;
    &:hover {
      background: #eee;
    }
    &.active {
      background: #eee;
    }
    .radio {
      position: relative;
      top: 3px;
      color: #2198f0;
      font-size: 20px;
    }
    .arrow {
      float: right;
      margin-top: 2px;
      margin-right: 5px;
    }
  }
}
.inputClasses {
  opacity: 0;
  display: inline-block;
  width: 16px;
  height: 16px;
  position: absolute;
  top: 0;
  left: 0;
  transform: scale(1.5);
  z-index: 10;
}
.slide-enter-active {
  transition: all 1s ease;
}
.slide-leave-active {
  transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}
.slide-enter, .slide-leave-to
        /* .slide-leave-active for below version 2.1.8 */ {
  transform: translateX(10px);
  opacity: 0;
}
</style>
