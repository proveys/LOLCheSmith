import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Button,
  Typography,
  Paper,
  Stack,
  Divider,
} from "@mui/material";

const BoardDetail = () => {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBoardDetail = async () => {
      try {
        const response = await axios.get(`/board/${id}`);
        setBoard(response.data);
      } catch (error) {
        console.error("게시글 상세 조회 에러:", error);
      }
    };
    fetchBoardDetail();
  }, [id]);

  // 삭제 버튼 클릭 시
  const handleDelete = async () => {
    if (window.confirm("정말로 삭제하시겠습니까?")) {
      try {
        await axios.delete(`/board/${id}`, { withCredentials: true });
        navigate("/board");
      } catch (error) {
        console.error("삭제 실패:", error);
      }
    }
  };

  if (!board) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "80vh",
          backgroundColor: "#111",
        }}
      >
        <Typography variant="h6" color="#fff">
          Loading...
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        backgroundColor: "#111",
        minHeight: "100vh",
        pt: "100px", // 헤더 가림 방지용 상단 여백
        px: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          maxWidth: "800px",
          mx: "auto",
          p: 4,
          borderRadius: 3,
          backgroundColor: "#1e1e1e",
          color: "#fff",
        }}
      >
        <Stack spacing={2}>
          {/* 제목 */}
          <Typography variant="h4" fontWeight="bold">
            {board.title}
          </Typography>

          {/* 작성자, 작성일 */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Typography variant="caption" sx={{ color: "#888" }}>
              작성자: {board.writer?.email || board.username || "알 수 없음"}
            </Typography>
            <Divider orientation="vertical" flexItem sx={{ borderColor: "#444" }} />
            <Typography variant="caption" sx={{ color: "#888" }}>
              {new Date(board.createdAt).toLocaleString()}
            </Typography>
          </Stack>

          <Divider sx={{ borderColor: "#444" }} />

          {/* 이미지 (가운데 정렬) */}
          {board.imageUrl && (
            <Box sx={{ display: "flex", justifyContent: "center" }}>
              <Box
                component="img"
                src={`http://localhost${encodeURI(board.imageUrl)}`}
                alt="게시글 이미지"
                sx={{
                  width: "75%",
                  maxHeight: 300,
                  objectFit: "cover",
                  borderRadius: 2,
                }}
              />
            </Box>
          )}

          {/* 내용 */}
          <Typography
            variant="body1"
            sx={{ lineHeight: 1.8, whiteSpace: "pre-wrap" }}
          >
            {board.content}
          </Typography>

          {/* 하단 버튼 영역 */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 2 }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate(-1)}
            >
              목록으로 돌아가기
            </Button>
            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="info"
                onClick={() => navigate(`/board/${board.id}/edit`)}
              >
                수정
              </Button>
              <Button variant="outlined" color="error" onClick={handleDelete}>
                삭제
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
};

export default BoardDetail;
