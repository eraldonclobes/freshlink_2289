import React, { useState, useEffect } from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '../../../components/ui/carousel';
import { Card, CardContent } from '../../../components/ui/card';
import { Button } from '../../../components/ui/button';
import { Badge } from '../../../components/ui/badge';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';

const HeroCarousel = ({ className = '' }) => {
    const [api, setApi] = useState();
    const [current, setCurrent] = useState(0);
    const [count, setCount] = useState(0);

    const slides = [
        {
            id: 1,
            image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=1200&h=400&fit=crop",
            title: "Produtos Frescos Direto da Fazenda",
            subtitle: "Conecte-se com produtores locais e tenha acesso aos melhores produtos da região",
            cta: "Explorar Produtos",
            ctaAction: () => console.log('Navigate to products')
        },
        {
            id: 2,
            image: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?w=1200&h=400&fit=crop",
            title: "Apoie Produtores Locais",
            subtitle: "Cada compra fortalece a economia local e garante produtos mais frescos para você",
            cta: "Conhecer Vendedores",
            ctaAction: () => console.log('Navigate to vendors')
        },
        {
            id: 3,
            image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=1200&h=400&fit=crop",
            title: "Orgânicos Certificados",
            subtitle: "Encontre produtos orgânicos certificados com garantia de qualidade e procedência",
            cta: "Ver Orgânicos",
            ctaAction: () => console.log('Navigate to organic products')
        }
    ];

    useEffect(() => {
        if (!api) {
            return;
        }

        setCount(api.scrollSnapList().length);
        setCurrent(api.selectedScrollSnap() + 1);

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap() + 1);
        });

        // Auto-play functionality
        const interval = setInterval(() => {
            if (api.canScrollNext()) {
                api.scrollNext();
            } else {
                api.scrollTo(0);
            }
        }, 5000);

        return () => clearInterval(interval);
    }, [api]);

    return (
        <div className={`relative ${className}`}>
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{
                    align: "start",
                    loop: true,
                }}
            >
                <CarouselContent>
                    {slides.map((slide) => (
                        <CarouselItem key={slide.id}>
                            <Card className="border-0 shadow-lg overflow-hidden rounded-2xl">
                                <CardContent className="p-0">
                                    <div className="relative h-72 md:h-96">
                                        <Image
                                            src={slide.image}
                                            alt={slide.title}
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/30 to-transparent" />

                                        <div className="absolute inset-0 flex items-center">
                                            <div className="container mx-auto px-8">
                                                <div className="max-w-xl text-white">
                                                    <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4 leading-tight">
                                                        {slide.title}
                                                    </h2>
                                                    <p className="text-base md:text-lg font-body mb-8 opacity-95 leading-relaxed">
                                                        {slide.subtitle}
                                                    </p>
                                                    <Button
                                                        onClick={slide.ctaAction}
                                                        size="lg"
                                                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 rounded-xl font-body font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                                                    >
                                                        {slide.cta}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                <CarouselPrevious className="left-6 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 hover:text-white w-12 h-12" />
                <CarouselNext className="right-6 bg-white/20 backdrop-blur-md text-white border-white/30 hover:bg-white/30 hover:text-white w-12 h-12" />
            </Carousel>

            {/* Dots Indicator */}
            <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2">
                {Array.from({ length: count }).map((_, index) => (
                    <button
                        key={index}
                        onClick={() => api?.scrollTo(index)}
                        className={`w-2 h-2 rounded-full transition-all duration-300 ${
                            index + 1 === current ? 'bg-white scale-125' : 'bg-white/60 hover:bg-white/80'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;