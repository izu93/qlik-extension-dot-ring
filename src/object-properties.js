// object-properties.js - Streamlined configuration
export default {
  // Standard Qlik object properties
  showTitles: true,
  title: "",
  subtitle: "",
  footnote: "",

  // Hypercube definition for data handling
  qHyperCubeDef: {
    qDimensions: [], // Array to store dimension definitions
    qMeasures: [], // Array to store measure definitions
    // Initial data fetch configuration
    qInitialDataFetch: [
      {
        qWidth: 3, // Number of columns to fetch
        qHeight: 3000, // Number of rows to fetch - increased for full dataset
      },
    ],
  },

  // Custom properties for compare extension
  props: {
    // Visual settings - updated for better visibility
    bubbleSize: {
      min: 3,    // User configurable minimum bubble size
      max: 12    // User configurable maximum bubble size
    },
    
    // Ring settings
    sortOrder: "default",
    
    // Display settings
    showLegend: true,
    showMetrics: true
  },
}; 