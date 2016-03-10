/*
  vidpane.js
  An annotatable video pane

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

*/

var Vidpane = function( el, config ){

  //safety
  if (!(this instanceof Vidpane)) {
    return new Vidpane( el, config );
  }

  var self = this;

  var container, context, v, s, c;

  var objective = config;

  var control_height = 30;

  var overlay = null;

  var annotation_height = 30;
  var annotation_xstart = config.source.dimension.x + 10;

  var maxSlots = 10;
  var slots_open = [];
  var annotations = [];

  var measurement = { state: 0, sx: 0, sy: 0, ex: 0, ey: 0, dist: 0 };

  var target = { x: 0, y: 0 };

  for ( var i=0; i < maxSlots; i++ ){
    slots_open[i] = true;
  }

  this.addAnnotation = function( label, start, end, x, y ) {
    annotations.push( { label: label, t_start: start, t_end: end, pos_x: x, pos_y: y, slot: -1 } );
  };

  var parseObjective = function( objective ){
    for ( var i=0; i<objective.annotations.length; i++){
      var curr = objective.annotations[i];
      self.addAnnotation( curr.label, curr.time.start, curr.time.end, curr.pos.x, curr.pos.y );
    }
  };

  var displayAnnotations = function(){
    for ( var i=0; i < annotations.length; i++ ){
      displayAnnotationInstance( annotations[i] );
    }
  };

  var getNextSlot = function(){
    for ( var i = 0; i < maxSlots; i++ ){
      if ( slots_open[i] === true ){
        slots_open[i] = false;
        return i;
      }
    }
    return maxSlots;
  };

  var displayAnnotationInstance = function( annotation ){
    if ( v.currentTime >= annotation.t_start && v.currentTime < annotation.t_end ) {
      if ( annotation.slot == -1 ) {
        annotation.slot = getNextSlot();
      }
      var dslot = annotation.slot + 1;

      context.beginPath();
      context.moveTo(annotation.pos_x, annotation.pos_y);
      context.lineTo(annotation_xstart, dslot * annotation_height);
      context.strokeStyle = '#fff';
      context.stroke();

      context.beginPath();
      context.moveTo(annotation.pos_x+1, annotation.pos_y+1);
      context.lineTo(annotation_xstart, (dslot * annotation_height)+1);
      context.strokeStyle = '#000';
      context.stroke();

      context.fillStyle = "#999";
      context.fillRect(annotation_xstart, (dslot * annotation_height) - 10, 150, annotation_height - 2);

      context.font = "14px Helvetica";
      context.fillStyle = "#000";
      context.fillText(annotation.label, annotation_xstart + 5, (dslot * annotation_height) + 5);
    } else if ( annotation.slot != -1 ) {
      slots_open[annotation.slot] = true;
      annotation.slot = -1;
    }
  };

  var drawTriangle = function( cx, cy, size ) {

    var half = size / 2;

    var xa = cx - half;
    var ya = cy + half;

    var xb = cx;
    var yb = cy - half;

    var xc = cx + half;
    var yc = cy + half;

    context.beginPath();
    context.moveTo( xc, yc );
    context.lineTo(xa, ya);
    context.lineTo(xb, yb);
    context.lineTo(xc, yc);
    context.strokeStyle = '#fff';
    context.stroke();

  }

// control api
  self.play = function(){
    v.play();
  };

  self.pause = function(){
    v.pause();
  };

  self.setRate = function( rate ){
    v.playbackRate = rate;
  };

  self.stepFwd = function(){
    v.pause();
    v.currentTime += 0.1;
  };

  self.stepBack = function(){
    v.pause();
    v.currentTime -= 0.1;
  };

  self.goTo = function( time ){
    v.currentTime = time;
  };

  self.getTime = function(){
    return v.currentTime;
  };

  self.getVideo = function(){
    return v;
  }

  self.startMeasure = function(){
    measurement.state = 1;
  }

  var createElements = function( el, source ){

    var addEl = function( type, attributes ){
      var elem = document.createElement( type );
      for (var k in attributes) {
          if (attributes.hasOwnProperty(k)) {
             elem.setAttribute( k, attributes[k] );
          }
      }
      return elem;
    };

    var appendClass = function( element, classVal ){
      var currentClass = element.getAttribute("class");
      element.setAttribute( "class", currentClass === "" ? classVal : currentClass + " " + classVal);
    };

    if ( el.tagName ) {
      container = el;
    } else {
      container = document.getElementById( el );
    }

    container.style.width = source.dimension.x + "px";
    container.style.height = source.dimension.y + "px";
    container.style.position = "relative";

    var controls = container.getElementsByClassName("controls")[0];
    controls.style.top = ( source.dimension.y - control_height ) + "px";

    overlay = container.getElementsByClassName("overlay")[0];
    overlay.innerHTML = objective.header.subject + " - " + 0;

    var bindControl = function( name, bound ){
      controls.getElementsByClassName( name )[0].onclick = bound;
    };

    bindControl("vid-fast-back", function(){ self.pause(); self.goTo( 0 ); });

    bindControl("vid-step-back", self.stepBack );

    bindControl("vid-pause", self.pause );

    bindControl("vid-play", self.play );

    bindControl("vid-step-fwd", self.stepFwd );

    bindControl("vid-measure", self.startMeasure );



    appendClass( container, "vidcontainer");

    if ( !source.scalingfactor ) { source.scalingfactor = 0; }

    v = addEl( "video", {"width": source.dimension.x, "height": source.dimension.y, "muted": true });
    s = addEl( "source", { "src": source.url, "type": source.type });

    appendClass( v, "v" );
    appendClass( s, "s" );

    var legacy = document.createElement("p");
    legacy.innerHTML = "Your user agent does not support the HTML5 Video element.";

    v.appendChild( s );
    v.appendChild( legacy );

// source.dimension.x + 100
    c = addEl( "canvas", {"width": source.dimension.x + 200, "height": source.dimension.y });
    appendClass( c, "c" );

    container.appendChild( v );
    container.appendChild( c );

    context = c.getContext("2d");

    var updateCanvas = function(){
      context.clearRect(0, 0, c.width, c.height);
      displayAnnotations();
      overlay.innerHTML = objective.header.subject + " - " + Math.floor( v.currentTime * 100 ) / 100 + " { " + target.x + ", " + target.y + " } " + " D: " +measurement.dist;
      //displayAnnotationInstance({ label: "TEST", t_start: 0, t_end: v.currentTime + 1, pos_x: target.x, pos_y: target.y, slot: 0 });
      if ( measurement.state == 2 ) {
        drawTriangle( measurement.sx, measurement.sy, 7 );
      }

      if ( measurement.state == 3 ) {
        drawTriangle( measurement.sx, measurement.sy, 7 );
        drawTriangle( measurement.ex, measurement.ey, 7 );
      }

    };


    v.addEventListener('timeupdate', function() {
      updateCanvas();
    }, false);


    // we cannot trust container.offsetLeft/offsetTop, so we will take values directly from the hosting pane ( .leftpane or .rightpane )
    var tempTop = 165;
    var tempLeft = 200;

    c.addEventListener("mousedown", function( event ){
      target = { x: event.x - tempLeft, y: event.y - tempTop };
      overlay.innerHTML = objective.header.subject + " - " + v.currentTime + " { " + target.x + ", " + target.y + " }";
      //if ( source.scalingfactor !== 0 ) {
        if ( measurement.state == 1 ){
          measurement.sx = target.x;  measurement.sy = target.y;
          measurement.state = 2;
          updateCanvas();
        } else if ( measurement.state == 2 ){
          measurement.ex = target.x;  measurement.ey = target.y;
          measurement.state = 3;
          measurement.dist = Math.sqrt( (measurement.sx-measurement.ex)*(measurement.sx-measurement.ex) + (measurement.sy-measurement.ey)*(measurement.sy-measurement.ey) );
          measurement.dist *= source.scalingfactor;
          measurement.dist = Math.floor( measurement.dist * 100 ) / 100;
          updateCanvas();
        } else if ( measurement.state == 3 ){
          measurement.sx = measurement.sy = measurement.ex = measurement.ey = measurement.dist = measurement.state = 0;
          updateCanvas();
        }
      //} else {
      //  measurement.state = 0;
      //}
    }, true );

    c.addEventListener("mousemove", function( event ){
      if ( measurement.state == 2 ) {

      }
    });

  };

  createElements( el, objective.source );
  parseObjective( objective );

  if ( objective.source.default_rate ) {
    self.setRate( objective.source.default_rate );
  }

};
