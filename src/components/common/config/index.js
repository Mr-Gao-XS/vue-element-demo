let env = process.env
let url = ''

if (env.VUE_APP_TYPE === 'test') {
  // 测试服
  url = '/api'
} else if (process.env.NODE_ENV === 'production') {
  // 正式服
  url = '/api'
} else {
  url = '/server'
}

export const baseUrl = url
