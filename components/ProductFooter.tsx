import Link from "next/link";
import { getFooterData } from "../lib/cms";

export async function ProductFooter() {
  // Fetch CMS data with cache tags for revalidation
  const footerData = await getFooterData();

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {footerData.sections.map((section) => (
            <div key={section.id}>
              <h3 className="text-lg font-semibold mb-4">{section.title}</h3>

              {section.type === "description" && section.content && (
                <p className="text-gray-400 text-sm">{section.content}</p>
              )}

              {section.type === "links" && section.links && (
                <ul className="space-y-2 text-sm text-gray-400">
                  {section.links.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="hover:text-white transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>
            &copy; {footerData.copyright.year} {footerData.copyright.text}
          </p>

          {/* CMS data freshness indicator (only in development) */}
          {process.env.NODE_ENV === "development" && (
            <p className="mt-2 text-xs">
              Footer updated:{" "}
              {new Date(footerData.lastUpdated).toLocaleString()}
            </p>
          )}
        </div>
      </div>
    </footer>
  );
}
