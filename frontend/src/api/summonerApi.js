import axios from 'axios';

const API_BASE_URL = 'http://localhost:80/summoner';

// PUUID 가져오기
export const getSummonerPuuid = async (gameName, tagLine) => {
  try {
    console.log(` PUUID 요청: ${API_BASE_URL}/${gameName}/${tagLine}`); // 디버깅용 로그
    const response = await axios.get(`${API_BASE_URL}/${gameName}/${tagLine}`);
    console.log(" PUUID 응답:", response.data); // 응답 확인
    return response.data.puuid;
  } catch (error) {
    console.error("❌ PUUID 불러오기 실패:", error);
    return null;
  }
};

// PUUID로 소환사 정보 가져오기
export const getSummonerByPuuid = async (puuid) => {
  try {
    console.log(` 소환사 정보 요청: ${API_BASE_URL}/info/${puuid}`);
    const response = await axios.get(`${API_BASE_URL}/info/${puuid}`);
    console.log(" 소환사 정보 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 소환사 정보 불러오기 실패:", error.response?.data || error.message);
    return null;
  }
};

// summonerId로 랭크 정보 가져오기
export const getSummonerRank = async (summonerId) => {
  try {
    console.log(` 랭크 정보 요청: ${API_BASE_URL}/rank/${summonerId}`);
    const response = await axios.get(`${API_BASE_URL}/rank/${summonerId}`);
    console.log(" 랭크 정보 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ 랭크 정보 불러오기 실패:", error);
    return { tier: "Unranked", rank: "", leaguePoints: 0 };
  }
};

//  PUUID로 솔로 랭크 대전 기록 가져오기
export const getMatchHistory = async (puuid) => {
  try {
    console.log(`🔍 매치 히스토리 요청: http://localhost:80/match/${puuid}`);
    const response = await axios.get(`http://localhost:80/match/${puuid}`);
    console.log("✅ 매치 히스토리 응답:", response.data);

    response.data.forEach((match, index) => {
      console.log(`🏆 경기 ${index + 1}: Match ID - ${match.matchId} | 승리 여부 - ${match.win}`);
    });

    return response.data;
  } catch (error) {
    console.error("❌ 매치 히스토리 불러오기 실패:", error);
    return [];
  }
};


