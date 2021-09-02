import React from "react"

const MAX_PER_PAGE = 200;

class DisplayInfo extends React.Component {
    componentDidMount() {
        console.log(this.props.result)
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
                console.log("SEND AGAIN", response)
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
                    console.log("FINISHED!", response);
                })
                .catch(error => {
                    console.error(error);
                })
            })
            .catch((error) => {
                console.error(error);
            })

    }

    render() {
        return(
            <div>Info!</div>
        )
    }
}

export { DisplayInfo }
