import {
  useElement,
  useLayout,
  useEffect,
} from "@nebula.js/stardust";
import * as d3 from "d3";
import objectProperties from "./object-properties";
import extensionDefinition from "./ext";
import dataConfiguration from "./data";

export default function supernova() {
  return {
    qae: {
      properties: objectProperties,
      data: dataConfiguration,
    },
    ext: extensionDefinition,
    component() {
      const element = useElement();
      const layout = useLayout();

      useEffect(() => {
        // Get data from hypercube
        const data = layout.qHyperCube?.qDataPages?.[0]?.qMatrix || [];
        const dimensionCount = layout?.qHyperCube?.qDimensionInfo?.length || 0;
        const measureCount = layout?.qHyperCube?.qMeasureInfo?.length || 0;
        const dimensionInfo = layout?.qHyperCube?.qDimensionInfo || [];
        const measureInfo = layout?.qHyperCube?.qMeasureInfo || [];

        console.log('Extension Data:', {
          rows: data.length,
          dimensions: dimensionCount,
          measures: measureCount,
          sampleData: data.slice(0, 2)
        });

        // Validate field configuration
        if (dimensionCount === 0) {
          element.innerHTML = `
            <div style="padding: 40px; text-align: center; color: #666;">
              <h3>📊 Add Data Fields</h3>
              <p>Please add dimensions and measures to configure the cluster visualization.</p>
              <div style="margin-top: 20px; font-size: 12px;">
                <div><strong>Required:</strong></div>
                <div>• Account Name dimension (for dots)</div>
                <div>• Confidence Classification dimension (for rings)</div>
                <div>• ATR Amount measure (for bubble sizing)</div>
              </div>
            </div>
          `;
          return;
        }

        // Process the data - simple approach
        const processedData = data.map((row, index) => {
          // Use first dimension as account name
          const accountName = (dimensionCount > 0) ? 
            (row[0]?.qText || `Account${index}`) : 
            `Account${index}`;

          // Use second dimension as confidence, fallback to first if only one dimension
          const confidenceClass = (dimensionCount > 1) ? 
            (row[1]?.qText || 'Unknown') : 
            (row[0]?.qText || 'Unknown');

          // Use first measure as ATR
          const atrAmount = (measureCount > 0) ? 
            (row[dimensionCount]?.qNum || 0) : 
            Math.random() * 1000; // Random for demo if no measures

          return {
            id: index,
            accountName: accountName,
            confidenceClass: confidenceClass,
            atrAmount: atrAmount
          };
        });

        // Group data by confidence classification
        const groupedData = {};
        processedData.forEach(item => {
          if (!groupedData[item.confidenceClass]) {
            groupedData[item.confidenceClass] = [];
          }
          groupedData[item.confidenceClass].push(item);
        });

        console.log('Grouped data:', groupedData);

        // Get field names for display
        const accountFieldName = (dimensionCount > 0) ? 
          dimensionInfo[0].qFallbackTitle : 'Account Name';
        const confidenceFieldName = (dimensionCount > 1) ? 
          dimensionInfo[1].qFallbackTitle : 'Confidence';
        const atrFieldName = (measureCount > 0) ? 
          measureInfo[0].qFallbackTitle : 'ATR Amount';

        // Create the extension UI
        element.innerHTML = `
          <div style="
            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            font-family: Arial, sans-serif;
            background: #f8f9fa;
          ">
            <!-- Cluster Visualization Container -->
            <div style="
              flex: 1;
              position: relative;
              background: white;
              display: flex;
              align-items: center;
              justify-content: center;
            ">
              <svg id="cluster-svg" style="
                width: 100%;
                height: 100%;
                max-width: 900px;
                max-height: 700px;
              "></svg>
              
              <!-- Field Info - Moved to Top Left -->
              <div style="
                position: absolute;
                top: 20px;
                left: 20px;
                background: rgba(255,255,255,0.95);
                padding: 10px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-size: 10px;
                color: #666;
              ">
                <div><strong>Dots:</strong> ${accountFieldName}</div>
                <div><strong>Rings:</strong> ${confidenceFieldName}</div>
                <div><strong>Size:</strong> ${atrFieldName}</div>
              </div>

              <!-- Legend -->
              <div style="
                position: absolute;
                top: 20px;
                right: 20px;
                background: rgba(255,255,255,0.95);
                padding: 12px;
                border-radius: 6px;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                font-size: 11px;
                max-width: 180px;
              " id="legend-container">
                <div style="font-weight: bold; margin-bottom: 6px;">${confidenceFieldName}</div>
                <div id="legend-items"></div>
              </div>
            </div>
          </div>
        `;

        // Render the visualization
        renderCluster(processedData, groupedData, accountFieldName, confidenceFieldName, atrFieldName);

      }, [layout]);

      function renderCluster(processedData, groupedData, accountFieldName, confidenceFieldName, atrFieldName) {
        const svg = d3.select('#cluster-svg');
        svg.selectAll('*').remove();

        const width = 800;
        const height = 600;
        const centerX = width / 2;
        const centerY = height / 2;

        svg.attr('viewBox', `0 0 ${width} ${height}`);

        const ringLevels = Object.keys(groupedData);
        const colorScale = d3.scaleOrdinal()
          .domain(ringLevels)
          .range([
            '#dc3545', '#fec44f', '#6baed6', '#28a745',
            '#9c27b0', '#ff9800', '#795548', '#607d8b'
          ]);

        // Specific colors for known confidence levels
        const getColor = (level) => {
          const specificColors = {
            'High Confidence False Churn': '#dc3545',
            'Moderate Confidence': '#fec44f',
            'Low Confidence': '#6baed6',
            'Unlikely False Churn': '#28a745'
          };
          return specificColors[level] || colorScale(level);
        };

        // Calculate ring positions - optimized for many dots
        const maxRadius = Math.min(width, height) * 0.4;
        const minRadius = 60;
        const ringWidth = ringLevels.length > 1 ? 
          (maxRadius - minRadius) / (ringLevels.length - 1) : 0;

        // Render rings and dots
        ringLevels.forEach((level, levelIndex) => {
          const accounts = groupedData[level];
          const ringRadius = ringLevels.length === 1 ? 
            (maxRadius + minRadius) / 2 : 
            minRadius + (levelIndex * ringWidth);
          const color = getColor(level);

          // Draw ring circle
          svg.append('circle')
            .attr('cx', centerX)
            .attr('cy', centerY)
            .attr('r', ringRadius)
            .attr('fill', 'none')
            .attr('stroke', color)
            .attr('stroke-width', 2)
            .attr('stroke-opacity', 0.4);

          // Position dots - optimized for many dots with better visible size
          accounts.forEach((account, accountIndex) => {
            // Add spacing optimization to prevent overlap with many dots
            const baseAngle = (accountIndex / accounts.length) * 2 * Math.PI;
            
            // Add slight radius variation for better distribution when many dots
            const radiusVariation = accounts.length > 20 ? 
              (Math.random() - 0.5) * 15 : // More variation for dense rings
              (Math.random() - 0.5) * 8;   // Less variation for sparse rings
            
            const adjustedRadius = ringRadius + radiusVariation;
            const dotX = centerX + Math.cos(baseAngle) * adjustedRadius;
            const dotY = centerY + Math.sin(baseAngle) * adjustedRadius;
            
            // Better sized dots - larger but still efficient for many dots
            const maxATR = Math.max(...processedData.map(d => d.atrAmount));
            const minDotSize = 3;   // Increased from 1.5
            const maxDotSize = 8;   // Increased from 4
            const dotSize = maxATR > 0 && account.atrAmount > 0 ? 
              minDotSize + ((account.atrAmount / maxATR) * (maxDotSize - minDotSize)) : 
              minDotSize;

            // Create more visible dot
            const dot = svg.append('circle')
              .attr('cx', dotX)
              .attr('cy', dotY)
              .attr('r', dotSize)
              .attr('fill', color)
              .attr('stroke', 'white')
              .attr('stroke-width', 1)    // Increased from 0.5
              .style('cursor', 'pointer')
              .style('opacity', 0.9);

            // Add hover effects
            dot.on('mouseover', function(event) {
              d3.select(this)
                .transition()
                .duration(150)
                .attr('r', dotSize * 2)   // Reduced from 2.5x to 2x 
                .style('opacity', 1);

              showTooltip(event, account, accountFieldName, confidenceFieldName, atrFieldName);
            })
            .on('mouseout', function() {
              d3.select(this)
                .transition()
                .duration(150)
                .attr('r', dotSize)
                .style('opacity', 0.9);

              hideTooltip();
            })
            .on('click', function() {
              console.log('Clicked account:', account);
            });
          });
        });

        // Update legend
        updateLegend(ringLevels, getColor, groupedData);
      }

      function showTooltip(event, account, accountFieldName, confidenceFieldName, atrFieldName) {
        d3.select('#cluster-tooltip').remove();
        
        const tooltip = d3.select('body')
          .append('div')
          .attr('id', 'cluster-tooltip')
          .style('position', 'absolute')
          .style('background', 'rgba(0,0,0,0.9)')
          .style('color', 'white')
          .style('padding', '8px 12px')
          .style('border-radius', '4px')
          .style('font-size', '11px')
          .style('pointer-events', 'none')
          .style('z-index', '1000')
          .style('opacity', 0);

        tooltip.html(`
          <div style="font-weight: bold;">${account.accountName}</div>
          <div>${confidenceFieldName}: ${account.confidenceClass}</div>
          <div>${atrFieldName}: ${account.atrAmount > 0 ? '$' + account.atrAmount.toLocaleString() : 'N/A'}</div>
        `);

        tooltip.transition()
          .duration(200)
          .style('opacity', 1);

        const [mouseX, mouseY] = d3.pointer(event, document.body);
        tooltip.style('left', (mouseX + 10) + 'px')
          .style('top', (mouseY - 10) + 'px');
      }

      function hideTooltip() {
        d3.select('#cluster-tooltip').remove();
      }

      function updateLegend(ringLevels, getColor, groupedData) {
        const legendContainer = document.getElementById('legend-items');
        if (!legendContainer) return;

        legendContainer.innerHTML = ringLevels.map((level) => {
          const color = getColor(level);
          const count = groupedData[level]?.length || 0;
          return `
            <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 4px; justify-content: space-between;">
              <div style="display: flex; align-items: center; gap: 6px;">
                <div style="
                  width: 10px; 
                  height: 10px; 
                  border-radius: 50%; 
                  background: ${color};
                "></div>
                <span style="font-size: 10px;">${level}</span>
              </div>
              <span style="font-size: 9px; color: #666; font-weight: bold;">${count}</span>
            </div>
          `;
        }).join('');
      }

      return {};
    },
  };
}
