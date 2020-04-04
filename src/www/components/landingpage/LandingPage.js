import "./LandingPage.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Parallax } from 'react-parallax';
import ScrollUpButton from "react-scroll-up-button";
import { useTranslation } from "react-i18next";

const bgkidimg = '/img/KidBackground.png';
const bgimg = '/img/background.jpg';
const innerimg = './img/volunteer.svg';
const categories = { category: "Category", image: "./img/background.jpg", desc: "Description Desc ription Descri ption Des c ription." }


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
        <p className='phrase' >{t("landingpage.become")}</p>
        <Parallax blur={0.5} className='parallaxbg' bgImage={bgkidimg} bgImageAlt="the alt" strength={150}>
          <div className='panel'>
            <div className='card'>
              <p className='boxphrase'>{t("landingpage.volunteer")}</p>
              <img className='boximg' src={bgimg} />
              <p className='boxdesc'>{t("landingpage.volunteerdesc")}</p>
            </div>
            <div className='card'>
              <p className='boxphrase'>{t("landingpage.organise")}</p>
              <img className='boximg' src={bgimg} />
              <p className='boxdesc'>{t("landingpage.organisedesc")}</p>
            </div>
          </div>
        </Parallax>
      </div>


      <div className='thirdpage'>
        <p className='phrase' >{t("landingpage.findactions")}</p>
        <Parallax blur={0.5} className='parallaxbg' bgImage={bgkidimg} bgImageAlt="the alt" strength={150}>
          <div className='panel'>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
            <div className='card'>
              <div className='box'>
                <img className='boximg' src={categories.image} />
                <p className='category'>{categories.category}</p>
              </div>
              <p className='boxdesc'>{categories.desc}</p>
            </div>
          </div>
        </Parallax>
      </div>
    </div>
  )
};
//export default LandingPage;