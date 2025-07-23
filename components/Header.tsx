import Link from "next/link";
import { HeaderData, SiteConfig } from "../lib/cms";

interface HeaderProps {
  siteConfig: SiteConfig;
  headerData: HeaderData;
}

export function Header({ siteConfig, headerData }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/" className="text-2xl font-bold text-gray-900">
              {siteConfig.logo.text}
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            {headerData.navigation
              .filter((item) => item.isActive)
              .map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className="text-gray-500 hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
              ))}
          </nav>

          <div className="flex items-center space-x-4">
            {headerData.actions.search.enabled && (
              <button
                className="text-gray-500 hover:text-gray-900 transition-colors"
                title={headerData.actions.search.placeholder}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </button>
            )}

            {headerData.actions.cart.enabled && (
              <button className="text-gray-500 hover:text-gray-900 transition-colors relative">
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6m0 0h-.5M7 13h10m0 0v6a1 1 0 01-1 1H8a1 1 0 01-1-1v-6m8 0V9a1 1 0 00-1-1H8a1 1 0 00-1 1v4.01"
                  />
                </svg>
                {headerData.actions.cart.showCount && (
                  <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    0
                  </span>
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CMS data freshness indicator (only in development) */}
      {process.env.NODE_ENV === "development" && (
        <div className="bg-gray-100 px-4 py-1 text-xs text-gray-600 border-t">
          Header updated: {new Date(headerData.lastUpdated).toLocaleString()}
        </div>
      )}
    </header>
  );
}
