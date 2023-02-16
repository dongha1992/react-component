import { Alert, Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "react-query";
import Cookies from "js-cookie";
import { getTokenByPassword } from "../api/auth";
import { pageRoutes } from "../../routes";

function Auth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [btnLoading, setBtnLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setBtnLoading(true);

    try {
      const resp = await getTokenByPassword(email, password);
      if (resp?.data.token) {
        navigate(pageRoutes.main, { replace: true });
        queryClient.invalidateQueries();
      } else {
        toast.error("Invalid details", {
          position: "bottom-left",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      }
    } catch (e) {
      console.log(e, "11");
      toast.error("Invalid details", {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setBtnLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      width="300px"
      margin="36px auto auto"
    >
      <Box mb={6}>
        <Typography display="block" variant="h1" component="h2">
          Sign in
        </Typography>
      </Box>

      <form
        noValidate
        autoComplete="off"
        style={{ width: "100%" }}
        onSubmit={onSubmit}
      >
        <Box mb={2}>
          <TextField
            fullWidth
            autoComplete="off"
            id="outlined-basic"
            label="Email"
            variant="outlined"
            type="email"
            name="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
        </Box>

        <Box mb={2}>
          <TextField
            fullWidth
            autoComplete="off"
            id="outlined-basic"
            label="Password"
            variant="outlined"
            type="password"
            name="password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
        </Box>
        <Box mb={2}>
          <Alert severity="info">
            You could login with any credentials, even with empty fields. It
            doesn't matter. Just for demonstration purposes.
          </Alert>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          size="large"
          disabled={btnLoading}
          fullWidth
        >
          Submit
        </Button>
      </form>
    </Box>
  );
}

export default Auth;
