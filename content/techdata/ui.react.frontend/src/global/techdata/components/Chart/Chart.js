import React from 'react';
import DoughnutDiagram from "../DoughnutDiagram/DoughnutDiagram";
import axios from "axios";
import {nanoid} from "nanoid";

class Chart extends React.Component {

    state = {
        name:'My React Chart',
        customer: []
    }


    changeName = () => {
        this.setState({
            name:'Other Name'
        })
    }

    fetchApi = (url, id) => {
        axios.get(url, { withCredentials: false })
            .then((response) => {
                if(response.status === 200){
                    this.setState({
                        [id]: response.data.data
                    })
                }
            });
    }

    updateData = (url, id) => {
        this.fetchApi('https://api.npoint.io/333c60f461e85093f106', 'customer');
    }

    componentDidMount(){

        this.fetchApi('https://api.npoint.io/4c82d3e004a8a98766a0', 'customer');

    }

    render() {
        const {customer, sales, production} = this.state;
        console.log("render")
        let compProps = JSON.parse(this.props.componentProp)
        console.log(compProps)
        console.log(compProps.name)
        let uniqueId= nanoid()
        return (
                <div className="Chart">
                <ul>
                    <li>
                        <h1>{compProps.name}</h1>
                        {customer && customer.length ? <DoughnutDiagram data={customer} id={uniqueId} /> :'loading'}
                        <button onClick={this.updateData}>Change Customer Data</button>
                    </li>
                </ul>
                </div>

        )
    }

}

export default Chart;