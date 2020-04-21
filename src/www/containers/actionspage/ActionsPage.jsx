import "./ActionsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import SearchBar from "../../components/searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const cardList = require("./cards.json");

export default withTranslation()(
  class ActionsPage extends Component {
    state = {
      selectedCategories: [],
    };

    showCards = (cardList, t) => {
      const action_link = "/signup";
      const location_link = "https://goo.gl/maps/JYnmWrgsEzot3Dn86";
      return Object.keys(cardList).map((key) => {
        return (
          <li>
            <a href={action_link}>
              <img alt="Card icon" src={cardList[key].image} />
            </a>
            <div>
              <a href = {action_link}>
                <h3>{cardList[key].name}</h3>
              </a>
              <div>
                <span>{cardList[key].date}</span>
              </div>
              <a href={location_link} target="_blank" rel="noopener noreferrer">
                <span>{cardList[key].location}</span>
              </a>
              <div className="desc"><p>{cardList[key].desc}</p></div>
            </div>
          </li>
        );
      });
    };

    onCheckbox = (event, category) => {
      if (event.target.checked) {
        const categories = this.state.selectedCategories.concat(category);
        this.setState({ selectedCategories: categories });
      } else {
        this.removeCategory(category);
      }
    };

    removeCategory = (category) => {
      const filtered = this.state.selectedCategories.filter(
        (c) => c !== category
      );
      this.setState({
        selectedCategories: filtered,
      });
    };

    render() {
      const { t } = this.props;
      return (
        <div className="ActionsPage">
          <div className="ActionsPage_filter">
            <FilterList
              categories={{
                a: { name: "Education" },
                b: { name: "Environment" },
                c: { name: "Poverty" },
              }}
              selected={this.state.selectedCategories}
              onCheckbox={this.onCheckbox}
              onClear={() => this.setState({ selectedCategories: [] })}
              onRemove={this.removeCategory}
            />
          </div>
          <div className="ActionsPage_content">
            <SearchBar />
            <ul className="ActionsPage_content_actions">
              {this.showCards(cardList, t)}
            </ul>
          </div>
        </div>
      );
    }
  }
);
