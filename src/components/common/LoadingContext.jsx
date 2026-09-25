import React, {
  createContext,
  useContext,
  useState,
} from "react";

import Loader from "./Loader";

const LoadingContext = createContext(null);

export function LoadingProvider({ children }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider
      value={{
        loading,
        setLoading,
      }}
    >
      {children}

      {loading && <Loader />}
    </LoadingContext.Provider>
  );
}

export function useLoading() {
  const context = useContext(LoadingContext);

  if (!context) {
    throw new Error(
      "useLoading must be used inside LoadingProvider"
    );
  }

  return context;
}