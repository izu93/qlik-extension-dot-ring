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
        qWidth: 40, // Number of columns to fetch
        qHeight: 100, // Number of rows to fetch
      },
    ],
  },

  // Custom properties for compare extension
  props: {
    // Visual settings - updated for better visibility
    bubbleSize: {
      min: 3,    // Increased from 2
      max: 8     // Increased from 8 to match new sizes
    },
    
    // Display settings
    showLegend: true,
    showMetrics: true
  },
}; 