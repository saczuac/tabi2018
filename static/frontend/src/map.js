import * as L from 'leaflet';


const Map = {
	coords: [-34.9084161, -57.9499747],
	zoom: 15,
	map: null,
	markersLayer: null,
	init: _ => {
		Map.map = L.map('map', {
		    center: Map.coords,
		    zoom: Map.zoom,
		    closePopupOnClick: false,
		    // maxBounds: Map.bounds
		});

		Map.markersLayer = new L.LayerGroup();


		$(window).on('orientationchange pageshow resize', function () {
		    $("#map").height($(window).height());
		    Map.map.invalidateSize();
		    Map.map.setView(Map.coords, Map.zoom);
		}).trigger('resize');

		Map.drawTiles();

		Map.map.addLayer(Map.markersLayer);
	},
	drawTiles: _=> {
		Map.map.scrollWheelZoom.disable();
		Map.map.doubleClickZoom.disable();
		Map.map.attributionControl.setPrefix('');

		var osm = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		    maxZoom: 18,
		    attribution: 'Facultades de la UNLP',
		    id:'ligth-copy'
		})

		Map.map.addLayer(osm);
	},
	drawMarkers: markers => {
		Map.markersLayer.clearLayers();

		markers.forEach(m => {
		    let marker = new L.marker([m[0], m[1]])
		    	.bindPopup(m[2])
		    	.addTo(Map.markersLayer)
		})
	}
}


export default Map;