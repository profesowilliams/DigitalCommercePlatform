import React from 'react';
import Chart from 'chart.js';
import axios from 'axios';

class Chartcomp extends React.Component {

getData = () => {

    const {data, id} = this.props;
    var ctx = document.getElementById(id).getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'doughnut',
  
        // The data for our dataset
        data: {
          labels: [
            'Unquoted',
            'Quoted',
            'Old'
          ],
          datasets: [{
            label: 'My First Dataset',
            data: data,
            backgroundColor: [
              'rgb(54,192,225)',
              'rgb(255,191,50)',
              'rgb(0,13,34)'
            ],
            hoverOffset: 4
          }],
      
          // These labels appear in the legend and in the tooltips when hovering different arcs
      },
  
        // Configuration options go here
        options: {}
    });
}
componentDidMount(){
    this.getData();
}

componentDidUpdate(){
    this.getData();
}

  render(){
    
    const {data, id} = this.props;
    console.log(this.props.data, id);
    return (
        <div className="chartjs-wrapper">
      {data && data.length ? 
      <canvas className="chartjs" width="300" id={id}></canvas>
      :'loading'}
      </div>
    );
  }
}

export default React.memo(Chartcomp);

// return <div className="chartjs-wrapper"><canvas ref={canvas} className="chartjs"></canvas></div>;