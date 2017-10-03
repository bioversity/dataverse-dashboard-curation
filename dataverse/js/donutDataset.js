function donutDataset(data, div, page) {
    var donutnumber = 5;
    var page = page;

    d3.select(div).selectAll("svg").remove();
    d3.select(div).selectAll("div").remove();

    var donutData = genDataDataset(div,data, donutnumber, page);

    };
    

    function DonutChartsDataset(div) {

        var charts = d3.select(div);

        var chart_m,
            chart_r,
            color = d3.scale.category20();

        var getCatNamesDataset = function(dataset) {
            var catNames = new Array();

            for (var i = 0; i < dataset[0].data.length; i++) {
                catNames.push(dataset[0].data[i].cat);
            }

            return catNames;
        }

        // var createLegend = function(catNames) {
        //     var legends = charts.select('.legend')
        //                     .selectAll('g')
        //                         .data(catNames)
        //                     .enter().append('g')
        //                         .attr('transform', function(d, i) {
        //                             return 'translate(' + (i * 150 + 50) + ', 10)';
        //                         });
    
        //     legends.append('circle')
        //         .attr('class', 'legend-icon')
        //         .attr('r', 6)
        //         .style('fill', function(d, i) {
        //             return color(i);
        //         });
    
        //     legends.append('text')
        //         .attr('dx', '1em')
        //         .attr('dy', '.3em')
        //         .text(function(d) {
        //             return d;
        //         });
        // }

        var createCenterDataset = function(pie) {

            var eventObj = {
                'mouseover': function(d, i) {
                    d3.select(this)
                        .transition()
                        .attr("r", chart_r * 0.65);
                },

                'mouseout': function(d, i) {
                    d3.select(this)
                        .transition()
                        .duration(500)
                        .ease('bounce')
                        .attr("r", chart_r * 0.6);
                },

                'click': function(d, i) {
                    var paths = charts.selectAll('.clicked');
                    pathAnimDataset(paths, 0);
                    paths.classed('clicked', false);
                    resetAllCenterText();
                }
            }

            var donuts = charts.selectAll('.donut');

            // The circle displaying total data.
            donuts.append("svg:circle")
                .attr("r", chart_r * 0.6)
                .style("fill", "#E7E7E7")
                .on(eventObj);
    
            donuts.append('text')
                    .attr('class', 'center-txt type')
                    .attr('y', chart_r * -0.16)
                    .attr('text-anchor', 'middle')
                    .style('font-weight', 'bold')
                    .style('font-size', '8px')
                    .text(function(d, i) {
                        return d.type;
                    });
            donuts.append('text')
                    .attr('class', 'center-txt value')
                    .attr('text-anchor', 'middle');
            donuts.append('text')
                    .attr('class', 'center-txt percentage')
                    .attr('y', chart_r * 0.16)
                    .attr('text-anchor', 'middle')
                    .style('fill', '#A2A2A2');
            donuts.append('text')
                    .attr('class', 'center-txt category')
                    .attr('y', chart_r * 0.32)
                    .attr('text-anchor', 'middle');
        }

        var setCenterTextDataset = function(thisDonut) {
            // var sum = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
            //     return d.data.val;
            // });

            // var catName = d3.sum(thisDonut.selectAll('.clicked').data(), function(d) {
            //     return d.data.cat;
            // });

            thisDonut.select('.value')
                .text('');
            thisDonut.select('.percentage')
                .text('');

            thisDonut.select('.category')
                .text('');
        }

        var resetAllCenterTextDataset = function() {
            charts.selectAll('.value')
                .text('');
            charts.selectAll('.percentage')
                .text('');
            charts.selectAll('.category')
                .text('');
        }

        var pathAnimDataset = function(path, dir) {
            switch(dir) {
                case 0:
                    path.transition()
                        .duration(500)
                        .ease('bounce')
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r)
                        );
                    break;

                case 1:
                    path.transition()
                        .attr('d', d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(chart_r * 1.08)
                        );
                    break;
            }
        }

        var updateDonutDataset = function() {

            var eventObj = {

                'mouseover': function(d, i, j) {
                    pathAnimDataset(d3.select(this), 1);

                    var thisDonut = charts.select('.type' + j);
                    thisDonut.select('.value').text('');
                    thisDonut.select('.percentage').text('');
                    thisDonut.select('.category').text('');

                    // d3.select("#legend").selectAll("h2")
                    //         .data(d.data.datasetList).enter()
                    //         .append("h3")
                    //             .text(function (dl) { 
                    //                 return dl;
                    //             });
                },
                
                'mouseout': function(d, i, j) {
                    var thisPath = d3.select(this);
                    if (!thisPath.classed('clicked')) {
                        pathAnimDataset(thisPath, 0);
                    }
                    var thisDonut = charts.select('.type' + j);
                    setCenterTextDataset(thisDonut);
                },

                'click': function(d, i, j) {
                    var thisDonut = charts.select('.type' + j);

                    if (0 === thisDonut.selectAll('.clicked')[0].length) {
                        thisDonut.select('circle').on('click')();
                    }

                    var thisPath = d3.select(this);
                    var clicked = thisPath.classed('clicked');
                    pathAnimDataset(thisPath, ~~(!clicked));
                    thisPath.classed('clicked', !clicked);

                    setCenterTextDataset(thisDonut);
                }
            };

            var pie = d3.layout.pie()
                            .sort(null)
                            .value(function(d) {
                                return d.val;
                            });

            var arc = d3.svg.arc()
                            .innerRadius(chart_r * 0.7)
                            .outerRadius(function() {
                                return (d3.select(this).classed('clicked'))? chart_r * 1.08
                                                                           : chart_r;
                            });

            // Start joining data with paths
            var paths = charts.selectAll('.donut')
                            .selectAll('path')
                            .data(function(d, i) {
                                return pie(d.data);
                            });

            paths
                .transition()
                .duration(1000)
                .attr('d', arc);

            paths.enter()
                .append('svg:path')
                    .attr('d', arc)
                    .style('fill', function(d, i) {
                        return color(i);
                    })
                    .style('stroke', '#FFFFFF')
                    .on(eventObj)

            paths.exit().remove();

            resetAllCenterTextDataset();
        }

        this.createDataset = function(div, dataset, name) {
            var $charts = $(div);
            chart_m = $charts.innerWidth() / dataset.length / 2 * 0.14;
            chart_r = $charts.innerWidth() / dataset.length / 2 * 0.85;

            charts.
            append('div')
                .html("<a href='"+name+"'>dataset "+name+"</a>");
                  //  .attr("xlink:href", name)
                   // .text("dataset "+name);

            // charts.append('svg')
            //     .attr('class', 'legend')
            //     .attr('width', '100%')
            //     .attr('height', 50)
            //     .attr('transform', 'translate(0, -10)');

            var donut = charts.append('div')
                            .selectAll('.donut')
                            .data(dataset)
                        .enter().append('svg:svg')
                            .attr('width', (chart_r + chart_m) * 2)
                            .attr('height', (chart_r + chart_m) * 2)
                        .append('svg:g')
                            .attr('class', function(d, i) {
                                return 'donut type' + i;
                            })
                            .attr('transform', 'translate(' + (chart_r+chart_m) + ',' + (chart_r+chart_m) + ')');
            // createLegend(getCatNames(dataset));
            createCenterDataset();

            updateDonutDataset();
        }
    
        this.updateDataset = function(dataset) {
            // Assume no new categ of data enter
            var donut = charts.selectAll(".donut")
                        .data(dataset);

            updateDonutDataset();
        }
    }


    /*
     * Returns a json-like object.
     */
    function genDataDataset(div, data, donutnumber, page) {
        
        var title = data.split('.')[0];
        title = title.split('/')[1];

        //for each doc
        $.getJSON( data, function( ds ) {
         

            var rangeup = donutnumber*page;
            var rangedown = (page-1)*donutnumber;

            var cpt = 0
          
            Object.keys(ds).forEach(function(element) {

            if(cpt >= rangedown && cpt < rangeup){

                var dataset = new Array();
                var type = Object.keys(ds[element]);
                //var unit = [''];
                for (var i = 0; i < type.length; i++) {
                    //console.log(ds[element][type[i]]);
                    var cat = ds[element][type[i]].map(function(d) { return d['name']; });

                    var arr = new Array();
                    var total = 0;

                    for (var j = 0; j < cat.length; j++) {
                        var result  = ds[element][type[i]].filter(function(o){return o.name == cat[j];} );

                        var value = result[0]["value"];
                        total += value;
                        var docList = result[0]["dataset"];
                        arr.push({
                            "cat": cat[j],
                            "val": value,
                            "datasetList": docList
                        });
                    }

                    dataset.push({
                        "type": type[i],
                        //"unit": unit[i],
                        "data": arr,
                        "total": total
                    });
                }       
                var donuts = new DonutChartsDataset(div);
                donuts.createDataset(div, dataset, element);    
            }
           cpt++;
           });
           
        }); 
        //return dataset;
    }