import { LoginSignup } from "@/components/auth/LoginSignup";

export default function LoginPage() {
  return (
    <div className="w-full h-screen flex justify-center items-center overflow-hidden relative">
      <div
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1594708767771-a7502209ff51?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')",
        }}
        className="absolute inset-0  bg-cover bg-center filter blur-md"
      />

      <div className="relative z-10 md:flex h-full w-full text-center">
        <div className="md:w-1/2 h-full flex flex-col gap-3 justify-center items-center">
          <h1 className="text-5xl font-bold tracking-tighter text-white mb-6">
            {" "}
            <span className="text-8xl">
              Join
              <span className="text-8xl"> Our</span>
            </span>
            <span className="block text-blue-500 text-8xl">पसायदान</span> NGO &
            Community
          </h1>
        </div>
        <div className="md:w-1/2 max-w-md mx-auto flex justify-center items-center">
          <LoginSignup />
        </div>
      </div>
    </div>
  );
}
