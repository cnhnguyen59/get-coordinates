require([
    "esri/widgets/Sketch",
    "esri/Map",
    "esri/layers/GraphicsLayer",
    "esri/views/MapView",
    "esri/geometry/support/webMercatorUtils"
  ], (Sketch, Map, GraphicsLayer, MapView, webMercatorUtils) => {

    const graphicsLayer = new GraphicsLayer();

    const map = new Map({
      basemap: "topo-vector",
      layers: [graphicsLayer]
    });

    const view = new MapView({
      container: "viewDiv",
      map: map,
      zoom: 5,
      center: [-98.5795, 39.8283]
    });

    view.when(() => {
      const sketch = new Sketch({
        layer: graphicsLayer,
        view: view
      });

      sketch.on("create", function(event) {
        console.log(event.state)
        if (event.state === "complete") {
          var output =''
          var coordList = ''
          var poly = webMercatorUtils.webMercatorToGeographic(event.graphic.geometry).toJSON()
          console.log(event.graphic.geometry.toJSON());
          console.log(webMercatorUtils.webMercatorToGeographic(event.graphic.geometry).toJSON());

          if(poly.paths){
            poly.paths[0].forEach(coord => {
              coordList += `${coord}\n`
            });
            console.log(coordList)
            $('#coordinates').html(coordList) 
          } else{
            poly.rings[0].forEach(coord => {
              if (coord != poly.rings[0][0]) {
              coordList += `${coord}\n` 
              }
            });
            $('#coordinates').html(coordList)
          }
        }
      });

      sketch.on("update", function(event) {
        if (event.state === "active") {
          sketch.delete();
        }
      });

      // fires after delete method is called
      // returns references to deleted graphics.
      sketch.on("delete", function(event) {
        event.graphics.forEach(function(graphic){
          console.log("deleted", graphic)
          //clear coordinates box
        })
      })


      view.ui.add(sketch, "top-right");

      sketch.visibleElements = {
        createTools: {
          point: false,
          circle: false
        },
        selectionTools:{
          "rectangle-selectio": false,
          "lasso-selection": false
        },
        undoRedoMenu: false,
        settingsMenu: false
      }

    });
  });



