
var { exitDirPath, writeFile, readFile, createDirPath, formatDate}=require("../../utils/util");

const app = getApp()
let windowWidth = 0;
let itemWidth = 0;
Page({
  data: {
    today:"",
    
    sliderOffset: 0,
    sliderOffsets: [],
    sliderLeft: 0,
    tabs: ["支出", "收入"],
    tab1Index: "0",
    spend:{
      classIndex: [0, 0],
      classArray: [['餐饮支出', '住宿支出', '市内交通', '其他消费'], ['早午晚餐', '烟酒茶', '水果零食']],
      accountIndex: [0, 0],
      accountArray: [['现金账户', '信用卡', '金融账户', '虚拟账户', '负债账户', '债权账户'], ['现金(CNY)']],
      remarkValue: "",
      amount:0,
    },
    income:{
      classIndex: [0, 0],
      classArray: [['餐饮', '住宿', '市内交通费', '城际交通费', '公杂费', '应酬', '工作收入', '其他收入'], ['餐饮补助']],
      accountIndex: [0, 0],
      accountArray: [['现金账户', '信用卡', '金融账户', '虚拟账户', '负债账户', '债权账户'], ['现金(CNY)']],
      remarkValue: "",
      amount:0,
    }
   
   
  },
  onLoad: function(options) {
    this.clueOffset();
    this.setData({
      today: `今天${new Date().getMonth() + 1}月${new Date().getDate()}日`
    })
  },
  clueOffset() {
    var that = this;
    wx.getSystemInfo({
      success: function(res) {
        itemWidth = Math.ceil(res.windowWidth / that.data.tabs.length);
        let tempArr = [];
        for (let i in that.data.tabs) {
          tempArr.push(itemWidth * i);
        }
        // tab 样式初始化
        windowWidth = res.windowWidth;
        that.setData({
          sliderLeft: (res.windowWidth / that.data.tabs.length - 50) / 2,
          sliderOffsets: tempArr,
          sliderOffset: 0
        });
      }
    });
  },
  /**
  * tabItme点击
  */
  onTab1Click(event) {
    let index = event.currentTarget.dataset.index;
    this.setData({
      sliderOffset: this.data.sliderOffsets[index],
      tab1Index: index,
    })
  },
  swiperTran(event) {
    let dx = event.detail.dx;
    let index = event.currentTarget.dataset.index;
    if (dx > 0) { //----->
      if (index < this.data.tabs.length - 1) { 
        let ratio = dx / windowWidth; 
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        // console.log(newOffset,",index:",index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    } else {  
      if (index > 0) {  
        let ratio = dx / windowWidth; 
        let newOffset = ratio * itemWidth + this.data.sliderOffsets[index];
        console.log(newOffset, ",index:", index);
        this.setData({
          sliderOffset: newOffset,
        })
      }
    }
  },
  animationfinish(event) {
    this.setData({
      sliderOffset: this.data.sliderOffsets[event.detail.current],
      tab1Index: event.detail.current,
    })
  },
  classPickerChange: function (e) {
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]:{
        ...this.data[type],
        classIndex: e.detail.value
      }
    })
  },
  accountPickerChange:function(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]:{
        ...this.data[type],
        accountIndex: e.detail.value
      }
    })
  },
  classColumnChange: function (e) {
    let type = e.currentTarget.dataset.type
    var data = {
      classArray: this.data[type].classArray,
      classIndex: this.data[type].classIndex
    };
    data.classIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column){
      case 0:
        switch (data.classIndex[0]){
          case 0:
            if(type=='spend'){
              data.classArray[1] = ['早午晚餐', '烟酒茶', '水果零食']
            }else{
              data.classArray[1] = ['餐饮补助']
            }
            break;
          case 1:
            if(type=='spend'){
              data.classArray[1] = ['房租', '水电费', '房贷', '住宿费', '住宿小费', '其他']
            }else{
              data.classArray[1] = ['住宿补助']
            }
            break;
          case 2:
            if (type == 'spend') {
              data.classArray[1] = ['的士费', '公交费', '租车费', '高速费', '加油费', '停车费', '其他交通费用']
            } else {
              data.classArray[1] = ['市内交通补助']
            }
            break;
          case 3:
            if (type == 'spend') {
              data.classArray[1] = ['购物支出', '医疗支出', '教育支出', '其他支出']
            }else{
              data.classArray[1] = ['城际交通补助']
            }
            break;
          case 4:
            data.classArray[1] = ['公杂费补助']
            break;
          case 5:
            data.classArray[1] = ['应酬报销']
            break;
          case 6:
            data.classArray[1] = ['工资收入', '差旅津贴', '业务提成','资金收入']
            break;
          case 7:
            data.classArray[1] = ['礼金收入', '意外收入']
            break;
        }
        data.classIndex[1] = 0;
        break;
    }
    this.setData({
      [type]: {
        ...this.data[type],
        ...data
      }
    });
  },
  accountColumnChange:function(e){
    let type = e.currentTarget.dataset.type
    console.log(type)
    var data = {
      accountArray: this.data[type].accountArray,
      accountIndex: this.data[type].accountIndex,
    };
    data.accountIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column){
      case 0:
        switch (data.accountIndex[0]){
          case 0:
            data.accountArray[1] = ["现金(CNY)"]
            break;
          case 1:
            data.accountArray[1] = ["信用卡(CNY)"]
            break;
          case 2:
            data.accountArray[1] = ["银行卡(CNY)"]
            break;
          case 3:
            data.accountArray[1] = ["公交卡(CNY)", "微信钱包(CNY)", "支付宝(CNY)"]
            break;
          case 4:
            data.accountArray[1] = ["应付款项(CNY)"]
            break;
          case 5:
            data.accountArray[1] = ["应收款项(CNY)", "公司报销(CNY)"]
            break;
        }
        data.accountIndex[1] = 0;
        break;
    }
    this.setData({
      [type]:{
        ...this.data[type],
        ...data
      }
    });
  }, 
  amountInput:function(e){
    let type = e.currentTarget.dataset.type
    this.setData({
      [type]: {
        ...this.data[type],
        amount: e.detail.value
      }
    })
  },
  remarkInput: function (e){
    let type = e.currentTarget.dataset.type
    this.setData({
       [type]:{
         ...this.data[type],
         remarkValue: e.detail.value
       } 
    })
  },
  save:async function(e){
    let type = e.currentTarget.dataset.type;
    let data = this.data[type];
    if(Number(data.amount)==0){
      wx.showToast({
        title: '请输入金额',
      })
      return
    }
    var obj={
      key:new Date().getTime(),
      category:type,
      amount: data.amount,
      classification: data.classArray[0][data.classIndex[0]] + ' > ' + data.classArray[1][data.classIndex[1]],
      account: data.accountArray[1][data.accountIndex[1]],
      remark: data.remarkValue,
      time: formatDate(new Date(), "yyyy-MM-dd")
    }
    
    let res=await writeFile(obj,obj.time)
    if(res){
      wx.showToast({
        title: '保存成功',
      })
    }else{
      wx.showToast({
        title: '保存失败',
      })
    }
  }
})