app.directive('controlpane', function( TargetModel ){
  var definitionObject = {
    templateUrl: '/angular/partials/controlpane.html',
    restrict: 'E',
    controller: function( $scope ){
      var self = this;
      self.nodes = TargetModel.data().nodes;      
    },
    scope: {
      target: '=',
      align: '='
    },
    controllerAs: 'ctlpane'
  };

  return definitionObject;
});
