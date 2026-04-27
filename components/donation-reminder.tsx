import Link from "next/link"

export function DonationReminder() {
  return (
    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h3 className="text-lg font-medium mb-2">Support GPXto with a donation</h3>
      <p className="text-sm mb-3">
        To keep our website ad-free and accessible, we depend on community support for hosting and updates. 
        Please consider supporting us through our Buy Me a Coffee page. A simple donation of €3 / $3 goes a long way in keeping these tools running for everyone.
      </p>
      <Link
        href="https://buymeacoffee.com/koen?utm_source=website&utm_medium=banner&utm_campaign=donation_reminder"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-200 hover:text-white rounded-md transition-colors"
      >
        Donate €3 / $3 via Buy Me a Coffee
      </Link>
    </div>
  )
}
