// pc = svg parent container
function drawMap(id, pc, navid, bool){

  if(bool){
    d3.select("#map").remove();
    drawMap("#right-sub-container-left", pc, navid, false);
    return;
  }

  var map = d3.select(id);
  
  var width = pc.clientWidth,
      height = pc.clientHeight;

  console.log("width " + width + "height " + height);

  var aspect = (width / height) * 2;
  var newHeight = window.innerHeight * aspect;
  pc.style.height = newHeight + "px";
  console.log("aspect " + aspect + " height " + newHeight);

  if((aspect * 2) <= 2) {
    var projection = d3.geo.albers()
                      .center([2, 55.4])
                      .rotate([4.4, 0])
                      .parallels([50, 60])
                      .scale(1200 * (aspect * 2))
                      .translate([width / 2, height / 2]);
  } else {
    var projection = d3.geo.albers()
                      .center([2, 55.4])
                      .rotate([4.4, 0])
                      .parallels([50, 60])
                      .scale(1200 * 2)
                      .translate([width / 2, height / 2]);
  }

  var path = d3.geo.path()
      .projection(projection);

  var svg = map.append("svg")
      .attr("id","map")
      .attr("width", width)
      .attr("height", newHeight);
  
  var colorScale = d3.scale.linear().domain([0,2.5,7.5,10]).range(["#990000","#ff6666","#003300","#99ff99"]);
  //var colorScale = d3.scale.linear().range(["red","green"]);

  var aspect = width / height;

  var areas=["AB", "AL", "B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "BT", "CA", "CB", "CF", "CH", "CM", "CO", "CR", "CT", "CV", "CW", "DA", "DD", "DE", "DG", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EH", "EN", "EX", "FK", "FY", "G", "GL", "GU", "HA", "HD", "HG", "HP", "HR", "HS", "HU", "HX", "IG", "IP", "IV", "KA", "KT", "KW", "KY", "L", "LA", "LD", "LE", "LL", "LN", "LS", "LU", "M", "ME", "MK", "ML", "N", "NE", "NG", "NN", "NP", "NR", "NW", "OL", "OX", "PA", "PE", "PH", "PL", "PO", "PR", "RG", "RH", "RM", "S", "SA", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", "SR", "SS", "ST", "SW", "SY", "TA", "TD", "TF", "TN", "TQ", "TR", "TS", "TW", "UB", "W", "WA", "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO", "ZE"];
  
  var ratings= {"Scotland": 1, "North East":7, "North West":2, "Yorkshire and The Humber":9, "Wales":3, "West Midlands": 4, "East Midlands":5, "London":8, "Eastern":9, "South West":1, "South East":10};
    
  var areadata={};

  _.each(areas, function(a) {
    areadata[a]=a.charCodeAt(0);
  });

  //colorScale.domain([0,10]);
  
  var svgDefs = svg.append('defs');

  var mainGradient = svgDefs.append('linearGradient')
    .attr('id', 'mainGradient')
    .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");;

  // Create the stops of the main gradient. Each stop will be assigned
  // a class to style the stop using CSS.
  mainGradient.append('stop')
    .attr('class', 'stop-up')
    .attr('offset', '0%');
    
  mainGradient.append('stop')
    .attr('class', 'stop-mid')
    .attr('offset', '50%');

  mainGradient.append('stop')
    .attr('class', 'stop-down')
    .attr('offset', '100%');
  var padding = 30;
  // Use the gradient to set the shape fill, via CSS.
  
  svg.append('rect')
    .classed('filled', true)
    .attr('x', width-padding)
    .attr('y', padding)
    .attr('width', 20)
    .attr('height', 200);
    
  

  d3.json("data/topo_eer.json", function(error, uk) {
    var tip = d3.tip()
    .attr('class', 'd3-tip')
    .offset([-10, 0])
    .html(function(d) {
      return d.properties.EER13NM;
    });
    svg.call(tip);
    svg.append('text')
      .attr('class','tiptext')
      .attr("x", 20)
      .attr("y", height/9)
      .text( 'Map')
      .attr("font-family", "sans-serif")
      .attr("font-size", "2.5vw");
    
  svg.append('text')
      .attr('x',width*0.92)
    .attr('y',20)
    .text( '10')
      .attr("font-family", "sans-serif")
      .attr("font-size", "1vw");
  svg.append('text')
      .attr('x',width*0.92)
    .attr('y',250)
    .text( '0')
      .attr("font-family", "sans-serif")
      .attr("font-size", "1vw");

    svg.selectAll(".postcode_area")
      .data(topojson.feature(uk, uk.objects['eer']).features)
      .enter().append("path")
        .attr("class", "postcode_area")
        .attr("d", path)
        .style("fill", function(d) {
          //Get data value
          return colorScale(ratings[d.properties.EER13NM]);
        })
        .on('mouseover',function(d){svg.selectAll('text.tiptext').text(d.properties.EER13NM).transition();})
        .on('click', function(d){ openNav(navid, d.properties.EER13NM);})                  
        .append("svg:title")
              .attr("transform", function (d, i) { return "translate(" + path.centroid(d) + ")"; })
              .attr("dy", ".35em")
              .text(function (d) { return d.properties.EER13NM; });

    svg.append("path")
        .datum(topojson.mesh(uk, uk.objects['eer'], function(a, b) { return a !== b; }))
        .attr("class", "mesh")
        .attr("d", path);
  });
}

function openNav(element, region) {
    //get child nodes
    var child = element.childNodes;

    console.log(region);

    //console.log("element " + element + " child " + child[3]);
    //child[3].style.background="#F8F8FF";

    window.drawGraph('#overlayDisplay', 'barGraphTestingData.tsv', "test", false);
    console.log("check");
    document.getElementById("myNav").style.height = "100%";
    console.log("end");
}

function show(){
  alert("testing");
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}