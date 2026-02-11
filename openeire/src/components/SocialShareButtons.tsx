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
  image?: string;
}

const SocialShareButtons: React.FC<SocialShareButtonsProps> = ({
  url,
  title,
  image,
}) => {
  const size = 32;
  const radius = 8;

  return (
    <div className="flex gap-2">
      <FacebookShareButton
        url={url}
        className="hover:opacity-80 transition-opacity"
      >
        <FacebookIcon size={size} borderRadius={radius} />
      </FacebookShareButton>
      <TwitterShareButton
        url={url}
        title={title}
        className="hover:opacity-80 transition-opacity"
      >
        <TwitterIcon size={size} borderRadius={radius} />
      </TwitterShareButton>
      <WhatsappShareButton
        url={url}
        title={title}
        separator=":: "
        className="hover:opacity-80 transition-opacity"
      >
        <WhatsappIcon size={size} borderRadius={radius} />
      </WhatsappShareButton>
      <LinkedinShareButton
        url={url}
        title={title}
        className="hover:opacity-80 transition-opacity"
      >
        <LinkedinIcon size={size} borderRadius={radius} />
      </LinkedinShareButton>
      {image && (
        <PinterestShareButton
          url={url}
          media={image}
          description={title}
          className="hover:opacity-80 transition-opacity"
        >
          <PinterestIcon size={size} borderRadius={radius} />
        </PinterestShareButton>
      )}
    </div>
  );
};

export default SocialShareButtons;
