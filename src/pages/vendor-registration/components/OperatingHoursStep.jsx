import React, { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import Icon from '../../../components/AppIcon';

const OperatingHoursStep = ({ formData, setFormData, onComplete, onBack }) => {
  const [errors, setErrors] = useState({});

  const daysOfWeek = [
    { key: 'monday', label: 'Segunda-feira' },
    { key: 'tuesday', label: 'Terça-feira' },
    { key: 'wednesday', label: 'Quarta-feira' },
    { key: 'thursday', label: 'Quinta-feira' },
    { key: 'friday', label: 'Sexta-feira' },
    { key: 'saturday', label: 'Sábado' },
    { key: 'sunday', label: 'Domingo' }
  ];

  const validateStep = () => {
    const newErrors = {};
    const operatingHours = formData?.operatingHours || {};

    // Check if at least one day is selected
    const hasSelectedDays = daysOfWeek.some(day => operatingHours[day.key]?.isOpen);
    
    if (!hasSelectedDays) {
      newErrors.general = 'Selecione pelo menos um dia de funcionamento';
    }

    // Validate hours for selected days
    daysOfWeek.forEach(day => {
      const dayData = operatingHours[day.key];
      if (dayData?.isOpen) {
        if (!dayData.openTime) {
          newErrors[`${day.key}_open`] = 'Horário de abertura é obrigatório';
        }
        if (!dayData.closeTime) {
          newErrors[`${day.key}_close`] = 'Horário de fechamento é obrigatório';
        }
        if (dayData.openTime && dayData.closeTime && dayData.openTime >= dayData.closeTime) {
          newErrors[`${day.key}_time`] = 'Horário de abertura deve ser anterior ao fechamento';
        }
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep()) {
      onComplete();
    }
  };

  const handleDayToggle = (dayKey, isOpen) => {
    const updatedHours = {
      ...formData?.operatingHours,
      [dayKey]: {
        ...formData?.operatingHours?.[dayKey],
        isOpen,
        openTime: isOpen ? formData?.operatingHours?.[dayKey]?.openTime || '08:00' : '',
        closeTime: isOpen ? formData?.operatingHours?.[dayKey]?.closeTime || '18:00' : ''
      }
    };

    setFormData(prev => ({
      ...prev,
      operatingHours: updatedHours
    }));

    if (errors?.general) {
      setErrors(prev => ({ ...prev, general: '' }));
    }
  };

  const handleTimeChange = (dayKey, timeType, value) => {
    const updatedHours = {
      ...formData?.operatingHours,
      [dayKey]: {
        ...formData?.operatingHours?.[dayKey],
        [timeType]: value
      }
    };

    setFormData(prev => ({
      ...prev,
      operatingHours: updatedHours
    }));

    if (errors?.[`${dayKey}_${timeType === 'openTime' ? 'open' : 'close'}`]) {
      setErrors(prev => ({ 
        ...prev, 
        [`${dayKey}_${timeType === 'openTime' ? 'open' : 'close'}`]: '' 
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Horários de Funcionamento
        </h2>
        <p className="text-muted-foreground font-body">
          Defina quando seus produtos estarão disponíveis
        </p>
      </div>

      {errors?.general && (
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-sm text-destructive">{errors?.general}</p>
        </div>
      )}

      <div className="space-y-4">
        {daysOfWeek.map((day) => {
          const dayData = formData?.operatingHours?.[day.key] || {};
          const isOpen = dayData?.isOpen || false;

          return (
            <div key={day.key} className="border border-border rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <Checkbox
                    id={day.key}
                    checked={isOpen}
                    onCheckedChange={(checked) => handleDayToggle(day.key, checked)}
                  />
                  <Label htmlFor={day.key} className="font-medium">
                    {day.label}
                  </Label>
                </div>
                {!isOpen && (
                  <span className="text-sm text-muted-foreground">Fechado</span>
                )}
              </div>

              {isOpen && (
                <div className="grid grid-cols-2 gap-4 ml-6">
                  <div className="space-y-2">
                    <Label htmlFor={`${day.key}-open`}>Abertura</Label>
                    <Input
                      id={`${day.key}-open`}
                      type="time"
                      value={dayData?.openTime || ''}
                      onChange={(e) => handleTimeChange(day.key, 'openTime', e.target.value)}
                    />
                    {errors?.[`${day.key}_open`] && (
                      <p className="text-sm text-destructive">{errors?.[`${day.key}_open`]}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor={`${day.key}-close`}>Fechamento</Label>
                    <Input
                      id={`${day.key}-close`}
                      type="time"
                      value={dayData?.closeTime || ''}
                      onChange={(e) => handleTimeChange(day.key, 'closeTime', e.target.value)}
                    />
                    {errors?.[`${day.key}_close`] && (
                      <p className="text-sm text-destructive">{errors?.[`${day.key}_close`]}</p>
                    )}
                  </div>
                  {errors?.[`${day.key}_time`] && (
                    <div className="col-span-2">
                      <p className="text-sm text-destructive">{errors?.[`${day.key}_time`]}</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex gap-4 pt-6">
        <Button
          variant="outline"
          onClick={onBack}
          className="flex-1"
        >
          <Icon name="ArrowLeft" size={16} className="mr-2" />
          Voltar
        </Button>
        <Button
          onClick={handleNext}
          className="flex-1"
        >
          Finalizar Cadastro
          <Icon name="Check" size={16} className="ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default OperatingHoursStep;