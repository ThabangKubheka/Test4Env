let data;
const accessToken = sessionStorage.getItem("Authorization");
const refreshToken = sessionStorage.getItem("RefreshToken");

if(accessToken == null && refreshToken == null){
  window.location.replace("/login");
}
function logout(){
  sessionStorage.removeItem("Authorization");
  sessionStorage.removeItem("RefreshToken");
}
document.addEventListener('DOMContentLoaded', async () => {
  try {
    const result = await fetch('https://djqw8yat5yomm.cloudfront.net/api/player/getScore', {
      method: 'GET',
      mode: 'cors',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'AccessToken': accessToken,
        'RefreshToken': refreshToken,
      }
      });
    data = await result.json();
  } catch (error) {
    console.error(error);
  }
  
  document.getElementById("name").innerHTML = data[0].username;
  document.getElementById("wins").innerHTML = data[0].wins;
  document.getElementById("losses").innerHTML = data[0].losses;

});