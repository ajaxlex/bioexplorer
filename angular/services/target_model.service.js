app.factory('TargetModel', function() {
  var self = this;

  var sampleData = {
    "nodes": [
      { "name": "Exterior Mesh",
        "type": "objMesh",
        "url": "data/dbb_mesh_outer.json",
        "iconclass": "th"        
        //"data": { "somekey": "someval" }
      },
      { "name": "Sagittal Head",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_sagittal.json",
        "iconclass": "film"
      },
      { "name": "Sagittal Body BW",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_sagittal_1.json",
        "iconclass": "film"
      },
      { "name": "Sagittal Body Color",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_sagittal_2.json",
        "iconclass": "film"
      },
      { "name": "Sagittal Head Color",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_sagittal_clr.json",
        "iconclass": "film"
      },
      { "name": "Coronal Head",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_coronal.json",
        "iconclass": "film"
      },
      { "name": "Transverse Head",
        "type": "objVideo",
        "url": "data/pkg_dbb_head_transverse.json",
        "iconclass": "film"
      }
    ]
  };

  return {
    data: function(){
        return sampleData;
    },
    getData: function( index ){
      var deferred = $.Deferred();

      var target = sampleData.nodes[index];
      if ( target ) {
        if ( target.data ) {
          deferred.resolve(target.data);
        } else if ( target.url ) {
          $.getJSON( target.url, function( package ) {
            deferred.resolve(package);
          }).fail( function( f ) {
            console.log( "error loading " + self.domId );
            deferred.resolve({});
          });
        } else {
          deferred.resolve({});
        }
      }
      return deferred.promise();
    }
  };
});
