import request from '@/utils/request'

export function login(username, password) {
  return request({
    url: '/user/login',
    method: 'post',
    data: {
      username,
      password
    }
  })
}

export function getInfo() {
  return request({
    url: '/user/info',
    method: 'get',
  })
}

export function getUser(id) {
  return request({
    url: '/user/' + id,
    method: 'get',
  })
}

export function logout() {
  return request({
    url: '/user/logout',
    method: 'post'
  })
}

export function fetchList(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}

export function fetchUAllUserList() {
  return request({
    url: '/user/listAll',
    method: 'get'
  })
}

export function createUser(data) {
  return request({
    url: '/user/register',
    method: 'post',
    data: data
  })
}

export function updateUser(id, data) {
  return request({
    url: '/user/' + id,
    method: 'put',
    data: data
  })
}

export function updateStatus(id, params) {
  return request({
    url: '/user/status/' + id,
    method: 'put',
    params: params
  })
}

export function deleteUser(id) {
  return request({
    url: '/user/' + id,
    method: 'delete'
  })
}

export function getRoleByUser(id) {
  return request({
    url: '/user/roles/' + id,
    method: 'get'
  })
}

export function allocRole(id, params) {
  return request({
    url: '/user/roles/' + id,
    method: 'put',
    params: params
  })
}
