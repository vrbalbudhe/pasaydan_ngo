import bcrypt from "bcryptjs";
export default function Settings() {
  console.log(bcrypt.hashSync("varunbalbudhe", 10));
  return <div>Settings Page</div>;
}
