import { useElement, useLayout, useStaleLayout } from '@nebula.js/stardust';

export default function supernova() {
  return {
    qae: {
      properties: {
        version: process.env.PACKAGE_VERSION,
        qHyperCubeDef: {
          qDimensions: [],
          qMeasures: [],
          qInitialDataFetch: [
            {
              qWidth: 10,
              qHeight: 1000,
            },
          ],
        },
      },
      data: {
        targets: [
          {
            path: '/qHyperCubeDef',
            dimensions: {
              min: 0,
              max: 1000,
            },
            measures: {
              min: 0,
              max: 1000,
            },
          },
        ],
      },
    },
    component() {
      const element = useElement();
      const layout = useLayout();

      // Basic render function
      const render = () => {
        element.innerHTML = `
          <div style="padding: 20px; font-family: Arial, sans-serif;">
            <h2>Qlik Extension Compare</h2>
            <p>Extension loaded successfully!</p>
            <p>Ready for development...</p>
          </div>
        `;
      };

      // Initial render
      render();

      return {
        render,
      };
    },
  };
} 