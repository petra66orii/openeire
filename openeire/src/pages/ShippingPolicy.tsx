import React from "react";
import { Link } from "react-router-dom";
import SEOHead from "../components/SEOHead";

const ShippingPolicy: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <SEOHead
        title="Shipping Policy"
        description="Review OpenÉire Studios shipping and delivery information for digital products, licensing fulfilment, and physical art prints."
        canonicalPath="/shipping"
      />
      <div className="legal-content">
        <h1>Shipping & Delivery Policy</h1>
        <p>
          <strong>Last Updated: March 2026</strong>
        </p>
        <p>
          At OpenEire Studios, we deliver our premium media in two formats:
          digital vault delivery for commercial licences and digital downloads,
          and physical print delivery for bespoke, museum-quality art prints.
          We currently ship physical prints exclusively to Ireland and the United
          States.
        </p>

      <hr />

      <h2>1. Digital Vault Delivery</h2>
      <p>
        If you have purchased a digital download for personal use or a
        rights-managed digital asset for commercial or editorial use, no
        physical item will be shipped to you.
      </p>
      <p>
        Upon successful payment, our secure delivery flow generates a
        time-sensitive download link and sends it to the email address provided
        at checkout.
      </p>
      <ul>
        <li>There are no shipping fees for digital products.</li>
        <li>The download link is delivered immediately after successful payment.</li>
        <li>
          For security and copyright protection, the secure link expires 48
          hours after it is generated.
        </li>
        <li>
          We recommend downloading and backing up your high-resolution files as
          soon as you receive them.
        </li>
      </ul>

      <h2>2. Physical Art Prints</h2>
      <p>
        We partner with a specialist Print-on-Demand network to manufacture our
        physical fine art prints. Every physical order is bespoke and produced
        specifically for you after checkout.
      </p>
      <h3>Localized Printing</h3>
      <p>
        To reduce delivery time, orders are typically routed to the print lab
        closest to the delivery address. United States orders are usually
        printed in the US, and Irish orders are typically printed within the
        EU or UK network.
      </p>
      <h3>Production Times</h3>
      <p>
        Because your artwork may be custom-printed, framed, or mounted on
        demand, production and quality assurance take place before dispatch.
        Shipping transit times are additional to production time.
      </p>

      <h2>3. Shipping Methods & Transit Times</h2>
      <p>
        Shipping costs are calculated dynamically at checkout based on artwork
        size, material, and delivery destination. We currently offer three
        shipping tiers:
      </p>
      <ul>
        <li>
          <strong>Budget:</strong> Typically an untracked or slower postal
          service. Some products and destinations may still include tracking.
        </li>
        <li>
          <strong>Standard:</strong> Standard postal delivery. Tracking depends
          on destination and product type.
        </li>
        <li>
          <strong>Express:</strong> A premium courier service, typically
          tracked, using providers such as FedEx, DHL, or DPD.
        </li>
      </ul>
      <h3>Estimated Standard Postal Transit Times</h3>
      <ul>
        <li>
          <strong>US to US:</strong> 4 to 6 working days
        </li>
        <li>
          <strong>EU or UK to Ireland:</strong> 5 to 7 working days
        </li>
        <li>
          <strong>EU or UK to US:</strong> 10 to 15 working days for specialty
          items printed in Europe
        </li>
      </ul>
      <h3>Estimated Express Transit Times</h3>
      <p>
        Orders shipped using the express option usually arrive within 1 to 6
        working days after dispatch.
      </p>

      <h2>4. Customs, Duties, and Import Taxes</h2>
      <p>
        Because we use a localized printing network, most physical orders are
        fulfilled domestically within the customer&apos;s region. This means
        import charges are uncommon, but they may still apply in some cases.
      </p>
      <ul>
        <li>
          The buyer is responsible for any customs charges, import taxes, or
          duties that apply at delivery.
        </li>
        <li>
          OpenEire Studios is not responsible for delays caused by customs
          processing.
        </li>
      </ul>

      <h2>5. Lost or Damaged Packages</h2>
      <p>
        We insure our physical shipments. A package is considered lost in
        transit if it has not arrived within the following timeframes after
        dispatch:
      </p>
      <ul>
        <li>
          <strong>US domestic orders:</strong> 10 working days
        </li>
        <li>
          <strong>Ireland orders from the EU or UK network:</strong> 15 working
          days
        </li>
        <li>
          <strong>US orders shipped from the EU or UK:</strong> 28 working days
        </li>
      </ul>
        <p>
          If a package is lost within those criteria, or if it arrives damaged,
          we will arrange a replacement at no additional cost. For reporting
          damage or replacement requests, please review our{" "}
          <Link to="/refunds">Refund & Return Policy</Link>.
        </p>
      </div>
    </div>
  );
};

export default ShippingPolicy;
