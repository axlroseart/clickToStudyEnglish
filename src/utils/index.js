function formatNumber(n) {
  const str = n.toString();
  return str[1] ? str : `0${str}`;
}

export function formatTime(date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const t1 = [year, month, day].map(formatNumber).join("/");
  const t2 = [hour, minute, second].map(formatNumber).join(":");

  return `${t1} ${t2}`;
}

export function formatSeconds(value) {
  var secondTime = parseInt(value); // 秒
  var minuteTime = 0; // 分
  var hourTime = 0; // 小时
  if (secondTime > 60) {
    //如果秒数大于60，将秒数转换成整数
    //获取分钟，除以60取整数，得到整数分钟
    minuteTime = parseInt(secondTime / 60);
    //获取秒数，秒数取佘，得到整数秒数
    secondTime = parseInt(secondTime % 60);
    //如果分钟大于60，将分钟转换成小时
    if (minuteTime > 60) {
      //获取小时，获取分钟除以60，得到整数小时
      hourTime = parseInt(minuteTime / 60);
      //获取小时后取佘的分，获取分钟除以60取佘的分
      minuteTime = parseInt(minuteTime % 60);
    }
  }
  var result = "" + parseInt(secondTime) + "秒";

  if (minuteTime > 0) {
    result = "" + parseInt(minuteTime) + "分" + result;
  }
  if (hourTime > 0) {
    result = "" + parseInt(hourTime) + "小时" + result;
  }
  return result;
}

/**
 * 获取数据状态处理
 * @param {object} data
 * */
export const checkData = (data) => {
  return new Promise((resolve, reject) => {
    if (typeof data !== 'undefined') {
      if (data.code === 1) {
        resolve(data)
      } else {
        reject(data)
      }
    }
  })
}

export default {
  formatNumber,
  formatTime,
  formatSeconds
}
