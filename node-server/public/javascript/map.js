// pc = svg parent container
function drawMap(id, topic){

  var dataname = '../data/map/topo_eer.json';

  d3.select("#map").remove();
  d3.select("#chart").remove();

  var map = d3.select(id);
  var pc = document.getElementById("right-sub-container-left");
  var navid = document.getElementById("myNav");

  var width = pc.clientWidth,
      height = pc.clientHeight;

  var aspect = (width / height) * 2;

  console.log("width " + width + "height " + height + " new height " + height);

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
      .attr("height", height);

  
  //var colorScale = d3.scale.linear().domain([0,2.5,7.5,10]).range(["#990000","#ff6666","#99ff99","#003300"]);
  var colorScale = d3.scale.linear().domain([0,1,10]).range(["#999999","#003300","#99ff99"]);  //var colorScale = d3.scale.linear().range(["red","green"]);

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

  d3.json(dataname, function(error, uk) {
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
        .on('click', function(d){ if(topic !== ""){
                                    openNav(navid, d.properties.EER13NM, topic);
                                  } else {
                                    drawChart();
                                  } })                  
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

function openNav(element, region, dataName) {

    console.log("topic1 " + dataName);
    var topic = dataName.concat("_Meta.csv");

    console.log("topic2 " + topic);

    document.getElementById("myNav").style.height = "100%";
    
    window.drawGraph('#overlayDisplay', region, topic, true);
    console.log("end");
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

function getTopic(elmnt){
  var topic = "";
  var str = elmnt.innerHTML;
  
  var strArray = str.split(" ");
        topic = strArray[1];

        if(topic == ""){
          topic = "overall";
        }
        return topic;
}

function setWindowSize() {
  var myWidth = 0, myHeight = 0;
  if( typeof( window.innerWidth ) == 'number' ) {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }
  
  document.getElementById("container").style.width = myWidth + "px";
  document.getElementById("container").style.height = (myHeight * 0.97) + "px";

   //alert("height " + document.getElementById("container").style.height);
}

function setTopicBack(){
  document.getElementById(topic).style.backgroundColor = "#33b5e5";
  topic = "";
  setWindowSize();
  drawMap("#right-sub-container-left", topic);

  console.log("topic " + topic);
}

function drawChart(){

  d3.select("#chart").remove();
      
  var container = document.getElementById("graph");
  console.log("look here "+ container);
  var τ = 2 * Math.PI,
      width = getInt(container.style.width),
      height = getInt(container.style.height);

  var outerRadius = Math.min(width,height)/2,
    innerRadius = (outerRadius/5)*4,
    fontSize = (Math.min(width,height)/4);
  
  myString = "1212px";
    var splits = myString.split(/(\d+)/);
    var prodName = splits[0];
    var prodId = splits[1];

  var arc = d3.svg.arc()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .startAngle(0);

      console.log(" viewBox " + width);

  var svg = d3.select("#graph").append("svg")
      .attr("id","chart")
      .attr("width", '100%')
      .attr("height", '100%')
      .attr('viewBox','0 0 '+ Math.min(width,height) +' '+ Math.min(width,height) )
      .attr('preserveAspectRatio','xMinYMin')
      .append("g")
      .attr("transform", "translate(" + Math.min(width,height) / 2 + "," + Math.min(width,height) / 2 + ")");

  var text = svg.append("text")
      .text('0%')
      .attr("text-anchor", "middle")
      .style("font-size",fontSize+'px')
      .attr("dy",fontSize/3)
      .attr("dx",2);
  
  var background = svg.append("path")
      .datum({endAngle: τ})
      .style("fill", "#7cc35f")
      .attr("d", arc);

  var foreground = svg.append("path")
      .datum({endAngle: 0 * τ})
      .style("fill", "#57893e")
      .attr("d", arc);

  setInterval(function() {
    foreground.transition()
        .duration(750)
        .call(arcTween, Math.random() * τ);
  }, 1500);

  function arcTween(transition, newAngle) {

    transition.attrTween("d", function(d) {

        var interpolate = d3.interpolate(d.endAngle, newAngle);
        
        return function(t) {
            
            d.endAngle = interpolate(t);
            
            text.text(Math.round((d.endAngle/τ)*100)+'%');
            
            return arc(d);
        };
    });
  }
}

function getInt(myString){
    var splits = myString.split(/(\d+)/);
    var prodName = splits[0];
    var prodId = splits[1];
    return parseInt(prodId);
}
