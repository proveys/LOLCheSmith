// axios 설정이 없으면 프론트엔드에서 쿠키(JSESSIONID) 를 백엔드로 안 보내aus,
// 세션 유지가 안 되거나, 로그아웃 요청이 제대로 안먹을 수 있다.
// 대신 여기서 쓴  baseURL을 신경 안쓰면 맵핑으로 개고생 할 수 있다. 나처럼

import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  withCredentials: true,  // 쿠키를 포함하여 요청
  headers: {
    'Content-Type': 'application/json'
  }
});

export default instance;

