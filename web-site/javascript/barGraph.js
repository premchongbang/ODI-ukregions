function drawGraph(id, loc, pc, bool){
	var dataname = "../data/" + loc;

	var margin = {top: 80, right: 100, bottom: 80, left: 100},
	    width = 960 - margin.left - margin.right,
	    height = 500 - margin.top - margin.bottom;

	var svg = d3.select(id).append("svg")
		.attr("width", width + margin.left + margin.right)
	    .attr("height", height + margin.top + margin.bottom)
		.append("g")
	    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
		//d3.select("input").on("click",changedata);
		
		var selector = d3.select("#drop")
	    	.append("select");
		//plot();
		function changedata(name){
		svg.selectAll('*').remove();
		plot();
		//svg.transition();
		}

	d3.tsv(dataname, function(error, data){
	    	
		//d3.select("#button2").on("click",changedata("data2.tsv"));
		var data = data.filter(function(d){return d.Year == '2012';});

		// filter year
		
		// Get every column value
		var elements = Object.keys(data[0])
			.filter(function(d){
				return ((d != "Year") & (d != "State"));
			});
		var selection = elements[0];

		var y = d3.scale.linear()
				.domain([0, d3.max(data, function(d){
					return +d[selection];
				})])
				.range([height, 0]);

		var x = d3.scale.ordinal()
				.domain(data.map(function(d){ return d.State;}))
				.rangeBands([0, width]);


		var xAxis = d3.svg.axis()
			.scale(x)
		    .orient("bottom");

		var yAxis = d3.svg.axis()
			.scale(y)
		    .orient("left");

		svg.append("g")
	    	.attr("class", "x axis")
	    	.attr("transform", "translate(0," + height + ")")
	    	.call(xAxis)
	    	.selectAll("text")
	    	.style("font-size", "8px")
	      	.style("text-anchor", "end")
	      	.attr("dx", "-.8em")
	      	.attr("dy", "-.55em")
	      	.attr("transform", "rotate(-90)" );


	 	svg.append("g")
	    	.attr("class", "y axis")
	    	.call(yAxis);

		svg.selectAll("rectangle")
			.data(data)
			.enter()
			.append("rect")
			.attr("class","rectangle")
			.attr("width", width/data.length)
			.attr("height", function(d){
				return height - y(+d[selection]);
			})
			.attr("x", function(d, i){
				return (width / data.length) * i ;
			})
			.attr("y", function(d){
				return y(+d[selection]);
			})
			.append("title")
			.text(function(d){
				return d.State + " : " + d[selection];
			});

		//var selector = d3.select("#drop")
	    	//.append("select")
			selector
	    	.attr("id","dropdown")
	    	.on("change", function(d){
	        	selection = document.getElementById("dropdown");

	        	y.domain([0, d3.max(data, function(d){
					return +d[selection.value];})]);

	        	yAxis.scale(y);

	        	d3.selectAll(".rectangle")
	           		.transition()
		            .attr("height", function(d){
						return height - y(+d[selection.value]);
					})
					.attr("x", function(d, i){
						return (width / data.length) * i ;
					})
					.attr("y", function(d){
						return y(+d[selection.value]);
					})
	           		.ease("linear")
	           		.select("title")
	           		.text(function(d){
	           			return d.State + " : " + d[selection.value];
	           		});
	      
	           	d3.selectAll("g.y.axis")
	           		.transition()
	           		.call(yAxis);

	         });

	    selector.selectAll("option")
	      .data(elements)
	      .enter().append("option")
	      .attr("value", function(d){
	        return d;
	      })
	      .text(function(d){
	        return d;
	      })
	});
}