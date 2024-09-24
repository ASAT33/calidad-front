export function logout(navigate) {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  navigate("/");
}
