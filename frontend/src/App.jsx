import { useEffect, useState } from 'react';
import axios from './api/axios';
import { Routes, Route } from 'react-router-dom';
import SummonerSearch from './components/SummonerSearch';
import Signup from './pages/Signup';
import Header from './components/Header';
import Login from './pages/Login';
import BoardList from "./pages/BoardList";
import BoardWrite from './pages/BoardWrite';
import BoardDetail from './pages/BoardDetail';
import BoardEdit from "./pages/BoardEdit";
import PatchNoteList from './components/PatchNoteList';
import { Box } from '@mui/material';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showPatchNotes, setShowPatchNotes] = useState(true);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axios.post('/member/logout', {}, { withCredentials: true });
      console.log('✅ 로그아웃 성공');
      setUser(null);
    } catch (err) {
      console.error('❌ 로그아웃 실패:', err.response?.data || err.message);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res = await axios.get('/member/me', {
          withCredentials: true
        });
        console.log('✅ 로그인 유지됨:', res.data);
        setUser(res.data);
      } catch (err) {
        console.log('❌ 로그인 안 되어 있음:', err.response?.data || err.message);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

 // ✅ 패치노트 수동 크롤링 버튼 함수
  const handleCrawl = async () => {
    try {
      const res = await axios.post('/patchnotes/crawl');
      alert('패치노트 크롤링 완료!');
      console.log(res.data);
    } catch (err) {
      alert('크롤링 실패');
      console.error(err);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <Header user={user} onLogout={handleLogout} />
      <Routes>
        <Route
          path="/"
          element={
            <Box sx={{ backgroundColor: '#0a0a0a', minHeight: '100vh' }}>
              <SummonerSearch onSearch={() => setShowPatchNotes(false)} />
                  {/* ✅ 임시 강제 크롤링 버튼 */}
                                <div style={{ margin: '20px' }}>
                                  <button onClick={handleCrawl}>패치노트 강제 크롤링</button>
                                </div>
            </Box>
          }
        />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login onLogin={handleLogin} />} />
        <Route path="/board" element={<BoardList />} />
        <Route path="/board/new" element={<BoardWrite />} />
        <Route path="/board/:id" element={<BoardDetail />} />
        <Route path="/board/:id/edit" element={<BoardEdit />} />
      </Routes>
    </>
  );
}

export default App;
