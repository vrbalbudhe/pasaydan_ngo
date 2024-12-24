import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function DriveEvents() {
  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-slate-800 font-normal">
            Blanket Donation Drive
          </CardTitle>
          <CardDescription className="text-sm">2024-12-16</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm">
            this is the blacket Donation drive on this date above specified
          </p>
        </CardContent>
      </Card>
    </>
  );
}
