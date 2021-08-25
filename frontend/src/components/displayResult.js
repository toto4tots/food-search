import React from 'react';
import '../stylesheets/result.css'

class DisplayResult extends React.Component {
    formatResult() {
        return this.props.result.map((x, index) => {
            return (
                <div key={index}>
                    <strong>{x.description + ' | ' + x.brandName + ' | ' + x.brandOwner + ' | ' + x.gtinUpc}</strong><br/>
                    INGREDIENTS: {x.ingredients}
                    <hr />
                </div>
            )
        })
    }

    render() {
        return(
            <div id="result">
                Result {this.props.resultTotal > 0 ? this.props.resultTotal : ""} <br />
                Product Name | Brand Name | Brand Owner | UPC
                <hr />
                <div>
                    {this.props.resultFound ? this.formatResult() : "No products found"}
                </div>
            </div>
        )
    }
}

export { DisplayResult }