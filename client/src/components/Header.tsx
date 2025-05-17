import { Link } from "wouter";

export default function Header() {
  return (
    <header className="bg-[#2E7D32] shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center cursor-pointer">
            <i className="fas fa-mountain text-white text-2xl mr-2"></i>
            <h1 className="text-xl md:text-2xl font-heading font-bold text-white">nps rank</h1>
          </div>
        </Link>
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/rankings">
                <a className="text-white hover:text-neutral-200 font-medium">Rankings</a>
              </Link>
            </li>
            <li>
              <Link href="/">
                <a className="text-white hover:text-neutral-200 font-medium">Vote</a>
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
