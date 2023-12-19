import * as XLSX from 'xlsx'
/**
 * @description: 方法1：生成一个唯一的uuid方法
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {number} len - uuid长度
 * @param {number} radix - 可选，从62个数字大小写字母中截取radix个作为选择池
 * @return {string}
 * @example:
 * ```ts
 * getUuid(8)
 * ```
 */
const getUuid = (len: number, radix?: number) => {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  var uuid: Array<string> = []
  var i
  radix = radix || chars.length
  if (len) {
    // Compact form
    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)]
  } else {
    // rfc4122, version 4 form
    var r

    // rfc4122 requires these characters
    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-'
    uuid[14] = '4'

    // Fill in random data.  At i==19 set the high bits of clock sequence as
    // per rfc4122, sec. 4.1.5
    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16)
        uuid[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }
  return uuid.join('')
}

/**
 * @description: 方法2：生成随机字符串
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {number} len - uuid长度
 * @return {string}
 * @example:
 * ```ts
 *   getUuid2(8)
 * ```
 */
const getUuid2 = (len: number) => {
  len = len || 32
  var t = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678',
    a = t.length,
    n = ''
  for (var i = 0; i < len; i++) n += t.charAt(Math.floor(Math.random() * a))
  return n
}

/**
 * @description: <数组分割>
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {Array} array - 待分割的数组
 * @param {number} subGroupLength - 子数组长度
 * @return {Array<Array<any>>} 分割后的新数组
 * @example
 */
const getDividedArray = (array: Array<any>, subGroupLength: number) => {
  let index: number = 0
  let newArray: Array<Array<any>> = []
  while (index < array.length) {
    newArray.push(array.slice(index, (index += subGroupLength)))
  }
  return newArray
}

/**
 * @description: 方法1:下载表格，不能自适应宽度
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {Array} sheet
 * @param {string} sheetName
 * @return {*}
 * @example:
 * ```ts
 *
 * ```
 */
const sheet2blob = (sheet: Array<any>, sheetName: string) => {
  //将文件转换为二进制文件
  sheetName = sheetName || 'sheet1'
  var workbook = {
    SheetNames: [sheetName],
    Sheets: {},
  }
  workbook.Sheets[sheetName] = sheet
  // 生成excel的配置项
  var wopts: any = {
    bookType: 'xlsx', // 要生成的文件类型
    bookSST: false, // 是否生成Shared String Table，官方解释是，如果开启生成速度会下降，但在低版本IOS设备上有更好的兼容性
    type: 'binary',
  }
  var wbout = XLSX.write(workbook, wopts)
  var blob = new Blob([s2ab(wbout)], { type: 'application/octet-stream' })
  // 字符串转ArrayBuffer
  function s2ab(s) {
    var buf = new ArrayBuffer(s.length)
    var view = new Uint8Array(buf)
    for (var i = 0; i != s.length; ++i) view[i] = s.charCodeAt(i) & 0xff
    return buf
  }
  return blob
}

/**
 * @description: 方法2：下载表格，可自适应宽度
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {Array} demo
 * @param {string} name - 文件名
 * @param {Array} title - 表格header
 * @return {*}
 * @example: 
 * ```ts
 *   const demo = [{
        "IMEI(设备编号)": "86482351421321111",
        设备名称: "饭少吃",
        设备类型: "空开",
        设备型号: "ML-200",
        NB卡号: "32113213",
        批次号: "11113333111",
        出厂编号: "4213231231215431",
        出厂日期是发哈是开放的粉红色: "2020-01-22 12:44:10",
        产品标识: "7665323144642124",
        设备密钥: "cc76w454321a2674j3g65",
    },
    {
        "IMEI(设备编号)": "86482351422131231321111",
        设备名称: "上点饭",
        设备类型: "电能表",
        设备型号: "ML-2100",
        NB卡号: "323213",
        批次号: "111133763433444441153531",
        出厂编号: "215431",
        出厂日期是发哈是开放的粉红色: "2020-01-22 12:44:10",
        产品标识: "7665323144642124",
        设备密钥: "cc76w45432142312312312312312312a2674j3g65",
    },
  ];
 * ```
 */
const toExcel = (demo: Array<any>, name: string, title: Array<any>) => {
  const excel = XLSX.utils.book_new()
  const json_demo = JSON.parse(JSON.stringify(demo))
  let new_arr: Array<any> = []
  let new_arr2: Array<any> = []
  title.forEach((item: Array<any>) => {
    new_arr.push(item[0])
    new_arr2.push(item[1])
  })
  let new_demo: Array<any> = []
  json_demo.forEach((item, index) => {
    // console.log(item);
    let new_obj = {}
    title.forEach((ite, ind) => {
      new_obj[ite[0]] = item[ite[1]]
    })
    new_demo.push(new_obj)
  })
  // console.log(new_demo);
  let data = XLSX.utils.json_to_sheet(new_demo, {
    // origin: "A2", // 设置插入位置
  })
  // 表头的样式
  data['A1'].s = {
    font: {
      bold: true,
    },
    alignment: {
      horizontal: 'center',
      vertical: 'center',
    },
  }

  // 合并单元格     s: 起始位置,   e: 结束位置,   r: 行,   c: 列
  // data["!merges"] = [{ s: { r: 0, c: 0 }, e: { r: 0, c: 10 } }];
  //  设置列宽
  // data["!cols"] = [{ wch: 50 }, { wch: 20 }, { wch: 40 }];

  // 1.所有表头的宽度
  const headsWidth = Object.keys(new_demo[0]).map((value) => {
    if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
      return parseFloat(String(value.toString().length * 2))
    } else {
      return parseFloat(String(value.toString().length * 1))
    }
  })
  // console.log("所有表头的宽度：", headsWidth);
  // 2.所有表体值的宽度
  const rowsWidth = new_demo.map((item) => {
    // 每行数据中值的宽度
    // console.log(item);
    const maxValue = Object.values(item).map((value: any, index) => {
      let valueWidth
      if (/.*[\u4e00-\u9fa5]+.*$/.test(value)) {
        valueWidth = parseFloat(String(value.toString().length * 2))
      } else {
        if (value) {
          valueWidth = parseFloat(String(value.toString().length * 1))
        }
      }
      // console.log("每行数据中值的宽度：", valueWidth);

      // 对比出表头和表体值的最大数
      if (Math.max(valueWidth, headsWidth[index]) == 40) {
        // console.log( Math.max(valueWidth, headsWidth[index]));
      }
      return Math.max(valueWidth, headsWidth[index])
    })
    // console.log("本行值中最大宽度：", maxValue);
    return maxValue
  })
  // console.log("每行数据对比出的最大宽度：", rowsWidth);

  // 3.对比每列最大值
  let aotuWidth: Array<any> = []
  rowsWidth.map((row, index) => {
    let maxWidth: Array<any> = []
    row.map((value, i) => {
      if (index === 0) {
        // console.log(wch);
        maxWidth.push({
          wch: value,
        })
      } else {
        // console.log(wch);
        // console.log(NaN);
        //  console.log( aotuWidth[i])

        if (aotuWidth[i]) {
          if (aotuWidth[i].wch.toString() !== 'NaN') {
            //  console.log(aotuWidth[i].wch,'888888');
            maxWidth.push({
              wch: Math.max(value, aotuWidth[i].wch),
            })
          }
        } else {
          // maxWidth.push({
          //   wch: Math.max(value),
          // });
        }
      }
    })
    // console.log("最大值：", maxWidth);
    aotuWidth = maxWidth
  })
  // console.log("每列最大宽度：", aotuWidth);

  // 4.给excel设置自适应宽度
  data['!cols'] = aotuWidth
  // console.log(data);
  XLSX.utils.book_append_sheet(excel, data)
  XLSX.writeFile(excel, name)
}

/**
 * @description: 方法1:常规下载json
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {object} res - 需要下载的json数据
 * @param {string} name - 下载文件名
 * @param {boolean} isFormat - 是否格式化，默认不格式化
 * @return {*}
 * @example:
 * ```ts
 * downloadJson({val:1},"文件名","json")
 * ```
 */
const downloadJson = (res: object, name?: string, isFormat?: boolean) => {
  isFormat = isFormat || false
  name = name || 'json'
  var a = document.createElement('a')
  a.download = name
  a.style.display = 'none'
  var dat = isFormat ? JSON.stringify(res, null, 4) : JSON.stringify(res)
  var blob = new Blob([dat], { type: 'Application/json' })
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  return true
}
/**
 * @description: <方法2：下载json，支持超大数据量，十万条以上>
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {any} data
 * @param {string} name - 文件名
 * @param {boolean} isFormat - 是否格式化
 * @return {*}
 * @example
 */
const downloadJson2 = (data: any, name?: string, isFormat?: boolean) => {
  isFormat = isFormat || false
  name = name || 'json'
  var nowTime = getNowTimeFormat1()
  name = name + '_' + nowTime
  var a = document.createElement('a')
  a.download = name
  a.style.display = 'none'
  //大于100000条时，序列化会失败，此时采用分段序列化只下载features
  if (data.features.length > 100000) {
    // var d = isFormat
    //   ? stringify(data.features, null, 4)
    //   : stringify(data.features);
    var d = stringify(data.features)
    var blob = new Blob(d, { type: 'Application/json' })
  } else {
    var dat = isFormat ? JSON.stringify(data, null, 4) : JSON.stringify(data)
    var blob = new Blob([dat], { type: 'Application/json' })
  }
  a.href = URL.createObjectURL(blob)
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  return true
}
/**
 * @description: <序列化>
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {*} data
 * @return {*}
 * @example
 */
const stringify = (data) => {
  // 使用数组储存文件数据
  let resultArray: Array<string> = []
  // 定义数组项的分隔字符
  let split = ','
  // 在数组开头添加数组的开始符号
  resultArray.push('[')
  // 循环添加每一个结果，以及分割字符
  for (const result of data) {
    // resultArray.push(JSON.stringify(result, null, 4));
    resultArray.push(JSON.stringify(result))
    resultArray.push(split)
  }
  // 删除最后一个分隔符（不去掉的话会导致格式错误）
  resultArray.pop()
  // 在数组末尾添加数组的结束符号
  resultArray.push(']')
  return resultArray
}
/**
 * @description: <获取当前时间(格式1：2023-06-26_140425)>
 * @msg: 备注
 * @author: YangYuzhuo
 * @return {*}
 * @example
 */
const getNowTimeFormat1 = () => {
  var time = getNowTime()
  let { year, month, day, hour, minute, second } = time
  let nowTime = ''
  nowTime =
    year +
    '-' +
    month +
    '-' +
    day +
    '_' +
    hour +
    // ":" +
    minute +
    // ":" +
    second
  return nowTime
}

/**
 * @description: <获取当前时间>
 * @msg: 备注
 * @author: YangYuzhuo
 * @return {*}
 * @example
 */
const getNowTime = () => {
  let now = new Date()
  let year = now.getFullYear() //获取完整的年份(4位,1970-????)
  let month = now.getMonth() + 1 //获取当前月份(0-11,0代表1月)
  let day = now.getDate() //获取当前日(1-31)
  let hour = now.getHours() //获取当前小时数(0-23)
  let minute = now.getMinutes() //获取当前分钟数(0-59)
  let second = now.getSeconds() //获取当前秒数(0-59)
  var time = {
    year,
    month: fillZero(month),
    day: fillZero(day),
    hour: fillZero(hour),
    minute: fillZero(minute),
    second: fillZero(second),
  }
  return time
}
/**
 * @description: <时间补0>
 * @msg: 备注
 * @author: YangYuzhuo
 * @param {*} str
 * @return {*}
 * @example
 */
const fillZero = (str) => {
  var realNum
  if (str < 10) {
    realNum = '0' + str
  } else {
    realNum = str
  }
  return realNum
}

class MinMaxCounter {
  minNum: number
  maxNum: number
  constructor() {
    this.minNum = Number.POSITIVE_INFINITY
    this.maxNum = Number.NEGATIVE_INFINITY
  }
  update(num) {
    if (num > this.maxNum) this.maxNum = num
    if (num < this.minNum) this.minNum = num
  }

  result() {
    return [this.minNum, this.maxNum]
  }
}

export const common = {
  describe: '通用前端方法',
  getUuid,
  getUuid2,
  getDividedArray,
  sheet2blob,
  toExcel,
  downloadJson,
  downloadJson2,
  getNowTimeFormat1,
  getNowTime
}
