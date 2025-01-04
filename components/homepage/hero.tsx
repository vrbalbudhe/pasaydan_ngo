import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import logo from '@/assets/homepage/logo.png';
import hp1 from '@/assets/homepage/hp1.png';
import hp2 from '@/assets/homepage/hp2.png';
import hp3 from '@/assets/homepage/hp3.png';
import hp4 from '@/assets/homepage/hp4.png';
import hp5 from '@/assets/homepage/hp5.png';
import hp6 from '@/assets/homepage/hp6.png';
import hp7 from '@/assets/homepage/hp7.png';
import hp8 from '@/assets/homepage/hp8.jpeg';

const HeroSection: React.FC = () => {
  const images = [hp1, hp2, hp3, hp4, hp5, hp6, hp7, hp8];

  return (
    <div className="w-[90%] min-h-screen bg-white">
      <div className="container mx-auto px-4 py-20 flex flex-col lg:flex-row items-center justify-between">
        {/* Left side - Text and Symbol */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center text-center mb-10 lg:mb-0 max-w-md mx-auto">
          <img
            src={logo.src}
            alt="Pasaydan Logo"
            className="mb-8 w-20 h-20 rounded-full"
          />
          <h2 className="text-6xl font-bold text-blue-500 mb-6">पसायदान</h2>
          <p className="text-xl text-black mb-4">
            जो जे वांछिल, तो ते लाहो। प्राणिजात ॥
          </p>
          <p className="text-lg italic text-black mb-6">~ संत ज्ञानेश्वर महाराज ~</p>
          <p className="text-xl italic text-black mb-10">Giving a helping hand to those in need</p>
          <Button className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 text-lg rounded-md">
            Donate Now
          </Button>
        </div>

        {/* Right side - Image grid */}
        <div className="lg:w-1/2 grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <Card
              key={index}
              className={`w-full h-53 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100 transform ${
                index % 2 === 0 ? 'translate-y-2' : '-translate-y-2'
              }`}
            >
              <img
                src={image.src}
                alt={`Image ${index + 1}`}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;