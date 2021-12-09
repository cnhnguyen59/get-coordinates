// ArcGIs API Key

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
          console.log(poly.rings[0][0])
          console.log(poly.rings[0][0][0])
          console.log(poly.rings[0][0][1])

        poly.rings[0].forEach(coord => {
            console.log(coord)

            if (coord != poly.rings[0][0]) {
            coordList += `${coord}\n` 
            console.log(coordList)
            }
          });
          
          console.log(coordList)
          $('#coordinates').html(coordList) 
        }
      });

      // selected graphics can be deleted only when update event becomes active
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



