import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat'
dayjs.extend(customParseFormat)
/**
 * @desc 格式化时间
 * @param {String}
 */
export const formatTime = (arg, format, formatOrigin) => {
  if (formatOrigin) {
    return dayjs(arg + '', formatOrigin).format(format || 'YYYY-MM-DD HH:mm:ss')
  } else {
    return dayjs(arg).format(format || 'YYYY-MM-DD HH:mm:ss')
  }
}

export const toPercent = point => {
  if (typeof point === 'string' && !Number(point)) return point
  if (point === 0) return 0
  let str = Number(point * 100).toFixed(2)
  str += '%'
  return str
}

/**
 *
 * @param {*} number
 * @param {*} long
 */
export const toRegularNum = (number, long) => {
  if (typeof long === 'undefined') {
    long = 2
  }
  if (long > 2) {
    let nump = (number - 0).toFixed(long).split('.')
    return nump[0].replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,') + '.' + nump[1]
  }
  return ((number - 0).toFixed(long) + '').replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, '$&,')
}

import Clickoutside from '@/directives/clickoutside'
export default {
  filters: {
    formatTime,
    toPercent,
    toRegularNum
  },
  directives: { Clickoutside },
  methods: {
    toRegularNum,
    toCutOffNum(val, len = 2) {
      val += ''
      if (val.indexOf('.') !== -1) {
        let arr = val.split('.')
        if (arr[1].length < len) {
          return arr.join('.') * 1
        } else {
          arr[1] = arr[1].substr(0, len)
          while (arr[1].length) {
            if (arr[1][arr.length - 1] === '0') {
              arr[1] = arr[1].substr(0, arr[1].length - 1)
            } else {
              break
            }
          }
          if (arr[1].length > 0) {
            return arr.join('.') * 1
          } else {
            return arr[0] * 1
          }
        }
      } else {
        return val * 1
      }
    }
  }
}
