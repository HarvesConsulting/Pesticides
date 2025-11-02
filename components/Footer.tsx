
import React from 'react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-100 mt-12 py-8">
      <div className="container mx-auto px-4 text-center text-gray-600">
        <p className="font-semibold mb-2">Примітка:</p>
        <p className="text-sm">
          Більш детальну інформацію шукайте на офіційних сайтах компаній виробників препаратів та у регіональних представників в Україні. 
          Більшість компаній рекомендують перед широким застосуванням препарату чи схеми захисту провести тестування на невеликих об'ємах.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
