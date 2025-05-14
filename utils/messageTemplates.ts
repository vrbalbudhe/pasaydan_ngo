interface Drive {
  id: string;
  title: string;
  location: string;
  startDate: string;
  EndDate: string;
  description: string;
  status: string;
  dtype: string;
  timeInterval: string;
  photos: string[];
  placeLink?: string;
  createdAt: string;
}

interface ContactPerson {
  name: string;
  phone: string;
}

const getMapLink = (drive: Drive): string => {
  if (drive.placeLink) {
    return `\n🗺️ *Location Map:* ${drive.placeLink}`;
  }
  return '';
};

// Updated contact section functions for each language
const getContactsSectionEnglish = (contacts: ContactPerson[]): string => {
  if (!contacts || contacts.length === 0) return '';
  
  let contactsSection = '\n\n📞 *Contact Persons:*';
  contacts.forEach(contact => {
    contactsSection += `\n- ${contact.name}: ${contact.phone}`;
  });
  
  return contactsSection;
};

const getContactsSectionMarathi = (contacts: ContactPerson[]): string => {
  if (!contacts || contacts.length === 0) return '';
  
  let contactsSection = '\n\n📞 *संपर्क व्यक्ती:*';
  contacts.forEach(contact => {
    contactsSection += `\n- ${contact.name}: ${contact.phone}`;
  });
  
  return contactsSection;
};

const getContactsSectionHindi = (contacts: ContactPerson[]): string => {
  if (!contacts || contacts.length === 0) return '';
  
  let contactsSection = '\n\n📞 *संपर्क व्यक्ति:*';
  contacts.forEach(contact => {
    contactsSection += `\n- ${contact.name}: ${contact.phone}`;
  });
  
  return contactsSection;
};

// ENGLISH TEMPLATES
const generateCycleEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🚲 Pasaydan NGO - ${drive.title} 🚲*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n✨ *Help us empower children through mobility!* ✨\n\n${drive.description}\n\nYour donation of a cycle can transform a child's life by giving them the freedom to travel to school easily. Join our mission to create brighter futures!${getContactsSectionEnglish(contacts)}\n\n💙 *Together we can make a difference!* 💙\n\n#PasaydanNGO #CycleDonation #Education`;
};

const generateClothesEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*👕 Pasaydan NGO - ${drive.title} 👕*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n✨ *Spread warmth and dignity through clothing!* ✨\n\n${drive.description}\n\nYour donated clothes can bring comfort and confidence to those in need. Clean, gently used clothing of all sizes are welcome.${getContactsSectionEnglish(contacts)}\n\n💙 *Your kindness clothes someone in need!* 💙\n\n#PasaydanNGO #ClothingDrive #GiveBack`;
};

const generateFoodEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🍲 Pasaydan NGO - ${drive.title} 🍲*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n✨ *Help us fight hunger in our community!* ✨\n\n${drive.description}\n\nYour food donations can provide essential nourishment to families facing food insecurity. Non-perishable items are especially appreciated.${getContactsSectionEnglish(contacts)}\n\n💙 *No one should go to bed hungry!* 💙\n\n#PasaydanNGO #FoodDrive #FightHunger`;
};

const generateEducationEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*📚 Pasaydan NGO - ${drive.title} 📚*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n✨ *Empower through education!* ✨\n\n${drive.description}\n\nYour donation of books, stationery, and educational materials can help students realize their potential. Education is the most powerful tool we can give.${getContactsSectionEnglish(contacts)}\n\n💙 *Knowledge opens doors to brighter futures!* 💙\n\n#PasaydanNGO #EducationDrive #EmpowerThroughKnowledge`;
};

const generateHealthcareEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🏥 Pasaydan NGO - ${drive.title} 🏥*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n✨ *Health is wealth - help us share it!* ✨\n\n${drive.description}\n\nYour donations of healthcare items, medications, and support can make healthcare accessible to those who need it most.${getContactsSectionEnglish(contacts)}\n\n💙 *Good health is a fundamental right!* 💙\n\n#PasaydanNGO #HealthcareDrive #HealthForAll`;
};

const generateDefaultEnglishMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*✨ Pasaydan NGO - ${drive.title} ✨*\n\n📅 *Date:* ${drive.startDate} to ${drive.EndDate}\n⏰ *Time:* ${drive.timeInterval}\n📍 *Location:* ${drive.location}${getMapLink(drive)}\n\n🌟 *Be part of something meaningful!* 🌟\n\n${drive.description}\n\nYour contribution makes a real difference in our community. Every act of kindness creates ripples of positive change!${getContactsSectionEnglish(contacts)}\n\n💙 *Together we can change lives!* 💙\n\n#PasaydanNGO #Community #MakingADifference`;
};

// MARATHI TEMPLATES
const generateCycleMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🚲 पसायदान - ${drive.title} 🚲*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n✨ *मुलांना सायकलच्या माध्यमातून सक्षम बनवण्यासाठी आम्हाला मदत करा!* ✨\n\n${drive.description}\n\nतुमच्या सायकल दानातून एका मुलाचे जीवन बदलू शकते, त्यांना शाळेत सहज जाण्याची स्वतंत्रता देऊन. उज्ज्वल भविष्य निर्माण करण्याच्या आमच्या मिशनमध्ये सामील व्हा!${getContactsSectionMarathi(contacts)}\n\n💙 *आपण मिळून बदल घडवू शकतो!* 💙\n\n#पसायदान #सायकलदान #शिक्षण`;
};

const generateClothesMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*👕 पसायदान - ${drive.title} 👕*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n✨ *कपड्यांच्या माध्यमातून उबदारपणा आणि सन्मान पसरवा!* ✨\n\n${drive.description}\n\nतुमचे दान केलेले कपडे गरजूंना आराम आणि आत्मविश्वास देऊ शकतात. स्वच्छ, हलके वापरलेले सर्व आकारांचे कपडे स्वागतार्ह आहेत.${getContactsSectionMarathi(contacts)}\n\n💙 *तुमची दयाळूपणा कोणाला तरी कपडे देते!* 💙\n\n#पसायदान #कपडेदान #परतफेड`;
};

const generateFoodMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🍲 पसायदान - ${drive.title} 🍲*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n✨ *आमच्या समाजातील भुकेशी लढण्यास मदत करा!* ✨\n\n${drive.description}\n\nतुमचे अन्नदान अन्न असुरक्षितेला सामोरे जाणाऱ्या कुटुंबांना आवश्यक पोषण देऊ शकते. नाशवंत नसलेल्या वस्तूंचे विशेष आभार.${getContactsSectionMarathi(contacts)}\n\n💙 *कोणीही भुकेलेले झोपू नये!* 💙\n\n#पसायदान #अन्नदान #भुकेशीलढा`;
};

const generateEducationMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*📚 पसायदान - ${drive.title} 📚*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n✨ *शिक्षणाद्वारे सक्षम बना!* ✨\n\n${drive.description}\n\nपुस्तके, स्टेशनरी आणि शैक्षणिक साहित्याच्या दानातून विद्यार्थ्यांना त्यांची क्षमता साकार करण्यास मदत होऊ शकते. शिक्षण हे आपण देऊ शकणारे सर्वात शक्तिशाली साधन आहे.${getContactsSectionMarathi(contacts)}\n\n💙 *ज्ञान उज्ज्वल भविष्याचे दरवाजे उघडते!* 💙\n\n#पसायदान #शिक्षणदान #ज्ञानातूनसक्षमीकरण`;
};

const generateHealthcareMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🏥 पसायदान - ${drive.title} 🏥*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n✨ *आरोग्य हीच संपत्ती - आम्हाला ती वाटण्यात मदत करा!* ✨\n\n${drive.description}\n\nआरोग्य सामग्री, औषधे आणि सहाय्यताच्या दानातून सर्वाधिक गरज असलेल्यांपर्यंत आरोग्य सेवा पोहोचवू शकते.${getContactsSectionMarathi(contacts)}\n\n💙 *चांगले आरोग्य हा मूलभूत अधिकार आहे!* 💙\n\n#पसायदान #आरोग्यदान #सर्वांसाठीआरोग्य`;
};

const generateDefaultMarathiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*✨ पसायदान - ${drive.title} ✨*\n\n📅 *दिनांक:* ${drive.startDate} ते ${drive.EndDate}\n⏰ *वेळ:* ${drive.timeInterval}\n📍 *ठिकाण:* ${drive.location}${getMapLink(drive)}\n\n🌟 *अर्थपूर्ण उपक्रमाचा भाग व्हा!* 🌟\n\n${drive.description}\n\nतुमचे योगदान आमच्या समुदायात खरा फरक घडवते. दयेचा प्रत्येक कृती सकारात्मक बदलाची लाट निर्माण करतो!${getContactsSectionMarathi(contacts)}\n\n💙 *आपण मिळून जीवन बदलू शकतो!* 💙\n\n#पसायदान #समाज #बदलघडवणारे`;
};

// HINDI TEMPLATES
const generateCycleHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🚲 पसायदान - ${drive.title} 🚲*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n✨ *बच्चों को साइकिल के माध्यम से सशक्त बनाने में हमारी मदद करें!* ✨\n\n${drive.description}\n\nआपके द्वारा दान की गई साइकिल एक बच्चे के जीवन को बदल सकती है, उन्हें स्कूल आसानी से जाने की स्वतंत्रता देकर। उज्जवल भविष्य बनाने के हमारे मिशन में शामिल हों!${getContactsSectionHindi(contacts)}\n\n💙 *हम मिलकर बदलाव ला सकते हैं!* 💙\n\n#पसायदान #साइकिलदान #शिक्षा`;
};

const generateClothesHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*👕 पसायदान - ${drive.title} 👕*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n✨ *कपड़ों के माध्यम से गर्माहट और सम्मान फैलाएं!* ✨\n\n${drive.description}\n\nआपके दान किए गए कपड़े जरूरतमंदों को आराम और आत्मविश्वास दे सकते हैं। साफ, हल्के इस्तेमाल किए गए सभी आकारों के कपड़े स्वागत योग्य हैं।${getContactsSectionHindi(contacts)}\n\n💙 *आपकी दया किसी जरूरतमंद को कपड़े पहनाती है!* 💙\n\n#पसायदान #वस्त्रदान #वापसीदेना`;
};

const generateFoodHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🍲 पसायदान - ${drive.title} 🍲*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n✨ *हमारे समुदाय में भूख से लड़ने में मदद करें!* ✨\n\n${drive.description}\n\nआपका भोजन दान खाद्य असुरक्षा का सामना करने वाले परिवारों को आवश्यक पोषण प्रदान कर सकता है। गैर-खराब होने वाली वस्तुओं की विशेष रूप से सराहना की जाती है।${getContactsSectionHindi(contacts)}\n\n💙 *कोई भी भूखा नहीं सोना चाहिए!* 💙\n\n#पसायदान #अन्नदान #भूखसेलड़ाई`;
};

const generateEducationHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*📚 पसायदान - ${drive.title} 📚*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n✨ *शिक्षा के माध्यम से सशक्त बनें!* ✨\n\n${drive.description}\n\nपुस्तकों, स्टेशनरी और शैक्षिक सामग्रियों के आपके दान से छात्रों को अपनी क्षमता का एहसास करने में मदद मिल सकती है। शिक्षा वह सबसे शक्तिशाली उपकरण है जो हम दे सकते हैं।${getContactsSectionHindi(contacts)}\n\n💙 *ज्ञान उज्जवल भविष्य के द्वार खोलता है!* 💙\n\n#पसायदान #शिक्षादान #ज्ञानकेमाध्यमसेसशक्तिकरण`;
};

const generateHealthcareHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*🏥 पसायदान - ${drive.title} 🏥*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n✨ *स्वास्थ्य ही धन है - इसे साझा करने में हमारी मदद करें!* ✨\n\n${drive.description}\n\nस्वास्थ्य सामग्री, दवाओं और सहायता के आपके दान से स्वास्थ्य देखभाल उन लोगों तक पहुंच सकती है जिन्हें इसकी सबसे अधिक आवश्यकता है।${getContactsSectionHindi(contacts)}\n\n💙 *अच्छा स्वास्थ्य एक मौलिक अधिकार है!* 💙\n\n#पसायदान #स्वास्थ्यदान #सभीकेलिएस्वास्थ्य`;
};

const generateDefaultHindiMessage = (drive: Drive, contacts: ContactPerson[]): string => {
  return `*✨ पसायदान - ${drive.title} ✨*\n\n📅 *दिनांक:* ${drive.startDate} से ${drive.EndDate}\n⏰ *समय:* ${drive.timeInterval}\n📍 *स्थान:* ${drive.location}${getMapLink(drive)}\n\n🌟 *कुछ सार्थक का हिस्सा बनें!* 🌟\n\n${drive.description}\n\nआपका योगदान हमारे समुदाय में वास्तविक अंतर लाता है। दया का हर कार्य सकारात्मक परिवर्तन की लहरें पैदा करता है!${getContactsSectionHindi(contacts)}\n\n💙 *हम मिलकर जीवन बदल सकते हैं!* 💙\n\n#पसायदान #समुदाय #अंतरबनाना`;
};

export const getMessageTemplate = (drive: Drive, language: string, contacts: ContactPerson[] = []): string => {
  const driveType = drive.dtype.toLowerCase();
  
  if (language === "english") {
    if (driveType.includes("cycle")) return generateCycleEnglishMessage(drive, contacts);
    if (driveType.includes("clothes") || driveType.includes("clothing")) return generateClothesEnglishMessage(drive, contacts);
    if (driveType.includes("food")) return generateFoodEnglishMessage(drive, contacts);
    if (driveType.includes("education") || driveType.includes("book")) return generateEducationEnglishMessage(drive, contacts);
    if (driveType.includes("health") || driveType.includes("medical")) return generateHealthcareEnglishMessage(drive, contacts);
    return generateDefaultEnglishMessage(drive, contacts);
  } 
  else if (language === "marathi") {
    if (driveType.includes("cycle")) return generateCycleMarathiMessage(drive, contacts);
    if (driveType.includes("clothes") || driveType.includes("clothing")) return generateClothesMarathiMessage(drive, contacts);
    if (driveType.includes("food")) return generateFoodMarathiMessage(drive, contacts);
    if (driveType.includes("education") || driveType.includes("book")) return generateEducationMarathiMessage(drive, contacts);
    if (driveType.includes("health") || driveType.includes("medical")) return generateHealthcareMarathiMessage(drive, contacts);
    return generateDefaultMarathiMessage(drive, contacts);
  } 
  else if (language === "hindi") {
    if (driveType.includes("cycle")) return generateCycleHindiMessage(drive, contacts);
    if (driveType.includes("clothes") || driveType.includes("clothing")) return generateClothesHindiMessage(drive, contacts);
    if (driveType.includes("food")) return generateFoodHindiMessage(drive, contacts);
    if (driveType.includes("education") || driveType.includes("book")) return generateEducationHindiMessage(drive, contacts);
    if (driveType.includes("health") || driveType.includes("medical")) return generateHealthcareHindiMessage(drive, contacts);
    return generateDefaultHindiMessage(drive, contacts);
  }
  
  // Default fallback to English
  return generateDefaultEnglishMessage(drive, contacts);
};