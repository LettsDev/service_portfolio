import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { ExtendedError } from "../types";
import { useNavigate } from "react-router-dom";
import { useAlert } from "../context/alert.provider";
export default function useFetchWithCatch() {
  const navigate = useNavigate();
  const { addAlert } = useAlert();

  async function fetchWithCatch<T>(config: AxiosRequestConfig): Promise<T> {
    try {
      const response: AxiosResponse<T> = await axios({
        ...config,
        timeout: 1000,
        baseURL: "/api/",
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          if (error.response.status === 401) {
            //authentication error
            navigate("/login");
          }
          if (error.response.status === 403) {
            //authorization error
            addAlert({
              type: "warning",
              message:
                "You don't have the required authority to access this resource.",
            });
          }
          throw new ExtendedError(error.message, error.response.status);
        }
        //there was no response
        throw new ExtendedError(error.message, 404);
      }
      //other error
      throw error;
    }
  }

  return { fetchWithCatch };
}
