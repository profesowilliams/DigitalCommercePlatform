import React from 'react';
import Chartcomp from "../customer-widegt/customer";
import axios from "axios";

class Chart extends React.Component {

    state = {
        name:'MY CONFIGURATIONS',
        customer: [],
        sales:[],
        production:[]
    }

    chnageNmae = () => {
        this.setState({
            name:'Othert Name'
        })
    }

    fetchApi = (url, id) => {
        axios.get(url)
            .then((response) => {
                if(response.status === 200){
                    this.setState({
                        [id]: response.data.data
                    })
                }
            });
    }

    changecustomerApi = (url, id) => {
        // this.fetchApi('https://api.npoint.io/333c60f461e85093f106', 'customer');
        this.fetchApi('./customerdata.json', 'customer');
    }
    changesalesApi = (url, id) => {
        this.fetchApi('https://api.npoint.io/333c60f461e85093f106', 'sales');
    }
    changeproductionApi = (url, id) => {
        this.fetchApi('https://api.npoint.io/333c60f461e85093f106', 'production');
    }


    componentDidMount(){
        this.fetchApi('https://api.npoint.io/4c82d3e004a8a98766a0', 'customer');
        this.fetchApi('https://api.npoint.io/4c82d3e004a8a98766a0', 'sales');
        this.fetchApi('https://api.npoint.io/4c82d3e004a8a98766a0', 'production');
    }

    render() {
        const {customer, sales, production} = this.state;
        return (
                <div className="Chart">
                <ul>
                    <li>
                        {customer && customer.length ? <Chartcomp data={customer} id="customer" /> :'loading'}
                        <button onClick={this.changecustomerApi}>Change Customer Data</button>
                    </li>
                </ul>
                </div>

        )
    }

}

export default Chart;