import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

const BoardList = () => {
  const [boards, setBoards] = useState([]);
  const [keyword, setKeyword] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const navigate = useNavigate();

  useEffect(() => {
    fetchBoards();
  }, []);

  const fetchBoards = async () => {
    try {
      const response = await axios.get("/board");
      setBoards(response.data);
      setCurrentPage(1); // 검색 후에도 첫 페이지로 이동
    } catch (error) {
      console.error("게시글 조회 에러:", error);
    }
  };

  const searchBoards = async () => {
    try {
      const response = await axios.get(`/board/search?keyword=${keyword}`);
      setBoards(response.data);
      setCurrentPage(1); // 검색 결과도 첫 페이지로 이동
    } catch (error) {
      console.error("게시글 검색 에러:", error);
    }
  };

  const totalPages = Math.ceil(boards.length / itemsPerPage);
  const currentBoards = boards.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", backgroundColor: "#111" }}>
      {/* 좌측 사이드바 */}
      <Box sx={{ width: 220, p: 2 }}></Box>

      {/* 중앙 컨텐츠 */}
      <Box
        sx={{
          flex: 1,
          px: 4,
          py: 4,
          maxWidth: "1000px",
          mx: "auto",
          mt: "80px",
        }}
      >
        {/* 게시글 작성 + 검색 바 */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate("/board/new")}
            sx={{ borderRadius: 2, py: 1, px: 2, fontWeight: "bold" }}
          >
            게시글 작성
          </Button>

          <Stack direction="row" spacing={2}>
            <TextField
              variant="outlined"
              size="small"
              placeholder="게시글 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              sx={{
                input: { color: "#fff", backgroundColor: "#222" },
                fieldset: { borderColor: "#444" },
              }}
            />
            <Button variant="outlined" color="info" onClick={searchBoards}>
              검색
            </Button>
          </Stack>
        </Box>

        {/* 게시글 목록 */}
        <Stack spacing={2}>
          {currentBoards.map((board) => (
            <Paper
              key={board.id}
              elevation={3}
              onClick={() => navigate(`/board/${board.id}`)}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                p: 2,
                borderRadius: 2,
                backgroundColor: "#1e1e1e",
                color: "#fff",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#2a2a2a",
                },
              }}
            >
              <Box sx={{ flex: 1, pr: 2 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  {board.title}
                </Typography>
                <Typography variant="body2" sx={{ color: "#ccc" }} noWrap>
                  {board.content}
                </Typography>
                <Typography variant="caption" sx={{ color: "#888" }}>
                  작성자: {board.writer?.email || board.username || "알 수 없음"}
                </Typography>
              </Box>

              {board.imageUrl && (
                <Box
                  component="img"
                  src={`http://localhost${encodeURI(board.imageUrl)}`}
                  alt="썸네일"
                  sx={{
                    width: 120,
                    height: 80,
                    objectFit: "cover",
                    borderRadius: 1,
                    ml: 2,
                  }}
                />
              )}
            </Paper>
          ))}
        </Stack>

        {/* 페이지네이션 */}
        {totalPages > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 4, gap: 1 }}>
            <Button
              variant="outlined"
              size="small"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((prev) => prev - 1)}
            >
              &lt;
            </Button>

            {Array.from({ length: totalPages }, (_, i) => (
              <Button
                key={i + 1}
                variant={currentPage === i + 1 ? "contained" : "outlined"}
                size="small"
                onClick={() => setCurrentPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}

            <Button
              variant="outlined"
              size="small"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((prev) => prev + 1)}
            >
              &gt;
            </Button>
          </Box>
        )}
      </Box>

      {/* 우측 여백 (광고 자리) */}
      <Box sx={{ width: 220 }} />
    </Box>
  );
};

export default BoardList;
