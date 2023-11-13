import axios, { AxiosResponse, AxiosRequestConfig } from "axios";
import { ExtendedError } from "../types";
import { redirect } from "react-router-dom";

export default async function fetchWithCatch<T>(
  config: AxiosRequestConfig
): Promise<T> {
  try {
    const response: AxiosResponse<T> = await axios({
      ...config,
      baseURL: "/api/",
    });
    return response.data;
  } catch (error) {
    // if there is an error related to wrong page(404), forbidden due to auth (403), then throw to be caught by react router and handled with an Error page boundary
    if (axios.isAxiosError(error)) {
      if (error.response) {
        //the request was made and there was a response
        console.error(error.message);

        throw new ExtendedError(error.message, error.response.status);
      } else {
        //there was no response
        throw new ExtendedError(error.message, 404);
      }
    } else {
      //handle other type of error
      console.error(error);
      throw error;
    }
  }
}

export const loaderWrapper = async <T>(config: AxiosRequestConfig) => {
  try {
    const data = await fetchWithCatch<T>(config);
    return data;
  } catch (err) {
    if (err instanceof ExtendedError && err.statusCode === 401) {
      return redirect("/login");
    }
    throw err;
  }
};
