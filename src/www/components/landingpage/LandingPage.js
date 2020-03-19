import "./LandingPage.scss";

import React, { Component } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Parallax } from 'react-parallax';
import ScrollUpButton from "react-scroll-up-button";

const bgkidimg = '/img/KidBackground.png';
const bgimg = '/img/background.jpg';
const innerimg = './img/volunteer.svg';


export default function LandingPage() {       //I need to fill the "alt"s
  const { t } = useTranslation();
  return (
    <div className='container'>
      <Parallax className='parallax' bgImage={bgkidimg} bgImageAlt="the alt" strength={500}>
        <div className='panel'>
          <img className='innerphoto' src={innerimg} />
          <div className='innertextcontainer'>
            <p className='catchphrase'>{t("landingpage.catchphrase")}</p>
            <p className='desc'>{t("landingpage.desc")}</p>
            <Link className="joinlink" to="/signup"><button class="joinbutton">{t("landingpage.join")}</button></Link>
          </div>
        </div>
        <ScrollUpButton ContainerClassName='scrollbutton' AnimationDuration={1200}
         EasingType='easeInOutCubic' ShowAtPosition={150}/>
      </Parallax>
      <div className='test'>Testing Block</div>
      <Parallax className='parallax' bgImage={bgimg} bgImageAlt="the alt" strength={600}>
        For testing purposes only. Will remove later.
      </Parallax>
      <div className='test'>Testing Block</div>
      <Parallax className='parallax' bgImage={bgimg} bgImageAlt="the alt" strength={800}>
        For testing purposes only. Will remove later.
      </Parallax>
      <div className='test'>Testing Block</div>
      <Parallax className='parallax' bgImage={bgimg} bgImageAlt="the alt" strength={600}>
        For testing purposes only. Will remove later.
      </Parallax>
      <div className='test'>Testing Block</div>
      <Parallax className='parallax' bgImage={bgimg} bgImageAlt="the alt" strength={800}>
        For testing purposes only. Will remove later.
      </Parallax>
    </div>
  )
};
//export default LandingPage;