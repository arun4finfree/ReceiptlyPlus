# ReceiptlyPlus

A React-based single-page application for generating rental receipts with e-signature support. The application allows users to create professional PDF receipts with embedded signatures and automatically manages receipt numbering and storage.

🌐 **Live Demo**: [https://arun4finfree.github.io/receiptlyplus](https://arun4finfree.github.io/receiptlyplus)

## Features

- **Complete Receipt Form**: All required fields for rental receipts
- **E-Signature Support**: Digital signature capture using react-signature-canvas
- **PDF Generation**: Automatic PDF creation with embedded signatures
- **Local Storage**: Persistent storage of receipts and auto-incrementing receipt numbers
- **Multiple Currencies**: Support for INR, USD, EUR, GBP, CAD, AUD
- **Responsive Design**: Modern UI built with Tailwind CSS
- **Form Validation**: Client-side validation with helpful error messages

## Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

## Installation

### For Windows Users

1. **Open Command Prompt or PowerShell**
   - Press `Win + R`, type `cmd` or `powershell`, and press Enter
   - Or right-click in your project folder and select "Open in Terminal"

2. **Navigate to your project directory**
   ```cmd
   cd "D:\GitHub Repo\CursorApps"
   ```

3. **Install dependencies**
   ```cmd
   npm install
   ```

4. **Start the development server**
   ```cmd
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173` (or the URL shown in your terminal)

### Alternative: Using Git Bash (if you have Git installed)
```bash
cd "D:/GitHub Repo/CursorApps"
npm install
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Alias for `npm run dev`
- `npm run deploy` - Build and deploy to GitHub Pages

## GitHub Pages Deployment

### Automatic Deployment (Recommended)

1. **Push your code to GitHub**
   ```cmd
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository on GitHub
   - Click "Settings" → "Pages"
   - Under "Source", select "GitHub Actions"
   - The app will automatically deploy to `https://your-username.github.io/receiptlyplus`

### Manual Deployment

1. **Build the project**
   ```cmd
   npm run build
   ```

2. **Deploy to GitHub Pages**
   ```cmd
   npm run deploy
   ```

3. **Update repository settings**
   - Go to GitHub repository → Settings → Pages
   - Select "Deploy from a branch"
   - Choose "gh-pages" branch and "/ (root)" folder

## Project Structure

```
receiptlyplus/
├── .github/
│   └── workflows/
│       └── deploy.yml      # GitHub Actions deployment workflow
├── src/
│   ├── components/
│   │   ├── ReceiptForm.jsx      # Main form component
│   │   └── SignatureModal.jsx   # E-signature modal
│   ├── utils/
│   │   └── pdf.js              # PDF generation utilities
│   ├── styles/
│   │   └── index.css           # Tailwind CSS imports and custom styles
│   ├── App.jsx                 # Main app component
│   └── main.jsx               # React entry point
├── package.json               # Dependencies and scripts
├── vite.config.js            # Vite configuration with GitHub Pages base
├── tailwind.config.js        # Tailwind CSS configuration
└── README.md                 # This file
```

## How to Use

### 1. Fill Out the Receipt Form

- **Title Name**: Enter your company or personal name
- **Title Address**: Enter your address (optional)
- **Tenant Name**: Enter the tenant's name
- **Duration**: Set the rental period (from/to dates)
- **Term**: Select Monthly or Yearly
- **Denomination**: Choose currency (default: INR)
- **Amount**: Enter the rental amount
- **Date of Receipt**: Payment date (defaults to today)
- **Receipt Number**: Auto-generated in format `RCT-YYYY-XXXX`

### 2. Add E-Signature (Optional)

1. Check the "E-Signature required" checkbox
2. Click "Add Signature" button
3. Draw your signature in the modal
4. Click "Confirm" to save the signature
5. Use "Clear" to start over or "Cancel" to close without saving

### 3. Generate PDF

1. Click "Generate Receipt PDF" button
2. The PDF will automatically download with filename `receipt-RCT-YYYY-XXXX.pdf`
3. The receipt is saved to localStorage for future reference

## Testing Instructions

### Basic Functionality Test

1. **Open the application** in your browser
2. **Fill out the form** with sample data:
   - Title Name: "ABC Properties"
   - Tenant Name: "John Doe"
   - Duration: Set any date range
   - Amount: "50000"
3. **Generate PDF** without signature - should download successfully
4. **Check localStorage** in browser dev tools to see stored receipt

### E-Signature Test

1. **Check "E-Signature required"**
2. **Click "Add Signature"** - modal should open
3. **Draw a signature** using mouse or touch
4. **Click "Confirm"** - signature should appear in preview
5. **Generate PDF** - signature should be embedded in PDF

### Storage Management Test

1. **Generate multiple receipts** - receipt numbers should auto-increment
2. **Check localStorage** in browser dev tools:
   - `rental_receipts`: Array of all generated receipts
   - `rental_receipt_seq`: Current sequence number
   - `rental_receipt_form_data`: Saved form data for convenience
3. **Click "Clear All Data"** - should reset everything and show confirmation

### Clear Stored Data

**Option 1: Using the App**
- Click "Clear All Data" button in the form
- Confirm the action in the popup

**Option 2: Using Browser Developer Tools**
1. Open browser dev tools (F12)
2. Go to Application/Storage tab
3. Find Local Storage for your domain
4. Delete these keys:
   - `rental_receipts`
   - `rental_receipt_seq`
   - `rental_receipt_form_data`

## Technical Details

### Dependencies

- **React 18**: Modern React with hooks
- **Tailwind CSS**: Utility-first CSS framework
- **react-signature-canvas**: Signature capture component
- **jspdf**: PDF generation library
- **html2canvas**: HTML to canvas conversion
- **Vite**: Fast build tool and dev server

### Key Features Implementation

- **Auto-incrementing Receipt Numbers**: Format `RCT-YYYY-XXXX` where XXXX increments
- **Local Storage Persistence**: Receipts and sequence numbers stored locally
- **PDF Generation**: High-quality PDFs with embedded signatures
- **Form Validation**: Required field validation and signature requirement checks
- **Responsive Design**: Works on desktop and mobile devices

### Browser Compatibility

- Chrome (recommended)
- Firefox
- Safari
- Edge

## Troubleshooting

### Common Issues

1. **PDF not generating**: Check browser console for errors, ensure all required fields are filled
2. **Signature not appearing**: Make sure to draw something in the signature canvas before confirming
3. **Receipt numbers not incrementing**: Clear localStorage and restart the app
4. **Styling issues**: Ensure Tailwind CSS is properly loaded
5. **GitHub Pages not working**: Check that the repository name matches "receiptlyplus" and GitHub Pages is enabled

### Windows-Specific Issues

1. **Command not found**: Make sure Node.js is installed and added to PATH
2. **Permission errors**: Run Command Prompt as Administrator
3. **Path issues**: Use quotes around paths with spaces: `cd "D:\GitHub Repo\CursorApps"`

### Development Tips

- Use browser dev tools to inspect localStorage
- Check console for any JavaScript errors
- Test signature functionality on both desktop and mobile
- Verify PDF generation works across different browsers
- For GitHub Pages: Make sure your repository is public and GitHub Actions are enabled

## License

MIT License - feel free to use and modify as needed.
