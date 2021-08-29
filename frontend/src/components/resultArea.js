import React from "react"
import { DisplayResult } from "./displayResult"
import { DisplayStats } from "./displayStats"

class ResultArea extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            active: "Result"
        }

        this.handleClick = this.handleClick.bind(this)
    }

    getActive() {
        switch (this.state.active) {
            case "Stats":
                return (
                    <DisplayStats result={this.props.result}
                        resultFound={this.props.resultFound}
                        resultTotal={this.props.resultTotal}
                    />
                )              
            default:
                return (
                    <DisplayResult result={this.props.result}
                        resultFound={this.props.resultFound}
                        resultTotal={this.props.resultTotal}
                    />
                )
        }
    }

    handleClick(e) {
        // strip 'button' from the name to get page
        const page = e.target.name.substring(0, e.target.name.length - 6);
        this.setState({
            active: page
        })
    }

    render() {
        return(
            <div>
                <button className="noStyleButton" name="ResultButton" onClick={this.handleClick}>Result</button> 
                {this.props.resultTotal > 0 ? this.props.resultTotal : ""} | 
                <button className="noStyleButton" name="StatsButton" onClick={this.handleClick}>Stats</button>
                < hr />
                {
                    this.props.resultTotal > 0 && this.state.active === "Result" ? 
                    "Product Name | Brand Name | Brand Owner | UPC" : 
                    ""
                }
                {this.getActive()}
                {this.state.active === "Result" ? this.props.displayPagination() : ""}
            </div>
        )
    }
}

export { ResultArea }
