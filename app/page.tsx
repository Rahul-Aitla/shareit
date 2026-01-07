'use client';

/**
 * Desktop Home Page
 * Shows QR code for mobile scanning and lists received files
 */

import { useEffect, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface FileItem {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: number;
}

export default function HomePage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');

  useEffect(() => {
    // Generate session ID
    const newSessionId = crypto.randomUUID();
    setSessionId(newSessionId);

    // Create session on server
    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: newSessionId }),
    }).then((res) => res.json());

    // Set upload URL
    const url = `${window.location.origin}/upload/${newSessionId}`;
    setUploadUrl(url);

    setIsConnected(true);

    // Poll for new files every 2 seconds
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/files/${newSessionId}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
        }
      } catch (error) {
        console.error('[Polling] Error fetching files:', error);
      }
    }, 2000);

    // Cleanup
    return () => {
      clearInterval(pollInterval);
    };
  }, []);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const handleDownload = (fileId: string, filename: string) => {
    const link = document.createElement('a');
    link.href = `/api/download/${fileId}`;
    link.download = filename;
    link.click();
  };

  const handlePrint = async (fileId: string) => {
    // Open file in new window and trigger print
    const printWindow = window.open(`/api/download/${fileId}`, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => {
        printWindow.print();
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">ShareIt</h1>
          <p className="text-gray-600">
            Scan the QR code from your phone to upload files
          </p>
          <div className="flex items-center justify-center gap-2 mt-2">
            <div
              className={`w-2 h-2 rounded-full ${
                isConnected ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <span className="text-sm text-gray-500">
              {isConnected ? 'Connected' : 'Connecting...'}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
          <div className="flex flex-col items-center">
            <div className="bg-white p-6 rounded-xl border-4 border-gray-200">
              {sessionId && (
                <QRCodeSVG
                  value={uploadUrl}
                  size={256}
                  level="H"
                  includeMargin={false}
                />
              )}
            </div>
            <p className="text-sm text-gray-500 mt-4 text-center max-w-md">
              Session expires in 10 minutes. Files will be automatically deleted.
            </p>
          </div>
        </div>

        {/* Files Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            Received Files ({files.length})
          </h2>

          {files.length === 0 ? (
            <div className="text-center py-12">
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
              <p className="text-gray-500">No files yet. Scan the QR code to start uploading.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1 min-w-0">
                      {/* File icon */}
                      <div className="flex-shrink-0">
                        {file.mimetype.startsWith('image/') ? (
                          <svg
                            className="h-10 w-10 text-blue-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                            />
                          </svg>
                        ) : (
                          <svg
                            className="h-10 w-10 text-red-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                            />
                          </svg>
                        )}
                      </div>

                      {/* File info */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {file.filename}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(file.size)} •{' '}
                          {new Date(file.uploadedAt).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={() => handleDownload(file.id, file.filename)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors text-sm font-medium"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handlePrint(file.id)}
                        className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-medium"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>No login required • Files auto-delete after 10 minutes</p>
        </div>
      </div>
    </div>
  );
}
