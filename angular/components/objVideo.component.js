app.directive('objVideo', function( TargetModel ){

  var controller = function(){
    var self = this;

    self.pane = {};

    self.load = function( index ){

      TargetModel.getData( index ).then( function( package ){
        if ( package != {} ) {
          self.pane = new Vidpane( self.domId, package );

          var subject = "yaya";
          var pane = index;

          self.snap = function(){
            // capture species key, pane id, and any pane-specific data necessary ( time, for example ) to return
            var thumb = addThumb( subject, pane, { time: self.pane.getTime() });
            var video = self.pane.getVideo();
            var canvas = thumb.find("canvas")[0];
            var ctx = canvas.getContext('2d');
            ctx.drawImage(video, 0, 0, 80, 80);
          };

        }
      });

    };

  };

  var linker = function( scope, element, attrs ){
    var self = scope.ctlVideo;

    self.domId = attrs.id;
    self.nodeId = attrs.nodeId;
    self.load( self.nodeId );
  };


  var definitionObject = {
    templateUrl: 'angular/partials/objVideo.html',
    restrict: 'C',
    controller: controller,
    link: linker,
    scope: {
      id: '='
    },
    controllerAs: 'ctlVideo'
  };

  return definitionObject;
});
