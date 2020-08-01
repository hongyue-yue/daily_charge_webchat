// pages/accountDetail/index.js
const app = getApp()
const moment = require('../../utils/moment.min.js');
const {
  getFileList,
  readFile
} = require("../../utils/util");
const monthArr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
Page({
  data: {
    list: [],
    data: {},
    type: 'spend',
    timeIndex: [0, 0],
    tiemArray: [],
    currYearMonth: [],
    curYears: 0,
    curMonth: 0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (option) {
    let type = option.type
    this.setData({
      data: app.globalData[`${type}Data`],
      list: app.globalData[`${type}Data`].spendList,
      balance: (app.globalData[`${type}Data`].incomeAmount - app.globalData[`${type}Data`].spendAmount).toFixed(2)
    }, () => {
      wx.setNavigationBarTitle({
        title: this.data.data.timeRange
      })
      console.log(this.data.data)
    })
    if (type == 'lastMonth') {
      let curYears = moment().year()
      let curMonth = moment().month()
      let tiemArray = [
          [],
          []
        ],
        currYearMonth = []
      for (let i = 0; i < 4; i++) {
        tiemArray[0].push(curYears - i)
      }
      for (let j = 0; j < curMonth; j++) {
        currYearMonth.push(j + 1)
      }
      tiemArray[1] = [...currYearMonth]
      this.setData({
        curYears,
        curMonth,
        tiemArray,
        currYearMonth,
        timeIndex: [0, currYearMonth.length - 1]
      })
    }
  },
  toggleData(e) {
    let type = e.currentTarget.dataset.list
    this.setData({
      type: type,
      list: this.data.data[`${type}List`]
    })
  },
  async getData() {
    const {
      tiemArray,
      timeIndex,
      type
    } = this.data
    let data
    let spendList = [], incomeList = [],monthList = [];
    let spendAmount = 0.00, incomeAmount = 0.00;
    let date = `${tiemArray[0][timeIndex[0]]}-${tiemArray[1][timeIndex[1]]}`
    let startDate=moment(date).startOf('month').format('YYYY-MM-DD');
    let endDate = moment(date).endOf('month').format('YYYY-MM-DD');
    try {
      data = wx.getStorageSync(date)
    } catch (e) {
      console.log(e)
    }
    if (data) {
      data = JSON.parse(data)
      this.setData({
        data:{
          spendAmount:data.spendAmount,
          incomeAmount: data.spendAmount,
          spendList: data.spendList,
          incomeList: data.incomeList,
          lastMonthRange:data.lastMonthRange
        },
        list:type=='spend'?data.spendList:data.incomeList,
        balance:(Number(data.incomeAmount)-Number(data.spendAmount)).toFixed(2)
      })
    } else {
      let exp = /\d+\-\d+\-\d+/
      let list = await getFileList()
      let pathList = []
      list.forEach((item) => {
        if (exp.test(item)) {
          pathList.push(item.replace('.json', ''))
        }
      })
      console.log(list,pathList)
      for (let i = pathList.length; i > 0; i--) {
        let item = pathList[i - 1];
        if (moment(item).isAfter(startDate)&&moment(item).isBefore(endDate)) {
          let list = await readFile(item);
          if (list.length > 0) {
            monthList.push(list);
          }
        } 
      }
      if(monthList.length==0){
        this.setData({
          data:{
          spendAmount,
          incomeAmount,
          spendList,
          incomeList,
          lastMonthRange: `${moment(endDate).month()}月1日-${moment(endDate).month()}月${moment(endDate).date()}日`
          },
          list:[],
          balance:0.00
        })
        return
      }
      monthList.forEach(item=>{
        item.forEach(key=>{
          if (key["category"] == "spend") {
            spendList.push(key);
            spendAmount += Number(key['amount']);
          } else if (key["category"] == "income") {
            incomeList.push(key);
            incomeAmount += Number(key['amount']);
          }
        })
      })
      try {
        wx.setStorageSync(`${moment(endDate).year()}-${moment(endDate).month()}`,JSON.stringify({
          'spendAmount': spendAmount.toFixed(2),
          'incomeAmount': incomeAmount.toFixed(2),
          'spendList': spendList,
          'incomeList': incomeList,
          'lastMonthRange': `${moment(endDate).month()}月1日-${moment(endDate).month()}月${moment(endDate).date()}日`
        }))
      } catch (e) { 
        console.log(e)
      }
      this.setData({
        data:{
          spendAmount: spendAmount.toFixed(2),
          incomeAmount: incomeAmount.toFixed(2),
          spendList: spendList,
          incomeList: incomeList,
          lastMonthRange: `${moment(endDate).month()}月1日-${moment(endDate).month()}月${moment(endDate).date()}日`
        },
        list:type=='spend'?spendList:incomeList,
        balance:(incomeAmount-spendAmount).toFixed(2)
      })
    }
  },
  pickerChange(e) {
    const {
      tiemArray
    } = this.data
    let value = e.detail.value
    this.setData({
      timeIndex: value
    })
    wx.setNavigationBarTitle({
      title: tiemArray[0][value[0]] + '年' + tiemArray[1][value[1]] + '月'
    })
    this.getData()
  },
  columnChange(e) {
    const {
      tiemArray,
      currYearMonth
    } = this.data
    console.log(e.detail.column, e.detail.value)
    if (e.detail.column == 0) {
      if (e.detail.value == 0) {
        tiemArray[1] = [...currYearMonth]
      } else {
        tiemArray[1] = [...monthArr]
      }
    }
    this.setData({
      tiemArray
    })
  }
})