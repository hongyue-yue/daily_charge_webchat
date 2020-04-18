function formatDate(time, format) { //时间格式化函数
  time = new Date(time)
  let o = {
    yyyy: time.getFullYear(),
    yy: ('' + time.getFullYear()).slice(-2),
    MM: ('0' + (time.getMonth() + 1)).slice(-2),
    M: time.getMonth() + 1,
    dd: ('0' + time.getDate()).slice(-2),
    d: time.getDate(),
    HH: ('0' + time.getHours()).slice(-2),
    H: time.getHours(),
    hh: ('0' + (time.getHours() % 12)).slice(-2),
    h: time.getHours() % 12,
    mm: ('0' + time.getMinutes()).slice(-2),
    m: time.getMinutes(),
    ss: ('0' + time.getSeconds()).slice(-2),
    s: time.getSeconds(),
    w: function () {
      return ['日', '一', '二', '三', '四', '五', '六'][time.getDay()]
    }()
  }
  for (let k in o) {
    format = format.replace(k, o[k])
  }
  return format
}
const FileSystemManager = wx.getFileSystemManager()

async function exitDirPath(filePath){
  return new Promise((resolve, reject)=>{
  
    FileSystemManager.access({
      path: `${wx.env.USER_DATA_PATH}${filePath}`,
      success(res) {
          resolve(true)
      },
      fail(err){
          resolve(false)
      }
    })
  })
  
}
async function createDirPath(){
  return new Promise((resolve, reject)=>{
    FileSystemManager.mkdir({
      dirPath: wx.env.USER_DATA_PATH + "/bill",
      success(res){
        resolve(res)
      },
      fail(err){
        console.log('目录创建失败', err)
        reject(err)
      }
    })
  })
}
async function readFile(filePath){
  return new Promise(async (resolve, reject) =>{
    if (!await exitDirPath('/bill/'+filePath+'.json')){
    
      resolve([])
      return 
    }
    FileSystemManager.readFile({
      filePath: wx.env.USER_DATA_PATH + "/bill/" + filePath + ".json",
      encoding: 'utf8',
      success(res) {
        if (res.data) {
          let obj = JSON.parse(res.data);
          resolve(obj)
        }
      },
      fail(err) {
        console.log('读取失败', err)
        reject(err)
      }
    })
  })
}
async function writeFile(obj, filePath) {
  return new Promise(async (resolve,reject)=>{
    if (!await exitDirPath('/bill')){
      await createDirPath()
    }
    let arr = []
    let data=await readFile(filePath)
    if(data.length>0){
      arr = data
    }
    arr.push(obj)
    FileSystemManager.writeFile({
      filePath: wx.env.USER_DATA_PATH + "/bill/" + filePath + ".json",
      encoding: 'utf8',
      data: JSON.stringify(arr),
      success(res) {
        resolve(true)
      },
      fail(err) {
        console.log("存储失败", err);
        resolve(false)
      }
    }) 
   
  })
}
async function getFileList() {
  return new Promise((resolve,reject)=>{
    FileSystemManager.readdir({
      dirPath: wx.env.USER_DATA_PATH + "/bill",
      success(res){
        resolve(true)
      },
      fail(err){
        console.log('读取失败', err)
        reject(err)
      }
    })
  })
}

module.exports = {
  formatDate: formatDate,
  exitDirPath: exitDirPath,
  writeFile: writeFile,
  readFile: readFile,
  createDirPath: createDirPath
}

