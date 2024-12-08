import request from '@/utils/request'

const serverPath = 'http://localhost:7100/api'

const userApi = {
    searchActivity: serverPath + '/student/searchActivity',
    enrollActivity: serverPath + '/student/enrollActivity',
    unenrollActivity: serverPath + '/student/unenrollActivity',
    searchScore: serverPath + '/club/searchScore',
    getRecommendation: serverPath + '/getRecommendation',
    searchTotalScore: serverPath + '/student/searchScore',
    addClick: serverPath + '/click',
    complaintActivity: serverPath + '/student/complaintActivity',
    ratingActivity: serverPath + '/student/ratingActivity'
}

export function ratingActivity (parameter) {
  return request({
    url: userApi.ratingActivity,
    method: 'post',
    data: parameter
  })
}

export function complaintActivity (parameter) {
  return request({
    url: userApi.complaintActivity,
    method: 'post',
    data: parameter
  })
}

export function addClick (parameter) {
  return request({
    url: userApi.addClick,
    method: 'post',
    data: parameter
  })
}

export function enrollActivity (parameter) {
  return request({
    url: userApi.enrollActivity,
    method: 'post',
    data: parameter
  })
}

export function unenrollActivity (parameter) {
  return request({
    url: userApi.unenrollActivity,
    method: 'post',
    data: parameter
  })
}

export function searchActivity (parameter) {
  return request({
    baseURL: userApi.searchActivity,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function searchScore (parameter) {
    return request({
      baseURL: userApi.searchScore,
      method: 'get',
      params: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }

export function getRecommendation () {
    return request({
        baseURL: userApi.getRecommendation,
        method: 'get',
        headers: {
        'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}

export function searchTotalScore () {
    return request({
        baseURL: userApi.searchTotalScore,
        method: 'get',
        headers: {
        'Content-Type': 'application/json;charset=UTF-8'
        }
    })
}
