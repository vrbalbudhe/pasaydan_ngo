import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function TitleInfo() {
  return (
    <div className="w-full h-full flex justify-center items-center flex-col">
      <div className="w-full h-[200px] flex justify-center items-center flex-col">
        <h1 className="-tracking-tighter text-[70px] text-slate-800">
          पसायदान
        </h1>
        <h1 className="-tracking-tighter text-xl md:text-3xl text-slate-800">
          जो जे वांच्छिल तो तें लाहो । प्राणिज
        </h1>
        <h1 className="-tracking-tighter text-sm text-slate-800">
          ~ संत ज्ञानेश्वर महाराज
        </h1>
      </div>
      <div className="w-[90%] md:w-[80%] h-full flex justify-center items-center text-center">
        <Card className="w-[1000px] h-fit border-none shadow-none flex justify-center items-center flex-col">
          <CardHeader className="w-full h-full flex flex-col gap-5">
            <CardDescription className="text-3xl shadow-none text-pretty">
              पसायदान हा शब्द पासा (पसा) या दोन शब्दांची रचना आहे ज्याचा अर्थ
              हाताचे तळवे एकमेकांना जोडलेले आहेत (जसे आपण कोणीतरी आपल्या हातात
              भरपूर चॉकलेट देणार असेल तेव्हा बनवतो) आणि दान (दान) म्हणजे भेट.
              एकत्रितपणे त्यांचा अर्थ एक भेटवस्तू आहे जी हस्तरेखांमध्ये एकत्र
              जोडली जाऊ शकते किंवा घेतली जाऊ शकते. सहसा भारतात, विशेषतः हिंदू
              पासा (पसा) मध्ये प्रसाद (देवाची भेट ) स्वीकारतात.
            </CardDescription>
            <CardDescription className="text-sm text-pretty">
              THE WORD PASAYDAN IS A COMPOSITION OF TWO WORDS PASA (HT) WHICH
              MEANS PALMS SPREAD JOINED TOGETHER (LIKE WE MAKE WHEN SOMEONE IS
              ABOUT TO GIVE A LOT OF CHOCOLATES IN OUR HANDS) AND DAN () WHICH
              MEANS GIFT. TOGETHER THEY MEAN A GIFT WHICH CAN BE TAKEN
            </CardDescription>
          </CardHeader>
        </Card>
        <p className="text-lg mt-10"></p>
      </div>
    </div>
  );
}
