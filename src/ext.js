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