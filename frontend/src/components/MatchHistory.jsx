import React, { useState } from "react";
import "./MatchHistory.css";

// 🔹 Riot 스펠 ID -> 실제 이미지 파일명 매핑
const summonerSpells = {
  1: "SummonerBoost",
  3: "SummonerExhaust",
  4: "SummonerFlash",
  6: "SummonerHaste",
  7: "SummonerHeal",
  11: "SummonerSmite",
  12: "SummonerTeleport",
  13: "SummonerMana",
  14: "SummonerDot",
  21: "SummonerBarrier",
  32: "SummonerSnowball"
};

// 🔹 Riot 룬 스타일 & 메인 룬 매핑
const runeStyles = {
  8000: "7201_Precision.png",
  8100: "7200_Domination.png",
  8200: "7202_Sorcery.png",
  8300: "7203_Whimsy.png",
  8400: "7204_Resolve.png"
};

const runes = {
  8005: "perk-images/Styles/Precision/PressTheAttack/PressTheAttack.png",
  8008: "perk-images/Styles/Precision/LethalTempo/LethalTempoTemp.png",
  8021: "perk-images/Styles/Precision/FleetFootwork/FleetFootwork.png",
  8010: "perk-images/Styles/Precision/Conqueror/Conqueror.png",
  8112: "perk-images/Styles/Domination/Electrocute/Electrocute.png",
  8124: "perk-images/Styles/Domination/Predator/Predator.png",
  8128: "perk-images/Styles/Domination/DarkHarvest/DarkHarvest.png",
  9923: "perk-images/Styles/Domination/HailOfBlades/HailOfBlades.png",
  8214: "perk-images/Styles/Sorcery/SummonAery/SummonAery.png",
  8229: "perk-images/Styles/Sorcery/ArcaneComet/ArcaneComet.png",
  8230: "perk-images/Styles/Sorcery/PhaseRush/PhaseRush.png",
  8351: "perk-images/Styles/Inspiration/GlacialAugment/GlacialAugment.png",      // 빙결강화
  8360: "perk-images/Styles/Inspiration/UnsealedSpellbook/UnsealedSpellbook.png",// 봉인 풀린 주문서
  8369: "perk-images/Styles/Inspiration/FirstStrike/FirstStrike.png",
  8437: "perk-images/Styles/Resolve/GraspOfTheUndying/GraspOfTheUndying.png",
  8439: "perk-images/Styles/Resolve/VeteranAftershock/VeteranAftershock.png",
  8465: "perk-images/Styles/Resolve/Guardian/Guardian.png"
};

const MatchHistory = ({ matches }) => {
  // 소환사명 길이 제한 함수 추가
  const truncateSummonerName = (name, tagLine) => {
    if (!name) return '';
    let count = 0;
    let result = '';
    const fullName = name + '#' + tagLine;
    
    for (let i = 0; i < fullName.length; i++) {
      const char = fullName[i];
      if (char === '#') {
        count += 1;
      } else if (fullName.charCodeAt(i) > 128) { // 한글
        count += 2;
      } else { // 영어, 숫자
        count += 1;
      }
      if (count > 12) break;
      result += char;
    }
    return result + (count > 12 ? '...' : '');
  };

  if (!matches || matches.length === 0) return <p>최근 솔로 랭크 기록 없음</p>;

  return (
    <div className="match-history">
      <h3>최근 솔로 랭크 경기</h3>
      <ul className="match-list">
        {matches.map((match, index) => {
          const kda = match.deaths === 0 ? "Perfect" : ((match.kills + match.assists) / match.deaths).toFixed(2);
          const gameMinutes = Math.floor((match.gameDuration || 0) / 60);
          const gameSeconds = (match.gameDuration || 0) % 60;

          // 팀 분리
          const blueTeam = match.teamMembers.filter(p => p.teamId === 100);
          const redTeam = match.teamMembers.filter(p => p.teamId === 200);

          // 데이터 확인을 위한 로그
          console.log('Match Data:', {
            matchId: match.matchId,
            blueTeam: blueTeam.map(member => ({
              summonerName: member.summonerName,
              tagLine: member.tagLine,
              championName: member.championName
            })),
            redTeam: redTeam.map(member => ({
              summonerName: member.summonerName,
              tagLine: member.tagLine,
              championName: member.championName
            }))
          });

          return (
            <li key={index} className={`match-item ${match.win ? "win" : "lose"}`}>
              <div className="match-container">
                <div className="match-info-left">
                  <p><strong>솔랭</strong></p>
                  <p className={match.win ? "win-text" : "lose-text"}>{match.win ? "승리" : "패배"}</p>
                  <p className="playtime">{gameMinutes}분 {gameSeconds}초</p>
                </div>

                <div className="match-info-center">
                  <div className="champion-container">
                    <img 
                      src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${match.championName}.png`} 
                      alt={match.championName} 
                      className="champion-icon" 
                    />
                  </div>
                  <div className="spell-rune-container">
                    <div className="spell-rune-top">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${summonerSpells[match.summoner1Id]}.png`} 
                        alt="Spell1" 
                      />
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/img/${runes[match.primaryRune1]}`}
                        alt="Primary Rune"
                      />
                    </div>
                    <div className="spell-rune-bottom">
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/spell/${summonerSpells[match.summoner2Id]}.png`} 
                        alt="Spell2" 
                      />
                      <img 
                        src={`https://ddragon.leagueoflegends.com/cdn/img/perk-images/Styles/${runeStyles[match.subRuneStyle]}`}
                        alt="Sub Rune"
                      />
                    </div>
                  </div>
                </div>

                <div className="match-info-right">
                  <div className="stats">
                    <p><strong>{match.kills}/{match.deaths}/{match.assists}</strong></p>
                    <p>{kda} KDA</p>
                    <p>{match.totalCS} CS ({(match.totalCS / gameMinutes).toFixed(1)})</p>
                  </div>
                  <div className="items-container">
                    {match.items.map((item, i) =>
                      item !== 0 ? (
                        <img 
                          key={i} 
                          src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/item/${item}.png`} 
                          alt={`item-${item}`} 
                          className="item-icon" 
                        />
                      ) : (
                        <div key={i} className="item-placeholder" />
                      )
                    )}
                  </div>
                </div>

                <div className="team-members">
                  <div className="team-container">
                    <div className={`team-column ${match.win ? 'win' : 'lose'}`}>
                      <h4>블루팀</h4>
                      {blueTeam.map((member, i) => (
                        <div key={i} className="team-member">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${member.championName}.png`} 
                            alt={member.championName} 
                            className="team-champion-icon" 
                          />
                          <span className="summoner-name">
                            {truncateSummonerName(member.summonerName, member.tagLine)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className={`team-column ${!match.win ? 'win' : 'lose'}`}>
                      <h4>레드팀</h4>
                      {redTeam.map((member, i) => (
                        <div key={i} className="team-member">
                          <img 
                            src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/champion/${member.championName}.png`} 
                            alt={member.championName} 
                            className="team-champion-icon" 
                          />
                          <span className="summoner-name">
                            {truncateSummonerName(member.summonerName, member.tagLine)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default MatchHistory;

