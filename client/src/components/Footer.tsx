export default function Footer() {
  return (
    <footer className="bg-neutral-800 text-white py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <div className="flex items-center">
              <i className="fas fa-mountain text-white text-xl mr-2"></i>
              <span className="text-lg font-heading font-bold">nps rank</span>
            </div>
            <p className="text-sm text-neutral-400 mt-1">Vote for your favorite National Parks</p>
          </div>
          <div>
            <p className="text-sm text-neutral-400">
              Data from{" "}
              <a
                href="https://www.nps.gov/"
                className="text-[#42A5F5] hover:underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                National Park Service
              </a>
            </p>
            <p className="text-sm text-neutral-400 mt-1">
              © {new Date().getFullYear()} NPS Rank. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
