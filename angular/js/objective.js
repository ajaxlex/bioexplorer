/*
  objective.js
  An stl viewer for phylogeny subjects

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
  config = {
    "mesh": "meshes/duckyn.obj",
    "dimension": { "x": 400, "y": 400 },
    "scale": { "x": 1, "y": 1 }
  }
*/



var Scanpane = function( el, config ){

  if (!(this instanceof Scanpane)) {
    return new Scanpane( el, config );
  }

  var self = this;

  var container;
  // Set up the scene, camera, and renderer as global variables.
  var camera, controls, scene, renderer;

  var mouse = new THREE.Vector2();
  var offset = new THREE.Vector3( 10, 10, 10 );

  var showGrid = true;
  var gridHelper;

  var control_height = 30;

  var targetObject;

  var raycaster = new THREE.Raycaster();

  var clock = new THREE.Clock();

  var pinMaterial;

  var d;

  var config = config;

  //window.onload = function(){
    init();
    animate();
  //};

  // Sets up the scene.
  function init() {

    var yoffset = 0;
    var zoffset = 10;
    var meshTarget = config.mesh;

    var showTexture = false;

    if ( el.tagName ) {
      container = el;
    } else {
      container = document.getElementById( el );
    }

    container.setAttribute( "width", config.dimension.x );
    container.setAttribute( "height", config.dimension.y );
    container.style.width = config.dimension.x + "px";
    container.style.height = config.dimension.y + "px";

    var controls_dom = container.getElementsByClassName("controls")[0];
    controls_dom.style.top = ( config.dimension.y - control_height ) + "px";

    var overlay = container.getElementsByClassName("overlay")[0];
    overlay.innerHTML = config.subject;


    camera = new THREE.PerspectiveCamera( 70, config.dimension.x / config.dimension.y, 1, 10000 );
    camera.position.z = 5;

    // preserveDrawingBuffer allows for screenshots, but may affect performance
    renderer = new THREE.WebGLRenderer( { antialias: true, preserveDrawingBuffer : true } );
    renderer.setClearColor( 0x000000 );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( config.dimension.x, config.dimension.y );
    renderer.sortObjects = false;

    controls = new THREE.OrbitControls( camera, renderer.domElement );
    //controls.addEventListener( 'change', render ); // add this only if there is no animation loop (requestAnimationFrame)
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = false;


    // Create the scene and set the scene size.
    scene = new THREE.Scene();


    gridHelper = new THREE.GridHelper( 10, 1 );
    gridHelper.setColors( 0x888888, 0x333333 );
    scene.add( gridHelper );

    scene.add( new THREE.AmbientLight( 0x555555 ) );

    var light = new THREE.SpotLight( 0xffffff, 1 );
    light.position.set( 0, 500, 0 );
    scene.add( light );

    light = new THREE.SpotLight( 0xffffff, 0.5 );
    light.position.set( 0, -500, 0 );
    scene.add( light );


    pinMaterial = createParticleMaterial();


    // load managers
    var manager = new THREE.LoadingManager();
    manager.onProgress = function ( item, loaded, total ) {
      console.log( item, loaded, total );
    };

    var onProgress = function ( xhr ) {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log( Math.round(percentComplete, 2) + '% downloaded' );
      }
    };

    var onError = function ( xhr ) {
      console.log('load err');
    };


    // model
    var loader2 = new THREE.OBJLoader( manager );
    loader2.load( config.mesh, function ( object ) {

      object.position.y = object.position.y + 1;
      scene.add( object );

      camera.position.y = object.position.y + 4;
      camera.lookAt( object.position );

      targetObject = object;

    }, onProgress, onError );

    container.appendChild( renderer.domElement );

    renderer.domElement.addEventListener( 'mousedown', onDocumentMouseDown, false );
    renderer.domElement.addEventListener( 'touchstart', onDocumentTouchStart, false );
  }

  function onDocumentTouchStart( event ) {
    event.preventDefault();
    event.clientX = event.touches[0].clientX;
    event.clientY = event.touches[0].clientY;
    onDocumentMouseDown( event );
  }

  function onDocumentMouseDown( event ) {

    event.preventDefault();

    mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera( mouse, camera );

    var intersects = raycaster.intersectObject( targetObject, true );

    if ( intersects.length > 0 ) {

      //intersects[ 0 ].object.material.color.setHex( Math.random() * 0xffffff );

      var particle = new THREE.Sprite( pinMaterial );
      particle.position.copy( intersects[ 0 ].point );
      //particle.scale.x = particle.scale.y = 16;
      scene.add( particle );

    }
  }

  function createParticleMaterial() {
    var textureLoader = new THREE.TextureLoader();
    var sprite = textureLoader.load( "textures/disc.png" );

    var material = new THREE.PointsMaterial( { size: 8, map: sprite, blending: THREE.AdditiveBlending, depthTest: false, transparent : true } );
    material.color.setHSL( 0.8, 0.8, 0.2 );

    return material;
  }

  //var distance = point1.distanceTo( point2 );

  function animate() {
    requestAnimationFrame( animate );
    controls.update();
    render();
  }

  function render() {
    renderer.clear();
    renderer.render( scene, camera );
  }

  self.getThumbnail = function() {
    return renderer.domElement.toDataURL("image/png");
  }

};
