import "./LandingPage.scss";

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { Parallax } from "react-parallax";
import ScrollUpButton from "react-scroll-up-button";
import { withTranslation } from "react-i18next";

const bgkidimg = "/img/KidBackground.png";
const innerimg = "./img/smallicon.svg";
const categoriesList = {
  Category1: {
    image: "./img/background.jpg",
    name: "Category1",
    desc: "AAADescription Desc ription Descri ption Des c ription."
  },
  Category2: {
    image: "./img/background.jpg",
    name: "Category2",
    desc: "Description Desc ription Descri ption Des c ription."
  },
  Category3: {
    image: "./img/background.jpg",
    name: "Category3",
    desc: "Description Desc ription Descri ption Des c ription."
  },
  Category4: {
    image: "./img/background.jpg",
    name: "Category4",
    desc: "AAADescription Desc ription Descri ption Des c ription."
  },
  Category5: {
    image: "./img/background.jpg",
    name: "Category5",
    desc: "AAADescription Desc ription Descri ption Des c ription."
  },
  Category6: {
    image: "./img/background.jpg",
    name: "Category6",
    desc: "AAADescription Desc ription Descri ption Des c ription."
  }
};

export default withTranslation()(
  class LandingPage extends Component {
    render() {
      // const [width, setWidth] = React.useState(window.innerWidth);

      // const updateWidth= () => {
      //   setWidth(window.innerWidth);
      // };

      // React.useEffect(() => {
      //   window.addEventListener("resize", updateWidth);
      //   return () => window.removeEventListener("resize", updateWidth);
      // });

      const { t } = this.props;
      return (
        <div className="container">
          <Parallax
            className="parallax"
            bgImage={bgkidimg}
            bgImageAlt="Backgroundimage"
            strength={500}
          >
            <div className="panel">
              <img className="innerphoto" alt="Frontimage" src={innerimg} />
              <div className="innertextcontainer">
                <p className="catchphrase">{t("landingpage.catchphrase")}</p>
                <p className="desc">{t("landingpage.desc")}</p>
                <Link className="joinlink" to="/signup">
                  <button class="joinbutton">{t("landingpage.join")}</button>
                </Link>
              </div>
            </div>
            <ScrollUpButton
              ContainerClassName="scrollbutton"
              AnimationDuration={1200}
              EasingType="easeInOutCubic"
              ShowAtPosition={150}
            />
          </Parallax>

          <div className="secondpage">
            <p className="phrase">{t("landingpage.become")}</p>
            <Parallax
              blur={0.5}
              className="parallaxbg"
              bgImage={bgkidimg}
              bgImageAlt="Backgroundimage"
              strength={150}
            >
              <div className="panel">
                <div className="card">
                  <p className="boxphrase">{t("landingpage.volunteer")}</p>
                  <img
                    className="boximg"
                    alt="volunteer"
                    src={"./img/volunteer.svg"}
                  />
                  <p className="boxdesc">{t("landingpage.volunteerdesc")}</p>
                </div>
                <div className="card">
                  <p className="boxphrase">{t("landingpage.organize")}</p>
                  <img
                    className="boximg"
                    alt="organize"
                    src={"./img/organizer.svg"}
                  />
                  <p className="boxdesc">{t("landingpage.organizedesc")}</p>
                </div>
              </div>
            </Parallax>
          </div>

          <div className="thirdpage">
            <p className="phrase">{t("landingpage.findactions")}</p>
            <Parallax
              blur={0.5}
              className="parallaxbg"
              bgImage={bgkidimg}
              bgImageAlt="Backgroundimage"
              strength={150}
            >
              <div className="panel">
                {(window.onresize = showCategories(categoriesList))}
              </div>
            </Parallax>
          </div>
        </div>
      );
    }
  }
);

function showCategories(categoriesList) {
  // eslint-disable-next-line
  return Object.keys(categoriesList).map((key, index) => {
    if (index < 3) {
      return (
        <div className="card">
          <div className="box">
            <img
              className="boximg"
              alt="category_img"
              src={categoriesList[key].image}
            />
            <p className="category">{categoriesList[key].name}</p>
          </div>
          <p className="boxdesc">{categoriesList[key].desc}</p>
        </div>
      );
    } else if (index < 4) {
      return (
        <div className="card card-4">
          <div className="box">
            <img
              className="boximg"
              alt="category_img"
              src={categoriesList[key].image}
            />
            <p className="category">{categoriesList[key].name}</p>
          </div>
          <p className="boxdesc">{categoriesList[key].desc}</p>
        </div>
      );
    } else if (index < 6) {
      return (
        <div className="card card-6">
          <div className="box">
            <img
              className="boximg"
              alt="category_img"
              src={categoriesList[key].image}
            />
            <p className="category">{categoriesList[key].name}</p>
          </div>
          <p className="boxdesc">{categoriesList[key].desc}</p>
        </div>
      );
    }
  });
}
