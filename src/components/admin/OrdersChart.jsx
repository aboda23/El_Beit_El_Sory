import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

export function OrdersChart({ data = [] }) {
  const defaultData = [
    { name: 'Mon', orders: 18, revenue: 1250 },
    { name: 'Tue', orders: 25, revenue: 1680 },
    { name: 'Wed', orders: 22, revenue: 1540 },
    { name: 'Thu', orders: 34, revenue: 2310 },
    { name: 'Fri', orders: 48, revenue: 3420 },
    { name: 'Sat', orders: 42, revenue: 2950 },
    { name: 'Sun', orders: 38, revenue: 2600 },
  ];

  const chartData = data.length > 0 ? data : defaultData;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-bg-card border border-border-dark p-2.5 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-bold text-text-primary">{label}</p>
          <p className="text-accent font-semibold">
            {payload[0].value} Orders
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-48 sm:h-56">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
        >
          <defs>
            <linearGradient id="orderGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F5A623" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#F5A623" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <XAxis
            dataKey="name"
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#262A3B' }}
          />
          <YAxis
            stroke="#64748B"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#262A3B' }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="orders"
            stroke="#F5A623"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#orderGradient)"
            dot={{ r: 4, fill: '#F5A623', strokeWidth: 2, stroke: '#0D0E12' }}
            activeDot={{ r: 6, fill: '#F5A623' }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default OrdersChart;
