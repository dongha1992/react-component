import { dequal } from "dequal";
import * as userClient from "./utils";
import { useAuth } from "./context/auth-context";
import { createContext, useContext, useReducer, useState } from "react";

const UserContext = createContext<any>(null);
UserContext.displayName = "UserContext";

function userReducer(state: any, action: any) {
  switch (action.type) {
    case "start update": {
      return {
        ...state,
        user: { ...state.user, ...action.updates },
        status: "pending",
        storedUser: state.user,
      };
    }
    case "finish update": {
      return {
        ...state,
        user: action.updatedUser,
        status: "resolved",
        storedUser: null,
        error: null,
      };
    }
    case "fail update": {
      return {
        ...state,
        status: "rejected",
        error: action.error,
        user: state.storedUser,
        storedUser: null,
      };
    }
    case "reset": {
      return {
        ...state,
        status: null,
        error: null,
      };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function UserProvider({ children }: any) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(userReducer, {
    status: null,
    error: null,
    storedUser: user,
    user,
  });
  const value = [state, dispatch];
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error(`useUser must be used within a UserProvider`);
  }
  return context;
}

async function updateUser(dispatch: any, user: any, updates: any) {
  dispatch({ type: "start update", updates });
  try {
    const updatedUser = await userClient.updateUser(user, updates);
    dispatch({ type: "finish update", updatedUser });
    return updatedUser;
  } catch (error) {
    dispatch({ type: "fail update", error });
    return Promise.reject(error);
  }
}

function UserSettings() {
  const [{ user, status, error }, userDispatch] = useUser();

  const isPending = status === "pending";
  const isRejected = status === "rejected";

  const [formState, setFormState] = useState(user);

  const isChanged = !dequal(user, formState);

  function handleChange(e: any) {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  }

  function handleSubmit(event: any) {
    event.preventDefault();
    updateUser(userDispatch, user, formState);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor="username">
          Username
        </label>
        <input
          id="username"
          name="username"
          disabled
          readOnly
          value={formState.username}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor="tagline">
          Tagline
        </label>
        <input
          id="tagline"
          name="tagline"
          value={formState.tagline}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={{ display: "block" }} htmlFor="bio">
          Biography
        </label>
        <textarea
          id="bio"
          name="bio"
          value={formState.bio}
          onChange={handleChange}
          style={{ width: "100%" }}
        />
      </div>
      <div>
        <button
          type="button"
          onClick={() => {
            setFormState(user);
            userDispatch({ type: "reset" });
          }}
          disabled={!isChanged || isPending}
        >
          Reset
        </button>
        <button
          type="submit"
          disabled={(!isChanged && !isRejected) || isPending}
        >
          {isPending
            ? "..."
            : isRejected
            ? "✖ Try again"
            : isChanged
            ? "Submit"
            : "✔"}
        </button>
        {isRejected ? (
          <pre style={{ color: "red" }}>{error.message}</pre>
        ) : null}
      </div>
    </form>
  );
}

function UserDataDisplay() {
  const [{ user }] = useUser();
  return <pre>{JSON.stringify(user, null, 2)}</pre>;
}

function ContextModule() {
  return (
    <div
      style={{
        minHeight: 350,
        width: 300,
        backgroundColor: "#ddd",
        borderRadius: 4,
        padding: 10,
      }}
    >
      <UserProvider>
        <UserSettings />
        <UserDataDisplay />
      </UserProvider>
    </div>
  );
}

export default ContextModule;
