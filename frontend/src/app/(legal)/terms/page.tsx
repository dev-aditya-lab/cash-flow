import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "Terms and conditions for using the CashFlow personal finance app.",
};

const LAST_UPDATED   = "May 26, 2025";
const APP_NAME       = "CashFlow";
const CONTACT_EMAIL  = "schoolasium123@gmail.com";
const WEBSITE        = "https://cashflow.devaditya.dev";

// ── shared primitives ─────────────────────────────────────────────────────────
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
  return <ul className="space-y-1.5 mb-4 ml-4 list-none">{children}</ul>;
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
export default function TermsPage() {
  return (
    <div className="max-w-2xl">

      {/* Header */}
      <div className="mb-10">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
          Legal
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
          Terms of Service
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Last updated: {LAST_UPDATED}
        </p>
      </div>

      <P>
        These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of{" "}
        <Strong>{APP_NAME}</Strong> (the &ldquo;Service&rdquo;), operated by Dev Aditya
        (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;). By downloading, installing, or
        using {APP_NAME}, you agree to be bound by these Terms. If you do not agree, do not use
        the Service.
      </P>

      <Divider />

      {/* 1 */}
      <H2>1. Eligibility</H2>
      <P>
        You must be at least <Strong>13 years old</Strong> to use {APP_NAME}. By using the
        Service, you represent that you meet this requirement. If you are using {APP_NAME} on
        behalf of an organisation, you represent that you have authority to bind that organisation
        to these Terms.
      </P>

      <Divider />

      {/* 2 */}
      <H2>2. Your Account</H2>
      <UL>
        <LI>You are responsible for maintaining the confidentiality of your account credentials.</LI>
        <LI>You must provide accurate and complete information when registering.</LI>
        <LI>
          You must notify us immediately at{" "}
          <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A>{" "}
          if you suspect unauthorised access to your account.
        </LI>
        <LI>You are responsible for all activity that occurs under your account.</LI>
        <LI>You may not create more than one account without our express permission.</LI>
      </UL>

      <Divider />

      {/* 3 */}
      <H2>3. Acceptable Use</H2>
      <P>
        You agree to use {APP_NAME} only for lawful, personal, non-commercial purposes. You must
        not:
      </P>
      <UL>
        <LI>Use the Service for any illegal purpose or in violation of applicable laws.</LI>
        <LI>Attempt to gain unauthorised access to any part of the Service or its servers.</LI>
        <LI>Reverse-engineer, decompile, or disassemble any portion of the app.</LI>
        <LI>Upload or transmit viruses, malware, or any harmful code.</LI>
        <LI>Scrape, crawl, or data-mine the Service without written permission.</LI>
        <LI>Use the Service to store or transmit harassing, defamatory, or unlawful content.</LI>
        <LI>Impersonate another person or entity.</LI>
      </UL>

      <Divider />

      {/* 4 */}
      <H2>4. The Service</H2>

      <H3>4.1 Personal Finance Tool</H3>
      <P>
        {APP_NAME} is a personal finance tracking tool provided for informational and
        organisational purposes only. <Strong>Nothing in {APP_NAME} constitutes financial,
        investment, tax, or legal advice.</Strong> Always consult a qualified professional for
        advice specific to your situation.
      </P>

      <H3>4.2 No Bank Integration</H3>
      <P>
        {APP_NAME} does not connect to your bank or financial institutions. All transaction data
        is entered manually by you. We are not responsible for any errors in your manually entered
        data.
      </P>

      <H3>4.3 Service Availability</H3>
      <P>
        We strive to maintain high availability but do not guarantee that the Service will be
        available at all times. We may suspend or terminate the Service for maintenance, security
        reasons, or other circumstances.
      </P>

      <Divider />

      {/* 5 */}
      <H2>5. Intellectual Property</H2>
      <P>
        All content, design, code, logos, and trademarks in {APP_NAME} are the property of Dev
        Aditya or its licensors and are protected by applicable intellectual property laws. You
        may not copy, modify, distribute, or create derivative works without our express written
        consent.
      </P>
      <P>
        You retain ownership of all data you enter into the app. By using {APP_NAME}, you grant
        us a limited, non-exclusive licence to store and process your data solely to provide the
        Service.
      </P>

      <Divider />

      {/* 6 */}
      <H2>6. Privacy</H2>
      <P>
        Our{" "}
        <Link
          href="/privacy-policy"
          className="text-foreground underline underline-offset-2 hover:opacity-70"
        >
          Privacy Policy
        </Link>{" "}
        describes how we collect, use, and share information about you. By using {APP_NAME}, you
        agree to our Privacy Policy.
      </P>

      <Divider />

      {/* 7 */}
      <H2>7. Account Deletion &amp; Data</H2>
      <P>
        You may request deletion of your account and all associated data at any time via the
        app&apos;s Profile page or our{" "}
        <Link
          href="/delete-account"
          className="text-foreground underline underline-offset-2 hover:opacity-70"
        >
          Account Deletion Request page
        </Link>
        . We will permanently delete your data within 30 days of a verified deletion request,
        subject to any legal retention obligations.
      </P>

      <Divider />

      {/* 8 */}
      <H2>8. Termination</H2>
      <P>
        We reserve the right to suspend or terminate your account at any time, with or without
        notice, if we believe you have violated these Terms or for any other reason at our sole
        discretion. Upon termination, your right to use the Service ceases immediately.
      </P>

      <Divider />

      {/* 9 */}
      <H2>9. Disclaimers</H2>
      <P>
        THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS AVAILABLE&rdquo; WITHOUT
        WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO IMPLIED
        WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
        WE DO NOT WARRANT THAT THE SERVICE WILL BE ERROR-FREE, SECURE, OR UNINTERRUPTED.
      </P>

      <Divider />

      {/* 10 */}
      <H2>10. Limitation of Liability</H2>
      <P>
        TO THE FULLEST EXTENT PERMITTED BY LAW, DEV ADITYA SHALL NOT BE LIABLE FOR ANY INDIRECT,
        INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS OR DATA,
        ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SERVICE, EVEN IF WE HAVE BEEN
        ADVISED OF THE POSSIBILITY OF SUCH DAMAGES.
      </P>

      <Divider />

      {/* 11 */}
      <H2>11. Governing Law</H2>
      <P>
        These Terms are governed by the laws of <Strong>India</Strong>. Any disputes arising
        under these Terms shall be subject to the exclusive jurisdiction of the courts of India.
      </P>

      <Divider />

      {/* 12 */}
      <H2>12. Changes to Terms</H2>
      <P>
        We may update these Terms at any time. We will post the updated Terms on this page with a
        revised &ldquo;Last updated&rdquo; date. Material changes will be notified via the app or
        email. Continued use of {APP_NAME} after any change constitutes your acceptance of the
        new Terms.
      </P>

      <Divider />

      {/* 13 */}
      <H2>13. Contact</H2>
      <P>For questions about these Terms, please contact us:</P>
      <UL>
        <LI><Strong>Email:</Strong> <A href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</A></LI>
        <LI><Strong>Website:</Strong> <A href={WEBSITE}>{WEBSITE}</A></LI>
      </UL>

    </div>
  );
}
