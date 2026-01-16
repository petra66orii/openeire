import React from "react";
import {
  FacebookShareButton,
  TwitterShareButton,
  LinkedinShareButton,
  PinterestShareButton,
  WhatsappShareButton,
  FacebookIcon,
  TwitterIcon,
  LinkedinIcon,
  PinterestIcon,
  WhatsappIcon,
} from "react-share";

interface SocialShareButtonsProps {
  url: string;
  title: string;
  image?: string; // Needed for Pinterest
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  image,
}) => {
  const iconSize = 40;
  const iconRadius = 10; // Rounded corners

  return (
    <div className="flex gap-3 mt-6">
      {/* Facebook */}
      <FacebookShareButton
        url={url}
        className="hover:opacity-80 transition-opacity"
      >
        <FacebookIcon size={iconSize} borderRadius={iconRadius} />
      </FacebookShareButton>

      {/* Twitter / X */}
      <TwitterShareButton
        url={url}
        title={title}
        className="hover:opacity-80 transition-opacity"
      >
        {/* Note: React-share might still call it TwitterIcon, but it works for X */}
        <TwitterIcon size={iconSize} borderRadius={iconRadius} />
      </TwitterShareButton>

      {/* WhatsApp (Great for mobile) */}
      <WhatsappShareButton
        url={url}
        title={title}
        separator=":: "
        className="hover:opacity-80 transition-opacity"
      >
        <WhatsappIcon size={iconSize} borderRadius={iconRadius} />
      </WhatsappShareButton>

      {/* LinkedIn */}
      <LinkedinShareButton
        url={url}
        title={title}
        className="hover:opacity-80 transition-opacity"
      >
        <LinkedinIcon size={iconSize} borderRadius={iconRadius} />
      </LinkedinShareButton>

      {/* Pinterest (Only shows if we have an image) */}
      {image && (
        <PinterestShareButton
          url={url}
          media={image}
          description={title}
          className="hover:opacity-80 transition-opacity"
        >
          <PinterestIcon size={iconSize} borderRadius={iconRadius} />
        </PinterestShareButton>
      )}
    </div>
  );
};

export default SocialShareButtons;
