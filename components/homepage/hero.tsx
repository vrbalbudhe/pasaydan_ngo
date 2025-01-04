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
  return (
    <div className="w-full min-h-screen bg-white pt-2">
      {/* Center Text Content */}
      <div className="container mx-auto px-4 text-center mb-16">
      <div className="flex justify-center mb-2">
      <img
            src={logo.src}
            alt="Pasaydan Logo"
            className="mb-2 w-17 h-16 rounded-full"
          />
          </div>
        <h1 className="text-6xl italic font-bold mb-2 text-blue-900">
        पसायदान
        </h1>
        <h2 className="text-2xl italic font-bold mb-3">
        जो जे वांछिल, तो ते लाहो। प्राणिजात ॥
        </h2>
        <p className="max-w-2xl mx-auto italic text-lg mb-3">
        ~ संत ज्ञानेश्वर महाराज ~
        </p>
        <Button className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2 rounded-full text-lg">
          Donate now
        </Button>
      </div>

      {/* Card Grid */}
      <div className="container mx-auto px-10 py-0 relative">
        <div className="grid grid-cols-5 gap-5 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="col-span-1 space-y-4 -mt-55">
            <Card className="rounded-3xl overflow-hidden relative aspect-square ">
              <img src={hp1.src} alt="Child smiling" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold">Be the reason a child smiles</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-800 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-lg">A small donation can be great help</p>
              </div>
            </Card>
          </div>

          {/* Middle-Left Column */}
          <div className="col-span-1 pt-12">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp1.src} alt="Teacher" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <div className="text-white">
                  <p className="text-lg">Helping those in need</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Column */}
          <div className="col-span-1">
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-200 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold mb-4">Join 1000 people building a better tomorrow.</h3>
              <Button className="bg-blue-950 text-white rounded-full">Join Community</Button>
            </Card>
          </div>

          {/* Middle-Right Column */}
          <div className="col-span-1 pt-12">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp3.src} alt="Students" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold">Inspire change, Inspire education</h3>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6">
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-900 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-3xl">Make a difference in someone's life</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square">
              <img src={hp4.src} alt="Learning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-xl font-semibold">Give the gift of learning</h3>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;



{/*import React from 'react';
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

export default HeroSection;*/}