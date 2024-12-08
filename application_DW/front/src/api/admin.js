import request from '@/utils/request'

const serverPath = 'http://localhost:7100/api'

const userApi = {
    searchAllUser: serverPath + '/admin/searchAllUser',
    deleteUser: serverPath + '/admin/deleteUser',
    addUser: serverPath + '/admin/addUser',
    updateTea: serverPath + '/admin/updateTea',
    searchAllModels: serverPath + '/admin/searchAllModels'
}

export function updateTea (parameter) {
    return request({
      baseURL: userApi.updateTea,
      method: 'post',
      data: parameter
    })
  }

export function addUser (parameter) {
    return request({
      baseURL: userApi.addUser,
      method: 'post',
      data: parameter
    })
  }

export function deleteUser (parameter) {
    return request({
      baseURL: userApi.deleteUser,
      method: 'post',
      data: parameter
    })
  }

export function searchAllUser (parameter) {
    return request({
      baseURL: userApi.searchAllUser,
      method: 'get',
      params: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }

  export function searchAllModels (parameter) {
    return request({
      baseURL: userApi.searchAllModels,
      method: 'get',
      params: parameter,
      headers: {
        'Content-Type': 'application/json;charset=UTF-8'
      }
    })
  }
