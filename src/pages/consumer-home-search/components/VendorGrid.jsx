import React from 'react';
import VendorCard from './VendorCard';

const VendorGrid = ({ vendors, loading, className = '' }) => {
  const SkeletonCard = () => (
    <div className="bg-card border border-border rounded-lg overflow-hidden animate-pulse">
      <div className="h-48 bg-muted" />
      <div className="p-4 space-y-3">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="flex space-x-1">
          {[...Array(5)]?.map((_, i) => (
            <div key={i} className="w-3 h-3 bg-muted rounded" />
          ))}
        </div>
        <div className="flex space-x-1">
          {[...Array(3)]?.map((_, i) => (
            <div key={i} className="h-6 bg-muted rounded-full w-16" />
          ))}
        </div>
        <div className="h-3 bg-muted rounded w-2/3" />
        <div className="flex space-x-2">
          <div className="h-8 bg-muted rounded flex-1" />
          <div className="h-8 bg-muted rounded w-20" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
        {[...Array(8)]?.map((_, index) => (
          <SkeletonCard key={index} />
        ))}
      </div>
    );
  }

  if (vendors?.length === 0) {
    return (
      <div className={`flex flex-col items-center justify-center py-16 ${className}`}>
        <div className="w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
          <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <h3 className="font-heading font-semibold text-lg text-foreground mb-2">
          Nenhum vendedor encontrado
        </h3>
        <p className="text-sm font-body text-muted-foreground text-center max-w-md">
          Não encontramos vendedores na sua região. Tente ajustar os filtros ou expandir a área de busca.
        </p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 ${className}`}>
      {vendors?.map((vendor) => (
        <VendorCard key={vendor?.id} vendor={vendor} />
      ))}
    </div>
  );
};

export default VendorGrid;