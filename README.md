
# 🧙 LOL 전적 검색 사이트 - LOLCheSmith

## 🎮 프로젝트 소개
Riot API 기반으로 소환사 전적을 검색할 수 있는 웹 애플리케이션입니다.  
사용자는 소환사 정보를 검색하고, 최근 전적 및 챔피언 통계, 승률 등을 시각적으로 확인할 수 있습니다.  
검색 기록 저장 및 UI 개선을 통해 사용 편의성을 높였습니다.

## 🚀 배포환경
- AWS EC2 (Spring Boot)  
- AWS RDS (MySQL)  
- Vercel 또는 Netlify (프론트엔드 정적 배포)  
- 현재 서버는 비활성화 상태입니다.

## 🏆 주요 기능
- 소환사 검색 (게임명 + 태그 입력)  
- 최근 10경기 전적 자동 표시 및 무한 스크롤 기반 추가 조회  
- 챔피언별 KDA, 승률, 픽률 분석  
- 검색 기록 저장 (LocalStorage 활용)  
- 패치노트 크롤링 기능 (Selenium 기반)
- 로그인 및 회원가입 기능
- 로그인을 한 회원은 게시판(커뮤니티) 기능

## 🛠 사용 기술

### ⚙️ 백엔드

#### 언어 및 프레임워크
- Java 21  
- Spring Boot 3.4.1  
- Spring Security (세션 기반 인증)  
- Spring Data JPA (데이터 접근 계층)  
- QueryDSL (타입 안전한 쿼리 작성)

#### 데이터베이스
- MySQL (운영용 DB)  
- H2 Database (테스트용 DB)

#### 외부 API 및 라이브러리
- Riot API (소환사 정보, 매치 데이터)  
- Jsoup (정적 웹 크롤링)  
- Selenium + ChromeDriver (동적 크롤링 자동화)

#### 기능 모듈
- RESTful API 설계 및 응답 DTO 분리  
- LocalDateTime 처리 및 JSON 직렬화 커스터마이징  
- 스케줄러를 통한 정기 크롤링 기능

### 💻 프론트엔드

#### 개발 도구 및 빌드
- React + Vite (고속 빌드 및 모던 개발 환경)

#### UI 라이브러리
- Material UI (컴포넌트 기반 디자인 프레임워크)  
- Chart.js (챔피언 통계 시각화)

#### 핵심 기술
- JavaScript (ES6+), HTML5, CSS3  
- Axios (비동기 API 호출)  
- React Router Dom (페이지 라우팅 처리)

#### 기능 구현
- 소환사 검색 UI 및 입력 검증  
- 전적 리스트 무한스크롤 및 페이징  
- 로컬스토리지 기반 최근 검색 내역 관리  
- 반응형 디자인 구현 및 모바일 대응

## 📦 디렉토리 구조
```
backend/src/main/java/com/hc/lolmatchhistory
├── controller        # API 요청 처리
├── dto               # 데이터 전송 객체
├── entity            # JPA 엔티티 클래스
├── repository        # JPA 및 QueryDSL 저장소
├── service           # 비즈니스 로직
├── config            # 시큐리티 및 설정
```

## 💾 기술 선정 이유
- **Spring Boot**: 생산성과 유지보수성이 뛰어난 API 개발 프레임워크  
- **Spring Security**: 세션 기반 인증 및 로그인 처리 용이  
- **React + Vite**: 개발 편의성과 빠른 빌드 성능  
- **Material UI**: 반응형 인터페이스 및 일관된 디자인 적용  
- **Riot API**: 실시간 전적 데이터 확보 가능  
- **Selenium**: 동적 콘텐츠 자동 수집용 크롤링 툴
