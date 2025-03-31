import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Stack
} from '@mui/material';

const PatchNoteList = () => {
  const [patchNotes, setPatchNotes] = useState([]);
  const [page, setPage] = useState(0); // 현재 페이지
  const size = 6; // 한 페이지당 6개
  const [hasMore, setHasMore] = useState(true); // 다음 페이지 존재 여부

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const res = await axios.get(`/patchnotes?page=${page}&size=${size}`);
        setPatchNotes(res.data);
        setHasMore(res.data.length === size); // 6개 미만이면 마지막 페이지
      } catch (err) {
        console.error('패치노트 불러오기 실패:', err);
      }
    };
    fetchNotes();
  }, [page]);

  const handleNext = () => {
    if (hasMore) setPage(prev => prev + 1);
  };

  const handlePrev = () => {
    if (page > 0) setPage(prev => prev - 1);
  };

  return (
    <Box sx={{ px: '10%', pb: 4 }}>
      <Grid container spacing={3}>
        {patchNotes.map((note, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
            <Card
              sx={{ height: '100%', cursor: 'pointer' }}
              onClick={() => {
                const fixedLink = note.link.replace('https://www.leagueoflegends.comhttps', 'https');
                window.open(fixedLink, '_blank');
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={note.imageUrl}
                alt="패치 이미지"
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="caption" color="text.secondary">
                  {note.date}
                </Typography>
                <Typography variant="h6" component="div" sx={{ mt: 1 }}>
                  {note.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {note.description}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 페이지 이동 버튼 */}
      <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
        <Button variant="outlined" onClick={handlePrev} disabled={page === 0}>
          이전
        </Button>
        <Typography variant="body2" sx={{ lineHeight: '36px' }}>
          Page {page + 1}
        </Typography>
        <Button variant="outlined" onClick={handleNext} disabled={!hasMore}>
          다음
        </Button>
      </Stack>
    </Box>
  );
};

export default PatchNoteList;
