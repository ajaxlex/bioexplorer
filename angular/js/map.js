/*
  map.js
  Copyright (c) 2016, Mark Zifchock

  All rights reserved.

  Redistribution and use in source and binary forms, with or without
  modification, are permitted provided that the following conditions are met:

  Redistributions of source code must retain the above copyright notice, this
  list of conditions and the following disclaimer. Redistributions in binary
  form must reproduce the above copyright notice, this list of conditions and
  the following disclaimer in the documentation and/or other materials
  provided with the distribution.

  THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
  AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
  IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
  ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
  LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
  CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
  SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
  INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
  CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
  ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
  POSSIBILITY OF SUCH DAMAGE.

*/

/*

"data/world.json"
var width = 380,
    height = 340;
*/


var Rangepane = function( el, config ){

  if (!(this instanceof Rangepane)) {
    return new Rangepane( el, config );
  }

  var projection = d3.geo.mercator()
      .center([0, 5 ])
      .scale(150)
      .rotate([-180,0]);

  var svgMap = d3.select( el ).append("svg")
      .attr("width", config.dimension.x)
      .attr("height", config.dimension.y);

  var path = d3.geo.path()
      .projection(projection);

  var g = svgMap.append("g");

  // load and display the World
  d3.json( config.map, function(error, topology) {
      g.selectAll("path")
        .data(topojson.object(topology, topology.objects.countries)
            .geometries)
      .enter()
        .append("path")
        .attr("d", path);
  });


  var zoom = d3.behavior.zoom()
      .scaleExtent([1, 8])
      .on("zoom", move);


  function move() {
    var t = d3.event.translate,
        s = d3.event.scale;
    t[0] = Math.min(config.dimension.x / 2 * (s - 1), Math.max(config.dimension.x / 2 * (1 - s), t[0]));
    t[1] = Math.min(config.dimension.y / 2 * (s - 1) + 230 * s, Math.max(config.dimension.y / 2 * (1 - s) - 230 * s, t[1]));
    zoom.translate(t);
    g.style("stroke-width", 1 / s).attr("transform", "translate(" + t + ")scale(" + s + ")");
  }

  /*
  // zoom and pan
  var zoom = d3.behavior.zoom()
      .on("zoom",function() {
          g.attr("transform","translate("+
              d3.event.translate.join(",")+")scale("+d3.event.scale+")");
          g.selectAll("path")
              .attr("d", path.projection(projection));
    });

  */

  svgMap.call(zoom);

};
