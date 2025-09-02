import React from 'react';
import { Vega } from 'react-vega';

interface ChartProps {
  spec: string;
}

export const Chart: React.FC<ChartProps> = ({ spec }) => {
  try {
    const parsedSpec = JSON.parse(spec);
    return (
      <div className="my-4 p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800/50 flex justify-center overflow-x-auto">
        <Vega spec={parsedSpec} actions={false} />
      </div>
    );
  } catch (error) {
    console.error("Failed to parse Vega-Lite spec:", error);
    return (
      <div className="my-4 p-4 border border-red-200 dark:border-red-500/30 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
        <p>Could not render the chart due to an error in the data.</p>
      </div>
    );
  }
};
