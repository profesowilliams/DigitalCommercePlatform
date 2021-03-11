import React from 'react';
import {connect} from "react-redux";

class Spinner extends React.Component {
    constructor(props) {
        super(props);   
    }

    render() {
        return (
            <div className={`overlay ${this.props.spin ? "show" : ""}`}>
                <div className="spinner-ring"></div>
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        spin: state.spin
    };
}

export default connect(mapStateToProps)(Spinner);
