"use client";
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
          <li
            className={`cursor-pointer ${
              isActiveRoute("/pasaydan/com/contributions")
                ? "text-blue-700"
                : isLogsignRoute
                  ? "text-white"
                  : "text-slate-800"
            } hover:text-slate-700`}
          >
            Contributions
          </li>
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
          <Link href="/pasaydan/com/about">
            <li
              className={`cursor-pointer ${
                isActiveRoute("/pasaydan/com/about")
                  ? "text-blue-700"
                  : isLogsignRoute
                    ? "text-white"
                    : "text-slate-800"
              } hover:text-slate-700`}
            >
              About
            </li>
          </Link>
        </ul>
      </div>
    </>
  );
}
