import React, { useState, useEffect } from 'react';
import { Input } from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import { Label } from '../../../components/ui/label';
import Icon from '../../../components/AppIcon';


const LocationStep = ({ formData, setFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const validateStep = () => {
    const newErrors = {};

    if (!formData?.address) {
      newErrors.address = 'Endereço é obrigatório';
    }

    if (!formData?.city) {
      newErrors.city = 'Cidade é obrigatória';
    }

    if (!formData?.state) {
      newErrors.state = 'Estado é obrigatório';
    }

    if (!formData?.zipCode) {
      newErrors.zipCode = 'CEP é obrigatório';
    } else if (!/^\d{5}-?\d{3}$/?.test(formData?.zipCode)) {
      newErrors.zipCode = 'CEP inválido. Use formato 12345-678';
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onNext();
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors?.[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const formatZipCode = (value) => {
    const numbers = value?.replace(/\D/g, '');
    if (numbers?.length <= 8) {
      return numbers?.replace(/(\d{5})(\d{3})/, '$1-$2');
    }
    return value;
  };

  const handleZipCodeChange = (e) => {
    const formatted = formatZipCode(e?.target?.value);
    handleInputChange('zipCode', formatted);
  };

  const getCurrentLocation = () => {
    setIsLoadingLocation(true);
    
    if (navigator.geolocation) {
      navigator.geolocation?.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position?.coords;
          // Mock address based on coordinates
          setFormData(prev => ({
            ...prev,
            address: 'Rua das Flores, 123',
            city: 'São Paulo',
            state: 'SP',
            zipCode: '01234-567',
            latitude,
            longitude
          }));
          setIsLoadingLocation(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setIsLoadingLocation(false);
        }
      );
    } else {
      setIsLoadingLocation(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Localização
        </h2>
        <p className="text-muted-foreground font-body">
          Onde os clientes podem encontrar você
        </p>
      </div>
      <div className="space-y-4">
        <div className="flex gap-3">
          <div className="flex-1 space-y-2">
            <Label htmlFor="zipcode">CEP</Label>
            <Input
              id="zipcode"
              type="text"
              placeholder="12345-678"
              value={formData?.zipCode || ''}
              onChange={handleZipCodeChange}
              required
            />
            {errors?.zipCode && (
              <p className="text-sm text-destructive">{errors?.zipCode}</p>
            )}
          </div>
          <Button
            onClick={getCurrentLocation}
            variant="outline"
            size="default"
            disabled={isLoadingLocation}
            className="mt-8"
          >
            {isLoadingLocation ? (
              <Icon name="Loader2" size={16} className="animate-spin" />
            ) : (
              <Icon name="MapPin" size={16} />
            )}
          </Button>
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Endereço completo</Label>
          <Input
            id="address"
            type="text"
            placeholder="Rua, número, complemento"
            value={formData?.address || ''}
            onChange={(e) => handleInputChange('address', e?.target?.value)}
            required
          />
          {errors?.address && (
            <p className="text-sm text-destructive">{errors?.address}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Input
              id="city"
              type="text"
              placeholder="São Paulo"
              value={formData?.city || ''}
              onChange={(e) => handleInputChange('city', e?.target?.value)}
              required
            />
            {errors?.city && (
              <p className="text-sm text-destructive">{errors?.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Input
              id="state"
              type="text"
              placeholder="SP"
              value={formData?.state || ''}
              onChange={(e) => handleInputChange('state', e?.target?.value)}
              required
            />
            {errors?.state && (
              <p className="text-sm text-destructive">{errors?.state}</p>
            )}
          </div>
        </div>

        {/* Map Preview */}
        <div className="mt-6">
          <Label>Localização no mapa</Label>
          <div className="w-full h-48 bg-muted rounded-lg border border-border overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              loading="lazy"
              title="Localização do negócio"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.google.com/maps?q=${formData?.latitude || -23.5505}&lng=${formData?.longitude || -46.6333}&z=14&output=embed`}
              className="border-0"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Esta localização será mostrada aos clientes para facilitar o contato
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          onClick={onBack}
          variant="outline"
          size="lg"
          className="flex-1"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          size="lg"
          className="flex-1"
        >
          Continuar
          <Icon name="ArrowRight" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LocationStep;