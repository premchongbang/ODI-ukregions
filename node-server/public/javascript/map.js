// pc = svg parent container
 var colorScale;
function drawMap(id){

  var dataname = '../data/map/topo_eer.json';

  console.log("topic " + topic);

  d3.select("#map").remove();
  d3.select("#chart").remove();

  var map = d3.select(id);
  var pc = document.getElementById("right-sub-container-left");
  var navid = document.getElementById("myNav");

  var width = pc.clientWidth,
      height = pc.clientHeight;

  var aspect = (width / height) * 2;

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

  var aspect = width / height;

  var areas=["AB", "AL", "B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "BT", "CA", "CB", "CF", "CH", "CM", "CO", "CR", "CT", "CV", "CW", "DA", "DD", "DE", "DG", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EH", "EN", "EX", "FK", "FY", "G", "GL", "GU", "HA", "HD", "HG", "HP", "HR", "HS", "HU", "HX", "IG", "IP", "IV", "KA", "KT", "KW", "KY", "L", "LA", "LD", "LE", "LL", "LN", "LS", "LU", "M", "ME", "MK", "ML", "N", "NE", "NG", "NN", "NP", "NR", "NW", "OL", "OX", "PA", "PE", "PH", "PL", "PO", "PR", "RG", "RH", "RM", "S", "SA", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", "SR", "SS", "ST", "SW", "SY", "TA", "TD", "TF", "TN", "TQ", "TR", "TS", "TW", "UB", "W", "WA", "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO", "ZE"];
  
  //var ratings= {"Scotland": 1, "North East":7, "North West":2, "Yorkshire and The Humber":9, "Wales":3, "West Midlands": 4, "East Midlands":5, "London":8, "Eastern":9, "South West":1, "South East":10};

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
    
    var min = d3.min(d3.values(ratings));
    var max = d3.max(d3.values(ratings));
	if (!min){
		min = 0.1;
	}
	if(!max){
		max = 0.1;
	}

    var colorScale = d3.scale.linear().domain([0,min,max]).range(["#999999","#99ff99","#003300"]);  //var colorScale = d3.scale.linear().range(["red","green"]);

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
    .text('Max')
      .attr("font-family", "sans-serif")
      .attr("font-size", "1vw");
  svg.append('text')
      .attr('x',width*0.92)
    .attr('y',250)
    .text('Min')
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
        .on('mouseover',function(d){svg.selectAll('text.tiptext').text(d.properties.EER13NM).transition();
										drawChart(d.properties.EER13NM);
                    d3.selectAll('#clientmsg').text(topic).transition();
                    d3.selectAll('#chartcat').text(d.properties.EER13NM).transition();
                  })
        .on('click', function(d){ if(topic !== "Overall Score"){
                                    openNav(navid, d.properties.EER13NM, topic);
                                  } else {
                                    if(!isEmpty(ratings)){
                                      drawChart(d.properties.EER13NM);
                                    }
                                  }
								  //svg.select('.mesh').style('stroke','blue').transition;
								  d3.selectAll('.postcode_area')
									.style(
										'fill-opacity',0.8
									);
								  d3.select(this).style('fill-opacity', 1);
                                })                  
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

// checking for empty objects
function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

function updateMap(){
	var min = d3.min(d3.values(ratings));
    var max = d3.max(d3.values(ratings));
	if (!min){
		min = 0.1;
	}
	if(!max){
		max = 0.2;
	}
	colorScale = d3.scale.linear().domain([0,min,max]).range(["#999999","#99ff99","#003300"]);  //var colorScale = d3.scale.linear().range(["red","green"]);

	d3.selectAll('#map').transition().duration(500);
	d3.selectAll('title').transition().duration(500);
	d3.selectAll('.postcode_area').style("fill", function(d) {
          //Get data value
          return colorScale(ratings[d.properties.EER13NM]);
        }).transition().duration(500);
}

function openNav(element, region, dataName) {

    var topic = dataName.concat("_Meta.csv");

    document.getElementById("myNav").style.height = "100%";
    window.drawGraph('#overlayDisplay', region, topic, true);
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}

// fetch the current topic
function getTopic(elmnt){
  var topic = "";
  var str = elmnt.innerHTML;
  
  var strArray = str.split(" ");
        topic = strArray[1];

        if(topic == ""){
          topic = "Overall Score";
        }
        return topic;
}

// setting window size for responsive layout
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

//setting topics
function setTopicBack(){
  document.getElementById(topic).style.backgroundColor = "#33b5e5";
  topic = "Overall Score";
  setWindowSize();
  //drawMap("#right-sub-container-left", topic);
  updateMap();

  console.log("Set topic Back" + topic);
}

function drawChart(region){

  for(key in ratings){
    if(region === key){
      console.log("match . key " + key + " region " + region + " value " + ratings[key]);
    }
  }

  d3.select("#chart").remove();
      
  var container = document.getElementById("graph");

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


    foreground.transition()
        .duration(750)
        .call(arcTween, ratings[region]* τ/5);
  

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


// index code 

      var topic = "Overall Score"; // need to change it 
      
      var data = {regional: {}}; // stores regional ratings 
      var ratings = {}; // stores rating values
      var allRadios = document.getElementsByName('selector');

      $(document).ready(function(){
        $("button").click(function() {
          var p1 = $("#p1").val(),
              p2 = $("#p2").val(),
              p3 = $("#p3").val();

          if((p1==p2)||(p1==p3)||(p2==p3)) {
            document.getElementById("clientmsg").innerHTML = "Please select unique categories.";
             document.getElementById("chartcat").innerHTML = "";
          } else {
            //var customList = {ID : 3, one : $("#p1").val(), two : $("#p1").val(), three : $("#p1").val()};
            document.getElementById("clientmsg").innerHTML = "";
            document.getElementById("chartcat").innerHTML = "";
            $.ajax({
              type : 'POST',
              url : '/getPreferenceRating',
              headers : {'Content-Type' : 'application/json'},
              data : JSON.stringify({ID : this.id, one : p1, two : p2, three : p3}),
              success : function(result) {
                ratings = result;
                updateMap();
                setPref();
              }
            });
          }
        });
      });

      // in here, we set the preferences which remain static
      function getCustomRating(elemt){

        if(elemt.value === "one"){
          var topics = ["Housing", "Social", "Crime"];
          getData(topics);
        } else if(elemt.value === "two"){
          var topics = ["Employment", "Economy", "Housing"];
          getData(topics);
        } else if(elemt.value === "three"){
          var topics = ["Social", "Crime", "Population"];
          getData(topics);
        } else if(elemt.value === "four"){
          var topics = ["Economy", "Population", "Crime"];
          getData(topics);
        }
      }

      function getData(customList){
        var storeNum = ["count", "one", "two", "three", "four", "five"];
        var list = {};

        // index zero store size of customList
        for(i=0; i <= customList.length;i++){
          if(i === 0){
            var index = storeNum[i];
            list.index = customList.length;          
          } else {
            var index = storeNum[i];
            list.index = customList[i];
          }
        }

        // need to add ajax code here
        $(document).ready(function(){
          $.ajax({
            type : 'POST',
            url : '/getPreferenceRating',
            headers : {'Content-Type' : 'application/json'},
            data : JSON.stringify({ID : "custom", one : customList[0], two : customList[1], three : customList[2]}),
            success : function(result) {
              ratings = result;
              updateMap();
              setPref();
            }
          });
        });
      }

      function changeTopic(elmnt){

        //getting onclicked topic
        if(topic !== "Overall Score"){
          document.getElementById(topic).style.backgroundColor = "#33b5e5";
        }

        topic = getTopic(elmnt);
        setWindowSize();
        for(key in data.regional){
			     console.log("topic " + topic + "  key " + key);
          if(topic === key){
            ratings = data.regional[key];
          }
        }
        updateMap();
        elmnt.style.backgroundColor = " #87CEFA";
      }

      // setting topic to initial state
      function setTopicBack(){
        if(topic !== "Overall Score"){
          document.getElementById(topic).style.backgroundColor = "#33b5e5"; 
        }

        topic = "Overall Score";
        ratings = data.regional.Overall;
        setWindowSize();
        updateMap();
      }

      // setting topic to initial state
      function setPref(){
        if(topic !== "Overall Score"){
          document.getElementById(topic).style.backgroundColor = "#33b5e5"; 
        }

        topic = "Overall Score";
        setWindowSize();
        updateMap();
      }
      
      window.onload = function (){
        setWindowSize();
        drawMap("#right-sub-container-left");
        change(document.getElementById("slideThree"));
      }

      window.onresize = function(){
        setWindowSize();
        drawMap("#right-sub-container-left"); 
        
        document.getElementById("clientmsg").innerHTML = "";
        document.getElementById("chartcat").innerHTML = "";
        d3.select("#chart").remove();
      }

      // change mode
      function changeMode(elemt){
        window.change(elemt);
      }

      // hiding html contents
      function change(elemt){
        if(elemt.value === "true"){

          // getting all radios button by name and unchecking them
          for(x = 0; x < allRadios.length; x++){
            allRadios[x].checked = false;
          }

          elemt.value = false;
          setTopicBack();
          ratings= {"Scotland":null, "North East":null, "North West":0, "Yorkshire and The Humber":0, "Wales":0, "West Midlands":0, "East Midlands":0, "London":0, "Eastern":0, "South West":0, "South East":0};
          updateMap();
          //drawMap("#right-sub-container-left"); 
          document.getElementById("clientmsg").innerHTML = "";
           document.getElementById("chartcat").innerHTML = "";
          d3.select("#chart").remove();
          
          document.getElementById("mh1").style.display = "unset";
          document.getElementById("bh1").style.display = "unset";

          document.getElementById("mh2").style.display = "none";
          document.getElementById("bh2").style.display = "none";
          document.getElementById("pref").style.display = "none";
        } else {
          elemt.value = true;
          
          ratings = data.regional.Overall;

          setTopicBack();
		  updateMap();
          //drawMap("#right-sub-container-left"); 
          document.getElementById("clientmsg").innerHTML = "";
          document.getElementById("chartcat").innerHTML = "";

          d3.select("#chart").remove();
          
          document.getElementById("mh1").style.display = "none";
          document.getElementById("bh1").style.display = "none";

          document.getElementById("mh2").style.display = "unset";
          document.getElementById("bh2").style.display = "unset";
          document.getElementById("pref").style.display = "unset";
        }
      }
