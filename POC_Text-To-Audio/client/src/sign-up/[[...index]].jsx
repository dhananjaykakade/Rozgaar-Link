import { SignUp } from "@clerk/clerk-react";

const SignUpPage = () => {
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          backgroundColor: "#f8f9fa",
        }}
      >
        <SignUp />
      </div>
    </>
  );
};

export default SignUpPage;
