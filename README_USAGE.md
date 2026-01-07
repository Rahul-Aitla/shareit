# ShareIt - Temporary File Transfer App

A loginless, session-based file transfer application for quickly sharing files from mobile to desktop using QR codes.

## 🚀 Quick Start

### 1. Start the Development Server

```bash
npm run dev
```

The server will start at `http://localhost:3000`

### 2. Using the Application

#### On Desktop:
1. Open `http://localhost:3000` in your browser
2. A QR code will be displayed
3. Wait for files to appear in real-time as they're uploaded
4. Click **Download** to save files or **Print** to open the browser's print dialog

#### On Mobile:
1. Scan the QR code with your phone's camera
2. You'll be redirected to the upload page
3. Tap **Choose File** or drag-and-drop to upload
4. Files appear instantly on the desktop

## 📁 Project Structure

```
shareit/
├── app/
│   ├── page.tsx                          # Desktop home page with QR code
│   ├── upload/[sessionId]/page.tsx       # Mobile upload page
│   └── api/
│       ├── session/route.ts              # Create session
│       ├── upload/route.ts               # Upload files
│       ├── files/[sessionId]/route.ts    # Fetch files
│       └── download/[fileId]/route.ts    # Download files
├── lib/
│   ├── sessionStore.ts                   # Session management
│   └── fileStore.ts                      # File storage
└── server.ts                             # Custom server with Socket.IO
```

## 🔑 Key Features

- ✅ **No Authentication** - No login required
- ✅ **QR Code Scanning** - Instant mobile connection
- ✅ **Real-time Updates** - Files appear instantly via Socket.IO
- ✅ **Auto-expiry** - Sessions expire after 10 minutes
- ✅ **File Validation** - 10 MB limit, images and PDFs only
- ✅ **Print Support** - Direct browser print dialog
- ✅ **Mobile-friendly** - Drag-and-drop upload interface

## 🛠 Technical Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Real-time**: Socket.IO
- **QR Code**: qrcode.react
- **Storage**: In-memory (no database)

## 🔒 Security & Privacy

- All data stored in memory (no database)
- Files automatically deleted after 10 minutes
- Session-based isolation
- No user tracking or accounts

## 📝 API Endpoints

- `POST /api/session` - Create a new session
- `POST /api/upload` - Upload a file to a session
- `GET /api/files/[sessionId]` - Get all files for a session
- `GET /api/download/[fileId]` - Download a specific file

## 🎯 Use Case

Perfect for college labs where students need to quickly transfer screenshots from their phones to lab computers for printing - without logging into WhatsApp Web or other services.

## ⚡ Real-time Communication

Socket.IO events:
- `join_session` - Desktop joins a session room
- `file_uploaded` - Emitted when a file is uploaded
- `leave_session` - Desktop leaves a session room

## 🚨 Limitations

- Maximum file size: 10 MB
- Supported formats: JPEG, PNG, GIF, WebP, PDF
- Session duration: 10 minutes
- Storage: In-memory only (resets on server restart)
- No silent printing (requires user interaction due to browser security)

## 📱 Testing Locally

To test with a real mobile device on your local network:

1. Find your computer's IP address:
   ```bash
   ipconfig  # Windows
   ```

2. Start the server:
   ```bash
   npm run dev
   ```

3. Open on desktop: `http://YOUR-IP:3000`
4. Scan the QR code from your mobile device

Make sure both devices are on the same network!

---

Built with ❤️ for hassle-free file sharing
