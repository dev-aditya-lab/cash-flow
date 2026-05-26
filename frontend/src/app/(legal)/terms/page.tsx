import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the CashFlow personal finance app.",
};

const LAST_UPDATED  = "May 26, 2025";
const APP_NAME      = "CashFlow";
const CONTACT_EMAIL = "schoolasium123@gmail.com";
const WEBSITE       = "https://cashflow.devaditya.dev";

export default function TermsPage() {
  return (
    <article className="prose prose-sm sm:prose-base dark:prose-invert max-w-none">

      {/* Header */}
      <div className="not-prose mb-8">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">Legal</p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Terms of Service</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: {LAST_UPDATED}</p>
      </div>

      <p>
        These Terms of Service ("Terms") govern your access to and use of{" "}
        <strong>{APP_NAME}</strong> (the "Service"), operated by Dev Aditya ("we", "us", "our").
        By downloading, installing, or using {APP_NAME}, you agree to be bound by these Terms. If
        you do not agree, do not use the Service.
      </p>

      {/* 1 */}
      <h2>1. Eligibility</h2>
      <p>
        You must be at least <strong>13 years old</strong> to use {APP_NAME}. By using the
        Service, you represent that you meet this requirement. If you are using {APP_NAME} on
        behalf of an organisation, you represent that you have authority to bind that organisation
        to these Terms.
      </p>

      {/* 2 */}
      <h2>2. Your Account</h2>
      <ul>
        <li>You are responsible for maintaining the confidentiality of your account credentials.</li>
        <li>You must provide accurate and complete information when registering.</li>
        <li>You must notify us immediately at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a> if you suspect
          unauthorised access to your account.</li>
        <li>You are responsible for all activity that occurs under your account.</li>
        <li>You may not create more than one account without our express permission.</li>
      </ul>

      {/* 3 */}
      <h2>3. Acceptable Use</h2>
      <p>You agree to use {APP_NAME} only for lawful, personal, non-commercial purposes. You must not:</p>
      <ul>
        <li>Use the Service for any illegal purpose or in violation of applicable laws.</li>
        <li>Attempt to gain unauthorised access to any part of the Service or its servers.</li>
        <li>Reverse-engineer, decompile, or disassemble any portion of the app.</li>
        <li>Upload or transmit viruses, malware, or any harmful code.</li>
        <li>Scrape, crawl, or data-mine the Service without written permission.</li>
        <li>Use the Service to store or transmit harassing, defamatory, or unlawful content.</li>
        <li>Impersonate another person or entity.</li>
      </ul>

      {/* 4 */}
      <h2>4. The Service</h2>
      <h3>4.1 Personal Finance Tool</h3>
      <p>
        {APP_NAME} is a personal finance tracking tool. It is provided for informational and
        organisational purposes only. <strong>Nothing in {APP_NAME} constitutes financial,
        investment, tax, or legal advice.</strong> Always consult a qualified professional for
        advice specific to your situation.
      </p>

      <h3>4.2 No Bank Integration</h3>
      <p>
        {APP_NAME} does not connect to your bank or financial institutions. All transaction data
        is entered manually by you. We are not responsible for any errors in your manually entered
        data.
      </p>

      <h3>4.3 Service Availability</h3>
      <p>
        We strive to maintain high availability but do not guarantee that the Service will be
        available at all times. We may suspend or terminate the Service for maintenance, security
        reasons, or other circumstances.
      </p>

      {/* 5 */}
      <h2>5. Intellectual Property</h2>
      <p>
        All content, design, code, logos, and trademarks in {APP_NAME} are the property of Dev
        Aditya or its licensors and are protected by applicable intellectual property laws. You may
        not copy, modify, distribute, or create derivative works without our express written
        consent.
      </p>
      <p>
        You retain ownership of all data you enter into the app. By using {APP_NAME}, you grant us
        a limited, non-exclusive licence to store and process your data solely to provide the
        Service.
      </p>

      {/* 6 */}
      <h2>6. Privacy</h2>
      <p>
        Our <Link href="/privacy-policy">Privacy Policy</Link> describes how we collect, use, and
        share information about you. By using {APP_NAME}, you agree to our Privacy Policy.
      </p>

      {/* 7 */}
      <h2>7. Account Deletion &amp; Data</h2>
      <p>
        You may request deletion of your account and all associated data at any time via the
        app's Profile page or our{" "}
        <Link href="/delete-account">Account Deletion Request page</Link>. We will permanently
        delete your data within 30 days of a verified deletion request, subject to any legal
        retention obligations.
      </p>

      {/* 8 */}
      <h2>8. Termination</h2>
      <p>
        We reserve the right to suspend or terminate your account at any time, with or without
        notice, if we believe you have violated these Terms or for any other reason at our sole
        discretion. Upon termination, your right to use the Service ceases immediately.
      </p>

      {/* 9 */}
      <h2>9. Disclaimers</h2>
      <p>
        THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND, EITHER
        EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED WARRANTIES OF MERCHANTABILITY,
        FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT. WE DO NOT WARRANT THAT THE SERVICE
        WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
      </p>

      {/* 10 */}
      <h2>10. Limitation of Liability</h2>
      <p>
        TO THE FULLEST EXTENT PERMITTED BY LAW, DEV ADITYA SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR DATA,
        ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN ADVISED
        OF THE POSSIBILITY OF SUCH DAMAGES.
      </p>

      {/* 11 */}
      <h2>11. Governing Law</h2>
      <p>
        These Terms are governed by the laws of <strong>India</strong>. Any disputes arising under
        these Terms shall be subject to the exclusive jurisdiction of the courts of India.
      </p>

      {/* 12 */}
      <h2>12. Changes to Terms</h2>
      <p>
        We may update these Terms at any time. We will post the updated Terms on this page with a
        revised "Last updated" date. Material changes will be notified via the app or email.
        Continued use of {APP_NAME} after any change constitutes your acceptance of the new Terms.
      </p>

      {/* 13 */}
      <h2>13. Contact</h2>
      <p>For questions about these Terms, please contact us:</p>
      <ul>
        <li><strong>Email:</strong> <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></li>
        <li><strong>Website:</strong> <a href={WEBSITE}>{WEBSITE}</a></li>
      </ul>

    </article>
  );
}
