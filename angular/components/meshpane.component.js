function MeshpaneController() {

}

app.component('meshpane', {
  templateUrl: '/angular/partials/meshpane.html',
  controller: MeshpaneController,
  bindings: {
    meshpane: '='
  }
});
