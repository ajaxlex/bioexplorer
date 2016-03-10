app.directive('objVideo', function( TargetModel ){

  var linker = function( scope, element, attrs ){
    $.getJSON( "data/pkg_dbb_head_sagittal.json", function( package ) {
      var pane = new Vidpane( attrs.id, package );
    }).fail(function() {
      console.log( "error loading " + attrs.id );
    });
  }


  var definitionObject = {
    templateUrl: '/angular/partials/objVideo.html',
    restrict: 'C',
    link: linker,
    scope: {
      id: '='
    },
    controllerAs: 'ctlVideo'
  };

  return definitionObject;
});
