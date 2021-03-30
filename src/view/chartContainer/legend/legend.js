import React, { Component } from 'react'
import * as d3 from "d3";
import "./legend.css"

class Legend extends Component {
    constructor(props) {
        super(props);

        this.state = {
            height: window.innerHeight,
            width: window.innerWidth
        }

        this.legend = React.createRef();


        window.addEventListener('resize', () => {
            this.setState({
                height: window.innerHeight,
                width: window.innerWidth
            })
        })

    }
    shouldComponentUpdate(nextProps, nextState, nextContext) {
        // TODO do not update all the time
        return true;
    }

    componentDidMount(prevProps, prevState, snapshot) {
        this.udpateLegend();
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        this.udpateLegend();
    }

    udpateLegend() {
        if (this.props.quantizedScaleColor) {

            const quantize = this.props.quantizedScaleColor;
            const ranges = quantize.range().length;

            const containerWidth = this.legend.current.offsetWidth - 10;
            const keywidth = containerWidth / ranges;
            const boxmargin = 4,
                keyheight = 10,
                lineheight = keyheight + 4;

            var margin = {"left": 0, "top": 0};

            var title = [''],
                titleheight = title.length * lineheight + boxmargin;

            var x = d3.scaleLinear()
                .domain([0, 1]);

            d3.select(this.legend.current).select("svg").remove();
            var svg = d3.select(this.legend.current).append("svg")
                .attr("width", '100%')
                .attr("height", '100%');

// make legend
            var legend = svg.append("g")
                .attr("transform", "translate (" + margin.left + "," + margin.top + ")")
                .attr("class", "legend");

            legend.selectAll("text")
                .data(title)
                .enter().append("text")
                .attr("class", "legend-title")
                .attr("y", function (d, i) {
                    return (i + 1) * lineheight - 2;
                })
                .text(function (d) {
                    return d;
                })

// make quantized key legend items
            var li = legend.append("g")
                .attr("transform", "translate (4," + (titleheight + boxmargin) + ")");

            li.selectAll("rect")
                .data(quantize.range().map(function (color) {
                    var d = quantize.invertExtent(color);
                    if (d[0] == null) d[0] = x.domain()[0];
                    if (d[1] == null) d[1] = x.domain()[1];
                    return d;
                }))
                .enter().append("rect")
                .attr("y", () => 15)
                .attr("x", function (d, i) {
                    return i * (keywidth);
                })
                .attr("width", keywidth)
                .attr("height", keyheight)
                .style("fill", function (d) {
                    return quantize(d[0]);
                });


            const legendLabels = quantize.quantiles()
                .map(q => Math.round(q*1000) / 1000)
            li.selectAll("text")
                .data(legendLabels)
                .enter().append("text")
                .attr("y", (d,i) => {
                    if (i%2 === 0) {
                        return 5;
                    } else {
                        return 45
                    }
                })
                .attr("x", function (d, i) {
                    return (i) * (keywidth) + (keywidth+1)*70/100 ;
                })
                .text(function (d) {
                    return d.toFixed(2);
                });
        }
    }


    render() {
        console.log("Legend render")
        return <div  >
            <div className="legend-chart-container">{this.props.legendTitle}</div>
            <div className="legend-chart"  ref={this.legend}></div>
        </div>
    }
}

export default Legend;

