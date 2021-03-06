export function parseTime(time, cFormat) {
    if (arguments.length === 0) {
        return null
    }
    const format = cFormat || '{y}-{m}-{d} {h}:{i}:{s}'
    let date
    if (typeof time === 'object') {
        date = time
    } else {
        if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
            time = parseInt(time)
        }
        if ((typeof time === 'number') && (time.toString().length === 10)) {
            time = time * 1000
        }
        date = new Date(time)
    }
    const formatObj = {
        y: date.getFullYear(),
        m: date.getMonth() + 1,
        d: date.getDate(),
        h: date.getHours(),
        i: date.getMinutes(),
        s: date.getSeconds(),
        a: date.getDay()
    }
    const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
        let value = formatObj[key]
        // Note: getDay() returns 0 on Sunday
        if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
        if (result.length > 0 && value < 10) {
            value = '0' + value
        }
        return value || 0
    })
    return time_str
}

export function getStrByData(arr) {
    if (arr == null || arr == []) {
        return [];
    }
    var str = [];
    for (var i = 0; i < arr.length; i++) {
        str.push(arr[i].id)
    }
    return str;
}

export function formatTime(time, option) {
    if (('' + time).length === 10) {
        time = parseInt(time) * 1000
    } else {
        time = +time
    }
    const d = new Date(time)
    const now = Date.now()

    const diff = (now - d) / 1000

    if (diff < 30) {
        return '刚刚'
    } else if (diff < 3600) {
        // less 1 hour
        return Math.ceil(diff / 60) + '分钟前'
    } else if (diff < 3600 * 24) {
        return Math.ceil(diff / 3600) + '小时前'
    } else if (diff < 3600 * 24 * 2) {
        return '1天前'
    }
    if (option) {
        return parseTime(time, option)
    } else {
        return (
            d.getMonth() +
            1 +
            '月' +
            d.getDate() +
            '日' +
            d.getHours() +
            '时' +
            d.getMinutes() +
            '分'
        )
    }
}

export function getQueryObject(url) {
    url = url == null ? window.location.href : url
    const search = url.substring(url.lastIndexOf('?') + 1)
    const obj = {}
    const reg = /([^?&=]+)=([^?&=]*)/g
    search.replace(reg, (rs, $1, $2) => {
        const name = decodeURIComponent($1)
        let val = decodeURIComponent($2)
        val = String(val)
        obj[name] = val
        return rs
    })
    return obj
}

export function byteLength(str) {
    // returns the byte length of an utf8 string
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
        const code = str.charCodeAt(i)
        if (code > 0x7f && code <= 0x7ff) s++
            else if (code > 0x7ff && code <= 0xffff) s += 2
        if (code >= 0xDC00 && code <= 0xDFFF) i--
    }
    return s
}

/**
 * @param {Array} actual
 * @returns {Array}
 */
export function cleanArray(actual) {
    const newArray = []
    for (let i = 0; i < actual.length; i++) {
        if (actual[i]) {
            newArray.push(actual[i])
        }
    }
    return newArray
}

/**
 * @param {Object} json
 * @returns {Array}
 */
export function param(json) {
    if (!json) return ''
    return cleanArray(
        Object.keys(json).map(key => {
            if (json[key] === undefined) return ''
            return encodeURIComponent(key) + '=' + encodeURIComponent(json[key])
        })
    ).join('&')
}

/**
 * @param {string} url
 * @returns {Object}
 */
export function param2Obj(url) {
    const search = url.split('?')[1]
    if (!search) {
        return {}
    }
    return JSON.parse(
        '{"' +
        decodeURIComponent(search)
        .replace(/"/g, '\\"')
        .replace(/&/g, '","')
        .replace(/=/g, '":"')
        .replace(/\+/g, ' ') +
        '"}'
    )
}

/**
 * @param {string} val
 * @returns {string}
 */
export function html2Text(val) {
    const div = document.createElement('div')
    div.innerHTML = val
    return div.textContent || div.innerText
}

export function objectMerge(target, source) {
    if (typeof target !== 'object') {
        target = {}
    }
    if (Array.isArray(source)) {
        return source.slice()
    }
    Object.keys(source).forEach(property => {
        const sourceProperty = source[property]
        if (typeof sourceProperty === 'object') {
            target[property] = objectMerge(target[property], sourceProperty)
        } else {
            target[property] = sourceProperty
        }
    })
    return target
}

/**
 * @param {HTMLElement} element
 * @param {string} className
 */
export function toggleClass(element, className) {
    if (!element || !className) {
        return
    }
    let classString = element.className
    const nameIndex = classString.indexOf(className)
    if (nameIndex === -1) {
        classString += '' + className
    } else {
        classString =
            classString.substr(0, nameIndex) +
            classString.substr(nameIndex + className.length)
    }
    element.className = classString
}

/**
 * @param {string} type
 * @returns {Date}
 */
export function getTime(type) {
    if (type === 'start') {
        return new Date().getTime() - 3600 * 1000 * 24 * 90
    } else {
        return new Date(new Date().toDateString())
    }
}

export function debounce(func, wait, immediate) {
    let timeout, args, context, timestamp, result

    const later = function() {
        // 据上一次触发时间间隔
        const last = +new Date() - timestamp

        // 上次被包装函数被调用时间间隔 last 小于设定时间间隔 wait
        if (last < wait && last > 0) {
            timeout = setTimeout(later, wait - last)
        } else {
            timeout = null
            // 如果设定为immediate===true，因为开始边界已经调用过了此处无需调用
            if (!immediate) {
                result = func.apply(context, args)
                if (!timeout) context = args = null
            }
        }
    }

    return function(...args) {
        context = this
        timestamp = +new Date()
        const callNow = immediate && !timeout
        // 如果延时不存在，重新设定延时
        if (!timeout) timeout = setTimeout(later, wait)
        if (callNow) {
            result = func.apply(context, args)
            context = args = null
        }

        return result
    }
}

export function deleteEmptyProp(arr) {
    var newArr = []
    arr.forEach(item => {
        var keys = Object.keys(item)
        if (keys.length > 0) {
            newArr.push(item)
        }
    })
    return newArr
}

export function deleteEmptyObj(arr) {
    var newArr = []
    arr.forEach(item => {
        if (item.summary || item.coaId) {
            newArr.push(item)
        }
    })
    return newArr
}

export function addNullObj(arr) {
    var newArr = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}]
    for (var i = 0; i < arr.length; i++) {
        newArr.splice(i, 1, arr[i])
    }
    return newArr;
}

export function addNullObj2(arr) {
    var newArr = [{}, {}, {}, {}, {}];
    for (var i = 0; i < arr.length; i++) {
        newArr.splice(i, 1, arr[i])
    }
    return newArr
}

export function deepClone(source) {
    if (!source && typeof source !== 'object') {
        throw new Error('error arguments', 'deepClone')
    }
    const targetObj = source.constructor === Array ? [] : {}
    Object.keys(source).forEach(keys => {
        if (source[keys] && typeof source[keys] === 'object') {
            targetObj[keys] = deepClone(source[keys])
        } else {
            targetObj[keys] = source[keys]
        }
    })
    return targetObj
}

export function uniqueArr(arr) {
    return Array.from(new Set(arr))
}

/**
 * @returns {string}
 */
export function createUniqueString() {
    const timestamp = +new Date() + ''
    const randomNum = parseInt((1 + Math.random()) * 65536) + ''
    return (+(randomNum + timestamp)).toString(32)
}

/**
 * Check if an element has a class
 * @param {HTMLElement} elm
 * @param {string} cls
 * @returns {boolean}
 */
export function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'))
}

/**
 * Add class to element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ' ' + cls
}

/**
 * Remove class from element
 * @param {HTMLElement} elm
 * @param {string} cls
 */
export function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)')
        ele.className = ele.className.replace(reg, ' ')
    }
}

export function fetchRoles(arr) {
    var codes = []
    for (var i = 0; i < arr.length; i++) {
        codes.push(arr[i].funcCode)
    }
    return codes
}

export function getNowDate(type) {
    var d = new Date();
    var y = d.getFullYear()
    var m = d.getMonth() + 1
    var d = d.getDate()
    if (type === 1) {
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + '01'
    } else {
        return y + '-' + (m < 10 ? '0' + m : m) + '-' + (d < 10 ? '0' + d : d)
    }
}

export function getNowMonth() {
    var d = new Date()
    var y = d.getFullYear()
    var m = d.getMonth() + 1
    return y + '-' + (m < 10 ? '0' + m : m)
}

export function getPrevMonth() {
    var d = new Date()
    var y = d.getFullYear()
    var m = d.getMonth()
    if (m === 0) {
        y = y - 1
        m = 12
    }
    return y + '-' + (m < 10 ? '0' + m : m)
}

export function getPrevSeason() {
    var d = new Date()
    var m = d.getMonth() >= 3 ? d.getMonth() : d.getMonth() + 9
    var s = ['1', '1', '1', '2', '2', '2', '3', '3', '3', '4', '4', '4']
    return s[m]
}

export function convertCurrency(money) {
    var money = Math.abs(money);
    var cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
    var cnIntRadice = new Array('', '拾', '佰', '仟');
    var cnIntUnits = new Array('', '万', '亿', '兆');
    var cnDecUnits = new Array('角', '分', '毫', '厘');
    var cnInteger = '整';
    var cnIntLast = '元';
    var maxNum = 999999999999999.9999;
    var integerNum;
    var decimalNum;
    var chineseStr = '';
    var parts;
    money = Number(money) / 100;
    if (money == '') {
        return '';
    }
    money = parseFloat(money);
    if (money >= maxNum) {
        return '';
    }
    if (money == 0) {
        chineseStr = cnNums[0] + cnIntLast + cnInteger;
        return chineseStr;
    }
    money = money.toString();
    if (money.indexOf('.') == -1) {
        integerNum = money;
        decimalNum = '';
    } else {
        parts = money.split('.');
        integerNum = parts[0];
        decimalNum = parts[1].substr(0, 4);
    }
    if (parseInt(integerNum, 10) > 0) {
        var zeroCount = 0;
        var IntLen = integerNum.length;
        for (var i = 0; i < IntLen; i++) {
            var n = integerNum.substr(i, 1);
            var p = IntLen - i - 1;
            var q = p / 4;
            var m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                    chineseStr += cnNums[0];
                }
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                chineseStr += cnIntUnits[q];
            }
        }
        chineseStr += cnIntLast;
    }
    if (decimalNum != '') {
        var decLen = decimalNum.length;
        for (var i = 0; i < decLen; i++) {
            var n = decimalNum.substr(i, 1);
            if (n != '0') {
                chineseStr += cnNums[Number(n)] + cnDecUnits[i]
            }
        }
    }
    if (chineseStr == '') {
        chineseStr += cnNums[0] + cnIntLast + cnInteger
    } else if (decimalNum == '') {
        chineseStr += cnInteger
    }
    return chineseStr
}


export function toNumStr(arg) {
    if (arg == null)
        return arg;
    arg = String(arg).replace(/,/g, '');
    if (isNaN(arg))
        arg = 0;
    return arg;
}

// input时触发
export function validateVal(numval) {
    var a = numval.replace(/[^\d.-]/g, "")
    var b = a.replace(/\.{2,}/g, ".")
    var c = b.replace(".", "$#$").replace(/\./g, "").replace("$#$", ".");
    var d = c.replace(/^(\-)*(\d+)\.(\d\d).*$/, '$1$2.$3');
    if (d.indexOf(".") < 0 && d != "") {
        if (d.substr(0, 1) == '0' && d.length == 2) {
            d = d.substr(1, d.length)
        }
    }
    if (d.indexOf('.') > 0 && d.length > 12) {
        d = d.substring(0, 11)
    }
    if (numval.indexOf('.') < 0) {
        d = d.substring(0, 9)
    }
    return d ? d : ''
}

// blur时触发
export function showNumber1(value) {
    if (!value || value == "0" || value == "0." || value == "0.0" || value == "0.00" || value == "00.00" || value == '.') {
        var value = ''
    } else {
        var value = (value * 100).toFixed(0)
        if (value >= 10 && value < 100) {
            var value = '0' + String(value)
        } else if (value > -100 && value <= -10) {
            var value = '0' + String(value)
        } else if (value > 0 && value < 10) {
            var value = '00' + String(value)
        } else if (value > -10 && value < 0) {
            var value = '00' + String(value)
        }
        if (value.indexOf('.') > 0 && value.indexOf('.') == value.length - 1) {
            value = value.substring(0, value.length - 1)
        }
    }
    return value
}

// fouces时触发
export function showNumber2(value) {
    if (!value || value == "0") {
        var value = ''
    } else {
        var value = value * 1 / 100
    }
    return value
}


export function getIsAuxiliary(arr, id) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].id == id) {
            return arr[i].auxiliary
        }
    }
    return '000000'
}