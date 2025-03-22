import React, { useState } from "react";
import FileUpload from "../components/FileUpload";
import AudioList from "../components/AudioList";

const HomePage = () => {
  const [isUploadSuccess, setIsUploadSuccess] = useState(false);

  const handleUploadSuccess = () => {
    setIsUploadSuccess(true);
  };

  return (
    <div>
      <h1>PDF to Audio Book Converter</h1>
      <FileUpload onUploadSuccess={handleUploadSuccess} />
      {isUploadSuccess && <AudioList />}
    </div>
  );
};

export default HomePage;
