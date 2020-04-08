import "./LandingPage.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Parallax } from 'react-parallax';
import ScrollUpButton from "react-scroll-up-button";
import { useTranslation } from "react-i18next";

const bgkidimg = '/img/KidBackground.png';
const bgimg = '/img/background.jpg';
const innerimg = './img/smallicon.svg';
const categories = { category: "Category", image: "./img/background.jpg", desc: "Description Desc ription Descri ption Des c ription." }

const categoriesList = '{ "Category1": { "image":"./img/background.jpg", "name": "Category1", "desc": "AAADescription Desc ription Descri ption Des c ription." }, "Category2": { "image": "./img/background.jpg", "name": "Category2", "desc": "Description Desc ription Descri ption Des c ription." } }'
const JSONcat = JSON.parse(categoriesList)

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
              <img className='boximg' src={"./img/volunteer.svg"} />
              <p className='boxdesc'>{t("landingpage.volunteerdesc")}</p>
            </div>
            <div className='card'>
              <p className='boxphrase'>{t("landingpage.organize")}</p>
              <img className='boximg' src={"./img/organizer.svg"} />
              <p className='boxdesc'>{t("landingpage.organizedesc")}</p>
            </div>
          </div>
        </Parallax>
      </div>


      <div className='thirdpage'>
        <p className='phrase' >{t("landingpage.findactions")}</p>
        <Parallax blur={0.5} className='parallaxbg' bgImage={bgkidimg} bgImageAlt="the alt" strength={150}>
          <div className='panel'>

            {/* {JSONcat.map((category) => {
              return(
                <div className='card'>
                  <div className='box'>
                    <img className='boximg' src={category.image} />
                    <p className='category'>{category.name}</p>
                  </div>
                  <p className='boxdesc'>{category.desc}</p>
                </div>);
            })} */}

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