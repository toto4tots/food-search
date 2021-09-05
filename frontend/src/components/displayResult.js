import React from 'react';

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
                {/* Result {this.props.resultTotal > 0 ? this.props.resultTotal : ""} | Stats <br /> */}
                <div>
                    {this.props.resultFound ? this.formatResult() : "No products found"}
                </div>
            </div>
        )
    }
}

export { DisplayResult }