import request from '@/utils/request'
var fromData = [function (obj) {let c = '';for (let i in obj) {c += encodeURIComponent(i) + '=' + encodeURIComponent(obj[i]) + '&'}return c}];

export function getList(data) {
  return [
          { number: 1, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 },
          { number: 2, name: "名称1", type: '委托人', brand: '已售完',count:168 }
          ]
}

export function logout() {
  return request({
    url: '/logout',
    method: 'post'
  })
}