import { headers } from "next/headers";

export default async function Dashboard() {
  const headersList = await headers();
  const userHeader = headersList.get("x-user");
  console.log("userheader in the profile page:", userHeader);
  if (!userHeader) {
    return (
      <div>
        <h1>Unauthorized</h1>
        <p>You are not authorized to view this page. Please log in.</p>
      </div>
    );
  }

  const user = JSON.parse(userHeader);

  return (
    <div className="w-[90%] min-h-screen">
      {/* <h1>Welcome to the Dashboard</h1>
      <p>User Email: {user.email}</p> */}
    </div>
  );
}
