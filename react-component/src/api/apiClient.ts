import axios, { AxiosResponse } from "axios";

export const PublicApi = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
});

PublicApi.interceptors.response.use(
  (response: AxiosResponse) => {
    return response.data;
  },
  (error) => {
    return Promise.reject(error);
  }
);

PublicApi.interceptors.request.use((req: any) => {
  return req;
});

export const getUserInfoApi = (id: string): Promise<AxiosResponse<any>> => {
  return PublicApi.get(`users/${id}`);
};

interface IData {
  completed: boolean;
  id: number;
  title: string;
  userId: number;
}

export const getProductsApi = (): Promise<IData[]> => {
  return PublicApi.get(`todos`);
};
