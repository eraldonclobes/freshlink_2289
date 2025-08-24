import React from 'react';

const ProductCategoryFilter = ({ categories, activeCategory, onCategoryChange }) => {
  return (
    <div className="bg-card border-b border-border">
      <div className="container mx-auto px-4 py-4">
        <div className="flex space-x-2 overflow-x-auto scrollbar-hide">
          <button
            onClick={() => onCategoryChange('all')}
            className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-200 ${
              activeCategory === 'all' ?'bg-primary text-primary-foreground' :'bg-muted text-muted-foreground hover:bg-muted/80'
            }`}
          >
            Todos
          </button>
          {categories?.map((category) => (
            <button
              key={category?.id}
              onClick={() => onCategoryChange(category?.id)}
              className={`flex-shrink-0 px-4 py-2 rounded-full text-sm font-body font-medium transition-colors duration-200 ${
                activeCategory === category?.id
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground hover:bg-muted/80'
              }`}
            >
              {category?.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductCategoryFilter;