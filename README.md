
# 🧙 LOL 전적 검색 사이트 - LOLCheSmith

## 🎮 프로젝트 소개
Riot API 기반으로 소환사 전적을 검색할 수 있는 웹 애플리케이션입니다.  
사용자는 소환사 정보를 검색하고, 최근 전적 및 챔피언 통계, 승률 등을 시각적으로 확인할 수 있습니다.  
검색 기록 저장 및 UI 개선을 통해 사용 편의성을 높였습니다.

## 🚀 배포환경
- AWS EC2 + RDS  
- 프론트엔드: Vercel or Netlify  
- 현재 서버는 비활성화 상태입니다.

## 🏆 주요 기능
- 소환사 검색 (게임명 + 태그 입력)  
- 최근 10경기 전적 자동 표시 및 무한 스크롤 기반 추가 조회  
- 챔피언별 KDA, 승률, 픽률 분석  
- 검색 기록 저장 (LocalStorage 활용)  
- 패치노트 크롤링 기능 (Selenium 활용)

## 🛠 사용 기술

### ⚙️ 백엔드
- Java 21  
- Spring Boot 3.4.1  
- Spring Security (세션 기반 인증)  
- Spring Data JPA (데이터 접근 계층)  
- MySQL  
- Riot API (소환사 정보, 매치 기록)  
- Jsoup, Selenium (크롤링 및 자동화)

### 💻 프론트엔드
- React (Vite 기반)  
- Material UI  
- HTML5 / CSS3 / JavaScript  
- Axios (비동기 통신)  
- React Router Dom  
- Chart.js (챔피언 통계 시각화)

### 🛠 기타
- LocalStorage (검색 기록 저장)  
- RESTful API 설계  
- 파일 업로드 및 이미지 미리보기 (게시판 기능 포함)

## 📦 디렉토리 구조
```
backend/src/main/java/com/hc/lolmatchhistory
├── controller
├── dto
├── entity
├── repository
├── service
├── config
```

## 💾 기술 선정 이유
- **Spring Boot**: API 서버로써의 확장성과 유지보수성 확보  
- **React + Vite**: 빠른 개발과 빌드 성능 개선  
- **Material UI**: 직관적인 디자인과 반응형 UI 구현  
- **Riot API**: 실시간 게임 데이터 제공 및 다양한 정보 연동  
- **Selenium**: 정기적인 패치노트 자동 크롤링 처리
