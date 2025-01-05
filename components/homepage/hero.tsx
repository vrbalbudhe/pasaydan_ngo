import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import logo from '@/assets/homepage/logo.png';
import hp1 from '@/assets/homepage/hp1.png';
import hp3 from '@/assets/homepage/hp3.png';
import hp4 from '@/assets/homepage/hp4.png';
import hp2 from '@/assets/homepage/hp2.png';

const HeroSection: React.FC = () => {
  return (
    <div className="w-full min-h-screen bg-white">
      {/* Center Text Content */}
      <div className="container mx-auto px-4 text-center mb-16">
        <div className="flex justify-center mb-2">
          <img
            src={logo.src}
            alt="Pasaydan Logo"
            className="mb-2 w-17 h-16 rounded-full"
          />
        </div>
        <h1 className="text-6xl italic font-bold mb-2 text-blue-900">पसायदान</h1>
        <h2 className="text-2xl italic font-bold mb-3">जो जे वांछिल, तो ते लाहो। प्राणिजात ॥</h2>
        <p className="max-w-2xl mx-auto italic text-lg mb-3">~ संत ज्ञानेश्वर महाराज ~</p>
        <Button className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2 rounded-full text-lg">
          Donate now
        </Button>

        {/* Card Grid */}

        <div className="grid grid-cols-5 gap-5 max-w-7xl mx-auto">
          {/* Left Column */}
          <div className="col-span-1 space-y-4 -mt-[130]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square">
              <img src={hp2.src} alt="Child smiling" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded">Be the reason a child smiles</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-400 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-lg">A small donation can be great help</p>
              </div>
            </Card>
          </div>

          {/* Middle-Left Column */}
          <div className="col-span-1 pt-[45]">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp1.src} alt="Teacher" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <div className="text-white bg-gray-900 bg-opacity-60 px-2 py-1 rounded">
                  <p className="text-lg">Helping those in need</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Center Column */}
          <div className="col-span-1 pt-[120]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-200 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold mb-4">Join 1000 people building a better tomorrow.</h3>
              <Button className="bg-blue-950 text-white rounded-full">Join Our Drives</Button>
            </Card>
          </div>

          {/* Middle-Right Column */}
          <div className="col-span-1 pt-[45]">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp3.src} alt="Students" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded">Inspire change, Inspire education</h3>
              </div>
            </Card>
          </div>

          {/* Right Column */}
          <div className="col-span-1 space-y-6 -mt-[135]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square">
              <img src={hp4.src} alt="Learning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded">Give the gift of learning</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-800 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-3xl">Make a difference in someone's life</h3>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
