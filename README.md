# ReceiptlyPlus - Rental Receipt Generator

A comprehensive rental receipt generator with e-signature support, available as both web and mobile applications.

## Project Structure

```
ReceiptlyPlus/
├── src/                          # Shared components and styles
│   ├── components/
│   │   └── SignatureModal.jsx    # Shared signature modal component
│   └── styles/
│       └── index.css             # Shared CSS styles
├── utils/                        # Shared utilities
│   └── pdf.js                    # PDF generation utilities
├── ReceiptlyPlus-Web/            # Web application
│   ├── src/
│   │   ├── components/
│   │   │   └── ReceiptForm.jsx   # Web-specific form component
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   ├── vite.config.js
│   └── index.html
├── ReceiptlyPlus-Mobile/         # Mobile application (Capacitor)
│   ├── src/
│   │   ├── components/
│   │   │   └── MobileReceiptForm.jsx  # Mobile-specific form component
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── android/                  # Android project files
│   ├── package.json
│   ├── capacitor.config.ts
│   └── index.html
└── package.json                  # Shared dependencies
```

## Features

### Web Version
- **URL**: https://arun4finfree.github.io/ReceiptlyPlus/
- Responsive web interface
- PDF generation and download
- E-signature capture
- Local storage for receipts
- GitHub Pages deployment

### Mobile Version
- Android APK generation
- Touch-optimized interface
- Device storage integration
- File sharing capabilities
- Offline functionality

### Shared Features
- Professional PDF generation
- Indian numbering system (Lakh, Crore)
- Multiple payment modes (Cash, Cheque, UPI, etc.)
- Date validation and formatting
- Receipt number generation (RCT-YYMM-HHMM format)
- E-signature integration

## Quick Start

### Install Dependencies
```bash
# Install all dependencies (web + mobile)
npm run install-all

# Or install individually
npm run install-web
npm run install-mobile
```

### Development

#### Web Version
```bash
# Start web development server
npm run dev-web
# or
cd ReceiptlyPlus-Web && npm run dev
```

#### Mobile Version
```bash
# Start mobile development server
npm run dev-mobile
# or
cd ReceiptlyPlus-Mobile && npm run dev
```

### Building

#### Web Version
```bash
# Build web version
npm run build-web
# or
cd ReceiptlyPlus-Web && npm run build
```

#### Mobile Version
```bash
# Build mobile version
npm run build-mobile
# or
cd ReceiptlyPlus-Mobile && npm run build

# Generate Android APK
cd ReceiptlyPlus-Mobile/android && gradlew assembleDebug
```

## Technology Stack

### Shared
- **React 18** - UI framework
- **Tailwind CSS** - Styling
- **jsPDF** - PDF generation
- **html2canvas** - HTML to canvas conversion
- **react-signature-canvas** - E-signature capture

### Web
- **Vite** - Build tool
- **GitHub Pages** - Deployment

### Mobile
- **Capacitor** - Hybrid mobile framework
- **Android Studio** - Android development
- **Gradle** - Build system

## Usage

### Web Version
1. Open https://arun4finfree.github.io/ReceiptlyPlus/
2. Fill in the receipt form
3. Add e-signature if required
4. Generate and download PDF

### Mobile Version
1. Install APK on Android device
2. Fill in the receipt form
3. Add e-signature using touch
4. Save to device or share

## Development Notes

### Shared Code
- All PDF generation logic is in `utils/pdf.js`
- Signature modal is shared in `src/components/SignatureModal.jsx`
- Common styles are in `src/styles/index.css`

### Import Paths
- Web components import from `../../../utils/pdf.js`
- Mobile components import from `../../../utils/pdf.js`
- Both use shared signature modal from `../../../src/components/SignatureModal.jsx`

### PDF Generation
- Uses the same PDF generation logic for both web and mobile
- Ensures consistent output across platforms
- Optimized for file size and quality

## Troubleshooting

### Web Version
- If GitHub Pages shows blank page, check base path in `vite.config.js`
- Clear browser cache if assets don't load

### Mobile Version
- Ensure Java 17+ is installed for Android builds
- Check `gradle.properties` for correct Java path
- Use Command Prompt instead of PowerShell for Gradle commands

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make changes to shared utilities first
4. Update both web and mobile versions
5. Test on both platforms
6. Submit a pull request

## License

MIT License - see LICENSE file for details