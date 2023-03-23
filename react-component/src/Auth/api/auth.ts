import { apiRoutes } from "../../routes";
import { api } from "../../utils/mock/api";
import { ProfileInterface } from "../interface/auth";
import { useFetch } from "../../utils/mock/reactQuery";

export const getTokenByPassword = (email: string, password: string) => {
  return api.post<{ token: string }>(apiRoutes.getTokenByPassword, {
    email,
    password,
  });
};

export const useGetProfile = () => {
  const context = useFetch<{ user: ProfileInterface }>(
    apiRoutes.getProfile,
    undefined,
    { retry: false }
  );
  return { ...context, data: context.data?.user };
};
