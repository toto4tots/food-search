
import React from 'react';
import { DisplayResult } from './displayResult'
import { CATEGORY_NAMES } from '../constants/categories'
import '../stylesheets/search.css'

const RESULT_PER_PAGE = 25; 

class SearchArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            food: '',
            category: 'Any',
            include: '',
            exclude: '',
            includeList: [],
            excludeList: [],
            page: 1,
            result: [],
            resultFound: true,
            resultTotal: 0
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClickPages = this.handleClickPages.bind(this);
        this.handleClear = this.handleClear.bind(this);
    }

    getFoodData() {
        this.setState({
            result: []
        });
        fetch(`http://localhost:5000/food?page=${this.state.page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'food': this.state.food,
                'category': this.state.category === "Any" ? "" : this.state.category,
                'includeList': this.state.includeList,
                'excludeList': this.state.excludeList,
            }),
            mode: 'cors',
        })
            .then(response => response.json())
            .then(response => {
                this.setState({
                    resultFound: response.success && response.data.length > 0 ? true : false,
                    result: response.success ? [...response.data] : [],
                    resultTotal: response.success ? response['totalHits'] : 0
                });
            })
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    handleSubmit(e) {
        e.preventDefault();
        this.setState({
            page: 1
        }, () => {
            this.getFoodData();
        });
    }

    handleClear(e) {
        this.setState({
            food: '',
            category: '',
            includeList: [],
            excludeList: [],
            page: 1,
            result: [],
            resultFound: true,
            resultTotal: 0
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick(e) {
        const name = e.target.name.substring(0, e.target.name.length - 6)
        if (this.state[name] !== "") {
            const listName = name + "List";
            this.setState((prevState) => ({
                [listName]: [...prevState[listName], prevState[name]]
            }));
            this.setState({
                [name]: ""
            });
        }
    }

    getOptions() {
        return CATEGORY_NAMES.map((x, index) => {
            return(
                <option key={index} value={x}>{x}</option>
            )
        })
    }

    displayArray(name) {
        return this.state[name].map((x, index) => {
            if (index === 0) {
                return (
                    <span key={index}>{x}</span>
                );    
            } else if (index === this.state[name].length - 1 && this.state[name].length >= 3){
                return (
                    <span key={index}>, and {x}</span>
                );
            } else {
                return (
                    <span key={index}>, {x}</span>
                );
            }
        })
    }

    handleClickPages(e) {
        const button = e.target
        this.setState({
            "page": +button.value
        }, () => {
            this.getFoodData();
        });
    }

    displayPagination() {
        let ret = [];
        if (this.state.result.length > 0) {
            for (let i = 0; i < Math.ceil(this.state.resultTotal / RESULT_PER_PAGE ); i++) {
                ret.push([
                    <button className="pageButton" 
                            key={i}
                            onClick={this.handleClickPages}
                            value={i + 1}
                            style={{color: this.state.page === i + 1 ? 'blue' : 'black'}}
                    >{i + 1}
                    </button>
                ])
            }
        }
        return ret
    }

    render() {
        return (
            <div>
                <div id="title">
                    <h1>{this.state.food ? this.state.food : "No Peanuts"}</h1>
                    <h4>
                        WITH: {this.state.includeList.length > 0 ? this.displayArray("includeList") : ""}<br />
                        WITHOUT: {this.state.excludeList.length > 0 ? this.displayArray("excludeList") : ""}
                    </h4>
                    <form>
                        <input name='food'
                            value={this.state.food}
                            onChange={this.handleChange}
                            placeholder="Food"
                            className="inputText"
                            /><br />
                        <input name='include'
                            value={this.state.include}
                            onChange={this.handleChange}
                            placeholder="Include"
                            className="inputText"
                        />
                        <input type="button"
                            name="includeButton"
                            value="set"
                            onClick={this.handleClick}
                        />
                        <input name='exclude'
                            value={this.state.exclude}
                            onChange={this.handleChange.bind(this)}
                            placeholder="Exclude"
                            className="inputText"
                        />
                        <input type="button"
                            name="excludeButton"
                            value="set"
                            onClick={this.handleClick}
                        /><br />
                        <select
                            name="category"
                            value={this.state.category}
                            onChange={this.handleChange}
                            className="inputText"
                        >
                            {this.getOptions()}
                        </select><br />
                        <input type="submit"
                            value="submit"
                            onClick={this.handleSubmit}
                        />
                        <input type="button"
                            value="clear"
                            onClick={this.handleClear}
                        />
                    </form>                    
                </div>
                <div>
                    <DisplayResult result={this.state.result}
                                resultFound={this.state.resultFound}
                                resultTotal={this.state.resultTotal}
                    />
                    
                </div>
                {this.displayPagination()}
            </div>
        )
    }
}

export { SearchArea }
