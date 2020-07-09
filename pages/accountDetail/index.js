// pages/accountDetail/index.js
const app = getApp()
Page({
  data: {
    list:[],
    data:{},
    type:'spend'
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let type=option.type
    this.setData({
      data:app.globalData[`${type}Data`],
      list:app.globalData[`${type}Data`].spendList,
      balance:(app.globalData[`${type}Data`].incomeAmount-app.globalData[`${type}Data`].spendAmount).toFixed(2)
    },()=>{
      wx.setNavigationBarTitle({title:this.data.data.timeRange})
      console.log(this.data.data)
    })
  },
  toggleData(e){
    let type=e.currentTarget.dataset.list
    this.setData({
      type:type,
      list:this.data.data[`${type}List`]
    })
  },

})