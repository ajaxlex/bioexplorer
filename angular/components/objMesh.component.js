app.directive('objMesh', function( TargetModel ){

  var dir = this;

  var linker = function( scope, element, attrs ){
    $.getJSON( "data/dbb_mesh_outer.json", function( package ) {
      dir.mesh = new Scanpane( attrs.id, package );
    }).fail(function() {
      console.log( "error loading " + attrs.id );
    });
  }

  var controller = function() {
    var self = this;

    var subject = "yaya";
    var pane = 1; // attrs.nodeId;

    self.snap = function(){
      // capture species key, pane id, and any pane-specific data necessary ( time, for example ) to return
      var thumb = addThumb( subject, pane, {});
      var image = new Image;
      image.src = dir.mesh.getThumbnail();
      var canvas = thumb.find("canvas")[0];
      var ctx = canvas.getContext('2d');
      ctx.drawImage(image, 0, 0, 80, 80); // Or at whatever offset you like
    };
  }

  var definitionObject = {
    templateUrl: 'angular/partials/objMesh.html',
    link: linker,
    controller: controller,
    restrict: 'C',
    scope: {},
    controllerAs: 'ctlMesh'
  };

  return definitionObject;
});
