import Link from "next/link"

export const metadata = {
  title: "Privacy policy - Free converter online - GPXto",
  description:
    "GPXto's privacy policy explains how we protect your data. All conversions happen in your browser, and we never store your GPX files or route data.",
}

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <section className="py-8">
        <h1 className="text-2xl mb-8">Privacy policy</h1>

        <div className="prose dark:prose-invert max-w-none space-y-6">
          <p>Last updated: {new Date().toLocaleDateString()}</p>

          <h2 className="text-xl mt-8 mb-4">Introduction</h2>
          <p>
            At GPXto, we take your privacy seriously. This privacy policy explains how we handle your data when you use
            our website and services. We've designed our services with privacy in mind, minimizing data collection and
            ensuring that your GPS data remains private.
          </p>

          <h2 className="text-xl mt-8 mb-4">Data processing in your browser</h2>
          <p>
            <strong>All file conversions happen in your browser.</strong> When you upload a GPX file or paste a Google
            Maps URL for conversion, all processing happens locally on your device. Your GPX files, route data, and
            location information never leave your computer or get sent to our servers.
          </p>
          <p>This browser-based approach means:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Your sensitive location data stays private</li>
            <li>We don't store copies of your files</li>
            <li>You can use our tools even when offline (once the page has loaded)</li>
            <li>Your data is not shared with third parties</li>
          </ul>

          <h2 className="text-xl mt-8 mb-4">Website analytics</h2>
          <p>
            We use Ahrefs to collect anonymous usage statistics about our website. This helps us understand how visitors
            use our site so we can improve it.
          </p>
          <p>
            <strong>The analytics data we collect is completely anonymous</strong> and cannot be used to identify you
            personally. We do not track individual users across websites or collect any personally identifiable
            information.
          </p>
          <p>Ahrefs analytics collects basic information such as:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Pages visited</li>
            <li>Referring websites</li>
            <li>Time spent on site</li>
            <li>Browser type and device information</li>
            <li>Approximate geographic location (country/city level only)</li>
          </ul>
          <p>This information is aggregated and used solely for improving our website and services.</p>

          <h2 className="text-xl mt-8 mb-4">Why we don't need a cookie banner</h2>
          <p>
            You may have noticed that GPXto doesn't display a cookie consent banner like many other websites. Here's
            why:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>We only use necessary cookies</strong> - The only cookies we use are those that are strictly
              necessary for the website to function (such as session cookies for the current visit).
            </li>
            <li>
              <strong>Our analytics is privacy-focused</strong> - The analytics we use (Ahrefs) is configured to collect
              anonymous data only and doesn't require cookies for cross-site tracking.
            </li>
            <li>
              <strong>No tracking cookies</strong> - We don't use any advertising or tracking cookies that would require
              explicit consent under GDPR, ePrivacy Directive, or similar privacy regulations.
            </li>
            <li>
              <strong>No personal data processing</strong> - Since we don't collect personal data through cookies or
              similar technologies, consent banners are not required under current privacy regulations.
            </li>
          </ul>
          <p>
            Under the EU's GDPR and ePrivacy Directive, cookie consent is only required for non-essential cookies that
            track personal data. Since we don't use such cookies, we don't need to display a consent banner.
          </p>

          <h2 className="text-xl mt-8 mb-4">Information we don't collect</h2>
          <p>
            It's important to understand what we <strong>don't</strong> collect:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>We don't collect or store your GPX files or route data</li>
            <li>We don't track your precise location</li>
            <li>We don't create user profiles or track you across different websites</li>
            <li>We don't sell or share any data with third parties for marketing purposes</li>
            <li>We don't use cookies for advertising or behavioral tracking</li>
          </ul>

          <h2 className="text-xl mt-8 mb-4">Contact information</h2>
          <p>
            If you have any questions about our privacy practices, please visit our{" "}
            <Link href="/contact">Contact page</Link> to find our email address and get in touch with us.
          </p>

          <h2 className="text-xl mt-8 mb-4">Changes to this privacy policy</h2>
          <p>
            We may update our privacy policy from time to time. We will notify you of any changes by posting the new
            privacy policy on this page and updating the "Last updated" date at the top.
          </p>
          <p>
            We encourage you to review this privacy policy periodically for any changes. Your continued use of our
            website after any changes to this privacy policy constitutes your acceptance of the changes.
          </p>
        </div>
      </section>
    </div>
  )
}
