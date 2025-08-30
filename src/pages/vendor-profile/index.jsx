import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';
import VendorHeroSection from '../vendor-profile-products/components/VendorHeroSection';
import ShareModal from '../../components/ui/ShareModal';
import Icon from '../../components/AppIcon';

const VendorProfile = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showShareModal, setShowShareModal] = useState(false);

  const vendorId = location.state?.vendorId || 1;

  // Mock vendor data
  const mockVendor = {
    id: 1,
    name: "Fazenda Verde Orgânicos",
    image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop",
    bannerImage: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&h=400&fit=crop",
    location: "São Paulo, SP",
    distance: "0.8km",
    phone: "11999999999",
    rating: 4.8,
    reviewCount: 156,
    productCount: 45,
    isVerified: true,
    description: "Somos uma fazenda familiar dedicada ao cultivo de produtos orgânicos há mais de 20 anos. Nossa missão é fornecer alimentos frescos, saudáveis e sustentáveis para nossa comunidade local.",
    story: "Nossa história começou em 1995, quando decidimos transformar nossa pequena propriedade rural em uma fazenda orgânica. Hoje, cultivamos mais de 30 variedades de frutas e vegetais sem o uso de pesticidas ou fertilizantes químicos.",
    categories: ["Orgânicos", "Frutas", "Verduras", "Legumes"],
    operatingHours: {
      monday: { isOpen: true, openTime: "07:00", closeTime: "17:00" },
      tuesday: { isOpen: true, openTime: "07:00", closeTime: "17:00" },
      wednesday: { isOpen: true, openTime: "07:00", closeTime: "17:00" },
      thursday: { isOpen: true, openTime: "07:00", closeTime: "17:00" },
      friday: { isOpen: true, openTime: "07:00", closeTime: "17:00" },
      saturday: { isOpen: true, openTime: "08:00", closeTime: "16:00" },
      sunday: { isOpen: false, openTime: "", closeTime: "" }
    }
  };

  useEffect(() => {
    const loadVendor = async () => {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setVendor(mockVendor);
      setLoading(false);
    };

    loadVendor();
  }, [vendorId]);

  const handleWhatsAppContact = () => {
    const message = encodeURIComponent(`Olá ${vendor?.name}! Vi seu perfil no FreshLink e gostaria de conhecer seus produtos.`);
    const whatsappUrl = `https://wa.me/55${vendor?.phone}?text=${message}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDirections = () => {
    const query = encodeURIComponent(vendor?.location);
    window.open(`https://www.google.com/maps/search/${query}`, '_blank');
  };

  const handleShare = () => {
    setShowShareModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ResponsiveHeader />
        <main className="pt-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando perfil do vendedor...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!vendor) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <ResponsiveHeader />
        <main className="pt-16 flex-1 flex items-center justify-center">
          <div className="text-center">
            <Icon name="AlertCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-heading font-semibold text-foreground mb-2">
              Vendedor não encontrado
            </h2>
            <p className="text-muted-foreground mb-6">
              O perfil que você está procurando não existe ou foi removido.
            </p>
            <button
              onClick={() => navigate('/')}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-lg hover:bg-primary/90 transition-colors duration-200"
            >
              Voltar ao início
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{vendor.name} - FreshLink</title>
        <meta name="description" content={vendor.description} />
      </Helmet>

      <div className="min-h-screen bg-background flex flex-col">
        <ResponsiveHeader />
        
        <main className="pt-16 flex-1">
          <VendorHeroSection
            vendor={vendor}
            onWhatsAppContact={handleWhatsAppContact}
            onDirections={handleDirections}
            onShare={handleShare}
          />
        </main>

        <ShareModal
          isOpen={showShareModal}
          onClose={() => setShowShareModal(false)}
          vendor={vendor}
        />

        <Footer />
      </div>
    </>
  );
};

export default VendorProfile;