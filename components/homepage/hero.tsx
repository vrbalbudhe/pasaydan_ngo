"use client";
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowDown, Heart } from 'lucide-react';
import logo from '@/assets/homepage/logo.png';
import hp1 from '@/assets/homepage/hp1.png';
import hp2 from '@/assets/homepage/hp2.png';
import hp3 from '@/assets/homepage/hp3.png';
import hp4 from '@/assets/homepage/hp4.png';

interface CardWithImageProps {
  imageSrc: string;
  imageAlt: string;
  title: string;
  className?: string;
  titleClassName?: string;
}

const CardWithImage: React.FC<CardWithImageProps> = ({ 
  imageSrc, 
  imageAlt, 
  title, 
  className = "aspect-square",
  titleClassName = "text-2xl"
}) => {
  const [isHovered, setIsHovered] = React.useState(false);

  const cardAnimation = {
    initial: { scale: 1 },
    hover: { 
      scale: 1.03,
      transition: { duration: 0.3 }
    }
  };

  const textAnimation = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 10 }
  };

  return (
    <motion.div 
      className={`rounded-3xl overflow-hidden relative ${className}`}
      initial="initial"
      whileHover="hover"
      variants={cardAnimation}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <Card className="h-full p-0 border-0">
        <img 
          src={imageSrc} 
          alt={imageAlt} 
          className="w-full h-full object-cover"
        />
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              className="absolute inset-0 bg-black bg-opacity-40 p-6 flex items-end"
              initial="initial"
              animate="animate"
              exit="exit"
              variants={textAnimation}
            >
              <h3 className={`text-white ${titleClassName} font-semibold px-2 py-1 rounded italic`}>
                {title}
              </h3>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </motion.div>
  );
};

const TextCard: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = "" }) => {
  const cardAnimation = {
    initial: { scale: 1, y: 0 },
    hover: { 
      scale: 1.03,
      y: -5,
      transition: { duration: 0.3 }
    }
  };

  return (
    <Card className={`rounded-3xl overflow-hidden relative aspect-square ${className}`}>
      <motion.div 
        className="h-full p-6"
        initial="initial"
        whileHover="hover"
        variants={cardAnimation}
      >
        {children}
      </motion.div>
    </Card>
  );
};

const HeroSection: React.FC = () => {
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const floatingAnimation = {
    initial: { y: 0 },
    animate: {
      y: [-10, 0, -10],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen bg-gradient-to-b from-white to-blue-50">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-48 sm:w-72 md:w-96 h-48 sm:h-72 md:h-96 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-2 sm:px-4 text-center mb-8 sm:mb-16">
        {/* Header Section */}
        <motion.div 
          className="text-center mb-12"
          initial="hidden"
          animate="visible"
          variants={fadeIn}
          transition={{ duration: 0.6 }}
        >
          {/* ... Header content remains the same ... */}
          <div className="flex justify-center mb-2">
            <motion.img
              src={logo.src}
              alt="Pasaydan Logo"
              className="mb-2 w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full"
              whileHover={{ scale: 1.1 }}
              transition={{ type: "spring", stiffness: 300 }}
            />
          </div>
          
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl italic font-bold mb-2 text-blue-900"
            variants={fadeIn}
          >
            पसायदान
          </motion.h1>
          
          <motion.h2 
            className="text-lg sm:text-xl md:text-2xl italic font-bold mb-3"
            variants={fadeIn}
          >
            जो जे वांछिल, तो ते लाहो। प्राणिजात ॥
          </motion.h2>
          
          <motion.p 
            className="max-w-2xl mx-auto italic text-lg mb-3"
            variants={fadeIn}
          >
            ~ संत ज्ञानेश्वर महाराज ~
          </motion.p>
          
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button 
              className="bg-blue-950 hover:bg-blue-900 text-white px-8 py-2 rounded-full text-lg"
            >
              <Heart className="mr-2 h-5 w-5" />
              Donate now
            </Button>
          </motion.div>
        </motion.div>

        {/* Card Grid */}
        <div className="grid grid-cols-5 gap-2 sm:gap-3 md:gap-4 lg:gap-5 max-w-7xl mx-auto px-1 sm:px-2 md:px-4">
          {/* Left Column */}
          <motion.div 
            className="col-span-1 space-y-2 sm:space-y-3 md:space-y-4 -mt-[65px] sm:-mt-[90px] md:-mt-[110px] lg:-mt-[130px]"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
          >
            <CardWithImage 
              imageSrc={hp2.src}
              imageAlt="Child smiling"
              title="Be the reason someone smiles"
            />
            <TextCard className="bg-blue-500">
              <div className="h-full flex flex-col justify-center items-center text-center text-white">
                <p className="text-2xl italic bold">
                  The world changes when we care. And that change begins with YOU!
                </p>
              </div>
            </TextCard>
          </motion.div>

          {/* Middle-Left Column */}
          <motion.div 
            className="col-span-1 pt-[22px] sm:pt-[30px] md:pt-[38px] lg:pt-[45px]"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.3 }}
          >
            <CardWithImage 
              imageSrc={hp1.src}
              imageAlt="Teacher"
              title="Inspire change, Inspire education"
              className="aspect-[3/4]"
            />
          </motion.div>

          {/* Center Column */}
          <motion.div 
            className="col-span-1 pt-[60px] sm:pt-[80px] md:pt-[100px] lg:pt-[120px]"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
          >
            <TextCard className="bg-blue-300">
              <div className="h-full flex flex-col items-center justify-center text-center">
                <h3 className="text-xl font-semibold mb-4">
                  Join 1000 people building a better tomorrow.
                </h3>
                <Button className="bg-blue-950 text-white rounded-full">
                  Join Our Drives
                </Button>
              </div>
            </TextCard>
          </motion.div>

          {/* Middle-Right Column */}
          <motion.div 
            className="col-span-1 lg:pt-[45px]"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.5 }}
          >
            <CardWithImage 
              imageSrc={hp3.src}
              imageAlt="Students"
              title="Give Hope, Give Life"
              className="aspect-[3/4]"
            />
          </motion.div>

          {/* Right Column */}
          <motion.div 
            className="col-span-1 space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6 -mt-[67px] sm:-mt-[90px] md:-mt-[115px] lg:-mt-[135px]"
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
          >
            <CardWithImage 
              imageSrc={hp4.src}
              imageAlt="Learning"
              title="Helping those in need"
              titleClassName="text-xl"
            />
            <TextCard className="bg-blue-800">
              <div className="h-full flex flex-col justify-center items-center text-center text-white">
                <h3 className="text-lg italic">Your generosity creates a ripple effect that lasts a lifetime</h3>
                <h4 className="text-2xl italic bold">START THE RIPPLE!</h4>
              </div>
            </TextCard>
          </motion.div>
        </div>
      </div>

      {/* CSS Animation Styles */}
      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HeroSection;





{/*import React from 'react';
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

        

        <div className="grid grid-cols-5 gap-5 max-w-7xl mx-auto">
          
          <div className="col-span-1 space-y-4 -mt-[130]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square">
              <img src={hp2.src} alt="Child smiling" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded italic">Be the reason someone smiles</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-500 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <p className="text-2xl italic bold ">The world changes when we care. And that change begins with YOU!</p>
              </div>
            </Card>
          </div>

          
          <div className="col-span-1 pt-[45]">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp1.src} alt="Teacher" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <div className="text-white italic bold bg-gray-900 bg-opacity-60 px-2 py-1 rounded">
                  <p className="text-2xl">Inspire change, Inspire education</p>
                </div>
              </div>
            </Card>
          </div>

          
          <div className="col-span-1 pt-[120]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-300 p-6 flex flex-col items-center justify-center text-center">
              <h3 className="text-xl font-semibold mb-4">Join 1000 people building a better tomorrow.</h3>
              <Button className="bg-blue-950 text-white rounded-full">Join Our Drives</Button>
            </Card>
          </div>

          
          <div className="col-span-1 pt-[45]">
            <Card className="rounded-3xl overflow-hidden relative aspect-[3/4]">
              <img src={hp3.src} alt="Students" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-2xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded">Give Hope,Give Life</h3>
              </div>
            </Card>
          </div>

          
          <div className="col-span-1 space-y-6 -mt-[135]">
            <Card className="rounded-3xl overflow-hidden relative aspect-square">
              <img src={hp4.src} alt="Learning" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black bg-opacity-20 p-6 flex items-end">
                <h3 className="text-white text-xl font-semibold bg-gray-900 bg-opacity-60 px-2 py-1 rounded italic ">Helping those in need</h3>
              </div>
            </Card>
            <Card className="rounded-3xl overflow-hidden relative aspect-square bg-blue-800 p-6 text-white">
              <div className="h-full flex flex-col justify-center items-center text-center">
                <h3 className="text-lg italic">Your genorisity creates a ripple effect that lasts a lifetime </h3>
                <h4 className="text-2xl italic bold">START THE RIPPLE!</h4>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;*/}
