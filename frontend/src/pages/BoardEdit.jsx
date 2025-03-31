import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
  Paper,
} from "@mui/material";

const BoardEdit = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({ title: "", content: "" });
  const [previewImage, setPreviewImage] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");

  // 기존 데이터 불러오기
  useEffect(() => {
    const fetchBoard = async () => {
      try {
        const res = await axios.get(`/board/${id}`);
        setForm({
          title: res.data.title,
          content: res.data.content,
        });
        setPreviewImage(res.data.imageUrl ? `http://localhost:80${res.data.imageUrl}` : "");
      } catch (err) {
        console.error("게시글 불러오기 실패:", err);
        alert("게시글 정보를 불러오지 못했습니다.");
        navigate("/board");
      }
    };
    fetchBoard();
  }, [id, navigate]);

  // 입력값 핸들러
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // 이미지 변경 시
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  // 폼 제출(수정 완료)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title || !form.content) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append(
      "data",
      new Blob([JSON.stringify(form)], { type: "application/json" })
    );
    if (imageFile) {
      formData.append("image", imageFile);
    }

    try {
      await axios.put(`/board/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      navigate(`/board/${id}`);
    } catch (err) {
      console.error("게시글 수정 실패:", err);
      setError("수정 실패: " + (err.response?.data || "서버 오류"));
    }
  };

  return (
    <Box
      sx={{
        backgroundColor: "#111",
        minHeight: "100vh",
        pt: "100px", // 헤더에 가리지 않도록 여백
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
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          게시글 수정
        </Typography>

        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <Stack spacing={3}>
            {/* 제목 입력 */}
            <TextField
              label="제목"
              name="title"
              fullWidth
              value={form.title}
              onChange={handleChange}
              sx={{
                input: { color: "#fff", backgroundColor: "#222" },
                label: { color: "#ccc" },
                fieldset: { borderColor: "#444" },
              }}
            />

            {/* 내용 입력 */}
            <TextField
              label="내용"
              name="content"
              fullWidth
              multiline
              minRows={8}
              value={form.content}
              onChange={handleChange}
              sx={{
                textarea: { color: "#fff", backgroundColor: "#222" },
                label: { color: "#ccc" },
                fieldset: { borderColor: "#444" },
              }}
            />

            {/* 이미지 업로드 */}
            <Box>
              <Typography variant="body1" gutterBottom>
                이미지 (선택)
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />

              {previewImage && (
                <Box sx={{ mt: 2 }}>
                  <Box
                    component="img"
                    src={previewImage}
                    alt="미리보기"
                    sx={{
                      width: "200px",
                      borderRadius: 2,
                    }}
                  />
                </Box>
              )}
            </Box>

            {/* 에러 메시지 */}
            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {/* 수정 완료 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 3 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  width: "110px",
                  height: "48px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  backgroundColor: "#2264e6",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#1e50c2",
                  },
                }}
              >
                수정 완료
              </Button>
            </Box>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};

export default BoardEdit;
