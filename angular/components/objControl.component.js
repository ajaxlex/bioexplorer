app.directive('objControl', function( TargetModel ){
  var definitionObject = {
    templateUrl: 'angular/partials/objControl.html',
    restrict: 'C',
    controller: function( $scope ){
      var self = this;
      self.nodes = TargetModel.data().nodes;

      self.select = function( index ){
        $scope.$parent.ctlDatapane.selected = index;
      }
    },
    scope: {
      target: '=',
      align: '='
    },
    controllerAs: 'ctlControl'
  };

  return definitionObject;
});
