import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { useDashboard } from "../../hooks/useDashboard";

export const GraficoEstadisticas = () => {

  const { ventasPorMes } = useDashboard();
  
  return (
    <div className="chart-card">
      <h5>Ventas por mes</h5>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={ventasPorMes}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="mes" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="total"
            stroke="#0d6efd"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};
