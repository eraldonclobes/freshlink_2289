import React from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const VendorHeroSection = ({ vendor, onWhatsAppContact, onDirections, onShare }) => {
    const [isDescriptionExpanded, setIsDescriptionExpanded] = React.useState(false);

    const toggleDescription = () => {
        setIsDescriptionExpanded(!isDescriptionExpanded);
    };
    const renderStars = (rating) => {
        const stars = [];
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;

        for (let i = 0; i < fullStars; i++) {
            stars.push(
                <Icon key={i} name="Star" size={14} className="text-yellow-400 fill-current" />
            );
        }

        if (hasHalfStar) {
            stars.push(
                <Icon key="half" name="StarHalf" size={14} className="text-yellow-400 fill-current" />
            );
        }

        const emptyStars = 5 - Math.ceil(rating);
        for (let i = 0; i < emptyStars; i++) {
            stars.push(
                <Icon key={`empty-${i}`} name="Star" size={14} className="text-gray-300" />
            );
        }

        return stars;
    };

    return (
        <div className="relative w-full">
            {/* Banner Grande */}
            <div className="h-64 md:h-80 bg-gradient-to-r from-orange-200 via-pink-200 to-purple-300 relative overflow-hidden">
                {vendor?.bannerImage && (
                    <Image
                        src={vendor.bannerImage}
                        alt={`${vendor.name} banner`}
                        className="w-full h-full object-cover opacity-80"
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Container Principal - Layout com Botões no Topo Direito */}
            <div className="relative -mt-16 px-4 md:px-6 pb-8">
                <div className="container mx-auto">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-8">

                        {/* Coluna Esquerda - Avatar, Nome, Descrição, Info */}
                        <div className="flex flex-col items-start flex-1">

                            {/* Avatar */}
                            <div className="relative mb-6">
                                <Image
                                    src={vendor?.image}
                                    alt={vendor?.name}
                                    className="w-24 h-24 md:w-28 md:h-28 rounded-full border-4 border-white shadow-lg object-cover bg-white"
                                />
                                {vendor?.isVerified && (
                                    <div className="absolute -bottom-1 -right-1 bg-green-500 rounded-full p-1.5">
                                        <Icon name="CheckCircle" size={16} color="white" />
                                    </div>
                                )}
                            </div>

                            {/* Nome com Botões na mesma linha */}
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between w-full mb-4">
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 lg:mb-0">
                                    {vendor?.name}
                                </h1>

                                {/* Botões de Ação - Na altura do nome */}
                                <div className="flex gap-3">
                                    <Button
                                        variant="default"
                                        size="sm"
                                        iconName="MessageCircle"
                                        onClick={onWhatsAppContact}
                                        className="bg-success hover:bg-success/90 flex-1 py-5"
                                    >
                                        WhatsApp
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        iconName="Share"
                                        onClick={onShare}
                                        className="text-muted-foreground border hover:bg-muted hover:text-foreground hover:border-primary/30 flex-1 py-5"
                                    >
                                        Compartilhar
                                    </Button>
                                </div>
                            </div>

                            {/* Descrição com Ler Mais */}
                            <div className="mb-4 max-w-2xl">
                                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                                    {isDescriptionExpanded
                                        ? vendor?.description || vendor?.story
                                        : (vendor?.description || vendor?.story)?.substring(0, 120) + '...'
                                    }
                                </p>
                                {(vendor?.description || vendor?.story)?.length > 120 && (
                                    <button
                                        onClick={toggleDescription}
                                        className="text-blue-600 hover:text-blue-700 text-sm font-medium mt-1 transition-colors"
                                    >
                                        {isDescriptionExpanded ? 'Ver menos' : 'Ler mais'}
                                    </button>
                                )}
                            </div>

                            {/* Informações em linha */}
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-2 mt-6">
                                {/* Social Links */}
                                <div className="flex items-center gap-2">
                                    <button className="text-blue-500 hover:text-blue-600 transition-colors">
                                        <Icon name="Facebook" size={16} />
                                    </button>
                                    <button className="text-pink-500 hover:text-pink-600 transition-colors">
                                        <Icon name="Instagram" size={16} />
                                    </button>
                                </div>

                                {/* Localização */}
                                <div className="flex items-center gap-1">
                                    <Icon name="MapPin" size={14} className="text-gray-500" />
                                    <span>{vendor?.location}</span>
                                </div>

                                {/* Produtos */}
                                <div className="flex items-center gap-1">
                                    <Icon name="Package" size={14} className="text-gray-500" />
                                    <span>{vendor?.productCount} produtos</span>
                                </div>

                                {/* Rating */}
                                <div className="flex items-center gap-2">
                                    <div className="flex items-center gap-1">
                                        {renderStars(vendor?.rating)}
                                    </div>
                                    <span className="font-medium text-gray-900">
                                        {vendor?.rating?.toFixed(1)}
                                    </span>
                                    <span className="text-gray-500">
                                        ({vendor?.reviewCount})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VendorHeroSection;