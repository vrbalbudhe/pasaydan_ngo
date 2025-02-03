export default function Footer() {
  return (
    <div className="w-[80%] gap-5 h-60 flex justify-center items-center">
      <div>
        <ul className="text-white">
          <li>Priacy Policy</li>
          <li>Phone</li>
          <li>Emails</li>
        </ul>
      </div>
      <div>
        <ul className="text-white">
          <li>Home</li>
          <li>Drive</li>
          <li>Contribution</li>
          <li>Community</li>
          <li>About</li>
        </ul>
      </div>
      <div className="w-[250px]">
        <h1 className="text-white">Address</h1>
        <p className="text-slate-500 text-sm hover:underline cursor-pointer">
          Near Vishrantwadi, Pune 412105
        </p>
      </div>
    </div>
  );
}
