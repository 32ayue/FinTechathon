import request from '@/utils/request'

const serverPath = 'http://localhost:7100/api'

const userApi = {
    searchActivity: serverPath + '/club/searchActivity',
    allTeacher: serverPath + '/admin/allTeacher',
    allCopllege: serverPath + '/admin/allCollege',
    addActivity: serverPath + '/club/addActivity',
    updateActivity: serverPath + '/club/updateActivity',
    addScore: serverPath + '/club/addScore',
    searchScore: serverPath + '/club/searchScore',
    removeScore: serverPath + '/club/removeScore',
    removeActivity: serverPath + '/club/removeActivity',
    addAchievement: serverPath + '/club/addAchievement',
    sign: serverPath + '/club/sign',
    getAnalysis: serverPath + '/getAnalysis',
    searchAchievement: serverPath + '/searchAchievement',
    addDetection: serverPath + '/addDetection',
    addFeedback: serverPath + '/addFeedback',
    searchDetection: serverPath + '/searchDetection',
    searchmyDetection: serverPath + '/searchmyDetection',
    searchFeedback: serverPath + '/searchFeedback',
    auditFeedback: serverPath + '/auditFeedback'
}

export function addAchievement (parameter) {
  console.log(parameter)
  return request({
    url: userApi.addAchievement,
    method: 'post',
    data: parameter,
    processData: false,
    contentType: false
  })
}

export function searchAchievement (parameter) {
  return request({
    baseURL: userApi.searchAchievement,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getAnalysis (parameter) {
  return request({
    baseURL: userApi.getAnalysis,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function sign (parameter) {
  return request({
    url: userApi.sign,
    method: 'post',
    data: parameter
  })
}

export function removeActivity (parameter) {
  return request({
    url: userApi.removeActivity,
    method: 'post',
    data: parameter
  })
}

export function removeScore (parameter) {
  return request({
    url: userApi.removeScore,
    method: 'post',
    data: parameter
  })
}

export function addScore (parameter) {
  return request({
    url: userApi.addScore,
    method: 'post',
    data: parameter
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

export function updateActivity (parameter) {
  return request({
    url: userApi.updateActivity,
    method: 'post',
    data: parameter
  })
}

export function addActivity (parameter) {
  return request({
    url: userApi.addActivity,
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

export function allTeacher (parameter) {
  return request({
    baseURL: userApi.allTeacher,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function allCopllege (parameter) {
  return request({
    baseURL: userApi.allCopllege,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function addDetection (parameter) {
  return request({
    url: userApi.addDetection,
    method: 'post',
    data: parameter
  })
}

export function addFeedback (parameter) {
  return request({
    url: userApi.addFeedback,
    method: 'post',
    data: parameter
  })
}

export function searchDetection () {
  return request({
    url: userApi.searchDetection,
    method: 'get'
  })
}

export function searchmyDetection () {
  return request({
    url: userApi.searchmyDetection,
    method: 'get'
  })
}

export function searchFeedback () {
  return request({
    url: userApi.searchFeedback,
    method: 'get'
  })
}

export function auditFeedback (parameter) {
  return request({
    baseURL: userApi.auditFeedback,
    method: 'post',
    data: parameter
  })
}
