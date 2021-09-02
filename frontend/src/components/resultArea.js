import React from "react"
import { DisplayResult } from "./displayResult"
import { DisplayInfo } from "./displayInfo"

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
            case "Info":
                return (
                    <DisplayInfo queryInfo={this.props.queryInfo}/>
                )              
            default:
                return (
                    <DisplayResult result={this.props.resultInfo.result}
                        resultFound={this.props.resultInfo.resultFound}
                        resultTotal={this.props.resultInfo.resultTotal}
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
                {this.props.resultInfo.resultTotal > 0 ? this.props.resultInfo.resultTotal : ""} | 
                <button className="noStyleButton" name="InfoButton" onClick={this.handleClick}>Info</button>
                < hr />
                {
                    this.props.resultInfo.resultTotal > 0 && this.state.active === "Result" ? 
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
