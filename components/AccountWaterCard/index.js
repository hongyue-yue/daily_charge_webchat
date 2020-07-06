// components/AccountWaterCard/index.js
Component({
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
  methods: {
    _tapEvent() {
      this.triggerEvent("tapEvent")
    }
  }
})
