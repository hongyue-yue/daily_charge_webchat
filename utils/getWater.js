const app = getApp()
const moment = require('./moment.min.js');
const {getFileList,readFile}=require("./util");
const getWater={
  async getWater(){
    let exp=/\d+\-\d+\-\d+/
    let list=await getFileList()
    let pathList=[]
    list.forEach((item)=>{
       if(exp.test(item)){
         pathList.push(item.replace('.json',''))
       }
    })
    this.setData({
      pathList
    },()=>{
      this.getTodayData()
      this.getWeekData()
      this.getMonthData()
      this.getLastMonthData()
    })
 },
 async getTodayData(){
  //  if(app.globalData.todayData){
  //    this.setData({
  //      todayData:{
  //        ...app.globalData.todayData
  //      }
  //    })
  //    return
  //  }
   var todayPath=moment().format('YYYY-MM-DD')
   var list=await readFile(todayPath)
   var spendList=[],incomeList=[]
   var spendAmount=0.00,incomeAmount = 0.00;
   var dateRange=`${moment().month()+1}月${moment().date()}日`
   if (list.length > 0){
     list.forEach(item=>{
       if (item["category"] == "spend") {
         spendList.push(item);
         spendAmount += Number(item['amount']||0);
       } else if (item["category"] == "income") {
         incomeList.push(item);
         incomeAmount += Number(item['amount']||0);
       }
     })
   }
 
   let todayData={
     spendAmount:spendAmount.toFixed(2),
     incomeAmount:incomeAmount.toFixed(2),
     spendList,
     incomeList,
     timeRange:dateRange
   }
   console.log('todayData',todayData)
   app.globalData.todayData={
     ...todayData
   }
   this.setData({
     todayData:todayData
   })
 },
 async getWeekData(){
  //  if(app.globalData.weekData){
  //    this.setData({
  //      weekData:{
  //        ...app.globalData.weekData
  //      }
  //    })
  //    return
  //  }
   var {pathList}=this.data
   var currWeek=moment().weekday()
   var weekStart=moment().subtract(currWeek,'days')
   var weekEnd=moment().add(7-currWeek,'days')
   var weekRange=`${weekStart.month()+1}月${weekStart.date()}日-${weekEnd.month()+1}月${weekEnd.date()}日`
   var weekList=[],spendList = [], incomeList = []
   var spendAmount = 0.00, incomeAmount = 0.00
   for(let i=pathList.length;i>0;i--){
     let item = pathList[i - 1];
     if(moment(item).isAfter(weekStart)){
       let list=await readFile(item)
       if(list.length>0){
         weekList.push(list)
       }
     }else{
       break
     }
   }
 
   weekList.forEach(item=>{
     item.forEach(key=>{
       if (key["category"] == "spend") {
         spendList.push(key);
         spendAmount += Number(key['amount']||0);
       } else if (key["category"] == "income") {
         incomeList.push(key);
         incomeAmount += Number(key['amount']||0);
       }
     })
   })
   let weekData={
     spendAmount:spendAmount.toFixed(2),
     incomeAmount:incomeAmount.toFixed(2),
     spendList,
     incomeList,
     timeRange:weekRange
   }
   app.globalData.weekData={
     ...weekData
   }
   this.setData({
     weekData:{
       ...weekData
     }
   })
 },
 async getMonthData(){
  //  if(app.globalData.monthData){
  //    this.setData({
  //      monthData:{
  //        ...app.globalData.monthData
  //      }
  //    })
  //    return
  //  }
   var {pathList}=this.data
  const endDate = moment().month(moment().month()).endOf('month').format('YYYY-MM-DD');
const lastMonthEndDay=moment().month(moment().month()-1).endOf('month').format('YYYY-MM-DD');
let curMonth=moment().month()+1
   var monthRange=`${curMonth}月1日-${curMonth}月${moment(endDate).date()}日`
   let spendList = [], incomeList = [],monthList = [];
   let spendAmount = 0.00, incomeAmount = 0.00;
   for (let i = pathList.length; i > 0; i--) {
     let item = pathList[i - 1];
     if (moment(item).isAfter(lastMonthEndDay)) {
       let list = await readFile(item);
       if (list.length > 0) {
         monthList.push(list);
       }
     } else {
       break;
     }
   }
   monthList.forEach((item)=>{
     item.forEach((key)=>{
       if (key["category"] == "spend") {
         spendList.push(key);
         spendAmount += Number(key['amount']||0);
       } else if (key["category"] == "income") {
         incomeList.push(key);
         incomeAmount += Number(key['amount']||0);
       }
     });
   });

  let monthData={
   spendAmount:spendAmount.toFixed(2),
   incomeAmount:incomeAmount.toFixed(2),
     spendList,
     incomeList,
     timeRange:monthRange
   }
   app.globalData.monthData={
     ...monthData
   }
   this.setData({
     monthData:{
       ...monthData
     }
   })
 },
 async getLastMonthData(){
   if(app.globalData.lastMonthData){
     this.setData({
       lastMonthData:{
         ...app.globalData.lastMonthData
       }
     })
     return
   }
   var {pathList}=this.data
   const startDate=moment().month(moment().month()-1).startOf('month').format('YYYY-MM-DD');
   const endDate = moment().month(moment().month()-1).endOf('month').format('YYYY-MM-DD');
   const comMonthStartDay=moment(startDate).subtract(1, 'days').format('YYYY-MM-DD')
   const comMonthEndDay=moment(endDate).add(1, 'days').format('YYYY-MM-DD')
   let lastMonth=moment().month(moment().month()-1).month()+1
   let lastMonthRange=`${lastMonth}月1日-${lastMonth}月${moment(endDate).date()}日`
   let lastMonthDataString
   let lastMonthData
   let spendList = [], incomeList = [],monthList = [];
   let spendAmount = 0.00, incomeAmount = 0.00;
   try {
      lastMonthDataString=wx.getStorageSync(`${moment(endDate).year()}-${lastMonth}`)
   }catch(e){
    console.log(e)
   }
   if(lastMonthDataString){
     lastMonthData=JSON.parse(lastMonthDataString)
   }else{
    
     for (let i = pathList.length; i > 0; i--) {
       let item = pathList[i - 1];
       if (moment(item).isAfter(comMonthStartDay)&&moment(item).isBefore(comMonthEndDay)) {
         let list = await readFile(item);
         if (list.length > 0) {
           monthList.push(list);
         }
       } 
     }
     
     monthList.forEach(item=>{
       item.forEach(key=>{
         if (key["category"] == "spend") {
           spendList.push(key);
           spendAmount += Number(key['amount']||0);
         } else if (key["category"] == "income") {
           incomeList.push(key);
           incomeAmount += Number(key['amount']||0);
         }
       })
     })
     try {
       wx.setStorageSync(`${moment(endDate).year()}-${lastMonth}`,JSON.stringify({
         'spendAmount': spendAmount.toFixed(2),
         'incomeAmount': incomeAmount.toFixed(2),
         'spendList': spendList,
         'incomeList': incomeList,
         'lastMonthRange': lastMonthRange
       }))
     } catch (e) { 
       console.log(e)
     }
   }
  
  let obj={
     spendAmount:lastMonthData?lastMonthData.spendAmount:spendAmount.toFixed(2),
     incomeAmount:lastMonthData?lastMonthData.incomeAmount:incomeAmount.toFixed(2),
     spendList:lastMonthData?lastMonthData.spendList:spendList,
     incomeList:lastMonthData?lastMonthData.incomeList:incomeList,
     timeRange:lastMonthRange
   }
   app.globalData.lastMonthData={
     ...obj
   }
   this.setData({
     lastMonthData:{
       ...obj
     }
   })
 }
}
module.exports={
  getWater
}