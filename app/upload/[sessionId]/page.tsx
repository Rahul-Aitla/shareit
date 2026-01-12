'use client';

/**
 * Mobile Upload Page
 * Allows users to upload files by scanning a QR code
 */

import { useParams, useRouter } from 'next/navigation';
import { useState, useRef, ChangeEvent, DragEvent } from 'react';

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const sessionId = params.sessionId as string;

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed');
      return;
    }

    // Validate file size (10 MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10 MB');
      return;
    }

    setError('');
    setUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      // Simulate progress (actual progress tracking requires additional setup)
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadedFiles((prev) => [...prev, data.file.filename]);
      
      // Show success message
      setSuccessMessage('File sent to print PC');
      setTimeout(() => setSuccessMessage(''), 3000);

      // Reset after short delay
      setTimeout(() => {
        setUploading(false);
        setUploadProgress(0);
      }, 1000);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileSelect(e.target.files);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 p-4">
      <div className="max-w-lg mx-auto mt-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">Upload Files</h1>
          <p className="text-lg text-gray-700 font-medium">
            Scan → Upload → Print
          </p>
        </div>

        {/* Upload Area */}
        <div className="bg-white rounded-2xl shadow-xl p-4 mb-6">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-xl p-12 text-center transition-all ${
              isDragging
                ? 'border-blue-500 bg-blue-50'
                : 'border-gray-300 bg-gray-50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileInputChange}
              accept="image/*,application/pdf"
              className="hidden"
            />

            {!uploading ? (
              <>
                <svg
                  className="mx-auto h-16 w-16 text-gray-400 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>

                <p className="text-gray-700 font-medium mb-2 text-lg">
                  Tap to select file
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Images & PDFs (max 10 MB)
                </p>

                <button
                  onClick={handleButtonClick}
                  className="px-10 py-5 bg-blue-500 text-white rounded-xl hover:bg-blue-600 transition-colors font-bold text-lg shadow-lg active:scale-95"
                >
                  Choose File
                </button>
              </>
            ) : (
              <div>
                <div className="mb-4">
                  <svg
                    className="mx-auto h-16 w-16 text-blue-500 animate-pulse"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                </div>

                <p className="text-gray-700 font-medium mb-4">Uploading...</p>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div
                    className="bg-blue-500 h-3 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
                <p className="text-sm text-gray-500">{uploadProgress}%</p>
              </div>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 font-medium">{successMessage}</p>
            </div>
          )}
        </div>

        {/* Uploaded Files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              ✅ Uploaded ({uploadedFiles.length})
            </h2>
            <div className="space-y-2">
              {uploadedFiles.map((filename, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-green-50 border border-green-200 rounded-lg"
                >
                  <svg
                    className="h-5 w-5 text-green-500 flex-shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <span className="text-sm text-gray-700 truncate">{filename}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Info */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h3 className="font-semibold text-gray-800 mb-4 text-center text-lg">How it works</h3>
          <div className="flex items-center justify-center gap-3 text-gray-700">
            <span className="font-bold text-blue-500">Scan</span>
            <span className="text-gray-400">→</span>
            <span className="font-bold text-blue-500">Upload</span>
            <span className="text-gray-400">→</span>
            <span className="font-bold text-blue-500">Print</span>
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">Files auto-delete after session</p>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-gray-400">
          <p>No login • Secure & temporary</p>
        </div>
      </div>
    </div>
  );
}
