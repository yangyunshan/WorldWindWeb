// Create a WorldWindow for the canvas.
var wwd = new WorldWind.WorldWindow("canvasOne");

function initLayer() {
    var bingMapKey = "Avh_Q3k6KxwY_vTUm6li4oKa-kWktNMc9khYUEWu8kqh9qH08LATOLMuym7FK0XU";

    wwd.addLayer(new WorldWind.BMNGLayer());
    wwd.addLayer(new WorldWind.BMNGOneImageLayer());
    wwd.addLayer(new WorldWind.BMNGLandsatLayer());
    wwd.addLayer(new WorldWind.BingAerialWithLabelsLayer(bingMapKey));
    wwd.addLayer(new WorldWind.AtmosphereLayer());
    wwd.addLayer(new WorldWind.CompassLayer());
    wwd.addLayer(new WorldWind.CoordinatesDisplayLayer(wwd));
    wwd.addLayer(new WorldWind.ViewControlsLayer(wwd));

    wwd.surfaceOpacity = 0.5;

    // var rectangle = new WorldWind.Rectangle(110,39,30,30);
    // wwd.viewport = rectangle;
    new WorldWind.HighlightController(wwd);

    wwd.goTo(new WorldWind.Location(39,110));

    // var handleClick = function (recognizer) {
    //     var x = recognizer.clientX,
    //         y = recognizer.clientY;
    //     var pickList = wwd.pick(wwd.canvasCoordinates(x, y));
    //     if (pickList.objects.length === 1 && pickList.objects[0].isTerrain) {
    //         var position = pickList.objects[0].position;
    //         wwd.goTo(new WorldWind.Position(position.latitude, position.longitude,2200000));
    //     }
    // };
    // var clickRecognizer = new WorldWind.ClickRecognizer(wwd, handleClick);
    // var tapRecognizer = new WorldWind.TapRecognizer(wwd, handleClick);
}

//加载地标图层
function addPlaceMarker(wwd, placemarkLayer, lat, lon, alt) {
    wwd.addLayer(placemarkLayer);
    var placemarkAttributes = new WorldWind.PlacemarkAttributes(null);

    placemarkAttributes.imageOffset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.3,
        WorldWind.OFFSET_FRACTION, 0.0);

    placemarkAttributes.labelAttributes.color = WorldWind.Color.YELLOW;
    placemarkAttributes.labelAttributes.offset = new WorldWind.Offset(
        WorldWind.OFFSET_FRACTION, 0.5,
        WorldWind.OFFSET_FRACTION, 1.0);

    placemarkAttributes.imageSource = "images/sate.png";

    var position = new WorldWind.Position(lat, lon, alt);
    var placemark = new WorldWind.Placemark(position, false, placemarkAttributes);

    placemark.label = "Placemark\n" +
        "Lat " + placemark.position.latitude.toPrecision(4).toString() + "\n" +
        "Lon " + placemark.position.longitude.toPrecision(5).toString();
    placemark.alwaysOnTop = true;

    placemarkLayer.addRenderable(placemark);
}

//加载线形数据
function addLineString(wwd, LineLayer,line_pts) {
    wwd.addLayer(LineLayer);

    var lineAttributes = new WorldWind.ShapeAttributes(null);
    lineAttributes.outlineColor = WorldWind.Color.YELLOW;
    lineAttributes.applyLighting = true;

    var line = new WorldWind.Path(line_pts, lineAttributes);
    line.pathType = WorldWind.GREAT_CIRCLE;
    LineLayer.addRenderable(line);
}

//加载多边形数据
function addPolygon(wwd, polygon_layer,boundries) {
    var polygonAttributes = new WorldWind.ShapeAttributes(null);
    polygonAttributes.interiorColor = WorldWind.Color.RED;
    polygonAttributes.outlineColor = WorldWind.Color.BLUE;
    polygonAttributes.drawOutline = true;
    polygonAttributes.applyLighting = true;

    var polygon = new WorldWind.Polygon(boundries, polygonAttributes);
    //polygon.extrude = true;
    polygon_layer.addRenderable(polygon);
    wwd.addLayer(polygon_layer);
}

//加载shp数据
function addShp(wwd, wkt_layer, wkt) {
    var parser = new WorldWind.Wkt(wkt);
    parser.load(null, null, wkt_layer);
    wwd.addLayer(wkt_layer);
}

//加载shapefile数据
function addShapeFile(wwd, shapeFileLayer, resourceUrl) {
    // Callback function for configuring shapefile visualization.
    var shapeConfigurationCallback = function (attributes, record) {
        var configuration = {};
        alert("!!!");
        configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

        if (record.isPointType()) { // Configure point-based features (cities, in this example)
            configuration.name = attributes.values.name || attributes.values.Name || attributes.values.NAME;

            configuration.attributes = new WorldWind.PlacemarkAttributes(placemarkAttributes);

            if (attributes.values.pop_max) {
                var population = attributes.values.pop_max;
                configuration.attributes.imageScale = 0.01 * Math.log(population);
            }
        } else if (record.isPolygonType()) { // Configure polygon-based features (countries, in this example).
            configuration.attributes = new WorldWind.ShapeAttributes(null);

            // Fill the polygon with a random pastel color.
            configuration.attributes.interiorColor = new WorldWind.Color(
                0.375 + 0.5 * Math.random(),
                0.375 + 0.5 * Math.random(),
                0.375 + 0.5 * Math.random(),
                1.0);

            // Paint the outline in a darker variant of the interior color.
            configuration.attributes.outlineColor = new WorldWind.Color(
                0.5 * configuration.attributes.interiorColor.red,
                0.5 * configuration.attributes.interiorColor.green,
                0.5 * configuration.attributes.interiorColor.blue,
                1.0);
        }

        return configuration;
    };

    // Create data for the world.
    var worldShapefile = new WorldWind.Shapefile(resourceUrl);
    worldShapefile.load(null, null, shapeFileLayer);
    wwd.addLayer(shapeFileLayer);
}

//加载Tiff数据
function addGeoTiff(wwd, geoTiffLayer, resourceUrl) {
    geoTiffLayer.enabled = false;
    geoTiffLayer.showSpinner = true;
    wwd.addLayer(geoTiffLayer);

    var parserCallback = function (geoTiffReader, xhrStatus) {
        if (!geoTiffReader) {
            // Error, provide the status text to the console
            console.log(xhrStatus);
            return;
        }

        var surfaceGeoTiff = new WorldWind.SurfaceImage(
            geoTiffReader.metadata.bbox,
            // new WorldWind.ImageSource(geoTiffReader.getImage())
            resourceUrl
        );

        geoTiffLayer.addRenderable(surfaceGeoTiff);

        geoTiffLayer.enabled = true;
        geoTiffLayer.showSpinner = false;

        wwd.redraw();
        wwd.goTo(new WorldWind.Position(30, 114, 220000));
    };

    // Load the GeoTiff using the Reader's built in XHR retrieval function
    WorldWind.GeoTiffReader.retrieveFromUrl(resourceUrl, parserCallback);
}

//加载SurfaceImage数据
function addSurfaceImage(wwd, surfaceImageLayer, minLat, maxLat, minLong, maxLong, resource) {
    // Create a surface image using a static image.
    var surfaceImage1 = new WorldWind.SurfaceImage(new WorldWind.Sector(minLat, maxLat, minLong, maxLong), resource);

    // Add the surface images to a layer and the layer to the WorldWindow's layer list.
    surfaceImageLayer.displayName = "Surface Images";
    surfaceImageLayer.addRenderable(surfaceImage1);
    wwd.addLayer(surfaceImageLayer);
}

$(function () {
    $(document).ready(function () {
        var placemarkLayer = new WorldWind.RenderableLayer();

        // var lineStringLayer = new WorldWind.RenderableLayer();
        // var line_pts = [];
        // line_pts.push(new WorldWind.Position(24, 124, 10000));
        // line_pts.push(new WorldWind.Position(30, 120, 10000));
        //
        // var polygon_layer = new WorldWind.RenderableLayer();
        // var boundries = []
        // boundries.push(new WorldWind.Position(34, 124, 10000));
        // boundries.push(new WorldWind.Position(34, 126, 10000));
        // boundries.push(new WorldWind.Position(32, 126, 10000));
        // boundries.push(new WorldWind.Position(32, 124, 10000));
        var resourceUrl = "images/wu_han.tif";
        // var resourceUrl = "images/test.tif";
        var geoTiffLayer = new WorldWind.RenderableLayer("GeoTiff");

        initLayer(wwd);
        addGeoTiff(wwd,geoTiffLayer,resourceUrl);
        var wkt_layer = new WorldWind.RenderableLayer();
        addShp(wwd, wkt_layer, "POINT(114.3213613 30.5261682)");
        // var shapeFileLayer = new WorldWind.RenderableLayer();
        // var resource = "images/ne_110m_admin_0_countries.shp";
        // var resource = "images/Wuhan_Colleges.shp";
        // addShapeFile(wwd,shapeFileLayer,resource);

        // var surfaceImageLayer = new WorldWind.RenderableLayer();
        // var resource = "images/test.jpg";
        // addSurfaceImage(wwd,surfaceImageLayer,30,34,109,112,resource);

        var logError = function (jqXhr, text, exception) {
            console.log("There was a failure retrieving the capabilities document: " +
                text +
                " exception: " + exception);
        };
        $.get(serviceAddress).done(createLayer).fail(logError);
    })
})

// $(function () {
//     $(document).ready(function () {
//         initLayer(wwd);
//         var CQLString = "MATCH (n:y) RETURN properties(n)";
//         $.ajax({
//             url:"getNodeInfo",
//             type:"get",
//             dataType:"json",
//             data:{
//                 CQL:CQLString
//             },
//             success:function (data) {
//                 var count = data.length;
//                 console.log("Count: "+count);
//                 var selectHtml = "";
//                 var wktLayer = new WorldWind.RenderableLayer();
//                 for (var i=0;i<count;i++) {
//                     selectHtml += "<option value=\""+data[i].yid+"\">"+data[i].yname+"</option>";
//                     addShp(wwd,wktLayer,data[i].yloca);
//                 }
//                 $("#select1").html(selectHtml);
//             },
//         })
//         var logError = function (jqXhr, text, exception) {
//             console.log("There was a failure retrieving the capabilities document: " +
//                 text +
//                 " exception: " + exception);
//         };
//         $.get(serviceAddress).done(createLayer).fail(logError);
//     })
// })
