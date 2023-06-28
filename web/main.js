window.onload=function() {
  landing()
}

const landing = () => {
  const accessToken = sessionStorage.getItem("Authorization")
  const refreshToken = sessionStorage.getItem("RefreshToken")

  if (!accessToken || !refreshToken ) {
    window.location.href = '/login';
  }
  else {
    window.location.href = '/player'
  }
}