import React from "react"

const MAX_PER_PAGE = 200;

class DisplayInfo extends React.Component {
    state = {
        'commonIngredients': [],
        'commonCategories': [],
        'message': '(May take a few minutes)',
    }    

    componentDidMount() {
        fetch('http://localhost:5000/all', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'food': this.props.queryInfo.food,
                'category': this.props.queryInfo.category === "Any" ? "" : this.props.queryInfo.category,
                'includeList': this.props.queryInfo.includeList,
                'excludeList': this.props.queryInfo.excludeList,
                'pageSize': MAX_PER_PAGE
            }),
            mode: 'cors',
        })
            .then(response => response.json())
            .then(response => {                   
                fetch('http://localhost:5000/info', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(response.result),
                    mode: 'cors',
                })
                .then(response => response.json())
                .then(response => {
                    this.setState({
                        'commonIngredients': response.data.common_ingredients,
                        'commonCategories': response.data.common_categories,
                        'message': 'Finished'
                    });
                })
                .catch(error => {
                    this.setState({
                        'message': 'Error'
                    });                    
                    console.error(error);
                })
            })
            .catch((error) => {
                console.error(error);
            })

    }

    render() {
        if (this.state.commonIngredients.length > 0) {
            return (
                <div>
                    <div className="infoTitle">
                        <div>
                            <strong>Common Ingredients</strong><br />
                        </div>

                        {"Ingredient | Frequency"}
                    </div>
                    <ul className="infoList">
                        {this.state.commonIngredients.map(
                            (ingred, index) =>
                                <li key={index}>
                                    {ingred[0]} <span className="infoValue"> {ingred[1]}</span>
                                </li>
                        )}
                    </ul>
                    <div className="infoTitle">
                        <div>
                            <strong>Common Categories</strong><br />
                        </div>
                        
                        {"Category | Frequency"}
                    </div>                    
                    <ul className="infoList">
                        {this.state.commonCategories.map(
                            (ingred, index) =>
                                <li key={index}>
                                    {ingred[0]} <span className="infoValue"> {ingred[1]}</span>
                                </li>
                        )}
                    </ul>                    

                </div>
            )            
        }
        else {
            return (
                <div className="infoTitle">{this.state.message}</div>
            )
        }

    }
}

export { DisplayInfo }
