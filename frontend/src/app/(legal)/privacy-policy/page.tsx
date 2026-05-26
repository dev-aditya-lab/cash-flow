import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How CashFlow collects, uses, and protects your personal data.",
};

const LAST_UPDATED   = "May 26, 2025";
const APP_NAME       = "CashFlow";
const CONTACT_EMAIL  = "schoolasium123@gmail.com";
const WEBSITE        = "https://cashflow.devaditya.dev";

// ── tiny shared primitives ────────────────────────────────────────────────────
function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xl font-bold text-foreground mt-10 mb-3 tracking-tight">
      {children}
    </h2>
  );
}
function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="text-base font-semibold text-foreground mt-6 mb-2">
      {children}
    </h3>
  );
}
function P({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-sm text-muted-foreground leading-relaxed mb-3">
      {children}
    </p>
  );
}
function UL({ children }: { children: React.ReactNode }) {
  return (
    <ul className="space-y-1.5 mb-4 ml-4 list-none">
      {children}
    </ul>
  );
}
function LI({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-sm text-muted-foreground leading-relaxed">
      <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground/50 shrink-0" />
      <span>{children}</span>
    </li>
  );
}
function Strong({ children }: { children: React.ReactNode }) {
  return <strong className="font-semibold text-foreground">{children}</strong>;
}
function A({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      className="text-foreground underline underline-offset-2 hover:opacity-70 transition-opacity"
    >
      {children}
    </a>
  );
}
function Divider() {
  return <div className="border-t border-border my-8" />;
}

// ── page ─────────────────────────────────────────────────────────────────────
export default function PrivacyPolicyPage() {
  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Privacy Policy
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <P>
        Welcome to <Strong>{APP_NAME}</Strong> ("{APP_NAME}", "we", "our", or "us"). We are
        committed to protecting your personal information and your right to privacy. This Privacy
        Policy explains how we collect, use, disclose, and safeguard your information when you use
        our mobile application and website (<A href={WEBSITE}>{WEBSITE}</A>).
      </P>
      <P>
        Please read this policy carefully. If you disagree with its terms, please discontinue use
        of the app.
      </P>

      <Divider />

      {/* 1 */}
      <H2>1. Information We Collect</H2>

      <H3>1.1 Information You Provide</H3>
      <UL>
        <LI><Strong>Account Data:</Strong> Name, email address, and password when you register.</LI>
        <LI><Strong>Financial Data:</Strong> Income and expense transactions you manually enter,
          including amounts, categories, dates, and optional notes.</LI>
        <LI><Strong>Feedback &amp; Reports:</Strong> Messages, ratings, and bug reports you
          voluntarily submit through the app.</LI>
      </UL>

      <H3>1.2 Information Collected Automatically</H3>
      <UL>
        <LI><Strong>Usage Data:</Strong> Pages visited, features used, and in-app actions — used
          to improve the product.</LI>
        <LI><Strong>Device Data:</Strong> Device type, operating system version, browser type, and
          time zone.</LI>
        <LI><Strong>Log Data:</Strong> IP address, access timestamps, and error logs collected by
          our servers.</LI>
        <LI><Strong>Cookies &amp; Local Storage:</Strong> We use a session cookie
          (<code className="font-mono text-xs bg-muted text-foreground px-1 py-0.5 rounded">cf_logged_in</code>) for
          authentication routing. No advertising or third-party tracking cookies are used.</LI>
      </UL>

      <H3>1.3 Information We Do NOT Collect</H3>
      <UL>
        <LI>Bank account numbers, card numbers, or any payment credentials.</LI>
        <LI>Government ID or tax information.</LI>
        <LI>Location data.</LI>
        <LI>Contacts or media from your device.</LI>
      </UL>

      <Divider />

      {/* 2 */}
      <H2>2. How We Use Your Information</H2>
      <P>We use the information we collect to:</P>
      <UL>
        <LI>Create and manage your account.</LI>
        <LI>Provide, operate, and maintain the {APP_NAME} service.</LI>
        <LI>Display your transaction history and analytics.</LI>
        <LI>Send transactional emails (email verification, password reset).</LI>
        <LI>Respond to your feedback, reports, and support requests.</LI>
        <LI>Monitor and improve performance, security, and reliability.</LI>
        <LI>Comply with legal obligations.</LI>
      </UL>
      <P>
        We <Strong>do not</Strong> sell, rent, or trade your personal information to any third
        party for marketing purposes.
      </P>

      <Divider />

      {/* 3 */}
      <H2>3. How We Share Your Information</H2>
      <P>We only share data in limited circumstances:</P>
      <UL>
        <LI><Strong>Service Providers:</Strong> Trusted vendors who assist in operating our
          infrastructure (e.g., hosting, email delivery). They are contractually obligated to
          protect your data.</LI>
        <LI><Strong>Legal Requirements:</Strong> When required by law, court order, or governmental
          authority.</LI>
        <LI><Strong>Business Transfers:</Strong> In the event of a merger or acquisition, your data
          may be transferred. We will notify you beforehand.</LI>
        <LI><Strong>With Your Consent:</Strong> For any other purpose with your explicit
          permission.</LI>
      </UL>

      <Divider />

      {/* 4 */}
      <H2>4. Data Retention</H2>
      <P>
        We retain your personal data for as long as your account is active or as needed to provide
        services. When you delete your account, we will permanently delete your personal data and
        transaction records within <Strong>30 days</Strong>, except where we are required by law
        to retain certain information.
      </P>

      <Divider />

      {/* 5 */}
      <H2>5. Data Security</H2>
      <P>We implement industry-standard security measures including:</P>
      <UL>
        <LI>HTTPS/TLS encryption for all data in transit.</LI>
        <LI>Hashed passwords (bcrypt) — we never store plain-text passwords.</LI>
        <LI>HttpOnly session cookies to mitigate XSS attacks.</LI>
        <LI>Regular security audits and dependency updates.</LI>
      </UL>
      <P>
        No method of transmission over the Internet or electronic storage is 100% secure. While we
        strive to protect your data, we cannot guarantee absolute security.
      </P>

      <Divider />

      {/* 6 */}
      <H2>6. Your Rights</H2>
      <P>
        Depending on your location, you may have the following rights regarding your personal data:
      </P>
      <UL>
        <LI><Strong>Access:</Strong> Request a copy of the data we hold about you.</LI>
        <LI><Strong>Correction:</Strong> Request correction of inaccurate data.</LI>
        <LI>
          <Strong>Deletion:</Strong> Request permanent deletion of your account and data.
          Use our{" "}
          <Link href="/delete-account" className="text-foreground underline underline-offset-2 hover:opacity-70">
            Account Deletion page
          </Link>{" "}
          or email us.
        </LI>
        <LI><Strong>Portability:</Strong> Export your transaction data in CSV format (available
          in the app).</LI>
        <LI><Strong>Withdrawal of Consent:</Strong> Withdraw consent at any time by deleting
          your account.</LI>
      </UL>
      <P>
        To exercise any of these rights, contact us at{" "}
        <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>.
      </P>

      <Divider />

      {/* 7 */}
      <H2>7. Children&apos;s Privacy</H2>
      <P>
        {APP_NAME} is not directed at children under the age of 13. We do not knowingly collect
        personal information from children under 13. If you believe a child has provided us with
        personal information, please contact us and we will delete it.
      </P>

      <Divider />

      {/* 8 */}
      <H2>8. Third-Party Links</H2>
      <P>
        Our app may contain links to third-party websites. We are not responsible for the privacy
        practices of those websites and encourage you to review their privacy policies.
      </P>

      <Divider />

      {/* 9 */}
      <H2>9. Changes to This Policy</H2>
      <P>
        We may update this Privacy Policy from time to time. We will notify you of significant
        changes by posting the new policy on this page with an updated &ldquo;Last updated&rdquo;
        date. Your continued use of the app after any changes constitutes acceptance of the updated
        policy.
      </P>

      <Divider />

      {/* 10 */}
      <H2>10. Contact Us</H2>
      <P>If you have questions, concerns, or requests regarding this Privacy Policy:</P>
      <UL>
        <LI><Strong>Email:</Strong> <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A></LI>
        <LI><Strong>Website:</Strong> <A href={WEBSITE}>{WEBSITE}</A></LI>
        <LI>
          <Strong>Account deletion:</Strong>{" "}
          <Link href="/delete-account" className="text-foreground underline underline-offset-2 hover:opacity-70">
            {WEBSITE}/delete-account
          </Link>
        </LI>
      </UL>

    </div>
  );
}
