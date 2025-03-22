import React, { useState } from "react";
import axios from "axios";

function MainPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [audioPath, setAudioPath] = useState("");
  const [error, setError] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // Dark Mode state

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
    setAudioPath("");
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError("Please select a PDF file first.");
      return;
    }

    const formData = new FormData();
    formData.append("pdfFile", selectedFile);

    setIsProcessing(true);

    try {
      const response = await axios.post(
        "http://localhost:5000/upload-pdf",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setAudioPath(`http://localhost:5000${response.data.audioPath}`);
      setIsProcessing(false);
    } catch (err) {
      setIsProcessing(false);
      setError(err.response?.data?.message || "Something went wrong.");
    }
  };

  const handleShare = (platform) => {
    const shareUrl = encodeURIComponent(audioPath);
    const text = encodeURIComponent("Check out this audiobook I generated!");

    const urls = {
      twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${text}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
      whatsapp: `https://api.whatsapp.com/send?text=${text}%20${shareUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`,
    };

    window.open(urls[platform], "_blank");
  };

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        backgroundColor: darkMode ? "#121212" : "#f8f9fa",
        color: darkMode ? "#ffffff" : "#000000",
        fontFamily: "Arial, sans-serif",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <div
        style={{
          background: darkMode ? "#1e1e1e" : "#ffffff",
          padding: "30px",
          borderRadius: "10px",
          boxShadow: darkMode
            ? "0 4px 8px rgba(0, 0, 0, 0.5)"
            : "0 4px 8px rgba(0, 0, 0, 0.1)",
          width: "100%",
          maxWidth: "500px",
          textAlign: "center",
        }}
      >
        {/* Dark Mode Toggle */}
        <button
          onClick={toggleDarkMode}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            padding: "10px",
            backgroundColor: darkMode ? "#FFC107" : "#343a40",
            color: darkMode ? "#000000" : "#ffffff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "14px",
            fontWeight: "bold",
            transition: "background 0.3s ease, color 0.3s ease",
          }}
        >
          {darkMode ? "☀ Light Mode" : "🌙 Dark Mode"}
        </button>

        <h1 style={{ marginBottom: "10px" }}>Text To Audio</h1>
        <h2 style={{ fontSize: "18px", marginBottom: "20px" }}>
          {/* Generate an Audiobook from your PDF file */}
        </h2>

        <label
          htmlFor="fileInput"
          style={{
            display: "block",
            margin: "0 auto 20px",
            padding: "12px 20px",
            backgroundColor: darkMode ? "#333" : "#e9ecef",
            borderRadius: "8px",
            border: `2px dashed ${darkMode ? "#555" : "#ced4da"}`,
            cursor: "pointer",
            fontSize: "14px",
          }}
        >
          {selectedFile ? selectedFile.name : "Choose a PDF file"}
          <input
            type="file"
            id="fileInput"
            accept=".pdf"
            onChange={handleFileChange}
            style={{ display: "none" }}
          />
        </label>

        <button
          onClick={handleUpload}
          style={{
            width: "100%",
            padding: "12px 0",
            backgroundColor: isProcessing ? "#6c757d" : "#007BFF",
            color: "white",
            border: "none",
            borderRadius: "5px",
            fontSize: "16px",
            cursor: "pointer",
          }}
          disabled={isProcessing}
        >
          {isProcessing ? "Processing..." : "Generate Audiobook"}
        </button>

        {isProcessing && (
          <p style={{ marginTop: "20px", color: "#6c757d" }}>
            Generating audiobook... Please wait.
          </p>
        )}

        {error && (
          <p style={{ color: "#dc3545", marginTop: "20px" }}>{error}</p>
        )}

        {audioPath && (
          <div style={{ marginTop: "20px" }}>
            <audio controls style={{ width: "100%" }}>
              <source src={audioPath} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>
            <br />
            <a
              href={audioPath}
              download
              style={{
                display: "inline-block",
                padding: "10px 20px",
                backgroundColor: "#28A745",
                color: "white",
                textDecoration: "none",
                borderRadius: "5px",
                marginTop: "10px",
                fontWeight: "bold",
              }}
            >
              Download 
            </a>

            <div style={{ marginTop: "20px" }}>
              <p
                style={{
                  fontWeight: "bold",
                  color: darkMode ? "#d1d1d1" : "#6c757d",
                }}
              >
                {/* Share on: */}
              </p>
              {/* <button
                onClick={() => handleShare("twitter")}
                style={buttonStyle("#1DA1F2")}
              >
                Twitter
              </button>
              <button
                onClick={() => handleShare("facebook")}
                style={buttonStyle("#3B5998")}
              >
                Facebook
              </button>
              <button
                onClick={() => handleShare("whatsapp")}
                style={buttonStyle("#25D366")}
              >
                WhatsApp
              </button>
              <button
                onClick={() => handleShare("linkedin")}
                style={buttonStyle("#0077B5")}
              >
                LinkedIn
              </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const buttonStyle = (bgColor) => ({
  display: "inline-block",
  padding: "8px 12px",
  margin: "5px",
  backgroundColor: bgColor,
  color: "white",
  border: "none",
  borderRadius: "5px",
  cursor: "pointer",
  fontWeight: "bold",
});

export default MainPage;
