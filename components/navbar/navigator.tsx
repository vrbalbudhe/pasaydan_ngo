"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react"; // Using lucide-react for icons

export default function Navigator() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const isLogsignRoute = pathname === "/pasaydan/auth/logsign";
  const isActiveRoute = (route: string) => pathname === route;

  const navLinks = [
    { href: "/pasaydan/com", label: "Home" },
    { href: "/pasaydan/com/donate", label: "Donate" },
    { href: "/pasaydan/com/drive", label: "Drive" },
    { href: "/pasaydan/com/certification", label: "Certification" },
    { href: "/pasaydan/com/community", label: "Community" },
  ];

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button
          onClick={toggleMenu}
          className="p-2 text-slate-800 hover:text-slate-600"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:block">
        <ul className="flex gap-3 text-[13px] text-slate-800 -tracking-tighter">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href}>
              <li
                className={`cursor-pointer ${
                  isActiveRoute(link.href)
                    ? "text-blue-700"
                    : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
                } hover:text-slate-700`}
              >
                {link.label}
              </li>
            </Link>
          ))}
        </ul>
      </div>

      {/* Mobile Navigation Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[70px] left-0 right-0 bg-white shadow-lg z-50">
          <ul className="flex flex-col py-4">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <li
                  className={`px-6 py-2 cursor-pointer ${
                    isActiveRoute(link.href)
                      ? "text-blue-700"
                      : "text-slate-800"
                  } hover:bg-slate-100`}
                  onClick={toggleMenu}
                >
                  {link.label}
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
{/*"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigator() {
  const pathname = usePathname();

  // Check if the current path is '/pasaydan/auth/logsign'
  const isLogsignRoute = pathname === "/pasaydan/auth/logsign";

  const isActiveRoute = (route: string) => pathname === route;

  return (
    <>
      <div className="hidden md:block">
        <ul className="flex gap-3 text-[13px] text-slate-800 -tracking-tighter">
        <Link href="/pasaydan/com">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com")
                  ? "text-blue-700"
                  : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
              } hover:text-slate-700`}
            >
              Home
            </li>
          </Link>
          <Link href="/pasaydan/com/donate">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/donate")
                  ? "text-blue-700"
                  : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
              } hover:text-slate-700`}
            >
              Donate
            </li>
          </Link>
          <Link href="/pasaydan/com/drive">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/drive")
                  ? "text-blue-700"
                  : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
              } hover:text-slate-700`}
            >
              Drive
            </li>
          </Link>
          <Link href="/pasaydan/com/certification">
          <li
            className={`cursor-pointer ${
              isActiveRoute("/pasaydan/com/certification")
                ? "text-blue-700"
                : isLogsignRoute
                  ? "text-white"
                  : "text-slate-800"
            } hover:text-slate-700`}
          >
            Certification
          </li>
          </Link>
          
          <Link href="/pasaydan/com/community">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/community")
                  ? "text-blue-700"
                  : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
              } hover:text-slate-700`}
            >
              Community
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}*/}
