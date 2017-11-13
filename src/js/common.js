(function(){

  init()

  function init() {
    const from = getParams('from', 'from-default')
    const uuid = getParams('uuid', 'default-uuid')
    updateURL({from, uuid})
    console.log(`from: ${from}, uuid:${uuid}`)
  }

  /**
   * 根据 newKeys 更新当前的 url 地址，无刷新
   * @param {Object} newKeys - 新键值
   */
  function updateURL(newKeys) {
    const newURL = createNewURL(location.href, newKeys)
    history.replaceState(null, null, newURL)
  }

  /**
   * 在 url 的基础上合并 keys 页面参数，返回新的 url 地址
   * @param {String} url
   * @param {Object} keys
   * @return {String}
   */
  function createNewURL(url, keys) {
    const urlParams = parseUrlParams(url)
    const newKeys = Object.assign({}, urlParams, keys)
    return stringifyURL(url, newKeys)
  }

  /**
   * 使用 url 和 keys 生成
   * @param {String} url
   * @param {Object} keys
   * @return {String}
   */
  function stringifyURL(url, keys) {
    const parts = url.split(/\?|#/)
    const key_str = joinParams(keys)
    parts[1] = key_str

    if (parts.length < 3) {
      return parts.join('?')
    }

    return parts[0] + '?' + parts[1] + '#' + parts[2]
  }

  /**
   * 将 params 代表的对象转化为 `foo=bar&name=baz` 形式的字符串
   * @param {Object} params
   * @return {String}
   */
  function joinParams(params) {
    var keys = Object.keys(params)
    var tokens = []
    for (var i = 0; i < keys.length; i++) {
        tokens.push(keys[i] + '=' + params[keys[i]])
    }
    return tokens.join('&')
  }

  /**
   * 从当前地址或 referrer 地址获取指定的 key 值
   * 如果都没有找到，就返回默认值 `defaultValue`
   *
   * @param {String} key
   * @param {String} defaultValue
   * @return {String}
   */
  function getParams(key, defaultValue) {
    const url = location.href
    const currentParams = parseUrlParams(url)
    if (paramsExist(url, key)) {
      return currentParams[key]
    }

    const referer = document.referrer
    if (paramsExist(referer, key)) {
      return parseUrlParams(referer)[key]
    }

    return defaultValue
  }

  /**
   * 解析 url 的地址参数，返回对象类型
   * @param {url} url 地址
   * @return {Object}
   */
  function parseUrlParams(url) {
    if (url.indexOf('?') === -1) return {}
    return url.split(/\?|#/)[1]
      .split('&')
      .map(item => {
        const tokens = item.split('=')
        return {
          [tokens[0]]: tokens[1]
        }
      })
      .reduce((a, b) => {
        return Object.assign({}, a, b)
      })
  }

  /** 判断 URL 页面参数中是否存在某个键值 */
  function paramsExist(url, key) {
    return parseUrlParams(url).hasOwnProperty(key)
  }

})()
