let env = process.env
if (env.NODE_ENV !== 'development' && env.VUE_APP_TYPE !== 'test') {
  let timeLimit = 500
  setInterval(function() {
    check()
  }, timeLimit)
  let check = function() {
    let starttime = new Date()

    function doCheck(a) {
      if (('' + a / a)['length'] !== 1 || a % 20 === 0) {
        ;(function() {}['constructor']('debugger')())
      } else {
        ;(function() {}['constructor']('debugger')())
      }
      if (new Date() - starttime > timeLimit) {
        window.stop()
        document.querySelector('#app').innerHTML =
          '\u7cfb\u7edf\u68c0\u6d4b\u975e\u6cd5\u8c03\u8bd5\u002c\u8bf7\u5237\u65b0\u91cd\u8bd5\u0021'
      }
      doCheck(++a)
    }
    try {
      doCheck(0)
    } catch (err) {
      console.log(err)
    }
  }
  check()
} else {
  console.log('is development')
}
