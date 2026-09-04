import api from "./axios";

type headerType =
  | "application/json"
  | "application/x-www-form-urlencoded"
  | "multipart/form-data"
  | "text/plain";

const getMethod = async (url: string, config: any) => {
  try {
    const response = await api.get(url, config);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response;
  }
};

const postMethod = async (url: string, body: object, config: any) => {
  try {
    const response = await api.post(url, body, config);
    const data = response?.data;
    return { data, error: null };
  } catch (error: any) {
    throw error?.response || error;
  }
};
const putMethod = async (url: string, body: object, config: any) => {
  try {
    const response = await api.put(url, body, config);
    const data = response?.data;
    return { data, error: null };
  } catch (error: any) {
    throw error?.response || error;
  }
};

const deleteMethod = async (url: string, config: any) => {
  try {
    const response = await api.delete(url, config);
    const data = response?.data;
    return data;
  } catch (error: any) {
    throw error?.response;
  }
};

export { getMethod, postMethod, putMethod, deleteMethod };
