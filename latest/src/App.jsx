import { useState, useEffect, useRef } from "react";
import "./App.css";
import api from "./config/api.js";

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  const fileInputRef = useRef(null);

  // =====================================================
  // GET ALL IMAGES
  // GET /api/images
  // =====================================================
  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);

      const response = await api.get("/");

      const data = response.data;

      console.log("Images response:", data);

      if (data.success && data.data) {
        setImages(data.data);
      } else {
        setImages([]);
      }
    } catch (err) {
      console.error("Failed to fetch images:", err);

      alert(
        err.response?.data?.message ||
        "Failed to load images"
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DELETE IMAGE
  // DELETE /api/images/:id
  // =====================================================
  const handleDelete = async (id, e) => {
    // Prevent clicking the image card
    e.stopPropagation();

    const confirmed = window.confirm(
      "Are you sure you want to delete this image?"
    );

    if (!confirmed) {
      return;
    }

    try {
      // IMPORTANT:
      // No spaces inside the URL
      await api.delete(`/${id}`);

      // Remove deleted image from UI
      setImages((prevImages) =>
        prevImages.filter((img) => img._id !== id)
      );

    } catch (err) {
      console.error("Failed to delete image:", err);

      alert(
        err.response?.data?.message ||
        "Failed to delete image"
      );
    }
  };

  // =====================================================
  // SELECT IMAGE
  // =====================================================
  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Check if selected file is an image
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }

    // Save selected file
    setSelectedFile(file);

    // Create preview
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  // =====================================================
  // UPLOAD IMAGE
  // POST /api/images
  // =====================================================
  const handleUpload = async (e) => {
    e.preventDefault();

    // ---------------------------------------------------
    // Check whether image has been selected
    // ---------------------------------------------------
    if (!selectedFile) {
      alert("Please select an image first.");
      return;
    }

    // ---------------------------------------------------
    // Create FormData
    // ---------------------------------------------------
    const formData = new FormData();

    /*
      IMPORTANT:

      "image" MUST match your backend:

      upload.single("image")

      Example:

      router.post(
        "/",
        upload.single("image"),
        uploadImage
      );
    */
    formData.append("image", selectedFile);

    // Add image title
    formData.append(
      "title",
      selectedFile.name || "Untitled Image"
    );

    try {
      setUploading(true);

      console.log("Uploading file:", selectedFile);
      console.log("File name:", selectedFile.name);
      console.log("File type:", selectedFile.type);

      // ---------------------------------------------------
      // Send FormData to backend
      // ---------------------------------------------------
      const response = await api.post("/", formData);

      const data = response.data;

      console.log("Upload response:", data);

      // ---------------------------------------------------
      // Upload successful
      // ---------------------------------------------------
      if (data.success) {
        // Close modal
        setIsModalOpen(false);

        // Clear selected file
        setSelectedFile(null);

        // Clear preview
        setPreviewUrl(null);

        // Clear file input
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }

        // Refresh gallery
        await fetchImages();

      } else {
        alert(
          data.message ||
          "Image upload failed."
        );
      }

    } catch (err) {
      console.error("Upload error:", err);

      console.error(
        "Backend response:",
        err.response?.data
      );

      /*
        If backend says:

        "Image file is required"

        then the problem is most likely in the
        backend multer configuration.

        Frontend is sending:

        formData.append("image", selectedFile)

        Therefore backend must use:

        upload.single("image")
      */

      alert(
        err.response?.data?.message ||
        "Image upload failed."
      );

    } finally {
      setUploading(false);
    }
  };

  // =====================================================
  // CLOSE MODAL
  // =====================================================
  const closeModal = () => {
    setIsModalOpen(false);

    setSelectedFile(null);

    setPreviewUrl(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // =====================================================
  // OPEN FILE SELECTOR
  // =====================================================
  const openFileSelector = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // =====================================================
  // UI
  // =====================================================
  return (
    <div className="app-container">

      {/* =================================================
          HEADER
      ================================================= */}
      <header>
        <div className="logo-container">
          <h1 className="gradient-text">
            Nova Gallery
          </h1>
        </div>

        <button
          className="upload-btn"
          onClick={() => setIsModalOpen(true)}
        >
          + Upload Image
        </button>
      </header>


      {/* =================================================
          MAIN GALLERY
      ================================================= */}
      <main>

        {/* Loading */}
        {loading ? (
          <div className="spinner"></div>

        ) : images.length === 0 ? (

          /* Empty gallery */
          <div className="empty-state">
            <p>
              No images found. Upload your first masterpiece!
            </p>
          </div>

        ) : (

          /* Gallery */
          <div className="gallery-grid">

            {images.map((img) => (
              <div
                className="image-card glass-panel"
                key={img._id}
              >

                {/* Image */}
                <img
                  src={img.imageUrl}
                  alt={
                    img.title ||
                    "Uploaded image"
                  }
                  loading="lazy"
                />

                {/* Image overlay */}
                <div className="image-overlay">

                  {/* Image information */}
                  <div className="image-info">
                    <p
                      style={{
                        margin: 0,
                        fontWeight: "bold",
                      }}
                    >
                      {img.title || "Image"}
                    </p>
                  </div>

                  {/* Delete button */}
                  <button
                    className="delete-btn"
                    onClick={(e) =>
                      handleDelete(
                        img._id,
                        e
                      )
                    }
                    title="Delete"
                  >
                    🗑
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>


      {/* =================================================
          UPLOAD MODAL
      ================================================= */}
      {isModalOpen && (

        <div
          className="modal-overlay"
          onClick={closeModal}
        >

          <div
            className="modal-content glass-panel"
            onClick={(e) =>
              e.stopPropagation()
            }
          >

            {/* Modal header */}
            <div className="modal-header">

              <h2>
                Upload Image
              </h2>

              <button
                className="close-btn"
                onClick={closeModal}
              >
                &times;
              </button>

            </div>


            {/* Upload form */}
            <form onSubmit={handleUpload}>

              {/* =================================================
                  UPLOAD AREA
              ================================================= */}
              <div
                className={`upload-area ${previewUrl
                    ? "has-preview"
                    : ""
                  }`}
                onClick={openFileSelector}
              >

                {/* File input */}

                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                  hidden
                />


                {/* =================================================
                    IMAGE PREVIEW
                ================================================= */}
                {previewUrl ? (

                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="preview-image"
                  />

                ) : (

                  /* =================================================
                     DEFAULT UPLOAD UI
                  ================================================= */

                  <>
                    <span className="upload-icon">
                      ☁️
                    </span>

                    <p>
                      Click to browse or drag image here
                    </p>

                    <small>
                      PNG, JPG, JPEG, WEBP
                    </small>
                  </>

                )}

              </div>


              {/* =================================================
                  SELECTED FILE NAME
              ================================================= */}
              {selectedFile && (

                <p
                  style={{
                    marginTop: "10px",
                    textAlign: "center",
                  }}
                >
                  Selected:{" "}
                  <strong>
                    {selectedFile.name}
                  </strong>
                </p>

              )}


              {/* =================================================
                  UPLOAD BUTTON
              ================================================= */}
              <button
                type="submit"
                className="submit-btn"
                disabled={
                  !selectedFile ||
                  uploading
                }
              >

                {uploading
                  ? "Uploading..."
                  : "Upload Now"}

              </button>

            </form>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;