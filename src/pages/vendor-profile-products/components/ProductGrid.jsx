import React from 'react';
import ProductCard from '../../../components/ui/ProductCard';
import Icon from '../../../components/AppIcon';

const ProductGrid = ({ products, vendor, onProductInquiry, onProductClick, onFavoriteToggle, favoriteProducts = [] }) => {
    if (products?.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-16 text-center">
                <Icon name="Package" size={48} className="text-muted-foreground mb-4" />
                <h3 className="text-lg font-heading font-semibold text-foreground mb-2">
                    Nenhum produto encontrado
                </h3>
                <p className="text-muted-foreground font-body">
                    Não há produtos disponíveis nesta categoria no momento.
                </p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-6">
            {products?.map((product) => (
                <ProductCard
                    key={product?.id}
                    product={product}
                    vendor={vendor}
                    onProductClick={onProductClick}
                    onFavoriteToggle={onFavoriteToggle}
                    isFavorited={favoriteProducts.includes(product?.id)}
                />
            ))}
        </div>
    );
};

export default ProductGrid;