import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useGetProfile } from "../api/auth";

function AuthHoc({ children }: any) {
  const navigate = useNavigate();
  const { error } = useGetProfile();

  useEffect(() => {
    if (error) {
      navigate("/auth", { replace: true });
    }
  }, [error]);

  return <>{children}</>;
}

export default AuthHoc;
