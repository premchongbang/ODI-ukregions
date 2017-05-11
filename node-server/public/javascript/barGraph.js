function drawGraph(id, region, dataName, filter){
	var dataname = '../data/'+ dataName;

	//delete previous chart
	d3.select("#bargraph").remove();
    d3.select("select").remove();
	var margin = {top: 80, right: 220, bottom: 80, left: 370},
	    width = 1100 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var svg = d3.select(id).append("svg")
		.attr("id","bargraph")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//d3.select("input").on("click",changedata);
		if (filter){
			var selector = d3.select("#drop").append("select");
		}
		if(!filter){
			var selector = d3.select("#drop2").append("select");
		}
		//plot();
		/*function changedata(name){
		svg.selectAll('*').remove();
		plot();
		//svg.transition();
		}*/

	d3.csv(dataname, function(error, data){
	    	
		//d3.select("#button2").on("click",changedata("data2.tsv"));
		if (filter){
		  var data = data.filter(function(d){return d.Regions === region;});
		}
		
		//console.log(region);
		// filter year
		
		// Get every column value
		/*var elements = Object.keys(data[0])
			.filter(function(d){
				return ((d != "Regions") & (d != "Sub_Region"));
			});*/
		//console.log(data);
		var elements = data.map(function(d){ return d.Sub_Region;});
        //console.log(elements.length);
		
        
		var categories = Object.keys(data[0]).filter(function(d){
					return ((d != "Regions") & (d != "Sub_Region"));
			});
		
		//console.log(categories[0]);	
		var selection = categories[0];
		console.log(selection);
		
		formated = data.map(function(d){return {Sub_Region: d.Sub_Region,
		values:+d[selection]};
	});
	
	console.log(formated);
		//console.log(categories);
		var x = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d[selection];
				})])
				.range([0,width]);

		var y = d3.scale.ordinal()
				.domain(elements)
				.rangeBands([height,0],.5);


		var xAxis = d3.svg.axis()
			.scale(x)
		    .orient("top");

		var yAxis = d3.svg.axis()
			.scale(y)
		    .orient("left");

		svg.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0, 0)")
	    	.call(xAxis)
	    	.selectAll("text")
	    	.style("font-size", "10px")
	      	.style("text-anchor", "end")
	      	.attr("dx", "-.8em")
	      	.attr("dy", "-.55em");
			
		var w = -margin.left+20;
        svg.append("text")
            .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
            .attr("transform", "translate("+ w +","+height/3+")rotate(-90)")
			.style("font-size", "12px")
	      	.style("text-anchor", "end")
            .text("Region/Sub Regions");
	 	svg.append("g")
	    	.attr("class", "y axis")
	    	.call(yAxis);
		
		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("height", y.rangeBand())
			.attr("width", function(d){
				//console.log(d[selection]);
				return x(+d[selection]);
			})
			.attr("y", function(d, i){
				return y(d.Sub_Region);
			})
			.attr("x", function(d){
				return 0;
			})
			.append("title")
			.text(function(d){
				return d.Sub_Region + " : " + d[selection];
			});
       
		//var selector = d3.select("#drop")
	    	//.append("select")
			selector
	    	.attr("id","dropdown")
	    	.on("change", function(d){
	        	selection = document.getElementById("dropdown");
				//console.log(selection);
	        	x.domain([0, d3.max(data, function(d){
					return +d[selection.value];})]);


	        	xAxis.scale(x);

	        	d3.selectAll(".rectangle")
	           		.transition()
		            .attr("width", function(d){
						return x(+d[selection.value]);
					})
					.attr("y", function(d, i){
						return y(d.Sub_Region) ;
					})
					.attr("x", function(d){
						return 0;
					})
	           		.ease("linear")
	           		.select("title")
	           		.text(function(d){
	           			return d.Sub_Region + " : " + d[selection.value];
	           		});
	      
	           	d3.selectAll("g.x.axis")
	           		.transition()
	           		.call(xAxis);

	         });

	    selector.selectAll("option")
	      .data(categories)
	      .enter().append("option")
	      .attr("value", function(d){
	        return d;
	      })
	      .text(function(d){
	        return d;
	      })
	});
}