// pc = svg parent container
function drawMap(id, pc, navid, bool){
  if(bool){
    d3.select("svg").remove();
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

  var projection = d3.geo.albers()
    .center([2, 55.4])
    .rotate([4.4, 0])
    .parallels([50, 60])
    .scale(1200 * (aspect * 2))
    .translate([width / 2, height / 2]);

  var path = d3.geo.path()
      .projection(projection);

  var svg = map.append("svg")
      .attr("width", width)
      .attr("height", newHeight);

  var aspect = width / height;

  var areas=["AB", "AL", "B", "BA", "BB", "BD", "BH", "BL", "BN", "BR", "BS", "BT", "CA", "CB", "CF", "CH", "CM", "CO", "CR", "CT", "CV", "CW", "DA", "DD", "DE", "DG", "DH", "DL", "DN", "DT", "DY", "E", "EC", "EH", "EN", "EX", "FK", "FY", "G", "GL", "GU", "HA", "HD", "HG", "HP", "HR", "HS", "HU", "HX", "IG", "IP", "IV", "KA", "KT", "KW", "KY", "L", "LA", "LD", "LE", "LL", "LN", "LS", "LU", "M", "ME", "MK", "ML", "N", "NE", "NG", "NN", "NP", "NR", "NW", "OL", "OX", "PA", "PE", "PH", "PL", "PO", "PR", "RG", "RH", "RM", "S", "SA", "SE", "SG", "SK", "SL", "SM", "SN", "SO", "SP", "SR", "SS", "ST", "SW", "SY", "TA", "TD", "TF", "TN", "TQ", "TR", "TS", "TW", "UB", "W", "WA", "WC", "WD", "WF", "WN", "WR", "WS", "WV", "YO", "ZE"];

  var areadata={};

  _.each(areas, function(a) {
    areadata[a]=a.charCodeAt(0);
  });

  var color = d3.scale.quantize().range([
                  "rgb(198,219,239)",
                  "rgb(158,202,225)",
                  "rgb(107,174,214)",
                  "rgb(66,146,198)",
                  "rgb(33,113,181)",
                  "rgb(8,81,156)",
                  "rgb(8,48,107)"]);

  color.domain(d3.extent(_.toArray(areadata)));   

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

    svg.selectAll(".postcode_area")
      .data(topojson.feature(uk, uk.objects['eer']).features)
      .enter().append("path")
        .attr("class", "postcode_area")
        .attr("d", path)
        .style("fill", function(d) {
          //Get data value
          var value = areadata[d.id];
        })
        .on('mouseover',function(d){svg.selectAll('text.tiptext').text(d.properties.EER13NM).transition();})
        .on('click', function(d){ console.log(d.properties.EER13NM); openNav(navid);})                  
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

function openNav(element) {
    element.style.height = "100%";
}

function closeNav() {
    document.getElementById("myNav").style.height = "0%";
}