import { useState, useEffect, useRef } from 'react';
import './App.css';

const API_URL = 'http://localhost:5000/api/images';

function App() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const res = await fetch(API_URL);
      const data = await res.json();
      if (data.success && data.data) {
        setImages(data.data);
      }
    } catch (err) {
      console.error('Failed to fetch images', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!confirm('Are you sure you want to delete this image?')) return;
    try {
      const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setImages(images.filter((img) => img._id !== id));
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('title', selectedFile.name || 'Untitled Image');

    try {
      setUploading(true);
      const res = await fetch(API_URL, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsModalOpen(false);
        setSelectedFile(null);
        setPreviewUrl(null);
        fetchImages(); // Refresh gallery
      } else {
        alert(data.message || 'Upload failed');
      }
    } catch (err) {
      console.error('Upload error', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo-container">
          <h1 className="gradient-text">Nova Gallery</h1>
        </div>
        <button className="upload-btn" onClick={() => setIsModalOpen(true)}>
          + Upload Image
        </button>
      </header>

      <main>
        {loading ? (
          <div className="spinner"></div>
        ) : images.length === 0 ? (
          <div className="empty-state">
            <p>No images found. Upload your first masterpiece!</p>
          </div>
        ) : (
          <div className="gallery-grid">
            {images.map((img) => (
              <div className="image-card glass-panel" key={img._id}>
                <img src={img.imageUrl} alt={img.title || 'Uploaded image'} loading="lazy" />
                <div className="image-overlay">
                  <div className="image-info">
                    <p style={{ margin: 0, fontWeight: 'bold' }}>{img.title || 'Image'}</p>
                  </div>
                  <button
                    className="delete-btn"
                    onClick={(e) => handleDelete(img._id, e)}
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

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content glass-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Upload Image</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleUpload}>
              <div 
                className={`upload-area ${previewUrl ? 'has-preview' : ''}`}
                onClick={() => fileInputRef.current.click()}
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept="image/*"
                />
                {previewUrl ? (
                  <img src={previewUrl} alt="Preview" className="preview-image" />
                ) : (
                  <>
                    <span className="upload-icon">☁️</span>
                    <p>Click to browse or drag image here</p>
                  </>
                )}
              </div>
              <button
                type="submit"
                className="submit-btn"
                disabled={!selectedFile || uploading}
              >
                {uploading ? 'Uploading...' : 'Upload Now'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
