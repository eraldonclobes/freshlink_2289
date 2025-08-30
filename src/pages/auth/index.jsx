import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Checkbox } from '../../components/ui/checkbox';
import { Label } from '../../components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import Icon from '../../components/AppIcon';
import ResponsiveHeader from '../../components/ui/ResponsiveHeader';
import Footer from '../../components/ui/Footer';

const Auth = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState('login');
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Login fields
    email: '',
    password: '',
    rememberMe: false,
    
    // Register fields
    name: '',
    confirmPassword: '',
    termsAccepted: false
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab === 'register') {
      setActiveTab('register');
    }
  }, [searchParams]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateLogin = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateRegister = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório';
    }

    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }

    if (!formData.password) {
      newErrors.password = 'Senha é obrigatória';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Senha deve ter pelo menos 6 caracteres';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Senhas não coincidem';
    }

    if (!formData.termsAccepted) {
      newErrors.termsAccepted = 'Você deve aceitar os termos de uso';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!validateLogin()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock credentials
      const clientCredentials = { email: 'cliente@freshlink.com', password: '123456' };
      const vendorCredentials = { email: 'vendedor@freshlink.com', password: '123456' };
      
      if (formData.email === clientCredentials.email && formData.password === clientCredentials.password) {
        localStorage.setItem('clientAuth', JSON.stringify({
          name: 'Cliente Teste',
          email: formData.email,
          loginTime: new Date().toISOString(),
          type: 'client'
        }));
        navigate('/consumer-home-search');
      } else if (formData.email === vendorCredentials.email && formData.password === vendorCredentials.password) {
        localStorage.setItem('vendorAuth', JSON.stringify({
          businessName: 'Fazenda Teste',
          email: formData.email,
          loginTime: new Date().toISOString(),
          type: 'vendor'
        }));
        navigate('/vendor-dashboard');
      } else {
        alert(`Credenciais incorretas.\n\nCredenciais de teste:\nCliente: ${clientCredentials.email} / ${clientCredentials.password}\nVendedor: ${vendorCredentials.email} / ${vendorCredentials.password}`);
      }
    } catch (error) {
      alert('Erro ao fazer login. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    if (!validateRegister()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      localStorage.setItem('clientAuth', JSON.stringify({
        name: formData.name,
        email: formData.email,
        loginTime: new Date().toISOString(),
        type: 'client'
      }));
      alert('Conta criada com sucesso!');
      navigate('/consumer-home-search');
    } catch (error) {
      alert('Erro ao criar conta. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background pt-16 flex flex-col">
      <ResponsiveHeader />
      
      <main className="container mx-auto px-4 py-8 flex-1">
        <div className="max-w-md mx-auto">
          <Card className="auth-form">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="login">Entrar</TabsTrigger>
                  <TabsTrigger value="register">Cadastrar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login" className="space-y-4">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Entrar na sua conta
                    </h1>
                    <p className="text-sm font-body text-muted-foreground">
                      Acesse sua conta para uma experiência personalizada
                    </p>
                  </div>

                  <form onSubmit={handleLogin} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Digite sua senha"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="remember"
                          checked={formData.rememberMe}
                          onCheckedChange={(checked) => handleInputChange('rememberMe', checked)}
                        />
                        <Label htmlFor="remember" className="text-sm">Lembrar de mim</Label>
                      </div>
                      
                      <button
                        type="button"
                        className="text-sm font-body text-primary hover:text-primary/80 transition-colors duration-200"
                      >
                        Esqueci minha senha
                      </button>
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Entrando...' : 'Entrar'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm font-body text-muted-foreground">
                      Quer vender seus produtos?{' '}
                      <button
                        onClick={() => navigate('/vendor-registration')}
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                      >
                        Cadastre-se como vendedor
                      </button>
                    </p>
                  </div>
                </TabsContent>

                <TabsContent value="register" className="space-y-4">
                  <div className="text-center mb-6">
                    <h1 className="text-2xl font-heading font-bold text-foreground mb-2">
                      Criar conta de cliente
                    </h1>
                    <p className="text-sm font-body text-muted-foreground">
                      Crie sua conta para encontrar produtos frescos
                    </p>
                  </div>

                  <form onSubmit={handleRegister} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome completo</Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Seu nome"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        required
                      />
                      {errors.name && (
                        <p className="text-sm text-destructive">{errors.name}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-email">Email</Label>
                      <Input
                        id="register-email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                      {errors.email && (
                        <p className="text-sm text-destructive">{errors.email}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="register-password">Senha</Label>
                      <div className="relative">
                        <Input
                          id="register-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Mínimo 6 caracteres"
                          value={formData.password}
                          onChange={(e) => handleInputChange('password', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          <Icon name={showPassword ? "EyeOff" : "Eye"} size={18} />
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmar senha</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Digite a senha novamente"
                          value={formData.confirmPassword}
                          onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                          required
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors duration-200"
                        >
                          <Icon name={showConfirmPassword ? "EyeOff" : "Eye"} size={18} />
                        </button>
                      </div>
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>

                    <div className="flex items-start space-x-2 pt-2">
                      <Checkbox
                        id="terms"
                        checked={formData.termsAccepted}
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

                    {errors.termsAccepted && (
                      <p className="text-destructive text-sm">{errors.termsAccepted}</p>
                    )}

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full mt-6"
                      disabled={isLoading}
                    >
                      {isLoading ? 'Criando conta...' : 'Criar Conta'}
                    </Button>
                  </form>

                  <div className="mt-6 text-center">
                    <p className="text-sm font-body text-muted-foreground">
                      Quer vender seus produtos?{' '}
                      <button
                        onClick={() => navigate('/vendor-registration')}
                        className="text-primary hover:text-primary/80 font-medium transition-colors duration-200"
                      >
                        Cadastre-se como vendedor
                      </button>
                    </p>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Benefits Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="text-center text-lg">
                {activeTab === 'login' ? 'Bem-vindo de volta!' : 'Vantagens de ter uma conta'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center space-x-3">
                <Icon name="Heart" size={16} className="text-primary flex-shrink-0" />
                <span className="text-sm font-body text-muted-foreground">
                  Salve seus vendedores e produtos favoritos
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
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Auth;