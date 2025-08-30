import React, { useState } from 'react';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/Button';
import { Checkbox } from '../../../components/ui/checkbox';
import { Label } from '../../../components/ui/label';
import Icon from '../../../components/AppIcon';

const AccountStep = ({ formData, setFormData, onNext }) => {
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateStep = () => {
    const newErrors = {};

    if (!formData?.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/?.test(formData?.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData?.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData?.password?.length < 8) {
      newErrors.password = 'Senha deve ter pelo menos 8 caracteres';
    }

    if (!formData?.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData?.password !== formData?.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData?.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos de uso';
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

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-heading font-bold text-foreground mb-2">
          Criar sua conta
        </h2>
        <p className="text-muted-foreground font-body">
          Comece vendendo seus produtos frescos online
        </p>
      </div>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={formData?.email || ''}
            onChange={(e) => handleInputChange('email', e?.target?.value)}
            required
          />
          {errors?.email && (
            <p className="text-sm text-destructive">{errors?.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Senha</Label>
          <div className="relative">
            <Input
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Digite sua senha"
              value={formData?.password || ''}
              onChange={(e) => handleInputChange('password', e?.target?.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          </div>
          {errors?.password && (
            <p className="text-sm text-destructive">{errors?.password}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">Confirmar senha</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Digite a senha novamente"
              value={formData?.confirmPassword || ''}
              onChange={(e) => handleInputChange('confirmPassword', e?.target?.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
            >
              <Icon name={showConfirmPassword ? 'EyeOff' : 'Eye'} size={18} />
            </button>
          </div>
          {errors?.confirmPassword && (
            <p className="text-sm text-destructive">{errors?.confirmPassword}</p>
          )}
        </div>

        <div className="flex items-start space-x-2 pt-2">
          <Checkbox
            id="terms"
            checked={formData?.termsAccepted || false}
            onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
          />
          <Label htmlFor="terms" className="text-sm leading-5">
            Eu aceito os{' '}
            <button type="button" className="text-primary hover:underline">
              Termos de Uso
            </button>
            {' '}e{' '}
            <button type="button" className="text-primary hover:underline">
              Política de Privacidade
            </button>
          </Label>
        </div>
        {errors?.termsAccepted && (
          <p className="text-destructive text-sm">{errors?.termsAccepted}</p>
        )}
      </div>
      <Button
        onClick={handleNext}
        size="lg"
        className="w-full mt-8"
      >
        Continuar <Icon name="ArrowRight" size={16} className="ml-2" />
      </Button>
    </div>
  );
};

export default AccountStep;