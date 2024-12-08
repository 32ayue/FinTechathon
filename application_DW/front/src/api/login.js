import request from '@/utils/request'

const serverPath = 'http://localhost:7100/api'

const userApi = {
  // Login: '/auth/login',
  Login: serverPath + '/login',
  Logout: '/api/auth/logout',
  ForgePassword: '/api/auth/forge-password',
  Register: '/api/auth/register',
  twoStepCode: '/api/auth/2step-code',
  SendSms: '/api/account/sms',
  SendSmsErr: '/api/account/sms_err',
  // get my info
  // UserInfo: '/user/info',
  // UserMenu: '/api/user/nav',
  UserInfo: serverPath + '/userInfo',
  UserMenu: serverPath + '/userNav',
  changePwd: serverPath + '/changePwd'
}

/**
 * login func
 * parameter: {
 *     username: '',
 *     password: '',
 *     remember_me: true,
 *     captcha: '12345'
 * }
 * @param parameter
 * @returns {*}
 */
export function login (parameter) {
  return request({
    url: userApi.Login,
    method: 'post',
    data: parameter
  })
}

export function changePwd (parameter) {
  return request({
    url: userApi.changePwd,
    method: 'post',
    data: parameter
  })
}

export function getSmsCaptcha (parameter) {
  return request({
    url: userApi.SendSms,
    method: 'post',
    data: parameter
  })
}

export function getInfo (parameter) {
  return request({
    baseURL: userApi.UserInfo,
    method: 'get',
    params: parameter,
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

export function getCurrentUserNav () {
  return request({
    url: userApi.UserMenu,
    method: 'get'
  })
}

export function logout () {
  return request({
    url: userApi.Logout,
    method: 'post',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8'
    }
  })
}

/**
 * get user 2step code open?
 * @param parameter {*}
 */
export function get2step (parameter) {
  return request({
    url: userApi.twoStepCode,
    method: 'post',
    data: parameter
  })
}
