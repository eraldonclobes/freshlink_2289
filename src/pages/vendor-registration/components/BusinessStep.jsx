import React, { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/Button';
import { Label } from '../../../components/ui/label';
import { Textarea } from '../../../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../components/ui/select';
import Icon from '../../../components/AppIcon';

const BusinessStep = ({ formData, setFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const businessTypes = [
    { value: 'farmer', label: 'Produtor Rural' },
    { value: 'market_vendor', label: 'Vendedor de Feira' },
    { value: 'organic_producer', label: 'Produtor Orgânico' },
    { value: 'cooperative', label: 'Cooperativa' },
    { value: 'small_business', label: 'Pequeno Negócio' },
    { value: 'other', label: 'Outro' }
  ];

  const validateStep = () => {
    const newErrors = {};

    if (!formData?.businessName) {
      newErrors.businessName = 'Nome do negócio é obrigatório';
    }

    if (!formData?.businessType) {
      newErrors.businessType = 'Tipo de negócio é obrigatório';
    }

    if (!formData?.whatsappNumber) {
      newErrors.whatsappNumber = 'WhatsApp é obrigatório';
    } else if (!/^\(\d{2}\)\s\d{4,5}-\d{4}$/?.test(formData?.whatsappNumber)) {
      newErrors.whatsappNumber = 'Formato inválido. Use (11) 99999-9999';
    }

    if (!formData?.businessDescription) {
      newErrors.businessDescription = 'Descrição é obrigatória';
    } else if (formData?.businessDescription?.length < 50) {
      newErrors.businessDescription = 'Descrição deve ter pelo menos 50 caracteres';
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

  const formatWhatsApp = (value) => {
    const numbers = value?.replace(/\D/g, '');
    if (numbers?.length <= 11) {
      return numbers?.replace(/(\d{2})(\d{4,5})(\d{4})/, '($1) $2-$3');
    }
    return value;
  };

  const handleWhatsAppChange = (e) => {
    const formatted = formatWhatsApp(e?.target?.value);
    handleInputChange('whatsappNumber', formatted);
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Informações do negócio
        </h2>
        <p className="text-muted-foreground font-body">
          Conte-nos sobre seu negócio e produtos
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="business-name">Nome do negócio</Label>
          <Input
            id="business-name"
            type="text"
            placeholder="Ex: Fazenda São João"
            value={formData?.businessName || ''}
            onChange={(e) => handleInputChange('businessName', e?.target?.value)}
            required
          />
          {errors?.businessName && (
            <p className="text-sm text-destructive">{errors?.businessName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="business-type">Tipo de negócio</Label>
          <Select value={formData?.businessType || ''} onValueChange={(value) => handleInputChange('businessType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo do seu negócio" />
            </SelectTrigger>
            <SelectContent>
              {businessTypes.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors?.businessType && (
            <p className="text-sm text-destructive">{errors?.businessType}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp para contato</Label>
          <Input
            id="whatsapp"
            type="tel"
            placeholder="(11) 99999-9999"
            value={formData?.whatsappNumber || ''}
            onChange={handleWhatsAppChange}
            required
          />
          <p className="text-sm text-muted-foreground">
            Clientes entrarão em contato através deste número
          </p>
          {errors?.whatsappNumber && (
            <p className="text-sm text-destructive">{errors?.whatsappNumber}</p>
          )}
        </div>

        <div>
          <Label htmlFor="description">Descrição do negócio</Label>
          <Textarea
            id="description"
            placeholder="Descreva seus produtos, experiência e diferenciais. Mínimo 50 caracteres."
            value={formData?.businessDescription || ''}
            onChange={(e) => handleInputChange('businessDescription', e?.target?.value)}
            rows={4}
          />
          <div className="flex justify-between items-center mt-1">
            {errors?.businessDescription && (
              <p className="text-destructive text-sm">{errors?.businessDescription}</p>
            )}
            <p className="text-xs text-muted-foreground ml-auto">
              {(formData?.businessDescription || '')?.length}/500
            </p>
          </div>
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

export default BusinessStep;