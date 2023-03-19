import {
  Reducer,
  useCallback,
  useLayoutEffect,
  useReducer,
  useRef,
} from "react";

type AsyncState<T> = {
  status: "idle" | "pending" | "resolved" | "rejected";
  data: T | null;
  error: Error | null;
};

function useSafeDispatch(dispatch: any) {
  const mountedRef = useRef(false);

  useLayoutEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  return useCallback(
    (action: any) => {
      if (mountedRef.current) {
        dispatch({ ...action });
      }
    },
    [dispatch]
  );
}

function asyncReducer(state: any, action: any) {
  switch (action.type) {
    case "pending": {
      return { status: "pending", data: null, error: null };
    }
    case "resolved": {
      return { status: "resolved", data: action.data, error: null };
    }
    case "rejected": {
      return { status: "rejected", data: null, error: action.error };
    }
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}

function useAsync<T>(initialState: Partial<AsyncState<T>> = {}) {
  const [state, unSafeDispatch] = useReducer(
    asyncReducer as Reducer<
      AsyncState<T>,
      { type: string; data?: T; error?: Error }
    >,
    {
      status: "idle",
      data: null,
      error: null,
      ...initialState,
    }
  );

  const dispatch = useSafeDispatch(unSafeDispatch);
  const { data, error, status } = state;

  const run = useCallback(
    (promise: any) => {
      dispatch({ type: "pending" });
      promise.then(
        (data: any) => {
          dispatch({ type: "resolved", data });
        },
        (error: any) => {
          dispatch({ type: "rejected", error });
        }
      );
    },
    [dispatch]
  );

  const setData = useCallback(
    (data: any) => dispatch({ type: "resolved", data }),
    [dispatch]
  );
  const setError = useCallback(
    (error: any) => dispatch({ type: "rejected", error }),
    [dispatch]
  );

  return {
    setData,
    setError,
    error,
    status,
    data,
    run,
  };
}

export { useAsync };
