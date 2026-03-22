import React from "react";
import { Link } from "react-router-dom";

const TermsAndConditions: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="legal-content">
        <h1>Terms & Conditions</h1>
        <p>
          <strong>Last Updated: March 2026</strong>
        </p>
        <p>
          Welcome to OpenEire Studios. These Terms & Conditions ("Terms")
          govern your access to and use of our website, as well as the purchase
          of any physical prints, digital downloads, or commercial media
          licenses. By accessing our website or placing an order, you agree to
          be bound by these Terms. If you do not agree to these Terms, please do
          not use our site or purchase our products.
        </p>

      <hr />

      <h2>1. About Us</h2>
      <p>
        This website is operated by OpenEire Studios, based in Ireland.
        Throughout the site, the terms "we", "us", and "our" refer to
        OpenEire Studios.
      </p>

      <h2>2. Products and Services</h2>
      <p>We offer two distinct categories of products:</p>
      <ol>
        <li>
          <strong>Physical Prints:</strong> Bespoke, made-to-order art prints
          fulfilled via our Print-on-Demand partners.
        </li>
        <li>
          <strong>Digital Media:</strong> High-resolution digital files
          provided under a strict Personal Use Licence or a Rights-Managed
          Commercial Licence.
        </li>
      </ol>
      <h3>Purchasing a Licence, Not Ownership</h3>
      <p>
        When you purchase digital media from OpenEire Studios, you are
        purchasing a limited licence to use the asset, not the ownership of
        the asset itself. All copyright and intellectual property rights remain
        the exclusive property of OpenEire Studios.
      </p>

      <h2>3. Intellectual Property & Strict Licensing Rules</h2>
      <p>
        Your use of any digital or physical product purchased from OpenEire
        Studios is strictly governed by our licensing terms. By purchasing from
        us, you expressly agree that you will not:
      </p>
      <ul>
        <li>
          Use any digital file as the primary value component of physical
          merchandise or Print-on-Demand products for resale.
        </li>
        <li>
          Upload, use, or embed any asset for the purpose of training
          artificial intelligence, machine learning systems, or generative
          models.
        </li>
        <li>
          Mint, tokenise, or commercialise the assets as NFTs or via blockchain
          technology.
        </li>
        <li>
          Remove, alter, or obscure any embedded metadata, copyright notices,
          or digital watermarks.
        </li>
      </ul>
      <p>
        For full details regarding permitted uses, please read our{" "}
        <Link to="/licensing">Licensing & Usage Rights</Link> page.
        Unauthorised use constitutes copyright infringement and may result in
        legal action.
      </p>

      <h2>4. Orders, Pricing, and Payments</h2>
      <ul>
        <li>
          <strong>Pricing:</strong> All prices are subject to change without
          notice. We reserve the right to modify or discontinue any product or
          service at any time.
        </li>
        <li>
          <strong>Payments:</strong> Payments are securely processed via
          Stripe. You agree to provide current, complete, and accurate purchase
          and account information for all purchases made through our store.
        </li>
        <li>
          <strong>Custom Quotes:</strong> Commercial Rights-Managed licences
          require approval and are subject to custom pricing based on your
          intended media, territory, duration, and reach.
        </li>
      </ul>

      <h2>5. Fulfillment and Delivery</h2>
      <ul>
        <li>
          <strong>Physical Prints:</strong> Physical orders are routed to our
          global Print-on-Demand network. Production and transit times vary.
          Please review our <Link to="/shipping">Shipping & Delivery Policy</Link>{" "}
          for detailed estimates.
        </li>
        <li>
          <strong>Digital Vault:</strong> Digital purchases are delivered via a
          secure, pre-signed download link sent to your email. This link
          automatically expires after 48 hours.
        </li>
        <li>
          <strong>Customs & Duties:</strong> For physical shipments crossing
          international borders, the buyer is responsible for any customs fees,
          import taxes, or duties applied by their local government.
        </li>
      </ul>

      <h2>6. Returns, Refunds, and Consumer Rights</h2>
      <p>
        Because of the nature of our products, our return policies are strictly
        defined:
      </p>
      <ul>
        <li>
          <strong>Physical Prints:</strong> As bespoke, custom-made goods,
          physical prints are exempt from standard change-of-mind return
          policies.
        </li>
        <li>
          <strong>Digital Files:</strong> By purchasing a digital download, you
          consent to immediate delivery and acknowledge the loss of your
          14-day right of withdrawal under EU consumer law.
        </li>
        <li>
          <strong>Defective Goods:</strong> We will replace physical prints
          damaged in transit or digital files that are corrupted. For full
          instructions, please review our <Link to="/refunds">Refund & Return Policy</Link>.
        </li>
      </ul>
      <p>
        Nothing in these Terms limits your statutory rights under Irish or
        European Union consumer protection law.
      </p>

      <h2>7. Limitation of Liability</h2>
      <p>
        To the maximum extent permitted by applicable law, OpenEire Studios
        shall not be liable for any indirect, incidental, special,
        consequential, or punitive damages, including without limitation loss
        of profits, data, use, goodwill, or other intangible losses, resulting
        from your access to or use of, or inability to access or use, the
        website, any conduct or content of any third party on the website, or
        unauthorised access, use, or alteration of your transmissions or
        content.
      </p>

      <h2>8. Indemnification</h2>
      <p>
        You agree to indemnify and hold harmless OpenEire Studios and its
        affiliates, partners, and employees from any claim or demand, including
        reasonable legal fees, made by any third party due to or arising out of
        your breach of these Terms, your violation of any law, or your misuse
        of our licensed assets.
      </p>

      <h2>9. Governing Law and Jurisdiction</h2>
      <p>
        These Terms and any separate agreements whereby we provide services
        shall be governed by and construed in accordance with the laws of
        Ireland and applicable European Union law. OpenEire Studios reserves
        the right to pursue enforcement and remedies for copyright infringement
        in the jurisdiction where the infringement occurs and/or where the
        licensee is established.
      </p>

      <h2>10. Changes to Terms & Conditions</h2>
      <p>
        We reserve the right to update, change, or replace any part of these
        Terms by posting updates and/or changes to our website. It is your
        responsibility to check this page periodically for changes. Your
        continued use of or access to the website following the posting of any
        changes constitutes acceptance of those changes.
      </p>

        <h2>11. Contact Information</h2>
        <p>
          Questions about these Terms & Conditions can be sent to{" "}
          <a href="mailto:contact@openeire.ie">contact@openeire.ie</a>.
        </p>
      </div>
    </div>
  );
};

export default TermsAndConditions;
