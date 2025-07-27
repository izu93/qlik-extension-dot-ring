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