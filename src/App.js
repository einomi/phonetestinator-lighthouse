import React, { Component } from 'react';

import './App.css';

class App extends Component {
  state = {
    inputUrl: '',
    loading: false,
    result: {
      url: '',
      lighthouseData: null,
    },
  };

  handleFormSubmit = e => {
    e.preventDefault();
    this.setState({
      loading: true,
      result: {
        url: this.state.inputUrl,
        lighthouseData: null,
      },
    });
    window
      .fetch(`http://localhost:8888/api/metrics/?url=${this.state.inputUrl}`, {
        method: 'GET',
        mode: 'cors',
        cache: 'no-cache',
      })
      .then(res => {
        res.json().then(json => {
          this.setState(state => ({
            loading: false,
            result: {
              ...state.result,
              lighthouseData: json,
            },
          }));
        });
      });
  };

  handleInputChange = e => {
    this.setState({ inputUrl: e.currentTarget.value });
  };

  render() {
    const { lighthouseData } = this.state.result;

    return (
      <div className="App">
        <form className="form" onSubmit={this.handleFormSubmit}>
          <input
            className="input"
            type="text"
            name="url"
            placeholder="Website URL"
            value={this.state.inputUrl}
            onChange={this.handleInputChange}
          />
          <button className="submit" type="submit">
            Submit
          </button>
        </form>
        {this.state.loading && <div className="loading">Loading...</div>}
        {lighthouseData && lighthouseData.runs && lighthouseData.runs[0] && (
          <div className="result">
            <div className="result__title">
              Results for {this.state.result.url}
            </div>
            <div className="result__items">
              {lighthouseData.runs.map(({ timings }) => {
                return timings.map(metric => {
                  return (
                    <div className="result__item result-item" key={metric.id}>
                      <div className="result-item__title">{metric.title}</div>
                      <div className="result-item__timing">
                        {(metric.timing / 1000).toFixed(2)}s
                      </div>
                    </div>
                  );
                });
              })}
            </div>
          </div>
        )}
      </div>
    );
  }
}

export default App;
