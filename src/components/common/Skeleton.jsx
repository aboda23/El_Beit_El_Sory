import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse bg-bg-card border border-border-dark/60 rounded-xl ${className}`}
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="bg-bg-card border border-border-dark rounded-2xl p-3 flex flex-col justify-between">
      <div className="w-full aspect-square rounded-xl bg-bg-secondary animate-pulse mb-3" />
      <div className="h-4 bg-bg-secondary rounded w-3/4 animate-pulse mb-2" />
      <div className="h-3 bg-bg-secondary rounded w-1/2 animate-pulse mb-3" />
      <div className="flex items-center justify-between pt-1">
        <div className="h-5 bg-bg-secondary rounded w-16 animate-pulse" />
        <div className="w-8 h-8 rounded-full bg-bg-secondary animate-pulse" />
      </div>
    </div>
  );
}

export default Skeleton;
