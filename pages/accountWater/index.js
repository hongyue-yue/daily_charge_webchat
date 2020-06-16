const app = getApp()
const moment = require('../../utils/moment.min.js');
var {getFileList}=require("../../utils/util");
Page({
  data:{
    pathList:[],
    date:moment()
  },
  onLoad: function (options) {

  },
  async getWater(){
     let exp=/\d+\-\d+\-\d+/
     let list=await getFileList()
     let pathList=[]
     list.forEach((item)=>{
        if(exp.test(item)){
          pathList.push(item)
        }
     })
     this.setData({
       pathList
     })
  },
  async getTodayData(){
    var todayPath=this.data.date.format('yyyy-MM-dd')
    let list=await readFile(todayPath)
    let spendList=[],incomeList=[]
    let spendAmount=0.00,incomeAmount = 0.00;
  }
})