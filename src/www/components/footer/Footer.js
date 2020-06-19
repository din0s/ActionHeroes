import "./Footer.scss";

import React from "react";
import { useTranslation } from "react-i18next";

const fb_icon = "/img/social_media/facebook.svg";
const insta_icon = "/img/social_media/instagram.svg";
const twitter_icon = "/img/social_media/twitter.svg";
const linkedin_icon = "/img/social_media/linkedin.svg";
const github_icon = "/img/social_media/github.svg";

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer>
      <hr className="Divider" />
      <div className = "Content">
        <div className="Copyrights">
          <p>&copy; ActionHeroes 2020</p>
          <p>
            {t("footer.icons", { site: "flaticon.com", site2: "unsplash.com" })}
          </p>
        </div>
        <div className="Social_Media">
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.facebook.com"
          >
            <img alt="fb_icon" src={fb_icon} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.instagram.com"
          >
            <img alt="insta_icon" src={insta_icon} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.twitter.com"
          >
            <img alt="twitter_icon" src={twitter_icon} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://www.linkedin.com"
          >
            <img alt="linkedin_icon" src={linkedin_icon} />
          </a>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://github.com/din0s/ActionHeroes/"
          >
            <img alt="github_icon" src={github_icon} />
          </a>
        </div>
      </div>
    </footer>
  );
}