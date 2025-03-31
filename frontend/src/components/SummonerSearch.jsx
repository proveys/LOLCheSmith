import React, { useState, useEffect, useRef } from "react";
import {
  Box,
  TextField,
  Button,
  Paper,
  Stack,
  Chip,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  getSummonerPuuid,
  getSummonerByPuuid,
  getSummonerRank,
  getMatchHistory,
} from "../api/summonerApi";
import SummonerProfile from "./SummonerProfile";
import MatchHistory from "./MatchHistory";
import PatchNoteList from "./PatchNoteList"; // 🔹 패치노트 추가

const SummonerSearch = () => {
  const [gameName, setGameName] = useState("");
  const [tagLine, setTagLine] = useState("");
  const [summoner, setSummoner] = useState(null);
  const [rank, setRank] = useState(null);
  const [matches, setMatches] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isRecentSearch, setIsRecentSearch] = useState(false);
  const [searched, setSearched] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const recentRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem("recentSearches");
    setRecentSearches(saved ? JSON.parse(saved) : []);
  }, []);

  useEffect(() => {
    if (isRecentSearch) {
      handleSearch();
      setIsRecentSearch(false);
    }
  }, [gameName, tagLine, isRecentSearch]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (recentRef.current && !recentRef.current.contains(e.target)) {
        setShowRecent(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = async () => {
    if (!gameName.trim() || !tagLine.trim()) {
      alert("소환사 이름과 태그를 입력하세요.");
      return;
    }

    setLoading(true);
    setSummoner(null);
    setRank(null);
    setMatches([]);
    setSearched(false);

    try {
      const puuid = await getSummonerPuuid(gameName, tagLine);
      if (!puuid) return alert("소환사 정보를 찾을 수 없습니다.");

      const summonerData = await getSummonerByPuuid(puuid);
      if (summonerData) {
        summonerData.gameName = gameName;
        setSummoner(summonerData);

        const rankData = await getSummonerRank(summonerData.id);
        setRank(rankData);

        const matchData = await getMatchHistory(puuid);
        setMatches(matchData);

        const newSearch = { gameName, tagLine };
        const updated = [
          newSearch,
          ...recentSearches.filter(
            (s) => !(s.gameName === gameName && s.tagLine === tagLine)
          ),
        ];
        setRecentSearches(updated);
        localStorage.setItem("recentSearches", JSON.stringify(updated));
        setSearched(true);
      } else {
        alert("소환사 정보를 찾을 수 없습니다.");
      }
    } catch (err) {
      console.error("검색 오류:", err);
      alert("검색 중 문제가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const handleRecentSearchClick = (name, tag) => {
    setGameName(name);
    setTagLine(tag);
    setIsRecentSearch(true);
  };

  const handleDeleteSearch = (index) => {
    const updated = recentSearches.filter((_, i) => i !== index);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));
  };

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "#0a0a0a", position: "relative" }}>
      {/* 🔹 흐릿한 배경 이미지 */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "350px",
          backgroundImage: `url("https://displays.riotgames.com/static/content-original-runeterra-ionia-3af5494dd645cb673dc4cedc2d3458b1.jpg")`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(8px)",
          zIndex: 0,
        }}
      />

      {/* 🔸 상단 컨텐츠 */}
      <Box
        sx={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "flex-start",
          gap: 4,
          px: 4,
          pt: 12,
        }}
      >
        {/* 왼쪽 영역: 검색창 + 프로필 */}
        <Box sx={{ width: "400px" }}>
          <Stack direction="row" spacing={2} mb={1}>
            <TextField
              label="게임 닉네임"
              variant="outlined"
              value={gameName}
              onChange={(e) => setGameName(e.target.value)}
              onFocus={() => setShowRecent(true)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: "white", borderRadius: 1, width: 180 }}
            />
            <TextField
              label="태그라인 (#KR1)"
              variant="outlined"
              value={tagLine}
              onChange={(e) => setTagLine(e.target.value)}
              size="small"
              InputLabelProps={{ shrink: true }}
              sx={{ bgcolor: "white", borderRadius: 1, width: 180 }}
            />
            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={loading}
              size="small"
            >
              {loading ? "검색 중..." : "검색"}
            </Button>
          </Stack>

          {/* 최근 검색 */}
          {showRecent && recentSearches.length > 0 && (
            <Paper
              ref={recentRef}
              elevation={3}
              sx={{
                p: 2,
                mt: 1,
                bgcolor: "white",
                maxWidth: 400,
              }}
            >
              <Typography variant="subtitle2" mb={1}>
                최근 검색
              </Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {recentSearches.map((search, index) => (
                  <Chip
                    key={index}
                    label={`${search.gameName}#${search.tagLine}`}
                    onClick={() =>
                      handleRecentSearchClick(search.gameName, search.tagLine)
                    }
                    onDelete={() => handleDeleteSearch(index)}
                    deleteIcon={<CloseIcon />}
                    size="small"
                  />
                ))}
              </Stack>
            </Paper>
          )}

          {/* 소환사 프로필 */}
          {summoner && (
            <Box mt={3}>
              <SummonerProfile summoner={summoner} rank={rank} />
            </Box>
          )}
        </Box>

        {/* 오른쪽 영역: 대전 기록 */}
        {matches.length > 0 && (
          <Box sx={{ flex: 1 }}>
            <MatchHistory matches={matches} />
          </Box>
        )}
      </Box>

      {/* 🔻 패치노트: 검색 전 기본 노출 */}
      {!summoner && !loading && (
        <Box sx={{ mt: 8, px: 4, pb: 8, position: "relative", zIndex: 1  }}>
          <PatchNoteList />
        </Box>
      )}
    </Box>
  );
};

export default SummonerSearch;
