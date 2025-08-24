import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { Checkbox } from '../../components/ui/Checkbox';
import Icon from '../../components/AppIcon';

const ClientAuth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    rememberMe: false,
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!isLogin && !formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (!isLogin && formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!isLogin) {
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Senhas não coincidem';
      }

      if (!formData.termsAccepted) {
        newErrors.termsAccepted = 'Você deve aceitar os termos de uso';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      if (isLogin) {
        // Mock login validation
        if (formData.email === 'cliente@freshlink.com' && formData.password === '123456') {
          localStorage.setItem('clientAuth', JSON.stringify({
            name: 'Cliente Teste',
            email: formData.email,
            loginTime: new Date().toISOString()
          }));
          navigate('/consumer-home-search');
        } else {
          alert(`Credenciais incorretas.\n\nCredenciais de teste:\nEmail: cliente@freshlink.com\nSenha: 123456`);
        }
      } else {
        // Mock registration
        localStorage.setItem('clientAuth', JSON.stringify({
          name: formData.name,
          email: formData.email,
          loginTime: new Date().toISOString()
        }));
        alert('Conta criada com sucesso!');
        navigate('/consumer-home-search');
      }
    } catch (error) {
      alert('Erro ao processar solicitação. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/consumer-home-search');
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      rememberMe: false,
      termsAccepted: false
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Back Button - Mobile */}
            <button
              onClick={handleBackToHome}
              className="md:hidden p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors duration-200"
            >
              <Icon name="ArrowLeft" size={20} />
            </button>

            {/* Logo */}
            <button
              onClick={handleBackToHome}
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity duration-200"
            >
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Icon name="Leaf" size={20} color="white" />
              </div>
              <span className="font-heading font-bold text-xl text-foreground">FreshLink</span>
            </button>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <button
                onClick={handleBackToHome}
                className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Buscar Produtos
              </button>
              <button
                onClick={() => navigate('/vendor-login')}
                className="text-sm font-body font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
              >
                Sou Vendedor
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-md mx-auto">
          <div className="bg-card rounded-lg border border-border p-6 shadow-sm">
            <div className="text-center mb-6">
              <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                {isLogin ? 'Entrar na sua conta' : 'Criar conta'}
              </h1>
              <p className="text-sm font-body text-muted-foreground">
                {isLogin 
                  ? 'Acesse sua conta para uma experiência personalizada'
                  : 'Crie sua conta para salvar favoritos e histórico'
                }
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {!isLogin && (
                <Input
                  label="Nome completo"
                  type="text"
                  placeholder="Seu nome"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  error={errors.name}
                  required
                />
              )}

              <Input
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={formData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                error={errors.email}
                required
              />

              <div className="relative">
                <Input
                  label="Senha"
                  type={showPassword ? "text" : "password"}
                  placeholder={isLogin ? "Digite sua senha" : "Mínimo 6 caracteres"}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  error={errors.password}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                </button>
              </div>

              {!isLogin && (
                <div className="relative">
                  <Input
                    label="Confirmar senha"
                    type={showConfirmPassword ? "text" : "password"}
                    placeholder="Digite a senha novamente"
                    value={formData.confirmPassword}
                    onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                    error={errors.confirmPassword}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-9 text-muted-foreground hover:text-foreground transition-colors duration-200"
                  >
                    <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
                  </button>
                </div>
              )}

              {isLogin ? (
                <div className="flex items-center justify-between">
                  <Checkbox
                    label="Lembrar de mim"
                    checked={formData.rememberMe}
                    onChange={(e) => handleInputChange('rememberMe', e.target.checked)}
                    size="sm"
                  />
                  
                  <button
                    type="button"
                    className="text-sm font-body text-primary hover:text-primary/80 transition-colors duration-200"
                  >
                    Esqueci minha senha
                  </button>
                </div>
              ) : (
                <div className="flex items-start space-x-3 pt-2">
                  <input
                    type="checkbox"
                    id="terms"
                    checked={formData.termsAccepted}
                    onChange={(e) => handleInputChange('termsAccepted', e.target.checked)}
                    className="mt-1 w-4 h-4 text-primary bg-background border-border rounded focus:ring-primary focus:ring-2"
                  />
                  <label htmlFor="terms" className="text-sm font-body text-foreground">
                    Eu aceito os{' '}
                    <button type="button" className="text-primary hover:underline">
                      Termos de Uso
                    </button>
                    {' '}e{' '}
                    <button type="button" className="text-primary hover:underline">
                      Política de Privacidade
                    </button>
                  </label>
                </div>
              )}

              {errors.termsAccepted && (
                <p className="text-error text-sm font-caption">{errors.termsAccepted}</p>
              )}

              <Button
                type="submit"
                variant="default"
                size="lg"
                fullWidth
                loading={isLoading}
                className="mt-6"
              >
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm font-body text-muted-foreground">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{' '}
                <button
                  onClick={toggleMode}
                  className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                >
                  {isLogin ? 'Criar conta' : 'Entrar'}
                </button>
              </p>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-8 bg-muted/50 rounded-lg p-6">
            <h3 className="font-body font-medium text-foreground mb-4 text-center">
              {isLogin ? 'Bem-vindo de volta!' : 'Vantagens de ter uma conta'}
            </h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="Heart" size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  Salve seus vendedores favoritos
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Clock" size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  Histórico de consultas e compras
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Icon name="Bell" size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  Notificações de novos produtos
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ClientAuth;