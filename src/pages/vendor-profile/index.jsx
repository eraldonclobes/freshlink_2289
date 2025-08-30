import React, { useState, useEffect } from 'react';
import VendorSidebarNavigation from '../../components/ui/VendorSidebarNavigation';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Select from '../../components/ui/Select';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';
import Image from '../../components/AppImage';

const VendorProfile = () => {
  const [activeTab, setActiveTab] = useState('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    // Basic Info
    businessName: 'Fazenda Orgânica São José',
    email: 'vendedor@freshlink.com',
    phone: '(11) 99999-9999',
    whatsappNumber: '(11) 99999-9999',
    businessType: 'organic_producer',
    description: 'Há mais de 20 anos cultivamos alimentos orgânicos com muito carinho e dedicação.',
    
    // Location
    address: 'Rua das Flores, 123',
    city: 'São Paulo',
    state: 'SP',
    zipCode: '01234-567',
    
    // Operating Hours
    operatingHours: {
      monday: { isOpen: true, openTime: '06:00', closeTime: '18:00' },
      tuesday: { isOpen: true, openTime: '06:00', closeTime: '18:00' },
      wednesday: { isOpen: true, openTime: '06:00', closeTime: '18:00' },
      thursday: { isOpen: true, openTime: '06:00', closeTime: '18:00' },
      friday: { isOpen: true, openTime: '06:00', closeTime: '18:00' },
      saturday: { isOpen: true, openTime: '06:00', closeTime: '16:00' },
      sunday: { isOpen: false, openTime: '', closeTime: '' }
    },
    
    // Business Settings
    deliveryAvailable: true,
    deliveryRadius: '5',
    deliveryFee: '8.00',
    pickupAvailable: true,
    paymentMethods: ['cash', 'pix', 'card'],
    
    // Profile Image
    profileImage: 'https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=400&h=300&fit=crop'
  });

  const businessTypes = [
    { value: 'farmer', label: 'Produtor Rural' },
    { value: 'market_vendor', label: 'Vendedor de Feira' },
    { value: 'organic_producer', label: 'Produtor Orgânico' },
    { value: 'cooperative', label: 'Cooperativa' },
    { value: 'small_business', label: 'Pequeno Negócio' },
    { value: 'other', label: 'Outro' }
  ];

  const daysOfWeek = [
    { id: 'monday', label: 'Segunda-feira' },
    { id: 'tuesday', label: 'Terça-feira' },
    { id: 'wednesday', label: 'Quarta-feira' },
    { id: 'thursday', label: 'Quinta-feira' },
    { id: 'friday', label: 'Sexta-feira' },
    { id: 'saturday', label: 'Sábado' },
    { id: 'sunday', label: 'Domingo' }
  ];

  const timeOptions = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      timeOptions.push({ value: time, label: time });
    }
  }

  const tabs = [
    { id: 'basic', label: 'Informações Básicas', icon: 'User' },
    { id: 'location', label: 'Localização', icon: 'MapPin' },
    { id: 'hours', label: 'Horários', icon: 'Clock' },
    { id: 'business', label: 'Configurações', icon: 'Settings' }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOperatingHoursChange = (day, field, value) => {
    setProfileData(prev => ({
      ...prev,
      operatingHours: {
        ...prev.operatingHours,
        [day]: {
          ...prev.operatingHours[day],
          [field]: value
        }
      }
    }));
  };

  const handlePaymentMethodChange = (method, checked) => {
    setProfileData(prev => ({
      ...prev,
      paymentMethods: checked 
        ? [...prev.paymentMethods, method]
        : prev.paymentMethods.filter(m => m !== method)
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsEditing(false);
      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      alert('Erro ao salvar perfil. Tente novamente.');
    } finally {
      setIsSaving(false);
    }
  };

  const formatPrice = (value) => {
    const numericValue = value.replace(/\D/g, '');
    const formattedValue = (parseInt(numericValue) / 100).toFixed(2);
    return formattedValue.replace('.', ',');
  };

  const renderBasicInfo = () => (
    <div className="space-y-6">
      {/* Profile Image */}
      <div className="flex items-center space-x-6">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden bg-muted">
            <Image
              src={profileData.profileImage}
              alt="Foto do perfil"
              className="w-full h-full object-cover"
            />
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center">
              <Icon name="Camera" size={16} />
            </button>
          )}
        </div>
        <div>
          <h3 className="font-body font-medium text-foreground mb-1">Foto do Perfil</h3>
          <p className="text-sm text-muted-foreground">
            Uma boa foto ajuda os clientes a conhecer seu negócio
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="business-name">Nome do Negócio</Label>
          <Input
            id="business-name"
            value={profileData.businessName}
            onChange={(e) => handleInputChange('businessName', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={profileData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            value={profileData.phone}
            onChange={(e) => handleInputChange('phone', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="whatsapp">WhatsApp</Label>
          <Input
            id="whatsapp"
            value={profileData.whatsappNumber}
            onChange={(e) => handleInputChange('whatsappNumber', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="business-type">Tipo de Negócio</Label>
        <Select value={profileData.businessType} onValueChange={(value) => handleInputChange('businessType', value)} disabled={!isEditing}>
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tipo" />
          </SelectTrigger>
          <SelectContent>
            {businessTypes.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="description">Descrição do Negócio</Label>
        <Textarea
          id="description"
          value={profileData.description}
          onChange={(e) => handleInputChange('description', e.target.value)}
          disabled={!isEditing}
          rows={4}
        />
      </div>
    </div>
  );

  const renderLocation = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2 space-y-2">
          <Label htmlFor="address">Endereço Completo</Label>
          <Input
            id="address"
            value={profileData.address}
            onChange={(e) => handleInputChange('address', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="city">Cidade</Label>
          <Input
            id="city"
            value={profileData.city}
            onChange={(e) => handleInputChange('city', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">Estado</Label>
          <Input
            id="state"
            value={profileData.state}
            onChange={(e) => handleInputChange('state', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="zipcode">CEP</Label>
          <Input
            id="zipcode"
            value={profileData.zipCode}
            onChange={(e) => handleInputChange('zipCode', e.target.value)}
            disabled={!isEditing}
            required
          />
        </div>
      </div>

      {/* Map Preview */}
      <div>
        <Label>Localização no Mapa</Label>
        <div className="w-full h-64 bg-muted rounded-lg border border-border overflow-hidden">
          <iframe
            width="100%"
            height="100%"
            loading="lazy"
            title="Localização do negócio"
            referrerPolicy="no-referrer-when-downgrade"
            src="https://www.google.com/maps?q=-23.5505,-46.6333&z=14&output=embed"
            className="border-0"
          />
        </div>
      </div>
    </div>
  );

  const renderOperatingHours = () => (
    <div className="space-y-6">
      {daysOfWeek.map(day => {
        const dayData = profileData.operatingHours[day.id] || {};
        const isOpen = dayData.isOpen || false;

        return (
          <Card key={day.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <Switch
                    id={day.id}
                    checked={isOpen}
                    onCheckedChange={(checked) => handleOperatingHoursChange(day.id, 'isOpen', checked)}
                    disabled={!isEditing}
                  />
                  <Label htmlFor={day.id}>{day.label}</Label>
                </div>
                {isOpen && (
                  <div className="flex items-center space-x-2 text-sm text-success">
                    <Icon name="Clock" size={16} />
                    <span>Aberto</span>
                  </div>
                )}
              </div>
              {isOpen && (
                <div className="flex items-center space-x-2 text-sm font-caption text-success">
                  <Icon name="Clock" size={16} />
                  <span>Aberto</span>
                </div>
              )}
            </div>

            {isOpen && (
              <div className="grid grid-cols-2 gap-3 mt-3">
                <Select
                  label="Abertura"
                  options={timeOptions}
                  value={dayData.openTime || ''}
                  onChange={(value) => handleOperatingHoursChange(day.id, 'openTime', value)}
                  disabled={!isEditing}
                  searchable
                />
                <Select
                  label="Fechamento"
                  options={timeOptions}
                  value={dayData.closeTime || ''}
                  onChange={(value) => handleOperatingHoursChange(day.id, 'closeTime', value)}
                  disabled={!isEditing}
                  searchable
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      {/* Delivery Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Entrega</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Switch
              id="delivery"
              checked={profileData.deliveryAvailable}
              onCheckedChange={(checked) => handleInputChange('deliveryAvailable', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="delivery">Ofereço entrega</Label>
          </div>

          {profileData.deliveryAvailable && (
            <div className="grid grid-cols-2 gap-4 ml-6">
              <div className="space-y-2">
                <Label htmlFor="delivery-radius">Raio de Entrega (km)</Label>
                <Input
                  id="delivery-radius"
                  type="number"
                  value={profileData.deliveryRadius}
                  onChange={(e) => handleInputChange('deliveryRadius', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="delivery-fee">Taxa de Entrega (R$)</Label>
                <Input
                  id="delivery-fee"
                  value={profileData.deliveryFee}
                  onChange={(e) => handleInputChange('deliveryFee', formatPrice(e.target.value))}
                  disabled={!isEditing}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pickup Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Retirada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="pickup"
              checked={profileData.pickupAvailable}
              onCheckedChange={(checked) => handleInputChange('pickupAvailable', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="pickup">Permito retirada no local</Label>
          </div>
        </CardContent>
      </Card>

      {/* Payment Methods */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Formas de Pagamento</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="cash"
              checked={profileData.paymentMethods.includes('cash')}
              onCheckedChange={(checked) => handlePaymentMethodChange('cash', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="cash">Dinheiro</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="pix"
              checked={profileData.paymentMethods.includes('pix')}
              onCheckedChange={(checked) => handlePaymentMethodChange('pix', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="pix">PIX</Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="card"
              checked={profileData.paymentMethods.includes('card')}
              onCheckedChange={(checked) => handlePaymentMethodChange('card', checked)}
              disabled={!isEditing}
            />
            <Label htmlFor="card">Cartão</Label>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'basic':
        return renderBasicInfo();
      case 'location':
        return renderLocation();
      case 'hours':
        return renderOperatingHours();
      case 'business':
        return renderBusinessSettings();
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <VendorSidebarNavigation />
      
      <div className="md:ml-64 pt-16 md:pt-0">
        <div className="container mx-auto px-4 py-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="font-heading font-bold text-2xl text-foreground">
                Meu Perfil
              </h1>
              <p className="text-muted-foreground mt-1">
                Gerencie as informações do seu negócio
              </p>
            </div>
            
            <div className="flex items-center space-x-3">
              {isEditing ? (
                <>
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                    disabled={isSaving}
                  >
              {isOpen && (
                <div className="grid grid-cols-2 gap-3 mt-3">
                  <div className="space-y-2">
                    <Label>Abertura</Label>
                    <Select 
                      value={dayData.openTime || ''} 
                      onValueChange={(value) => handleOperatingHoursChange(day.id, 'openTime', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Fechamento</Label>
                    <Select 
                      value={dayData.closeTime || ''} 
                      onValueChange={(value) => handleOperatingHoursChange(day.id, 'closeTime', value)}
                      disabled={!isEditing}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeOptions.map((time) => (
                          <SelectItem key={time.value} value={time.value}>
                            {time.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Tab Navigation */}
          <div className="bg-card border border-border rounded-lg overflow-hidden mb-6">
            <div className="flex overflow-x-auto scrollbar-hide">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-6 py-4 text-sm font-body font-medium whitespace-nowrap border-b-2 transition-colors duration-200 ${
                    activeTab === tab.id
                      ? 'text-primary border-primary bg-primary/5'
                      : 'text-muted-foreground border-transparent hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab.icon} size={16} />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="bg-card border border-border rounded-lg p-6">
            {renderTabContent()}
          </div>

          {/* Mobile Bottom Padding */}
          <div className="h-20 md:hidden" />
        </div>
      </div>
    </div>
  );
};

export default VendorProfile;