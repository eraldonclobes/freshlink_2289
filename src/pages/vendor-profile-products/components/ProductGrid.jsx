import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const ProductGrid = ({ products, onProductInquiry }) => {
  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    })?.format(price);
  };

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
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
      {products?.map((product) => (
        <div
          key={product?.id}
          className="bg-card border border-border rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-200"
        >
          {/* Product Image */}
          <div className="relative aspect-square bg-muted">
            <Image
              src={product?.image}
              alt={product?.name}
              className="w-full h-full object-cover"
            />
            {!product?.available && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <span className="text-white text-sm font-body font-medium">
                  Indisponível
                </span>
              </div>
            )}
            {product?.isOrganic && (
              <div className="absolute top-2 left-2 bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-caption font-medium">
                Orgânico
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="p-3 lg:p-4">
            <h3 className="font-body font-medium text-foreground mb-1 line-clamp-2">
              {product?.name}
            </h3>
            <p className="text-xs lg:text-sm text-muted-foreground mb-2 line-clamp-1">
              {product?.unit}
            </p>
            
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg font-heading font-bold text-foreground">
                {formatPrice(product?.price)}
              </span>
              {product?.available && (
                <div className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-success rounded-full"></div>
                  <span className="text-xs font-caption text-success">Disponível</span>
                </div>
              )}
            </div>

            {/* Action Button */}
            <Button
              variant={product?.available ? "outline" : "secondary"}
              size="sm"
              iconName="MessageCircle"
              iconPosition="left"
              fullWidth
              disabled={!product?.available}
              onClick={() => onProductInquiry(product)}
            >
              {product?.available ? 'Perguntar' : 'Indisponível'}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProductGrid;