import React, { useState } from "react";
import axios from "axios";
import { CircularProgress, Snackbar, Alert, Button } from "@mui/material";
import "./App.css";

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const backendUrl = "https://image-backend-u2dd.onrender.com"; // Your deployed backend URL

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    setSelectedImage(file);
    setProcessedImage(null);
    setLoading(false);
  };

  const handleRemoveBackground = async () => {
    if (!selectedImage) {
      setError("Please upload an image first");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(
        `${backendUrl}/remove-background`,
        formData
      );

      // Extract the URL for the processed image
      const { processed_image_url } = response.data;
      const imageUrl = `${backendUrl}${processed_image_url}`;
      setProcessedImage(imageUrl);
    } catch (err) {
      setError("Error removing background");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleEnhanceQuality = async () => {
    if (!selectedImage) {
      setError("Please upload an image first");
      setSnackbarOpen(true);
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("image", selectedImage);

    try {
      const response = await axios.post(`${backendUrl}/upload`, formData);

      // Extract the URL for the processed image
      const { processed_image_url } = response.data;
      const imageUrl = `${backendUrl}${processed_image_url}`;
      setProcessedImage(imageUrl);
    } catch (err) {
      setError("Error enhancing quality");
      setSnackbarOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  return (
    <div className="container">
      <h1 className="title">Image Processing Tool</h1>
      <div
        className="dropzone"
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          const file = e.dataTransfer.files[0];
          setSelectedImage(file);
          setProcessedImage(null);
        }}
      >
        <p>Drag and drop an image here or click to select</p>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="file-input"
          style={{ display: "none" }}
        />
        <Button
          className="selectBtn"
          onClick={() => document.querySelector(".file-input").click()}
        >
          Select Image
        </Button>
      </div>
      <div className="btn-container">
        <Button
          variant="contained"
          color="primary"
          className="btn"
          onClick={handleRemoveBackground}
          disabled={loading}
        >
          Remove Background
        </Button>
        <Button
          variant="contained"
          color="secondary"
          className="btn"
          onClick={handleEnhanceQuality}
          disabled={loading}
        >
          Enhance Quality
        </Button>
      </div>
      {loading && (
        <div className="loader">
          <CircularProgress />
        </div>
      )}
      <div className="images-container">
        {selectedImage && (
          <div className="image-box">
            <h2 className="image-title">Uploaded Image</h2>
            <img
              src={URL.createObjectURL(selectedImage)}
              alt="Uploaded"
              className="image"
            />
          </div>
        )}
        {processedImage && (
          <div className="image-box">
            <h2 className="image-title">Processed Image</h2>
            <img src={processedImage} alt="Processed" className="image" />
          </div>
        )}
      </div>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </div>
  );
}

export default App;
