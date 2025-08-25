import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../AppIcon';
import Image from '../AppImage';
import Button from './Button';

const ProductModal = ({ product, vendor, isOpen, onClose }) => {
  const navigate = useNavigate();
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imageRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !product) return null;

  const images = Array.isArray(product.images) ? product.images : [product.image];

  const handleMouseMove = (e) => {
    if (!isZoomed || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    setZoomPosition({ x, y });
  };

  const handleVendorClick = () => {
    navigate('/vendor-profile-products', { state: { vendorId: vendor?.id } });
    onClose();
  };

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Olá! Tenho interesse no produto: ${product.name}. Está disponível?`);
    const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Confira este produto: ${product.name}`,
        url: window.location.href
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Link copiado!');
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Icon key={i} name="Star" size={16} className="text-warning fill-current" />
      );
    }

    if (hasHalfStar) {
      stars.push(
        <Icon key="half" name="StarHalf" size={16} className="text-warning fill-current" />
      );
    }

    const emptyStars = 5 - Math.ceil(rating);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Icon key={`empty-${i}`} name="Star" size={16} className="text-muted-foreground" />
      );
    }

    return stars;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-2xl shadow-modal max-w-6xl w-full max-h-[90vh] overflow-hidden animate-fade-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h2 className="text-xl font-heading font-bold text-foreground">
            Detalhes do Produto
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-muted hover:bg-muted/80 flex items-center justify-center transition-colors duration-200"
          >
            <Icon name="X" size={20} />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Image Section */}
          <div className="lg:w-1/2 p-6">
            {/* Main Image */}
            <div 
              className="relative aspect-square bg-muted rounded-xl overflow-hidden mb-4 cursor-zoom-in"
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsZoomed(true)}
              onMouseLeave={() => setIsZoomed(false)}
            >
              <Image
                ref={imageRef}
                src={images[currentImageIndex]}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-300 ${
                  isZoomed ? 'scale-150' : 'scale-100'
                }`}
                style={
                  isZoomed
                    ? {
                        transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                      }
                    : {}
                }
              />
              
              {!product.available && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <span className="text-white font-body font-medium">Indisponível</span>
                </div>
              )}

              {product.isOrganic && (
                <div className="absolute top-4 left-4 bg-success text-success-foreground px-3 py-1 rounded-full text-sm font-caption font-medium">
                  Orgânico
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {images.length > 1 && (
              <div className="flex space-x-3 overflow-x-auto scrollbar-hide">
                {images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                      index === currentImageIndex
                        ? 'border-primary shadow-lg'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="lg:w-1/2 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-heading font-bold text-foreground mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  {product.rating && (
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-1">
                        {renderStars(product.rating)}
                      </div>
                      <span className="text-sm font-body font-medium text-foreground">
                        {product.rating.toFixed(1)}
                      </span>
                      {product.reviewCount && (
                        <span className="text-sm text-muted-foreground">
                          ({product.reviewCount} avaliações)
                        </span>
                      )}
                    </div>
                  )}
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>Categoria: <span className="font-medium text-foreground">{product.category || 'Não informado'}</span></span>
                    <span className={`font-medium ${product.available ? 'text-success' : 'text-error'}`}>
                      {product.available ? 'Disponível' : 'Indisponível'}
                    </span>
                    {product.isOrganic && (
                      <span className="text-success font-medium">Orgânico</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="text-4xl font-heading font-bold text-primary">
                    {formatPrice(product.price)}
                  </div>
                  <div className="text-lg text-muted-foreground">
                    por {product.unit}
                  </div>
                </div>

                {product.description && (
                  <p className="text-muted-foreground leading-relaxed mb-6">
                    {product.description}
                  </p>
                )}
              </div>

              {/* Vendor Info */}
              <div className="bg-muted/50 rounded-xl p-4">
                <h3 className="font-body font-semibold text-foreground mb-3">
                  Vendedor
                </h3>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-muted">
                    <Image
                      src={vendor?.image || 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=100&h=100&fit=crop'}
                      alt={vendor?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <button
                      onClick={handleVendorClick}
                      className="font-body font-medium text-foreground hover:text-primary transition-colors duration-200"
                    >
                      {vendor?.name}
                    </button>
                    <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                      <Icon name="MapPin" size={14} />
                      <span>{vendor?.location}</span>
                      {vendor?.distance && (
                        <>
                          <span>•</span>
                          <span>{vendor.distance}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleVendorClick}
                  >
                    Ver Perfil
                  </Button>
                </div>
              </div>

              {/* Product Details */}
              {product.stock && (
                <div className="space-y-3">
                  <h3 className="font-body font-semibold text-foreground">
                    Informações Adicionais
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">Estoque:</span>
                      <span className="ml-2 font-medium text-foreground">
                        {product.stock} unidades
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  variant="default"
                  size="lg"
                  iconName="MessageCircle"
                  iconPosition="left"
                  onClick={handleWhatsAppContact}
                  disabled={!product.available}
                  className="flex-1 bg-success hover:bg-success/90"
                >
                  Entrar em Contato
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  iconName="Share"
                  iconPosition="left"
                  onClick={handleShare}
                >
                  Compartilhar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;