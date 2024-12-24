import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
export default function ProfileCard() {
  return (
    <div>
      <Card className="w-[220px] h-[250px] border border-slate-300 shadow-sm">
        <CardContent className="w-full h-full flex flex-col justify-center items-center">
          <img
            className="w-20 h-20 bg-slate-200 border-2 border-slate-400 rounded-full"
            src="https://static.vecteezy.com/system/resources/previews/026/734/818/non_2x/person-icon-user-profile-vector.jpg"
            alt=""
          />
          <h1 className="mt-2 text-xl">Varun Balbudhe</h1>
          <h1 className="text-sm text-slate-600">senior professor</h1>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
