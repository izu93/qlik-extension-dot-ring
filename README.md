# Qlik Extension Compare

A Qlik Sense extension for comparison analysis built with Nebula.js.

## Installation

### Step 1: Clone & Install

```bash
git clone https://github.com/izu93/qlik-extension-compare.git
cd qlik-extension-compare
npm install
```

### Step 2: Development

```bash
# Build the extension
npm run build

# Development mode
npm run dev
```

### Step 3: Deploy to Qlik

1. Upload the built extension to your Qlik Cloud tenant
2. Enable in Management Console > Extensions
3. Add to any Qlik Sense app

## Project Structure

```
qlik-extension-compare/
├── package.json              # Nebula.js dependencies & build scripts
├── playwright.config.js      # Testing configuration
├── src/
│   ├── index.js              # Main component
│   └── meta.json             # Extension metadata
└── README.md                 # This documentation
```

## Development

### Build Commands:

```bash
# Production build
npm run build

# Development mode
npm run dev

# Run tests
npm test
```

## License

This project is licensed under the MIT License. 