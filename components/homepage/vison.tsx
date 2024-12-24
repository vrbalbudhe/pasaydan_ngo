"use client";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const cardsDict = [
  {
    Image: "https://cdn-icons-png.flaticon.com/512/1509/1509480.png",
    Header: "Donating Food",
    desc: "Our mission is to contribute to the betterment of society. We work towards providing food to the needy, promoting education, and ensuring access to healthcare services. Our goal is to raise awareness within the community and strive for a better future. We are committed to addressing people's challenges by utilizing resources in the right direction. This journey can become even more impactful with your support.",
  },
  {
    Image:
      "https://img.freepik.com/premium-vector/cozy-blanket-icon_444196-23906.jpg",
    Header: "Donating Blankets",
    desc: "We aim to provide warmth and comfort to the underprivileged during cold seasons by distributing blankets. Every donation helps shield people from harsh weather conditions, ensuring their basic needs are met. Join us in bringing a little warmth into their lives and spreading kindness across communities.",
  },
  {
    Image:
      "https://static.vecteezy.com/system/resources/previews/010/353/075/non_2x/cycling-sport-color-icon-illustration-vector.jpg",
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
    <div className="w-[90%] md:w-[80%] h-fit gap-6 mt-20 mb-10 flex flex-col justify-center items-center">
      <div className="w-full h-20">
        <h1 className="text-5xl text-slate-800 text-center font-bold">
          How We Contribute
        </h1>
      </div>
      <div className="w-full flex justify-center items-center gap-3 flex-wrap">
        {cardsDict.map((cards, index) => (
          <Card
            key={index}
            className="w-[450px] md:w-[350px] h-auto shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader className="w-full h-auto flex flex-col items-center">
              <img
                className="w-40 h-40 mb-2"
                src={cards.Image}
                alt={`${cards.Header} Icon`}
              />
            </CardHeader>
            <CardContent className="w-full text-center space-y-4">
              <h2 className="text-xl font-semibold text-slate-800">
                {cards.Header}
              </h2>
              <p className="text-sm text-slate-600">
                {expandedIndex === index
                  ? cards.desc
                  : `${cards.desc.slice(0, 200)}...`}
              </p>
              <Button
                onClick={() => toggleReadMore(index)}
                className="text-white hover:underline"
              >
                {expandedIndex === index ? "Read Less" : "Read More"}
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
