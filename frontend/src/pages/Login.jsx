import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  Box,
  Button,
  TextField,
  Typography,
  Paper,
  Stack,
  Link,
} from '@mui/material';

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validate = () => {
    if (!form.email.includes('@')) {
      setError('올바른 이메일 형식을 입력해주세요.');
      return false;
    }
    if (form.password.length < 8 || form.password.length > 12) {
      setError('비밀번호는 8~12글자까지만 가능합니다.');
      return false;
    }
    setError('');
    return true;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('/api/member/login', form, {
        withCredentials: true,
      });
      console.log('로그인 성공:', res.data);
      onLogin(res.data);
      navigate('/');
    } catch (err) {
      console.error('로그인 실패:', err.response?.data || err.message);
      setError('로그인 실패: ' + (err.response?.data || '서버 오류'));
    }
  };

  return (
      <>
    <Box
      sx={{
        backgroundImage:
          'url(https://displays.riotgames.com/static/content-original-runeterra-ionia-3af5494dd645cb673dc4cedc2d3458b1.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',

        position: 'fixed',
        width: '100%',
        height: '100%',
        zIndex: -1,
      }}
    />

    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: 400,
          p: 4,
          borderRadius: 3,
          backdropFilter: 'blur(6px)',
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          color: '#fff',
        }}
      >
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          <img
            src="https://cdn.lol.ps/member/static/prod/80ffddd04aa2fd7eb08c93b558d5df687e14f89a/_app/immutable/assets/ps_binocular_logo.BLHGyxCZ.svg"
            alt="PS Logo"
            style={{ width: '100px', height: '60px' }}
          />
        </Box>
        <Typography variant="h5" align="center" fontWeight="bold" gutterBottom>
          로그인
        </Typography>

        <form onSubmit={handleSubmit}>
          <Stack spacing={2}>
            <TextField
              label="이메일"
              name="email"
              type="email"
              fullWidth
              value={form.email}
              onChange={handleChange}
              required
              size="small"
              InputProps={{ sx: { backgroundColor: 'white' } }}
            />
            <TextField
              label="비밀번호"
              name="password"
              type="password"
              fullWidth
              value={form.password}
              onChange={handleChange}
              required
              size="small"
              InputProps={{ sx: { backgroundColor: 'white' } }}
            />

            {error && (
              <Typography color="error" variant="body2">
                {error}
              </Typography>
            )}

            <Button type="submit" variant="contained" color="primary" fullWidth>
              로그인
            </Button>
          </Stack>
        </form>

        <Stack direction="row" justifyContent="space-between" mt={2}>
          <Link href="/" underline="hover" color="inherit" variant="body2">
            홈
          </Link>
          <Link href="/signup" underline="hover" color="inherit" variant="body2">
            회원가입
          </Link>
        </Stack>
      </Paper>
    </Box>
    </>
  );
}

export default Login;
