app.directive('objMesh', function( TargetModel ){
  var definitionObject = {
    templateUrl: '/angular/partials/objMesh.html',
    restrict: 'C',
    controller: function( $scope ){
      var self = this;

      var meshcontainer = new Scanpane( "pane_0", {
          "mesh": "meshes/duckyn.obj",
          "dimension": { "x": 500, "y": 500 },
          "scale": { "x": 1, "y": 1 },
          "subject": "Dusky Broadbill - Exterior"
        });

    },
    scope: {},
    controllerAs: 'ctlMesh'
  };

  return definitionObject;
});
