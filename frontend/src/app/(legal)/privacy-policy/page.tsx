import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CashFlow collects, uses, and protects your personal data.",
};

const LAST_UPDATED = "May 26, 2025";
const APP_NAME     = "CashFlow";
const CONTACT_EMAIL = "hello@devaditya.dev";
const WEBSITE       = "https://cashflow.devaditya.dev";

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">

      {/* Header */}
      <div className="not-prose mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Privacy Policy</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <p>
        Welcome to <strong>{APP_NAME}</strong> ("{APP_NAME}", "we", "our", or "us"). We are
        committed to protecting your personal information and your right to privacy. This Privacy
        Policy explains how we collect, use, disclose, and safeguard your information when you use
        our mobile application and website (<a href={WEBSITE}>{WEBSITE}</a>).
      </p>
      <p>
        Please read this policy carefully. If you disagree with its terms, please discontinue use
        of the app.
      </p>

      {/* 1 */}
      <h2>1. Information We Collect</h2>
      <h3>1.1 Information You Provide</h3>
      <ul>
        <li><strong>Account Data:</strong> Name, email address, and password when you register.</li>
        <li><strong>Financial Data:</strong> Income and expense transactions you manually enter,
          including amounts, categories, dates, and optional notes.</li>
        <li><strong>Feedback &amp; Reports:</strong> Messages, ratings, and bug reports you
          voluntarily submit through the app.</li>
      </ul>

      <h3>1.2 Information Collected Automatically</h3>
      <ul>
        <li><strong>Usage Data:</strong> Pages visited, features used, and in-app actions — used
          to improve the product.</li>
        <li><strong>Device Data:</strong> Device type, operating system version, browser type, and
          time zone.</li>
        <li><strong>Log Data:</strong> IP address, access timestamps, and error logs collected by
          our servers.</li>
        <li><strong>Cookies &amp; Local Storage:</strong> We use a session cookie
          (<code>cf_logged_in</code>) for authentication routing. No advertising or third-party
          tracking cookies are used.</li>
      </ul>

      <h3>1.3 Information We Do NOT Collect</h3>
      <ul>
        <li>Bank account numbers, card numbers, or any payment credentials.</li>
        <li>Government ID or tax information.</li>
        <li>Location data.</li>
        <li>Contacts or media from your device.</li>
      </ul>

      {/* 2 */}
      <h2>2. How We Use Your Information</h2>
      <p>We use the information we collect to:</p>
      <ul>
        <li>Create and manage your account.</li>
        <li>Provide, operate, and maintain the {APP_NAME} service.</li>
        <li>Display your transaction history and analytics.</li>
        <li>Send transactional emails (email verification, password reset).</li>
        <li>Respond to your feedback, reports, and support requests.</li>
        <li>Monitor and improve performance, security, and reliability.</li>
        <li>Comply with legal obligations.</li>
      </ul>
      <p>
        We <strong>do not</strong> sell, rent, or trade your personal information to any third
        party for marketing purposes.
      </p>

      {/* 3 */}
      <h2>3. How We Share Your Information</h2>
      <p>
        We only share data in limited circumstances:
      </p>
      <ul>
        <li>
          <strong>Service Providers:</strong> Trusted vendors who assist in operating our
          infrastructure (e.g., hosting, email delivery). They are contractually obligated to
          protect your data.
        </li>
        <li>
          <strong>Legal Requirements:</strong> When required by law, court order, or governmental
          authority.
        </li>
        <li>
          <strong>Business Transfers:</strong> In the event of a merger or acquisition, your data
          may be transferred. We will notify you beforehand.
        </li>
        <li>
          <strong>With Your Consent:</strong> For any other purpose with your explicit permission.
        </li>
      </ul>

      {/* 4 */}
      <h2>4. Data Retention</h2>
      <p>
        We retain your personal data for as long as your account is active or as needed to provide
        services. When you delete your account, we will permanently delete your personal data and
        transaction records within <strong>30 days</strong>, except where we are required by law to
        retain certain information.
      </p>

      {/* 5 */}
      <h2>5. Data Security</h2>
      <p>
        We implement industry-standard security measures including:
      </p>
      <ul>
        <li>HTTPS/TLS encryption for all data in transit.</li>
        <li>Hashed passwords (bcrypt) — we never store plain-text passwords.</li>
        <li>HttpOnly session cookies to mitigate XSS attacks.</li>
        <li>Regular security audits and dependency updates.</li>
      </ul>
      <p>
        No method of transmission over the Internet or electronic storage is 100% secure. While we
        strive to protect your data, we cannot guarantee absolute security.
      </p>

      {/* 6 */}
      <h2>6. Your Rights</h2>
      <p>
        Depending on your location, you may have the following rights regarding your personal data:
      </p>
      <ul>
        <li><strong>Access:</strong> Request a copy of the data we hold about you.</li>
        <li><strong>Correction:</strong> Request correction of inaccurate data.</li>
        <li><strong>Deletion:</strong> Request permanent deletion of your account and data.
          Use our <Link href="/delete-account">Account Deletion page</Link> or email us.</li>
        <li><strong>Portability:</strong> Export your transaction data in CSV format (available
          in the app).</li>
        <li><strong>Withdrawal of Consent:</strong> Withdraw consent at any time by deleting
          your account.</li>
      </ul>
      <p>
        To exercise any of these rights, contact us at{" "}
        <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
      </p>

      {/* 7 */}
      <h2>7. Children&apos;s Privacy</h2>
      <p>
        {APP_NAME} is not directed at children under the age of 13. We do not knowingly collect
        personal information from children under 13. If you believe a child has provided us with
        personal information, please contact us and we will delete it.
      </p>

      {/* 8 */}
      <h2>8. Third-Party Links</h2>
      <p>
        Our app may contain links to third-party websites. We are not responsible for the privacy
        practices of those websites and encourage you to review their privacy policies.
      </p>

      {/* 9 */}
      <h2>9. Changes to This Policy</h2>
      <p>
        We may update this Privacy Policy from time to time. We will notify you of significant
        changes by posting the new policy on this page with an updated "Last updated" date. Your
        continued use of the app after any changes constitutes acceptance of the updated policy.
      </p>

      {/* 10 */}
      <h2>10. Contact Us</h2>
      <p>
        If you have questions, concerns, or requests regarding this Privacy Policy, please contact
        us:
      </p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Website:</strong> <a href={WEBSITE}>{WEBSITE}</a></li>
        <li><strong>Account deletion:</strong> <Link href="/delete-account">{WEBSITE}/delete-account</Link></li>
      </ul>

    </article>
  );
}
