
      mapboxgl.accessToken = mapToken;
        const map = new mapboxgl.Map({
            container: 'map', // container ID
            style:"mapbox://styles/mapbox/streets-v12", //style url
            center: property.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
            zoom: 9 // starting zoom
        });
        const marker1 = new mapboxgl.Marker({color:"red"})
        .setLngLat(property.geometry.coordinates)//property.geometry//cordinates
        .setPopup(new mapboxgl.Popup({offset: 25})
        .setHTML(`<h4>${property.location}</h4><p>contact to the seller to give the details</p>`))
        .addTo(map);
        

