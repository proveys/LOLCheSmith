import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";

function Header({ user, onLogout }) {
  const navigate = useNavigate();

  const handleBoardClick = () => {
    if (!user) {
      alert("로그인이 필요한 서비스입니다.");
      navigate("/login");
    } else {
      navigate("/board");
    }
  };

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "#213a96" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* 🎮 로고 클릭 시 홈으로 이동 */}
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{
            textDecoration: "none",
            color: "inherit",
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          <span style={{ color: "#FFD700", marginRight: "6px" }}>⚜</span> LOLCheSmith
        </Typography>


        {/* 메뉴 버튼 (게시판만 남김) */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button onClick={handleBoardClick} color="inherit">
            게시판
          </Button>
        </Box>

        {/* 로그인 상태 표시 */}
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          {user ? (
            <>
              <Typography>{user.username} 님</Typography>
              <Button onClick={onLogout} color="inherit" variant="outlined" size="small">
                로그아웃
              </Button>
            </>
          ) : (
            <>
              <Button component={Link} to="/login" color="inherit">
                로그인
              </Button>
              <Button component={Link} to="/signup" color="inherit">
                회원가입
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
