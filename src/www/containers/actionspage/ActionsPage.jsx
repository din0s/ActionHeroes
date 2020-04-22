import "./ActionsPage.scss";

import React, { Component } from "react";

import FilterList from "../../components/filterlist/FilterList";
import SearchBar from "../../components/searchbar/SearchBar";
import { withTranslation } from "react-i18next";

const actions = require("./actions.json");
const categories = require("./categories.json");

export default withTranslation()(
  class ActionsPage extends Component {
    state = {
      selectedCategories: [],
    };

    showActions = () => {
      return Object.keys(actions)
        .filter((ac) => {
          const selected = this.state.selectedCategories;
          if (selected.length === 0) {
            return true;
          }

          const categories = actions[ac].categories;
          return selected.every((sc) =>
            Object.keys(categories).find((c) => {
              const category = categories[c];
              return sc === category;
            })
          );
        })
        .map((ac) => {
          const action = actions[ac];
          const action_link = "/signup";
          const location_link = "https://goo.gl/maps/JYnmWrgsEzot3Dn86";
          return (
            <li key={ac}>
              <a href={action_link}>
                <img alt="Card icon" src={action.image} />
              </a>
              <div>
                <a href={action_link}>
                  <h3>{action.name}</h3>
                </a>
                <div>
                  <span>{action.date}</span>
                </div>
                <a
                  href={location_link}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span>{action.location}</span>
                </a>
                <div className="desc">
                  <p>{action.desc}</p>
                </div>
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
          <SearchBar action="/actions" />
          <span>
            <FilterList
              categories={categories}
              selected={this.state.selectedCategories}
              onCheckbox={this.onCheckbox}
              onClear={() => this.setState({ selectedCategories: [] })}
              onRemove={this.removeCategory}
            />
            <div className="ActionsPage_content">
              <ul className="ActionsPage_content_actions">
                {this.showActions()}
              </ul>
            </div>
          </span>
        </div>
      );
    }
  }
);
