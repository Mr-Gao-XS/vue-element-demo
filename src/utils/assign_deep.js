export default function assignDeep(...params) {
  let class2type = {},
    src,
    copyIsArray,
    copy,
    name,
    options,
    clone,
    target = params[0] || {},
    i = 1,
    length = params.length,
    deep = false
  if (typeof target === 'boolean') {
    deep = target
    target = params[i] || {}
    i++
  }
  if (typeof target !== 'object' && !isFunction(target)) {
    target = {}
  }
  if (i === length) {
    target = this
    i--
  }
  for (; i < length; i++) {
    if ((options = params[i]) != null) {
      for (name in options) {
        src = target[name]
        copy = options[name]
        if (target === copy) {
          continue
        }
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && isPlainObject(src) ? src : {}
          }
          target[name] = assignDeep(deep, clone, copy)
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  function isPlainObject(obj) {
    if (!obj || obj.toString() !== '[object Object]' || obj.nodeType || obj.setInterval) {
      return false
    }
    if (
      obj.constructor &&
      // eslint-disable-next-line no-prototype-builtins
      !obj.hasOwnProperty('constructor') &&
      // eslint-disable-next-line no-prototype-builtins
      !obj.constructor.prototype.hasOwnProperty('isPrototypeOf')
    ) {
      return false
    }
    let key
    // eslint-disable-next-line no-empty
    for (key in obj) {
    }
    // eslint-disable-next-line no-prototype-builtins
    return key === undefined || obj.hasOwnProperty(key)
  }

  function type(obj) {
    if (obj == null) {
      return obj + ''
    }
    return typeof obj === 'object' || typeof obj === 'function'
      ? class2type[toString.call(obj)] || 'object'
      : typeof obj
  }

  function isFunction(obj) {
    return type(obj) === 'function'
  }
  return target
}
