import React from "react";
import { useClerk, SignedIn, SignedOut, useUser } from "@clerk/clerk-react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SignUpPage from "./sign-up/[[...index]]";
import MainPage from "./pages/MainPage";

const App = () => {
  const { isSignedIn, isLoaded } = useUser();
  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isSignedIn ? (
        <div>
          <MainPage />
        </div>
      ) : (
        <div>
          <SignUpPage />
        </div>
      )}
    </>
  );
};

export default App;
