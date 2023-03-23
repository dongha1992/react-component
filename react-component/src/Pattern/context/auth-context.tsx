import { createContext, useContext } from "react";

const AuthContext = createContext<any>({
  user: { username: "jakiechan", tagline: "", bio: "" },
});

AuthContext.displayName = "AuthContext";

const AuthProvider = ({ user, ...props }: any) => (
  <AuthContext.Provider value={user} {...props} />
);

function useAuth() {
  return useContext(AuthContext);
}

export { AuthProvider, useAuth };
