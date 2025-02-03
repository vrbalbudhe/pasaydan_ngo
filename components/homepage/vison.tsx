"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const cardsDict = [
  {
    Image: "https://cdn-icons-png.flaticon.com/512/1509/1509480.png",
    Header: "Donating Food",
    desc: "Our mission is to contribute to the betterment of society. We work towards providing food to the needy, promoting education, and ensuring access to healthcare services. Our goal is to raise awareness within the community and strive for a better future. We are committed to addressing people's challenges by utilizing resources in the right direction. This journey can become even more impactful with your support.",
  },
  {
    Image: "https://img.freepik.com/premium-vector/cozy-blanket-icon_444196-23906.jpg",
    Header: "Donating Blankets",
    desc: "We aim to provide warmth and comfort to the underprivileged during cold seasons by distributing blankets. Every donation helps shield people from harsh weather conditions, ensuring their basic needs are met. Join us in bringing a little warmth into their lives and spreading kindness across communities.",
  },
  {
    Image: "https://static.vecteezy.com/system/resources/previews/010/353/075/non_2x/cycling-sport-color-icon-illustration-vector.jpg",
    Header: "Donating Cycles",
    desc: "Transportation is a major challenge for many. By donating cycles, we empower individuals with a means to travel to schools, workplaces, or markets. This initiative not only helps save time but also promotes eco-friendly commuting, benefiting both the individual and the environment.",
  },
  {
    Image: "https://cdn-icons-png.flaticon.com/512/4243/4243250.png",
    Header: "Donating Blood",
    desc: "Blood donation is a noble cause that saves lives. We actively organize blood donation camps to ensure hospitals have an adequate supply for emergencies. Your donation can make the difference between life and death for someone in need. Be a hero—donate blood today.",
  },
  {
    Image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSa-4xBdVDWVv9B_AogOH3atcHxBZ23OMMjMw&s",
    Header: "Donating Clothes",
    desc: "Clothing donations are a great way to help those in need. By donating gently used clothes, you can provide warmth and comfort to individuals who are facing hardships. Your donation can make a difference in someone's life by giving them dignity and hope. Donate clothes today.",
  },
  {
    Image: "https://cdn-icons-png.flaticon.com/512/7630/7630510.png",
    Header: "Donating Money",
    desc: "Monetary donations are essential for supporting various causes. Your financial contributions can fund life-saving medical treatments, education, and provide disaster relief. Even small donations add up to make a significant impact. Help by donating money to support those in need.",
  },
];

export default function Vision() {
  const [expandedIndex, setExpandedIndex] = React.useState<number | null>(null);

  const toggleReadMore = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="relative w-[95%] md:w-[80%] mx-auto py-16 md:py-24 bg-gradient-to-b from-white to-blue-50">
      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute top-0 left-1/4 w-96 h-96 bg-[#f0f5ff] rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            transform: ["translate(0px, 0px) scale(1)", "translate(30px, -50px) scale(1.1)", "translate(-20px, 20px) scale(0.9)", "translate(0px, 0px) scale(1)"]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#e6eeff] rounded-full mix-blend-multiply filter blur-xl opacity-50"
          animate={{
            transform: ["translate(0px, 0px) scale(1)", "translate(30px, -50px) scale(1.1)", "translate(-20px, 20px) scale(0.9)", "translate(0px, 0px) scale(1)"]
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "linear",
            delay: 2
          }}
        />
      </div>

      <div className="relative container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[#1a237e] text-center">
            How We Contribute
          </h1>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
              },
            },
          }}
        >
          {cardsDict.map((card, index) => (
            <motion.div
              key={index}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <Card className="h-full bg-white/90 backdrop-blur border-2 border-[#e3e8ee] rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                <CardHeader className="p-6">
                  <motion.div
                    className="w-32 h-32 mx-auto mb-4"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.3 }}
                  >
                    <img
                      className="w-full h-full object-contain"
                      src={card.Image}
                      alt={`${card.Header} Icon`}
                    />
                  </motion.div>
                  <h2 className="text-xl md:text-2xl font-bold text-[#1a237e] text-center">
                    {card.Header}
                  </h2>
                </CardHeader>

                <CardContent className="px-6 pb-6 text-center">
                  <motion.div
                    initial={false}
                    animate={{
                      height: expandedIndex === index ? "auto" : "100px",
                    }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="text-sm md:text-base text-[#334e68] leading-relaxed">
                      {card.desc}
                    </p>
                  </motion.div>

                  <motion.div
                    className="mt-4"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      onClick={() => toggleReadMore(index)}
                      className="bg-[#1a237e] hover:bg-[#283593] text-white text-sm md:text-base px-6 py-2 rounded-full transition-all duration-300"
                    >
                      {expandedIndex === index ? "Read Less" : "Read More"}
                    </Button>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}