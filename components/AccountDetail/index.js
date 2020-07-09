// components/AccountDetail/index.js
const computedBehavior = require('miniprogram-computed')

Component({
  behaviors: [computedBehavior],
  /**
   * 组件的属性列表
   */
  properties: {
   item:Object,
   type:String
  },

  /**
   * 组件的初始数据
   */
  data: {
  //item:{}
  },
  computed:{
    amount(properties){
      return Number((properties.item&&properties.item.amount)||0).toFixed(2)
    }
  },
  /**
   * 组件的方法列表
   */
  methods: {

  }
})
