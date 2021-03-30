import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';
import {combineReducers, createStore} from "redux";
import setVisualizationNodeItem from "./reducers/setVisualizationNodeItem";

const allReducers = combineReducers({
    visualizationNodes: setVisualizationNodeItem
});


const store = createStore(allReducers,{});

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('root')
);
