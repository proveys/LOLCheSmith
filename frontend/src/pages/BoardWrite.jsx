import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Stack,
} from "@mui/material";

const BoardWrite = () => {
  const [form, setForm] = useState({ title: "", content: "" });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImageFile(null);
      setImagePreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim() || !form.content.trim()) {
      setError("제목과 내용을 입력해주세요.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("data", new Blob([JSON.stringify(form)], { type: "application/json" }));
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await axios.post("/board", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      navigate("/board");
    } catch (err) {
      console.error("게시글 등록 실패:", err);
      setError("게시글 등록 실패: 로그인한 사용자만 작성할 수 있습니다.");
    }
  };

  return (
    <Box sx={{ backgroundColor: "#111", color: "#fff", minHeight: "100vh", px: 4, pt: "100px" }}>
      <Box sx={{ maxWidth: "800px", mx: "auto" }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          게시글 작성
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
                이미지 업로드
              </Typography>
              <input type="file" accept="image/*" onChange={handleImageChange} />
            </Box>

            {imagePreview && (
              <Box>
                <Typography variant="body2" sx={{ mb: 1 }}>
                  🖼️ 이미지 미리보기:
                </Typography>
                <Box
                  component="img"
                  src={imagePreview}
                  alt="미리보기"
                  sx={{ maxWidth: "300px", borderRadius: 2 }}
                />
              </Box>
            )}

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            {/* 작성 완료 버튼 */}
            <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "#2264e6",
                  width: "110px",
                  py: 1.2,
                  fontWeight: "bold",
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "#1e50c2",
                  },
                }}
              >
                작성 완료
              </Button>
            </Box>
          </Stack>
        </form>
      </Box>
    </Box>
  );
};

export default BoardWrite;
