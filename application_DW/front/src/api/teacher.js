import request from '@/utils/request'

const serverPath = 'http://localhost:7100/api'

const userApi = {
    searchActivity: serverPath + '/teacher/searchActivity',
    auditActivity: serverPath + '/teacher/auditActivity',
    auditAchievement: serverPath + '/teacher/auditAchievement',
    auditComplaint: serverPath + '/teacher/auditComplaint'
}

export function auditComplaint (parameter) {
    return request({
      baseURL: userApi.auditComplaint,
      method: 'post',
      data: parameter
    })
  }

  export function auditAchievement (parameter) {
      return request({
        baseURL: userApi.auditAchievement,
        method: 'post',
        data: parameter
      })
    }

export function auditActivity (parameter) {
    return request({
      baseURL: userApi.auditActivity,
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
