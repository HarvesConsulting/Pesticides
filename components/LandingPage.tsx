import React from 'react';

const topProducts = {
  fungicides: ['Зорвек Інкантія', 'Ридоміл Голд Р', 'Сігнум', 'Квадріс', 'Медян Екстра'],
  insecticides: ['Кораген', 'Белт', 'Радіант', 'Проклейм', 'Мовенто'],
  herbicides: ['Челендж', 'Зенкор Ліквід', 'Стомп Аква', 'Гезагард', 'Акваті'],
};

const FungicideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3" /></svg>
);
const InsecticideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M9 10a3 3 0 0 1 6 0" /><path d="M12 13v8" /><path d="M8 9v-4a4 4 0 1 1 8 0v4" /><path d="M5 13h14" /><path d="M8 19h8" /></svg>
);
const HerbicideIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="w-7 h-7 mr-3" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M5 21c.5 -4.5 2.5 -8 7 -10" /><path d="M9 18c6.218 0 10.5 -3.288 11 -12v-2h-4.014" /><path d="M3 3l18 18" /></svg>
);

interface ProductCardProps {
    title: string;
    products: string[];
    color: 'blue' | 'red' | 'orange';
    icon: React.ReactNode;
}

const cardConfig: Record<string, ProductCardProps> = {
    fungicides: {
        title: "ТОП 5 Фунгіциди",
        products: topProducts.fungicides,
        color: "blue",
        icon: <FungicideIcon />,
    },
    insecticides: {
        title: "ТОП 5 Інсектициди",
        products: topProducts.insecticides,
        color: "red",
        icon: <InsecticideIcon />,
    },
    herbicides: {
        title: "ТОП 5 Гербіциди",
        products: topProducts.herbicides,
        color: "orange",
        icon: <HerbicideIcon />,
    },
};

const ProductCard: React.FC<ProductCardProps> = ({ title, products, color, icon }) => {
  const syngentaProducts = new Set([
    'Ридоміл Голд Р',
    'Квадріс',
    'Проклейм',
    'Фюзілад Форте',
    'Гезагард',
    'Акваті'
  ]);
  const syngentaUrl = 'https://store.syngenta.ua/?utm_source=syngenta_ua&utm_medium=banner&utm_campaign=internet_magazin';

  const handleFindPrice = (productName: string) => {
    const url = syngentaProducts.has(productName)
      ? syngentaUrl
      : `https://www.google.com/search?q=${encodeURIComponent(productName + ' ціна в Україні')}`;
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const colorClasses = {
      blue: {
          border: "border-blue-500",
          text: "text-blue-600",
          buttonBg: "bg-blue-50 hover:bg-blue-100",
          buttonText: "text-blue-700",
      },
      red: {
          border: "border-red-500",
          text: "text-red-600",
          buttonBg: "bg-red-50 hover:bg-red-100",
          buttonText: "text-red-700",
      },
      orange: {
          border: "border-orange-500",
          text: "text-orange-600",
          buttonBg: "bg-orange-50 hover:bg-orange-100",
          buttonText: "text-orange-700",
      },
  };
  
  const currentColors = colorClasses[color];

  return (
    <div className={`bg-white rounded-xl shadow-lg flex flex-col h-full border-t-4 ${currentColors.border} transition-transform duration-300 hover:scale-105 hover:shadow-2xl`}>
        <div className="p-6">
            <h3 className={`text-2xl font-bold flex items-center justify-center ${currentColors.text}`}>
                {icon}
                {title}
            </h3>
        </div>
        <ul className="px-6 pb-4 flex-grow">
            {products.map((product, index) => (
            <li key={index} className="flex justify-between items-center py-4 border-b border-gray-100 last:border-b-0">
                <div className="flex items-center">
                    <span className={`font-bold text-lg w-6 mr-3 ${currentColors.text}`}>{index + 1}.</span>
                    <span className="text-gray-800 font-semibold text-base">{product}</span>
                </div>
                <button
                    onClick={() => handleFindPrice(product)}
                    className={`text-sm font-semibold px-3 py-1.5 rounded-md transition-colors flex-shrink-0 ${currentColors.buttonBg} ${currentColors.buttonText}`}
                >
                Знайти ціну
                </button>
            </li>
            ))}
        </ul>
    </div>
  );
};

const LandingPage: React.FC = () => {
  return (
    <div className="container mx-auto px-4 animate-fade-in">
      <div className="pt-8 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <ProductCard {...cardConfig.fungicides} />
          <ProductCard {...cardConfig.insecticides} />
          <div className="md:col-span-2 lg:col-span-1">
              <ProductCard {...cardConfig.herbicides} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;