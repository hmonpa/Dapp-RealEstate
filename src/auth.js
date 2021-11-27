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
    },
    // Set wallet account
    setAccount(walletConnected) {
      Cookies.set("walletConnected", walletConnected);
    },
    // Get current wallet
    getCurrentWallet() {
      return Cookies.get("walletConnected");
    },
    // Remove wallet
    removeWallet(){
      return Cookies.remove("walletConnected");
    }

};