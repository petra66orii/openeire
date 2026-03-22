import React from "react";
import { Link } from "react-router-dom";

const RefundPolicy: React.FC = () => {
  return (
    <div className="bg-black min-h-screen text-white">
      <div className="legal-content">
        <h1>Refund & Return Policy</h1>
        <p>
          <strong>Last Updated: March 2026</strong>
        </p>
        <p>
          OpenEire Studios sells two distinct product types: digital media
          licences and physical art prints. Because these products are fulfilled
          differently, the refund and return rules are different as well. Nothing
          in this policy affects your statutory rights under Irish or European
          Union consumer protection law.
        </p>

      <hr />

      <h2>1. Digital Downloads & Licensing</h2>
      <p>
        This section applies to digital files purchased for personal use and to
        digital assets licensed for commercial or editorial use.
      </p>
      <h3>All Digital Sales Are Final</h3>
      <p>
        Because digital assets are delivered immediately and cannot be returned
        in a physical sense, we do not offer refunds, returns, or exchanges for
        digital products once the secure download link has been generated and
        sent.
      </p>
      <h3>EU 14-Day Right of Withdrawal Waiver</h3>
      <p>
        Under EU consumer law, customers generally have a 14-day right to
        cancel online purchases. By purchasing a digital download from
        OpenEire Studios, you explicitly consent to immediate digital delivery
        and acknowledge that you lose that withdrawal right once download
        access begins.
      </p>
      <h3>Exceptions for Corrupted or Incorrect Files</h3>
      <p>
        If the file you receive is corrupted, damaged, or does not match the
        product specifications shown at purchase, contact us within 7 days of
        purchase.
      </p>
      <ul>
        <li>We will first attempt to provide a replacement file.</li>
        <li>
          If a replacement cannot be provided, we will issue a full refund for
          the affected digital product.
        </li>
      </ul>

      <h2>2. Physical Art Prints</h2>
      <p>
        Physical prints are produced through specialist Print-on-Demand
        partners and are custom-made to the selected size, material, and
        finish after the order is placed.
      </p>
      <h3>Change of Mind Returns</h3>
      <p>
        Because each print is bespoke and made to order, physical prints are
        exempt from the standard EU 14-day right of withdrawal for change of
        mind. We cannot offer refunds if the wrong size or finish is chosen, or
        if you simply change your mind after production begins.
      </p>
      <h3>Damaged, Defective, or Incorrect Items</h3>
      <p>
        If your print arrives damaged in transit, has a manufacturing defect,
        or is not the item you ordered, we will replace it at no additional
        cost.
      </p>
      <ol>
        <li>Contact us within 14 days of receiving the item.</li>
        <li>
          Include your order number and clear photographs of the issue,
          including the packaging where relevant.
        </li>
        <li>
          Once the issue is reviewed and approved, we will arrange a replacement
          to the original shipping address.
        </li>
      </ol>
      <p>
        If a replacement is not possible, we will issue a full refund for the
        physical item.
      </p>

      <h2>3. Processing Approved Refunds</h2>
      <p>
        If a refund is approved for a corrupted digital file or an
        unreplaceable damaged print:
      </p>
      <ul>
        <li>
          The refund will be issued to the original payment method used at
          checkout.
        </li>
        <li>
          Please allow 5 to 10 business days for the funds to appear,
          depending on your bank or card provider.
        </li>
      </ul>

      <h2>4. Contact Us</h2>
      <p>
        To report a damaged package, request a replacement, or raise a digital
        delivery issue, please contact us at{" "}
        <a href="mailto:support@openeire.ie">support@openeire.ie</a>.
      </p>
        <p>
          You can also review our <Link to="/shipping">Shipping Policy</Link> for
          dispatch and transit expectations.
        </p>
      </div>
    </div>
  );
};

export default RefundPolicy;
