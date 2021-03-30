import React, { Component } from 'react';
import {generateItemNodes} from "./modules/generateItemNodes";
import './App.css';
import ChartContainer from "./view/chartContainer/chartContainer";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {};

        this.hideDataLoading = false;
        // Binding method
        this.onFileChange = this.onFileChange.bind(this);
        this.handleGenerateClick = this.handleGenerateClick.bind(this);
    }

    handleGenerateClick() {
        this.setState({generatedData: generateItemNodes()});
        this.hideDataLoading = true;
    }

    onFileChange(event) {
        const fileReader = new FileReader();
        fileReader.onloadend =(event) => {
            this.setState({generatedData: JSON.parse(event.target.result)});
        }

        fileReader.readAsText(event.target.files[0]);
        this.hideDataLoading = true;
    }

    render () {
        if (this.state.generatedData) {
            return <div><ChartContainer generatedData={this.state.generatedData}/></div>
        } else if (!this.hideDataLoading){
            return <div>
                <button onClick={this.handleGenerateClick}>Generate</button>
                <input type="file" accept=".json" onChange={this.onFileChange}/>
            </div>
        } else {
            return <div>Loading</div>
        }
    }
}


export default (App)
