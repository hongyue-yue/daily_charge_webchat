// components/AccountWaterCard/index.js
const computedBehavior = require('miniprogram-computed')
Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
    title:String,
    iconClass:String,
    incomeAmount:String,
    spendAmount:String,
    dateRange:String,
  },
  /**
   * 组件的初始数据
   */
  data: {
  },
  /**
   * 组件的方法列表
   */
  computed:{
    income(properties){
      return (Number(properties.incomeAmount)||0).toFixed(2)
    },
    spend(properties){
      return (Number(properties.spendAmount)||0).toFixed(2)
    }
  },
  methods: {
    _tapEvent() {
      this.triggerEvent("tapEvent")
    }
  }
})
