function VidpaneController() {

}

app.component('vidpane', {
  templateUrl: '/angular/partials/vidpane.html',
  controller: VidpaneController,
  bindings: {
    vidpane: '='
  }
});
