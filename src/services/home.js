import api from '../api';
import http from '../fetch';

export function getSpeecherGroup(phone) {
  let phonenew = phone ? phone : '13800138000';
  return http.post(
    `http://120.92.10.182:8000/api/gitc/person/pages.json?token=1afb756d16740266efde290917ca1a8e&phone=${
      phonenew
    }&order_by=ename`
  );
}

export function getPopleList(pageId, phone) {
  let phonenew = phone ? phone : '13800138000';
  return http.get(
    api.popleList +
      pageId +
      `/list.json?token=1afb756d16740266efde290917ca1a8e&phone=${
        phonenew
      }&order_by=ename`
  );
}

export function getAgenda(phone) {
  let phonenew = phone ? phone : '13800138000';
  return http.get(
    `http://120.92.10.182:8000/api/gitc/person/beijing.json?token=1afb756d16740266efde290917ca1a8e&phone=${
      phonenew
    }&order_by=-weight`
  );
}

export function getDate1(phone) {
  let phonenew = phone ? phone : '13800138000';
  return http.get(
    `http://120.92.10.182:8000/api/gitc/person-4/all/list.json?token=1afb756d16740266efde290917ca1a8e&type=1&phone=${
      phonenew
    }`
  );
}

export function getDate2(phone) {
  let phonenew = phone ? phone : '13800138000';
  return http.get(
    `http://120.92.10.182:8000/api/gitc/person-6/all/list.json?token=1afb756d16740266efde290917ca1a8e&type=1&phone=${
      phonenew
    }`
  );
}

// 亮点环节
export function getLightDot() {
  return http.get(
    api.getListNews + `66/list.json?token=1afb756d16740266efde290917ca1a8e`
  );
}

// 服务信息
export function getServiceInfo() {
  return http.get(
    api.getListNews + `69/list.json?token=1afb756d16740266efde290917ca1a8e`
  );
}

// 直播地址
export function getLiveUrl() {
  return http.get(
    'http://120.92.10.182:8000/api/video/70/list.json?token=1afb756d16740266efde290917ca1a8e'
  );
}

// 微信加群
export function getWeixinGroup() {
  return http.get(
    'http://120.92.10.182:8000/api/gitc/page/img-8/list.json?token=1afb756d16740266efde290917ca1a8e'
  );
}
