
import React from 'react';
import { DisplayResult } from './displayResult'

class SearchArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            food: '',
            category: '',
            include: '',
            exclude: '',
            includeList: [],
            excludeList: [],
            page: 1,
            result: [],
            resultFound: true,
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();
        fetch(`http://localhost:5000/food?page=${this.state.page}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'food': this.state.food,
                'category': this.state.category,
                'includeList': this.state.includeList,
                'excludeList': this.state.excludeList,
            }),
            mode: 'cors',
        })
        .then(response => response.json())
        .then(response => {
            if ('error' in response) {
                this.setState({
                    resultFound: false
                });
            } else {
                this.setState({
                    resultFound: true,
                    result: [...response.data]
                });                
            }
        })
        .catch((error) => {
            console.error('Error:', error);
        });
    }

    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        });
    }

    handleClick(e) {
        // get which list
        const name = e.target.name.substring(0, e.target.name.length - 6)
        const listName = name + "List";
        this.setState((prevState) => ({
            [listName]: [...prevState[listName], prevState[name]]
        }));
        this.setState({
            [name]: ""
        });
    }

    // delete

    render() {
        return (
            <div>
                <h1>{this.state.food ? this.state.food : "No Peanuts"}</h1>
                <form>
                    <input name='food'
                    value={this.state.food}
                    onChange={this.handleChange}
                    />
                    <input name='include'
                    value={this.state.include}
                    onChange={this.handleChange}
                    />
                    <input type="button"
                    name="includeButton"
                    value="with"
                    onClick={this.handleClick}
                    />           
                    <input name='exclude'
                    value={this.state.exclude}
                    onChange={this.handleChange.bind(this)}
                    />
                    <input type="button"
                    name="excludeButton"
                    value="without"
                    onClick={this.handleClick}
                    />
                    <input type="submit" 
                    value="submit" 
                    onClick={this.handleSubmit}
                    />                    
                </form>
                <div>
                    <DisplayResult result={this.state.result} resultFound={this.state.resultFound}/>
                </div>
            </div>
        )
    }
}

export { SearchArea }
