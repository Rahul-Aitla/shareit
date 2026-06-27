'use client';

import Link from 'next/link';

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement>, id: string) {
  e.preventDefault();
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

export default function LandingPage() {
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-gray-50/85 backdrop-blur-md border-b border-gray-200/60">
        <div className="max-w-5xl mx-auto flex items-center justify-between px-4 sm:px-6 h-14">
          <Link href="/" className="flex items-center gap-2 font-bold text-gray-900 text-lg tracking-tight">
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            ShareIt
          </Link>
          <div className="hidden sm:flex items-center gap-6 text-sm font-medium text-gray-500">
            <a href="#how" onClick={(e) => scrollToSection(e, 'how')} className="hover:text-gray-900 transition-colors">How it works</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="hover:text-gray-900 transition-colors">Features</a>
            <a href="#use-cases" onClick={(e) => scrollToSection(e, 'use-cases')} className="hover:text-gray-900 transition-colors">Use cases</a>
          </div>
          <Link
            href="/qr"
            className="inline-flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            Open app
          </Link>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pt-20 pb-16 sm:pt-28 sm:pb-20">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <div className="inline-flex items-center gap-1.5 bg-gray-200/70 text-gray-600 text-xs font-semibold px-3 py-1.5 rounded-full mb-5 tracking-wide uppercase">
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
              No login &middot; Works on any phone
            </div>
            <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 tracking-tight leading-[1.08] mb-4">
              Your phone files on your desktop{' '}
              <span className="relative whitespace-nowrap">
                in seconds
                <span className="absolute -bottom-0.5 left-0 right-0 h-2 bg-gray-200 rounded-full -z-10" />
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-500 leading-relaxed max-w-lg mb-7">
              Scan a QR code from your phone, upload files, and they appear on your desktop instantly.
              No accounts, no cloud storage, no cables.
            </p>
            <div className="flex flex-wrap items-center gap-3 mb-8">
              <Link
                href="/qr"
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 7h7V3H3v4zM3 21h7v-4H3v4zM14 7h7V3h-7v4zM14 14h3v3h-3zM17 17h4v4h-4zM14 17h3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                Scan QR &amp; transfer
              </Link>
              <a
                href="#how"
                onClick={(e) => scrollToSection(e, 'how')}
                className="inline-flex items-center gap-2 text-gray-700 font-medium text-sm px-5 py-2.5 rounded-lg border border-gray-200 hover:border-gray-300 hover:bg-gray-100 transition-all"
              >
                See how it works
              </a>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
                Auto-deletes
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2" /><path d="M7 11V7a5 5 0 0 1 10 0v4" /></svg>
                No account needed
              </span>
              <span className="flex items-center gap-1.5">
                <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="5" y="2" width="14" height="20" rx="2" ry="2" /><line x1="12" y1="18" x2="12.01" y2="18" /></svg>
                Any device
              </span>
            </div>
          </div>

          {/* ── Browser window mockup (desktop experience) ── */}
          <div className="hidden lg:flex items-center justify-center perspective-distant">
            <div className="transform-3d rotate-y-[-6deg] transition-transform duration-700 hover:rotate-y-[-2deg]">
              <div className="relative">
                {/* Browser window */}
                <div className="w-[480px] bg-white rounded-xl shadow-[0_25px_70px_-12px_rgba(0,0,0,0.3),0_8px_24px_-6px_rgba(0,0,0,0.12)] overflow-hidden">
                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-4 h-10 bg-gray-50 border-b border-gray-200/60">
                    <div className="flex items-center gap-[5px]">
                      <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <div className="flex-1 flex items-center justify-center gap-1.5 mx-3">
                      <div className="flex items-center gap-1 bg-white border border-gray-200/80 rounded-md px-2.5 py-1 w-full max-w-[220px]">
                        <svg className="w-3 h-3 text-emerald-600 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span className="text-[10px] text-gray-500 truncate">localhost:3000</span>
                      </div>
                    </div>
                  </div>

                  {/* Page content */}
                  <div className="bg-gray-50 p-5 pb-6">
                    {/* App header */}
                    <div className="text-center mb-4">
                      <div className="inline-flex items-center justify-center gap-1.5 mb-1">
                        <div className="w-6 h-6 rounded-md bg-gray-900 flex items-center justify-center">
                          <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="17 8 12 3 7 8" />
                            <line x1="12" y1="3" x2="12" y2="15" />
                          </svg>
                        </div>
                        <span className="text-base font-bold text-gray-900 tracking-tight">ShareIt</span>
                      </div>
                      <p className="text-[10px] text-gray-400">Scan &rarr; Upload &rarr; Print</p>
                    </div>

                    {/* QR card */}
                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4 mb-3">
                      <div className="flex flex-col items-center">
                        <div className="bg-gray-50 rounded-lg p-2.5">
                          <svg width="100" height="100" viewBox="0 0 80 80" fill="none">
                            <rect x="4" y="4" width="28" height="28" rx="3" stroke="#111827" strokeWidth="2" fill="none" />
                            <rect x="10" y="10" width="16" height="16" rx="2" fill="#111827" opacity="0.6" />
                            <rect x="48" y="4" width="28" height="28" rx="3" stroke="#111827" strokeWidth="2" fill="none" />
                            <rect x="54" y="10" width="16" height="16" rx="2" fill="#111827" opacity="0.6" />
                            <rect x="4" y="48" width="28" height="28" rx="3" stroke="#111827" strokeWidth="2" fill="none" />
                            <rect x="10" y="54" width="16" height="16" rx="2" fill="#111827" opacity="0.6" />
                            <rect x="48" y="48" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="54" y="48" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="60" y="48" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="48" y="54" width="8" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="58" y="54" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="64" y="54" width="10" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="48" y="60" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="54" y="60" width="4" height="4" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="48" y="66" width="10" height="8" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="60" y="66" width="4" height="8" rx="0.5" fill="#111827" opacity="0.5" />
                            <rect x="66" y="66" width="8" height="8" rx="0.5" fill="#111827" opacity="0.5" />
                          </svg>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <svg className="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          <span className="text-[9px] font-medium text-gray-400">9:41 remaining</span>
                          <span className="w-[1px] h-3 bg-gray-200" />
                          <span className="text-[9px] font-medium text-gray-400">Scan with phone</span>
                        </div>
                      </div>
                    </div>

                    {/* Files area */}
                    <div className="bg-white rounded-xl border border-gray-200/80 shadow-sm p-4">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-semibold text-gray-900 uppercase tracking-wider">Files</span>
                        <span className="text-[8px] font-medium text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">0 files</span>
                      </div>
                      <div className="text-center py-5">
                        <div className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-gray-100 mb-1.5">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-900 animate-pulse" />
                        </div>
                        <p className="text-[10px] font-medium text-gray-400">Waiting for files...</p>
                        <p className="text-[8px] text-gray-300 mt-0.5">Scan the QR code from your phone</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Floating scan indicator */}
                <div className="absolute -right-8 top-1/2 -translate-y-1/2 z-10 animate-pulse">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg px-2.5 py-1.5 shadow-sm">
                    <svg className="w-3 h-3 text-gray-900" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="17 8 12 3 7 8" />
                      <line x1="12" y1="3" x2="12" y2="15" />
                    </svg>
                    <span className="text-[9px] font-semibold text-gray-700 whitespace-nowrap">Scan to start</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── How it works ── */}
      <section id="how" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">How it works</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Three steps, nothing to install</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            ShareIt bridges your phone and desktop without cables, accounts, or apps.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 relative">
          {/* Connector line — hidden on mobile */}
          {/* <div className="hidden sm:block absolute top-8 left-[calc(33.33%+12px)] right-[calc(33.33%+12px)] h-px bg-gray-200" /> */}

          {[
            { num: '01', title: 'Open ShareIt on desktop', desc: 'Visit the site on your desktop. A unique QR code generates instantly for your session.' },
            { num: '02', title: 'Scan with your phone', desc: 'Use your phone\'s camera to scan the QR code. No app download needed — opens straight in your mobile browser.' },
            { num: '03', title: 'Upload and use', desc: 'Select files from your phone. They appear on your desktop instantly — download or print them.' },
          ].map((step) => (
            <div key={step.num} className="bg-white rounded-xl border border-gray-200 p-5 sm:p-6 hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gray-900 text-white flex items-center justify-center text-sm font-bold mb-3 relative">
                {step.num}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1.5">{step.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── Stats ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="grid sm:grid-cols-3 border border-gray-200 rounded-xl overflow-hidden bg-gray-200/60">
          {[
            { value: '0', label: 'Accounts required' },
            { value: '&lt;1s', label: 'Average transfer start' },
            { value: '100%', label: 'Client-side encrypted' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white py-8 px-4 text-center">
              <p className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight"
                dangerouslySetInnerHTML={{ __html: stat.value }} />
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── Features ── */}
      <section id="features" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Features</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Built for speed, not storage</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Everything you need to move files fast. Nothing you don&apos;t.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-3">
          {[
            { icon: 'lock', title: 'No account required', desc: 'Zero sign-up, zero login. Works the moment you open it.' },
            { icon: 'trash', title: 'Auto-deletes on close', desc: 'Files exist only during your session. Nothing lingers on any server.' },
            { icon: 'wifi', title: 'Any device, any browser', desc: 'iPhone, Android, old tablets — if the camera works, ShareIt works.' },
            { icon: 'printer', title: 'Print-ready', desc: 'Send files straight to your desktop printer the moment they arrive.' },
            { icon: 'bolt', title: 'Real-time transfer', desc: 'Files show up on your desktop the instant you tap upload on your phone.' },
            { icon: 'free', title: 'Completely free', desc: 'No hidden plans, no file size limits, no upsells.' },
          ].map((feature) => (
            <div key={feature.title} className="bg-white border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all">
              <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center mb-3">
                {feature.icon === 'lock' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                )}
                {feature.icon === 'trash' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                )}
                {feature.icon === 'wifi' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12.55a11 11 0 0 1 14.08 0" />
                    <path d="M1.42 9a16 16 0 0 1 21.16 0" />
                    <path d="M8.53 16.11a6 6 0 0 1 6.95 0" />
                    <circle cx="12" cy="20" r="1" />
                  </svg>
                )}
                {feature.icon === 'printer' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 6 2 18 2 18 9" />
                    <rect x="6" y="14" width="12" height="8" rx="1" />
                    <rect x="6" y="10" width="12" height="4" rx="1" />
                  </svg>
                )}
                {feature.icon === 'bolt' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                )}
                {feature.icon === 'free' && (
                  <svg className="w-4 h-4 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="12" y1="1" x2="12" y2="23" />
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                )}
              </div>
              <h3 className="text-sm font-bold text-gray-900 mb-1">{feature.title}</h3>
              <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── Use cases ── */}
      <section id="use-cases" className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="text-center mb-12">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-2">Use cases</p>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight mb-2">Where it helps most</h2>
          <p className="text-sm sm:text-base text-gray-500 max-w-md mx-auto">
            Real situations where ShareIt saves you time and frustration.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {[
            { icon: 'file', title: 'Print documents from your phone', desc: 'PDF on your phone but the printer is connected to your laptop? Scan, upload, print — in under 30 seconds.' },
            { icon: 'image', title: 'Move photos without a cable', desc: 'Skip the USB cable or AirDrop setup. Open ShareIt and your photos are on your desktop instantly.' },
            { icon: 'building', title: 'Share at a shared workstation', desc: 'On a computer that isn\'t yours? No login needed. Just scan, transfer, and you\'re done.' },
            { icon: 'plane', title: 'Last-minute travel documents', desc: 'Boarding pass or booking confirmation on your phone? Get it onto a printer or desktop screen in seconds.' },
          ].map((uc) => (
            <div key={uc.title} className="bg-white border border-gray-200 rounded-xl p-5 flex gap-4 items-start hover:border-gray-300 transition-all">
              <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0">
                {uc.icon === 'file' && (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                  </svg>
                )}
                {uc.icon === 'image' && (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
                {uc.icon === 'building' && (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="4" y="2" width="16" height="20" rx="1" />
                    <line x1="9" y1="6" x2="9" y2="6.01" />
                    <line x1="15" y1="6" x2="15" y2="6.01" />
                    <line x1="9" y1="10" x2="9" y2="10.01" />
                    <line x1="15" y1="10" x2="15" y2="10.01" />
                    <line x1="9" y1="14" x2="9" y2="14.01" />
                    <line x1="15" y1="14" x2="15" y2="14.01" />
                    <line x1="9" y1="18" x2="15" y2="18" />
                  </svg>
                )}
                {uc.icon === 'plane' && (
                  <svg className="w-5 h-5 text-gray-700" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
                  </svg>
                )}
              </div>
              <div>
                <h3 className="text-sm font-bold text-gray-900 mb-0.5">{uc.title}</h3>
                <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{uc.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Divider ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>

      {/* ── CTA ── */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-20">
        <div className="bg-gray-900 rounded-2xl px-6 sm:px-10 py-12 sm:py-14 text-center">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mb-2">
            Ready to transfer your first file?
          </h2>
          <p className="text-sm sm:text-base text-gray-400 mb-7 max-w-sm mx-auto">
            Open ShareIt on your desktop, point your phone at the QR code, and you&apos;re done.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/qr"
              className="inline-flex items-center gap-2 bg-white hover:bg-gray-100 text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition-all"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M3 7h7V3H3v4zM3 21h7v-4H3v4zM14 7h7V3h-7v4zM14 14h3v3h-3zM17 17h4v4h-4zM14 17h3" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Open ShareIt now
            </Link>
            <a
              href="#how"
              onClick={(e) => scrollToSection(e, 'how')}
              className="inline-flex items-center gap-2 text-gray-300 font-medium text-sm px-5 py-2.5 rounded-lg border border-gray-700 hover:border-gray-500 transition-all"
            >
              How it works
            </a>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-gray-200" />
      </div>
      <footer className="max-w-5xl mx-auto px-4 sm:px-6 pt-8 pb-10">
        <div className="grid sm:grid-cols-4 gap-8 mb-8">
          <div className="sm:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2 font-bold text-gray-900 text-base tracking-tight mb-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="17 8 12 3 7 8" />
                <line x1="12" y1="3" x2="12" y2="15" />
              </svg>
              ShareIt
            </Link>
            <p className="text-sm text-gray-500 max-w-xs">
              Temporary file transfer between your phone and desktop.
              No login, no storage, no nonsense.
            </p>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">Product</h4>
            <Link href="/qr" className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5 transition-colors">Open app</Link>
            <a href="#how" onClick={(e) => scrollToSection(e, 'how')} className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5 transition-colors">How it works</a>
            <a href="#features" onClick={(e) => scrollToSection(e, 'features')} className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Features</a>
          </div>
          <div>
            <h4 className="text-xs font-bold text-gray-900 uppercase tracking-wider mb-3">More</h4>
            <a href="#" onClick={(e) => e.preventDefault()} className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5 transition-colors">Privacy</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block text-sm text-gray-500 hover:text-gray-900 mb-1.5 transition-colors">GitHub</a>
            <a href="#" onClick={(e) => e.preventDefault()} className="block text-sm text-gray-500 hover:text-gray-900 transition-colors">Contact</a>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-5 flex flex-col sm:flex-row justify-between items-center gap-2 text-xs text-gray-400">
          <p>&copy; 2025 ShareIt. Open source. No data collected.</p>
          <p>Made with a focus on privacy and speed.</p>
        </div>
      </footer>
    </div>
  );
}
