import axios from "axios";

export default (function apiHttpRequests() {
  function authenticate(username: string, password: string) {
    return axios.put("/api/session", { username, password }, {});
  }

  return { authenticate };
})();
