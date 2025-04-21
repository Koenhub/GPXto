export const metadata = {
  title: "Terms of Service - Free converter online - GPXto",
  description:
    "Terms of service for GPXto's free GPX conversion tools. Read about how you can use our website and the rules that apply to our free online services.",
}

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl mb-8">Terms of Service</h1>

      <div className="prose dark:prose-invert max-w-none space-y-6">
        <p>Last updated: {new Date().toLocaleDateString()}</p>

        <h2 className="text-xl mt-8 mb-4">Introduction</h2>
        <p>
          These terms and conditions outline the rules and regulations for the use of GPXto's website. By accessing this
          website, we assume you accept these terms and conditions. Do not continue to use GPXto if you do not agree to
          take all of the terms and conditions stated on this page.
        </p>

        <h2 className="text-xl mt-8 mb-4">License</h2>
        <p>
          Unless otherwise stated, GPXto and/or its licensors own the intellectual property rights for all material on
          GPXto. All intellectual property rights are reserved.
        </p>

        <h2 className="text-xl mt-8 mb-4">Restrictions</h2>
        <p>You are specifically restricted from all of the following:</p>
        <ul className="list-disc pl-6 space-y-2">
          <li>Publishing any website material in any other media</li>
          <li>Selling, sublicensing and/or otherwise commercializing any website material</li>
          <li>Publicly performing and/or showing any website material</li>
          <li>Using this website in any way that is or may be damaging to this website</li>
          <li>Using this website in any way that impacts user access to this website</li>
          <li>
            Using this website contrary to applicable laws and regulations, or in any way may cause harm to the website,
            or to any person or business entity
          </li>
        </ul>

        <h2 className="text-xl mt-8 mb-4">Your Content</h2>
        <p>
          In these terms and conditions, "Your Content" shall mean any audio, video, text, images or other material you
          choose to display on this website. By displaying Your Content, you grant GPXto a non-exclusive, worldwide,
          irrevocable, royalty-free license to use, reproduce, adapt, publish, translate and distribute it in any and
          all media.
        </p>

        <h2 className="text-xl mt-8 mb-4">No Warranties</h2>
        <p>
          This website is provided "as is," with all faults, and GPXto makes no express or implied representations or
          warranties, of any kind related to this website or the materials contained on this website.
        </p>

        <h2 className="text-xl mt-8 mb-4">Limitation of Liability</h2>
        <p>
          In no event shall GPXto, nor any of its officers, directors and employees, be held liable for anything arising
          out of or in any way connected with your use of this website.
        </p>
      </div>
    </div>
  )
}
