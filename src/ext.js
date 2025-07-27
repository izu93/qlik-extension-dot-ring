// ext.js - Property panel definition for compare extension
export default {
  definition: {
    type: "items",
    component: "accordion",
    items: {
      // Standard data configuration section
      data: {
        uses: "data",
      },

      // Ring Configuration
      ringSettings: {
        type: "items",
        label: "Ring Settings",
        items: {
          sortOrder: {
            type: "string",
            component: "dropdown",
            label: "Sort Rings By",
            ref: "props.sortOrder",
            options: [
              {
                value: "default",
                label: "Default Order"
              },
              {
                value: "alphabetical",
                label: "Alphabetical (A-Z)"
              },
              {
                value: "reverse-alphabetical",
                label: "Reverse Alphabetical (Z-A)"
              },
              {
                value: "confidence-high-to-low",
                label: "Confidence: High to Low"
              },
              {
                value: "confidence-low-to-high",
                label: "Confidence: Low to High"
              },
              {
                value: "count-high-to-low",
                label: "Count: Most to Least"
              },
              {
                value: "count-low-to-high",
                label: "Count: Least to Most"
              }
            ],
            defaultValue: "default"
          }
        }
      },

      // Bubble Configuration
      bubbleSettings: {
        type: "items",
        label: "Bubble Settings",
        items: {
          bubbleSizeHeader: {
            type: "string",
            component: "text",
            label: "*Adjust bubble sizes for better visibility of data points*",
            style: "font-style: italic; color: #666; margin-bottom: 10px;"
          },
          bubbleSizeMin: {
            type: "number",
            component: "slider",
            label: "Minimum Bubble Size",
            ref: "props.bubbleSize.min",
            min: 1,
            max: 10,
            step: 0.5,
            defaultValue: 3
          },
          bubbleSizeMax: {
            type: "number", 
            component: "slider",
            label: "Maximum Bubble Size",
            ref: "props.bubbleSize.max",
            min: 5,
            max: 25,
            step: 1,
            defaultValue: 12
          }
        }
      },

      // Standard appearance settings
      appearance: {
        uses: "settings",
        items: {
          general: {
            items: {
              showTitles: {
                defaultValue: true,
              },
              title: {
                defaultValue: "False Churn Analysis",
              },
              subtitle: {
                defaultValue: "",
              },
              footnote: {
                defaultValue: "",
              },
            },
          },
        },
      },
    },
  },

  support: {
    snapshot: true,
    export: true,
    exportData: false,
  },
}; 