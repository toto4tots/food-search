import React from "react"

class DisplayStats extends React.Component {
    componentDidMount() {
        console.log(this.props.result)
        fetch('http://localhost:5000/stats', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                'foodData': this.props.result,
            }),
            mode: 'cors',
        })
            .then(response => response.json())
            .then(response => {
                console.log("REPSONSE", response);
            })
            .catch((error) => {
                console.log('Error', error);
            })

    }

    render() {
        return(
            <div>Stats!</div>
        )
    }
}

export { DisplayStats }
