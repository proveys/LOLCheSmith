import { useState } from 'react';
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

function Signup() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: ''
  });
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });

  const validate = () => {
    let newErrors = { email: '', password: '' };

    if (!form.email.includes('@')) {
      newErrors.email = '올바른 이메일 형식을 입력해주세요.';
    }

    if (form.password.length < 8 || form.password.length > 12) {
      newErrors.password = '비밀번호는 8~12글자까지만 가능합니다.';
    }

    setErrors(newErrors);
    return Object.values(newErrors).every((msg) => msg === '');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const res = await axios.post('/api/member/signup', form);
      console.log('✅ 회원가입 성공:', res.data);
      setMessage('🎉 회원가입 성공! 이제 로그인하세요.');
    } catch (err) {
      console.error('❌ 회원가입 실패:', err.response?.data || err.message);
      setMessage('⚠️ 회원가입 실패: ' + (err.response?.data || '서버 오류'));
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
            회원가입
          </Typography>

          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              <TextField
                label="닉네임"
                name="username"
                fullWidth
                value={form.username}
                onChange={handleChange}
                required
                size="small"
                InputProps={{ sx: { backgroundColor: 'white' } }}
              />

              <TextField
                label="이메일"
                name="email"
                type="email"
                fullWidth
                value={form.email}
                onChange={handleChange}
                required
                size="small"
                error={Boolean(errors.email)}
                helperText={errors.email}
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
                error={Boolean(errors.password)}
                helperText={errors.password}
                InputProps={{ sx: { backgroundColor: 'white' } }}
              />

              <Button type="submit" variant="contained" color="primary" fullWidth>
                회원가입
              </Button>

              {message && (
                <Typography
                  variant="body2"
                  color={message.includes('성공') ? 'success.main' : 'error'}
                  align="center"
                >
                  {message}
                </Typography>
              )}
            </Stack>
          </form>

          <Stack direction="row" justifyContent="space-between" mt={2}>
            <Link href="/" underline="hover" color="inherit" variant="body2">
              홈
            </Link>
            <Link href="/login" underline="hover" color="inherit" variant="body2">
              로그인
            </Link>
          </Stack>
        </Paper>
      </Box>
    </>
  );
}

export default Signup;
