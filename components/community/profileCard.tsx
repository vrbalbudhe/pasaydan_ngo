import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
interface ProfileCardProps {
  fullname: string;
  link: string;
  designation: string;
}
export default function ProfileCard({
  fullname,
  designation,
  link,
}: ProfileCardProps) {
  return (
    <div>
      <Card className="md:w-[180px] w-[150px] hover:scale-95 duration-500 ease-in-out h-[180px] md:h-[220px] border border-slate-300 shadow-sm">
        <CardContent className="w-full h-full flex flex-col justify-evenly items-center">
          <img
            className="md:w-24 md:h-24 w-14 h-14 bg-slate-200 object-coverF border-2 border-blue-600 rounded-full"
            src={
              link ||
              "https://static.vecteezy.com/system/resources/previews/026/734/818/non_2x/person-icon-user-profile-vector.jpg"
            }
            alt=""
          />
          <div>
            <h1 className="mt-2 md:text-md text-sm text-center">{fullname}</h1>
            <h1 className="text-sm text-slate-600 text-center">
              {designation || ""}
            </h1>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between"></CardFooter>
      </Card>
    </div>
  );
}
