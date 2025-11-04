import React from 'react';

const FungicideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
    </svg>
);

const InsecticideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
);

const HerbicideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
    </svg>
);

import { NewProductIcon } from './icons/NewProductIcon';

interface ProductCardProps {
    title: string;
    products: { name: string, url?: string }[];
    bgColor: string;
    textColor: string;
    icon: React.ReactNode;
}

const ProductCard: React.FC<ProductCardProps> = ({ title, products, bgColor, textColor, icon }) => {

    const handleFindPrice = (product: { name: string, url?: string }) => {
        if (product.url) {
            window.open(product.url, '_blank', 'noopener,noreferrer');
        } else {
            const query = encodeURIComponent(`${product.name} ціна`);
            window.open(`https://www.google.com/search?q=${query}`, '_blank', 'noopener,noreferrer');
        }
    };

    return (
        <div className={`${bgColor} p-6 rounded-lg shadow-lg`}>
            <div className="flex items-center mb-4">
                {icon}
                <h2 className={`text-2xl font-bold ${textColor}`}>{title}</h2>
            </div>
            <ul className="space-y-3">
                {products.map((product) => (
                    <li key={product.name} className="flex justify-between items-center bg-white/50 p-3 rounded-md">
                        <span className={`font-semibold ${textColor}`}>{product.name}</span>
                        <button 
                            onClick={() => handleFindPrice(product)}
                            className="text-sm font-medium bg-white text-gray-700 px-3 py-1 rounded-full hover:bg-gray-100 transition-colors shadow-sm">
                            Знайти ціну
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

const LandingPage: React.FC = () => {
  const topFungicides = [
    { name: 'Зорвек Інкантія' },
    { name: 'Ридоміл Голд Р' },
    { name: 'Сігнум' },
    { name: 'Квадріс' },
    { name: 'Медян Екстра' },
  ];

  const topInsecticides = [
    { name: 'Белт' },
    { name: 'Радіант' },
    { name: 'Проклейм' },
    { name: 'Мовенто' },
    { name: 'Кораген' },
  ];

  const topHerbicides = [
    { name: 'Зенкор' },
    { name: 'Танос' },
    { name: 'Дуал Голд' },
    { name: 'Лонтрел Гранд' },
    { name: 'Гезагард' },
  ];

  const topNewProducts = [
    { name: 'Камбаліо® Смарт', url: 'https://www.cropscience.bayer.ua/Products/Fungicides/KambalioSmart' },
    { name: 'Акваті', url: 'https://www.syngenta.ua/akvati-800-ec-ke-novynka-vid-synhenta' },
    { name: 'Ріджбек', url: 'https://www.corteva.com.ua/products-and-solutions/crop-protection/ridgeback.html' },
    { name: 'Вантакор', url: 'https://fmc.com.ua/products/insekticidi/vantakor/' },
    { name: 'Міравіс® Нео', url: 'https://www.syngenta.ua/sites/g/files/kgtney1466/files/media/document/2023/12/22/%D0%BA%D0%B0%D1%82%D0%B0%D0%BB%D0%BE%D0%B3_%D0%BD%D0%BE%D0%B2%D0%B8%D0%BD%D0%BE%D0%BA_%D0%BA.pdf' },
  ];

  return (
    <div className="animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProductCard title="ТОП 5 Фунгіцидів" products={topFungicides} bgColor="bg-blue-50" textColor="text-blue-900" icon={<FungicideIcon />} />
            <ProductCard title="ТОП 5 Інсектицидів" products={topInsecticides} bgColor="bg-red-50" textColor="text-red-900" icon={<InsecticideIcon />} />
            <ProductCard title="ТОП 5 Гербіцидів" products={topHerbicides} bgColor="bg-yellow-50" textColor="text-yellow-900" icon={<HerbicideIcon />} />
            <ProductCard title="ТОП 5 Новинок" products={topNewProducts} bgColor="bg-purple-50" textColor="text-purple-900" icon={<NewProductIcon />} />
        </div>
    </div>
  );
};

export default LandingPage;