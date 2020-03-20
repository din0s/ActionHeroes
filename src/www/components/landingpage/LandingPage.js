import "./LandingPage.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Parallax } from 'react-parallax';
import ScrollUpButton from "react-scroll-up-button";
import { useTranslation } from "react-i18next";

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
          EasingType='easeInOutCubic' ShowAtPosition={150} />
      </Parallax>

      <div className='secondpage'>
        <p className='phrase' >Become an Action Hero</p>    
        <Parallax blur={0.5} className='parallaxbg' bgImage={bgkidimg} bgImageAlt="the alt" strength={200}>
          <div className='panel'>
            <div className='box'>
              <p className='boxphrase'>Volunteer</p>
              <img className='boximg' src={bgimg} />
              <p className='boxdesc'>Lorem ipsum dolor sit amet. Duis neque nisl, tincidunt quis lorem vel, efficitur luctus orci. Vivamus dignissim tincidunt erat ac semper.</p>
            </div>
            <div className='box'>
              <p className='boxphrase'>Organise</p>
              <img className='boximg' src={bgimg} />
              <p className='boxdesc'>Lorem ipsum dolor sit amet. Duis neque nisl, tincidunt quis lorem vel, efficitur luctus orci. Vivamus dignissim tincidunt erat ac semper.</p>
            </div>
          </div>
        </Parallax>
      </div>
      {/* <Parallax className='parallax' bgImage={bgimg} bgImageAlt="the alt" strength={800}>
        For testing purposes only. Will remove later.
      </Parallax> */}
    </div>
  )
};
//export default LandingPage;