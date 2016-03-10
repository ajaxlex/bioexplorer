app.directive('datapane', [ '$compile', 'TargetModel', function( $compile, TargetModel ){

  var linker = function( scope, element, attrs ) {

    var data = TargetModel.data();

    var template = '<div class="panel-group objControl" />';
    angular.forEach( data.nodes, function( value, key ){
      template += '<div id="pane_' + key + '" class="' + value.type + ' objective" ng-show="ctlDatapane.selected = ' + key + '" />';
    });

    compiled = $compile(template)(scope);

    element.append(compiled);
  };

  var controller = function(){
    var self = this;
    this.selected = 0;
  };


  var definitionObject = {
    link: linker,
    controller: controller,
    restrict: 'A',
    scope: {
      target: '=',
      align: '='
    },
    controllerAs: 'ctlDatapane'
  };

  return definitionObject;
}]);
