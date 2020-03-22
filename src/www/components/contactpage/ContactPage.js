import "./ContactPage.scss"

import React, { Component } from "react";

import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const top_img = '/img/keyboard.png';
const form_img = '/img/inner.png'

export default function ContactPage() {
    const { t } = useTranslation();
    return (
        <div className="container">
            <div className="title-block">
                <img className="top-img" src={top_img}/>
                <span className="contact-form-title1">{t("contactpage.title1")}</span>
                <span className="contact-form-title2">{t("contactpage.title2")}</span>
                <div className="contact-form-block">
                    <img className="form-image" src={form_img}/>
                    <form className="contact-form">
                        <input type="text" placeholder={t("contactpage.first_name")} />
                        <input type="text" placeholder={t("contactpage.last_name")} />
                        <input type="text" placeholder={t("contactpage.email")} />
                        <textarea className="question" type="text" placeholder={t("contactpage.question")}/>
                        <button className="submit-btn" type="submit">{t("contactpage.submit")}</button>
                    </form>
                </div>
            </div>
        </div>
    )
  };