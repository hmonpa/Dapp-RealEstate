import Cookies from "js-cookie";

export default {
    // Set user
    setUserLogged(userLogged) {
      Cookies.set("userLogged", userLogged);
    },
    // Get user
    getUserLogged() {
      return Cookies.get("userLogged");
    },
    // Remove user (logout)
    logoutUser(){
      return Cookies.remove("userLogged");
    }

};