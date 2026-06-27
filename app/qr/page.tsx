'use client';

import Image from 'next/image';
import { useEffect, useState, useCallback, useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface FileItem {
  id: string;
  filename: string;
  mimetype: string;
  size: number;
  uploadedAt: number;
}

function QRSkeleton() {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8 animate-pulse">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-[220px] aspect-square bg-gray-100 rounded-xl" />
        <div className="mt-6 flex items-center gap-4">
          <div className="w-32 h-4 bg-gray-100 rounded" />
          <div className="w-20 h-9 bg-gray-100 rounded-lg" />
        </div>
      </div>
    </div>
  );
}

function FileListSkeleton() {
  return (
    <div className="space-y-2 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gray-100 rounded-lg flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <div className="h-4 bg-gray-100 rounded w-2/5" />
              <div className="h-3 bg-gray-100 rounded w-1/5" />
            </div>
            <div className="flex gap-2">
              <div className="w-20 h-8 bg-gray-100 rounded-lg" />
              <div className="w-16 h-8 bg-gray-100 rounded-lg" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function QRPage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [files, setFiles] = useState<FileItem[]>([]);
  const [uploadUrl, setUploadUrl] = useState('');
  const [sessionExpiresIn, setSessionExpiresIn] = useState<number>(10 * 60);
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [isResettingSession, setIsResettingSession] = useState(false);
  const [sessionError, setSessionError] = useState('');
  const [isExpired, setIsExpired] = useState(false);
  const [pollError, setPollError] = useState(false);
  const [showConfirmReset, setShowConfirmReset] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [copied, setCopied] = useState(false);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    setIsClient(true);
    const newSessionId = crypto.randomUUID();
    initializeSession(newSessionId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initializeSession = useCallback((newSessionId: string) => {
    setSessionId(newSessionId);
    setSessionError('');
    setIsExpired(false);
    setPollError(false);
    setIsInitializing(true);
    setCopied(false);

    fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId: newSessionId }),
    }).then((res) => {
      if (!res.ok) throw new Error('Failed to create session');
      setIsInitializing(false);
    }).catch((err) => {
      console.error('[Session] Error creating session:', err);
      setSessionError('Failed to create session. Please refresh the page.');
      setIsInitializing(false);
    });

    const url = `${window.location.origin}/upload/${newSessionId}`;
    setUploadUrl(url);

    if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/files/${newSessionId}`);
        if (response.ok) {
          const data = await response.json();
          setFiles(data.files || []);
          setPollError(false);
        }
      } catch (error) {
        console.error('[Polling] Error fetching files:', error);
        setPollError(true);
      }
    }, 2000);
    pollIntervalRef.current = pollInterval;

    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - startTime) / 1000);
      const remaining = Math.max(0, 10 * 60 - elapsed);
      setSessionExpiresIn(remaining);
      if (remaining === 0) {
        setIsExpired(true);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
          pollIntervalRef.current = null;
        }
      }
    }, 1000);
    timerIntervalRef.current = timerInterval;
  }, []);

  useEffect(() => {
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, []);

  const handleNewSession = () => {
    if (files.length > 0) {
      setShowConfirmReset(true);
    } else {
      resetSession();
    }
  };

  const resetSession = async () => {
    setShowConfirmReset(false);
    setIsResettingSession(true);

    try {
      const response = await fetch('/api/session/reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      });

      if (!response.ok) throw new Error('Failed to reset session');

      const data = await response.json();
      const { newSessionId } = data;

      setFiles([]);
      initializeSession(newSessionId);
      setSessionExpiresIn(10 * 60);
    } catch (error) {
      console.error('[Session] Error resetting session:', error);
      alert('Failed to create new session. Please refresh the page.');
    } finally {
      setIsResettingSession(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(uploadUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch { /* not available */ }
  };

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

  const handlePrint = (file: FileItem) => {
    if (isClient && window.innerWidth >= 768) {
      setPreviewFile(file);
    } else {
      printFileDirect(file.id);
    }
  };

  const printFileDirect = (fileId: string) => {
    const printWindow = window.open(`/api/download/${fileId}`, '_blank');
    if (printWindow) {
      printWindow.addEventListener('load', () => printWindow.print());
    }
  };

  const handlePrintFromPreview = () => {
    if (previewFile) {
      printFileDirect(previewFile.id);
      setPreviewFile(null);
    }
  };

  const renderTimer = () => {
    if (isExpired) return 'Expired';
    const m = Math.floor(sessionExpiresIn / 60);
    const s = sessionExpiresIn % 60;
    return `${m}:${String(s).padStart(2, '0')}`;
  };

  const timerColor = sessionExpiresIn < 60 && !isExpired
    ? 'text-red-500'
    : sessionExpiresIn < 120 && !isExpired
    ? 'text-amber-500'
    : 'text-gray-400';

  const fileExt = (filename: string) => filename.split('.').pop()?.toUpperCase() || '';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-12 animate-fade-in">
          <div className="inline-flex items-center justify-center gap-2.5 mb-4">
            <div className="w-10 h-10 rounded-xl bg-gray-900 flex items-center justify-center">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">ShareIt</h1>
          </div>
          <p className="text-base sm:text-lg text-gray-500">Scan &rarr; Upload &rarr; Print</p>
        </div>

        {/* Session Error */}
        {sessionError && (
          <div role="alert" className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-center animate-slide-down">
            <p className="text-red-600 text-sm font-medium">{sessionError}</p>
          </div>
        )}

        {/* Hero card */}
        <div className="min-h-[300px] sm:min-h-[320px]">
          {isInitializing ? (
            <QRSkeleton />
          ) : sessionError ? (
            <div role="alert" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-red-50 border border-red-100 mb-4">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Failed to Create Session</h2>
              <p className="text-sm text-gray-500 mb-6">{sessionError}</p>
              <button
                onClick={() => { setSessionError(''); initializeSession(crypto.randomUUID()); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Try Again
              </button>
            </div>
          ) : isExpired ? (
            <div role="alert" className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 sm:p-10 mb-8 text-center animate-scale-in">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-amber-50 border border-amber-100 mb-4">
                <svg className="w-7 h-7 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 3.75h.008v.008H12v-.008Z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-1">Session Expired</h2>
              <p className="text-sm text-gray-500 mb-6">Files have been auto-deleted.</p>
              <button
                onClick={handleNewSession}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182" />
                </svg>
                Start New Session
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 mb-8 animate-scale-in">
              <div className="flex flex-col items-center">
                <div className="bg-gray-50 rounded-xl p-4 sm:p-5">
                  {sessionId && (
                    <QRCodeSVG
                      value={uploadUrl}
                      size={220}
                      level="H"
                      includeMargin={false}
                      className="w-full max-w-[220px] h-auto"
                    />
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center gap-3 mt-5">
                  <div className="flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                    </svg>
                    <span className={`text-sm font-medium ${timerColor}`} aria-live="polite">
                      {renderTimer()}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopyLink}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.19 8.688a4.5 4.5 0 0 1 1.242 7.244l-4.5 4.5a4.5 4.5 0 0 1-6.364-6.364l1.757-1.757m9.86-2.573a4.5 4.5 0 0 0-1.242-7.244l-4.5-4.5a4.5 4.5 0 0 0-6.364 6.364L4.34 8.472" />
                      </svg>
                      {copied ? 'Copied!' : 'Copy Link'}
                    </button>
                    <button
                      onClick={handleNewSession}
                      disabled={isResettingSession}
                      className="px-3 py-1.5 text-xs font-semibold text-gray-900 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isResettingSession ? 'Resetting...' : 'New Session'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Poll Error */}
        {pollError && !isExpired && (
          <div role="alert" className="mb-4 p-3 bg-amber-50 border border-amber-100 rounded-lg text-center animate-slide-down">
            <p className="text-amber-600 text-xs font-medium">Connection interrupted &mdash; retrying...</p>
          </div>
        )}

        {/* Files Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-900">Files</h2>
            {files.length > 0 && (
              <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full">
                {files.length} {files.length === 1 ? 'file' : 'files'}
              </span>
            )}
          </div>

          {isInitializing ? (
            <FileListSkeleton />
          ) : files.length === 0 ? (
            <div className="text-center py-12">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100 mb-3">
                <div className="w-2.5 h-2.5 rounded-full bg-gray-900 animate-pulse" />
              </div>
              <p className="text-base font-medium text-gray-500">
                {isExpired ? 'Session ended' : 'Waiting for files...'}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                {isExpired ? 'Start a new session to continue' : 'Scan the QR code from your phone'}
              </p>
            </div>
          ) : (
            <ul className="space-y-2" role="list" aria-label="Received files">
              {files.map((file, index) => (
                <li
                  key={file.id}
                  className="file-enter animate-slide-up"
                  style={{ animationDelay: `${index * 60}ms` }}
                >
                  <div className="group flex items-center gap-3 sm:gap-4 rounded-xl bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200 px-4 py-3 transition-all duration-200 focus-within:ring-2 focus-within:ring-gray-900/20">
                    <div className="flex-shrink-0">
                      {file.mimetype.startsWith('image/') ? (
                        <div className="w-9 h-9 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0 0 22.5 18.75V5.25A2.25 2.25 0 0 0 20.25 3H3.75A2.25 2.25 0 0 0 1.5 5.25v13.5A2.25 2.25 0 0 0 3.75 21Z" />
                          </svg>
                        </div>
                      ) : (
                        <div className="w-9 h-9 rounded-lg bg-red-50 border border-red-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                          </svg>
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{file.filename}</p>
                      <p className="text-xs text-gray-400">
                        {formatFileSize(file.size)}
                        <span className="mx-1.5">&middot;</span>
                        {new Date(file.uploadedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        <span className="mx-1.5 hidden sm:inline">&middot;</span>
                        <span className="hidden sm:inline text-gray-300 uppercase text-[10px] font-medium">{fileExt(file.filename)}</span>
                      </p>
                    </div>

                    <div className="hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleDownload(file.id, file.filename)}
                        aria-label={`Download ${file.filename}`}
                        className="px-3 py-1.5 text-xs font-medium text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handlePrint(file)}
                        aria-label={`Print ${file.filename}`}
                        className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-gray-200 hover:bg-gray-300 rounded-lg transition-all"
                      >
                        Print
                      </button>
                    </div>
                    <div className="flex sm:hidden gap-1.5">
                      <button
                        onClick={() => handleDownload(file.id, file.filename)}
                        aria-label={`Download ${file.filename}`}
                        className="px-2.5 py-1.5 text-xs font-medium text-white bg-gray-900 rounded-lg"
                      >
                        Download
                      </button>
                      <button
                        onClick={() => handlePrint(file)}
                        aria-label={`Print ${file.filename}`}
                        className="px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-gray-200 rounded-lg"
                      >
                        Print
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="text-center mt-8 pb-4 text-xs text-gray-400">
          <p>No login &middot; Auto-deletes after session</p>
        </div>
      </div>

      {/* Confirm Reset Modal */}
      {showConfirmReset && (
        <div className="fixed inset-0 bg-gray-900/40 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="confirm-reset-heading">
          <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 animate-scale-in">
            <h3 id="confirm-reset-heading" className="text-lg font-semibold text-gray-900 mb-2">End current session?</h3>
            <p className="text-sm text-gray-500 mb-6">
              This will clear {files.length} file{files.length > 1 ? 's' : ''} and generate a new QR code.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setShowConfirmReset(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
              >
                Cancel
              </button>
              <button
                onClick={resetSession}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-500 hover:bg-red-400 rounded-lg transition-all"
              >
                End Session
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewFile && (
        <div className="fixed inset-0 bg-gray-900/50 flex items-center justify-center z-50 p-4 animate-fade-in" role="dialog" aria-modal="true" aria-labelledby="preview-heading">
          <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] flex flex-col animate-scale-in">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 id="preview-heading" className="text-base font-semibold text-gray-900 truncate pr-4">{previewFile.filename}</h3>
              <button
                onClick={() => setPreviewFile(null)}
                aria-label="Close preview"
                className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-all"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              {previewFile.mimetype.startsWith('image/') ? (
                <div className="relative w-full h-[65vh]">
                  <Image
                    src={`/api/download/${previewFile.id}`}
                    alt={previewFile.filename}
                    fill
                    className="object-contain rounded-lg"
                    unoptimized
                  />
                </div>
              ) : previewFile.mimetype === 'application/pdf' ? (
                <embed
                  src={`/api/download/${previewFile.id}#toolbar=0`}
                  type="application/pdf"
                  className="w-full h-[65vh] rounded-lg"
                />
              ) : (
                <div className="text-center py-10">
                  <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-gray-100 mb-4">
                    <svg className="w-7 h-7 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                    </svg>
                  </div>
                  <p className="text-gray-900 font-semibold mb-1">Preview not available</p>
                  <p className="text-sm text-gray-500">Download the file to view it on your device.</p>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100 bg-gray-50">
              <div className="text-sm text-gray-500">
                <span className="font-medium text-gray-700">{formatFileSize(previewFile.size)}</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => handleDownload(previewFile.id, previewFile.filename)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 rounded-lg transition-all"
                >
                  Download
                </button>
                <button
                  onClick={handlePrintFromPreview}
                  className="px-4 py-2 text-sm font-semibold text-white bg-gray-900 hover:bg-gray-800 rounded-lg transition-all"
                >
                  Print
                </button>
                <button
                  onClick={() => setPreviewFile(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-lg transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
