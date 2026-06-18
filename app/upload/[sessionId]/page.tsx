'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useState, useRef, useEffect, ChangeEvent, DragEvent } from 'react';

function UploadSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 animate-pulse">
      <div className="rounded-xl border-2 border-dashed border-gray-100 p-10 sm:p-12 text-center">
        <div className="mx-auto w-14 h-14 bg-gray-100 rounded-full mb-4" />
        <div className="h-5 bg-gray-100 rounded w-1/2 mx-auto mb-2" />
        <div className="h-4 bg-gray-100 rounded w-2/5 mx-auto mb-6" />
        <div className="mx-auto w-36 h-12 bg-gray-100 rounded-xl" />
      </div>
    </div>
  );
}

function InfoSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 animate-pulse">
      <div className="h-5 bg-gray-100 rounded w-1/4 mx-auto mb-4" />
      <div className="flex items-center justify-center gap-3">
        <div className="w-12 h-4 bg-gray-100 rounded" />
        <div className="w-6 h-4 bg-gray-100 rounded" />
        <div className="w-14 h-4 bg-gray-100 rounded" />
        <div className="w-6 h-4 bg-gray-100 rounded" />
        <div className="w-12 h-4 bg-gray-100 rounded" />
      </div>
      <div className="h-4 bg-gray-100 rounded w-1/2 mx-auto mt-4" />
    </div>
  );
}

export default function UploadPage() {
  const params = useParams();
  const sessionId = params.sessionId as string;

  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [successMessage, setSuccessMessage] = useState<string>('');
  const [sessionExpired, setSessionExpired] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/files/${sessionId}`)
      .then((res) => {
        if (res.status === 410 || res.status === 404) setSessionExpired(true);
      })
      .catch(() => setError('Could not connect to server.'))
      .finally(() => setCheckingSession(false));
  }, [sessionId]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const file = files[0];

    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      setError('Only images (JPEG, PNG, GIF, WebP) and PDFs are allowed');
      return;
    }

    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File size must be less than 10 MB');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('sessionId', sessionId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const data = await response.json();
        if (response.status === 410) {
          setSessionExpired(true);
          throw new Error('Session ended. Ask for a new QR code.');
        }
        throw new Error(data.error || 'Upload failed');
      }

      const data = await response.json();
      setUploadedFiles((prev) => [...prev, data.file.filename]);

      setSuccessMessage('File uploaded successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
      setTimeout(() => setUploading(false), 500);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const handleRetrySession = () => {
    setSessionExpired(false);
    setError('');
    setCheckingSession(true);
    fetch(`/api/files/${sessionId}`)
      .then((res) => {
        if (res.status === 410 || res.status === 404) {
          setSessionExpired(true);
          setError('This session has expired. Ask for a new QR code.');
        }
      })
      .catch(() => setError('Could not connect to server.'))
      .finally(() => setCheckingSession(false));
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">ShareIt</h1>
          </div>
          <p className="text-sm sm:text-base text-gray-500">Select a file to upload</p>
        </div>

        {/* Checking */}
        {checkingSession && (
          <div className="animate-fade-in">
            <UploadSkeleton />
            <InfoSkeleton />
          </div>
        )}

        {/* Session expired */}
        {!checkingSession && sessionExpired && (
          <div role="alert" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-6 text-center animate-scale-in">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-100 mb-4">
              <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-1">Session Expired</h2>
            <p className="text-sm text-gray-500 mb-6">Ask the desktop user for a new QR code.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetrySession}
                className="px-5 py-2.5 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all"
              >
                Retry
              </button>
              <Link
                href="/"
                className="px-5 py-2.5 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                Go to Home
              </Link>
            </div>
          </div>
        )}

        {/* Upload Area */}
        {!checkingSession && !sessionExpired && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 mb-6 animate-fade-in">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`rounded-xl border-2 border-dashed p-8 sm:p-10 text-center transition-all duration-200 ${
                isDragging
                  ? 'border-gray-900 bg-gray-50'
                  : 'border-gray-200 bg-gray-50/50 hover:bg-gray-100'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileInputChange}
                accept="image/*,application/pdf"
                className="hidden"
                aria-label="Choose file to upload"
              />

              {!uploading ? (
                <>
                  <div className="mx-auto w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                  </div>

                  <p className="text-gray-700 font-medium mb-1">Tap to select or drag and drop</p>
                  <p className="text-sm text-gray-400 mb-6">Images &amp; PDFs &middot; Max 10 MB</p>

                  <button
                    onClick={handleButtonClick}
                    className="px-8 py-3 rounded-xl bg-gray-900 hover:bg-gray-800 text-white font-semibold text-base transition-all active:scale-[0.98]"
                  >
                    Choose File
                  </button>
                </>
              ) : (
                <div className="py-4">
                  <svg className="mx-auto w-12 h-12 text-gray-900 animate-spin mb-4" fill="none" viewBox="0 0 24 24" aria-hidden="true">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  <p className="text-gray-700 font-medium">Uploading...</p>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="mt-3 p-3 bg-red-50 border border-red-100 rounded-lg animate-slide-down">
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            )}

            {/* Success */}
            {successMessage && (
              <div role="status" className="mt-3 p-3 bg-emerald-50 border border-emerald-100 rounded-lg animate-slide-down">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <p className="text-emerald-700 text-sm font-medium">{successMessage}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Uploaded files */}
        {uploadedFiles.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6 animate-fade-in">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Uploaded ({uploadedFiles.length})</h2>
            <ul className="space-y-1.5" role="list" aria-label="Uploaded files">
              {uploadedFiles.map((filename, index) => (
                <li key={index} className="animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                  <div className="flex items-center gap-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-100">
                    <svg className="w-4 h-4 text-emerald-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                    </svg>
                    <span className="text-sm text-gray-700 truncate">{filename}</span>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Info */}
        {!checkingSession && !sessionExpired && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 animate-fade-in">
            <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">How it works</h3>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
              <span className="font-semibold text-gray-900">Scan</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5.25 6 6-6 6" />
              </svg>
              <span className="font-semibold text-gray-900">Upload</span>
              <svg className="w-4 h-4 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="m9 5.25 6 6-6 6" />
              </svg>
              <span className="font-semibold text-gray-900">Print</span>
            </div>
            <p className="text-center text-xs text-gray-400 mt-3">Files auto-delete after session</p>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-8 pb-4 text-xs text-gray-400">
          <p>No login &middot; Secure &amp; temporary</p>
        </div>
      </div>
    </div>
  );
}
