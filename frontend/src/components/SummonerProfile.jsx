import React from "react";
import { Box, Typography, Avatar, Paper, Stack } from "@mui/material";

const SummonerProfile = ({ summoner, rank }) => {
  if (!summoner) return null;

  // ✅ 최신 op.gg 티어 이미지 경로로 변경
  const rankImage = rank && rank.tier
    ? `https://opgg-static.akamaized.net/images/medals_new/${rank.tier.toLowerCase()}.png?image=q_auto:good,f_webp,w_72`
    : null;

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 800,
        mx: "auto",
        p: 3,
        display: "flex",
        alignItems: "center",
        backgroundColor: "#1c1c1c",
        color: "#fff",
      }}
    >
      {/* 🔹 프로필 아이콘 */}
      <Avatar
        src={`https://ddragon.leagueoflegends.com/cdn/14.3.1/img/profileicon/${summoner.profileIconId}.png`}
        alt="소환사 아이콘"
        sx={{ width: 100, height: 100, mr: 3 }}
      />

      {/* 🔸 프로필 정보 */}
      <Box flex="1">
        <Typography variant="h5" fontWeight="bold">
          {summoner.gameName}
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          레벨: {summoner.summonerLevel}
        </Typography>

        {rank && rank.tier ? (
          <Stack direction="row" alignItems="center" spacing={2}>
            {rankImage && (
              <img
                src={rankImage}
                alt={`${rank.tier} badge`}
                width="72"
                height="72"
                style={{ borderRadius: "8px" }}
              />
            )}
            <Box>
              <Typography variant="body1">
                {rank.tier} {rank.rank} ({rank.leaguePoints} LP)
              </Typography>
              <Typography variant="body2">
                {rank.wins}승 {rank.losses}패 ({rank.winRate}% 승률)
              </Typography>
            </Box>
          </Stack>
        ) : (
          <Typography>랭크: Unranked</Typography>
        )}
      </Box>
    </Paper>
  );
};

export default SummonerProfile;
