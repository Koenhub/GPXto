import Link from "next/link"

export function DonationReminder() {
  return (
    <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md">
      <h3 className="text-lg font-medium mb-2">Support GPXto with a small donation</h3>
      <p className="text-sm mb-3">
        Our tools are completely free to use, but we rely on donations to cover server costs and continue development.
        If you find our tools helpful, please consider supporting us with a small donation.
      </p>
      <Link
        href="https://ko-fi.com/gpxto?utm_source=website&utm_medium=banner&utm_campaign=donation_reminder"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-700 text-gray-200 hover:text-white rounded-md transition-colors"
      >
        Support us here
      </Link>
    </div>
  )
}
