/// air polution and population exposure for Nyeri Couty
//importing  population count from gridded population of the word
var population=ee.ImageCollection("WorldPop/GP/100m/pop")
    .filterBounds(Nyeri)
    //filter for 2020
    .filterDate('2020-01-01','2020-12-31')
    .mean().clip(Nyeri)
print(population.projection())    
//print the image
print('population', population);

var popVis={
  min:0,
  max:50,
  palette:["black","yellow","white"]
};

//function to filter clouds
function maskClouds(image) {
    // Get the cloud fraction band of the image.
    var cf = image.select('cloud_fraction');
    // Create a mask using 0.3 threshold.
    var mask = cf.lte(0.3); // You can play around with this value.
    // Return a masked image.
    return image.updateMask(mask).copyProperties(image);
}


//import sentinel-5 No2 offline product
//2019
var no2019=ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
    .filterDate('2019-01-01','2019-12-31')
    .filterBounds(Nyeri)
    .map(maskClouds)
    // Select the tropospheric vertical column of NO2 band.
    .select('tropospheric_NO2_column_number_density')
    .median().clip(Nyeri);
    
print("2019", no2019)
//visualize the 2019 NO2
var Vis2019={
  min:0,
  max:0.000015,
  palette: ['blue', 'purple', 'red']
};

//2020
var no2020=ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
    .filterDate('2020-01-01','2020-12-31')
    .filterBounds(Nyeri)
    .map(maskClouds)
    // Select the tropospheric vertical column of NO2 band.
    .select('tropospheric_NO2_column_number_density')
    .median().clip(Nyeri);

//2021
var no2021=ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
    .filterDate('2021-01-01','2021-12-31')
    .filterBounds(Nyeri)
    .map(maskClouds)
    // Select the tropospheric vertical column of NO2 band.
    .select('tropospheric_NO2_column_number_density')
    .median().clip(Nyeri);

//2022
var no2022=ee.ImageCollection("COPERNICUS/S5P/OFFL/L3_NO2")
    .filterDate('2022-01-01','2022-12-31')
    .filterBounds(Nyeri)
    .map(maskClouds)
    // Select the tropospheric vertical column of NO2 band.
    .select('tropospheric_NO2_column_number_density')
    .median().clip(Nyeri);



Map.setOptions('HYBRID');
Map.centerObject(Nyeri);
Map.addLayer(population,popVis,'population count');
Map.addLayer(no2019, Vis2019,'NO2_2019')
Map.addLayer(Nyeri,{},'Nyeri');

//2019 image export
Export.image.toDrive({
  image: no2019,
  description: 'NO2_2019',
  scale: 10,
  folder:"GEE",
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  },
  maxPixels: 1e13,
  region: Nyeri
});


//2020 image export
Export.image.toDrive({
  image: no2020,
  description: 'NO2_2020',
  scale: 10,
  folder:"GEE",
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  },
  maxPixels: 1e13,
  region: Nyeri
});


//2021 image export
Export.image.toDrive({
  image: no2021,
  description: 'NO2_2021',
  scale: 10,
  folder:"GEE",
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  },
  maxPixels: 1e13,
  region: Nyeri
});


//2022 image export
Export.image.toDrive({
  image: no2022,
  description: 'NO2_2022',
  scale: 10,
  folder:"GEE",
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  },
  maxPixels: 1e13,
  region: Nyeri
});

//population image export
Export.image.toDrive({
  image: population,
  description: 'population',
  scale: 10,
  folder:"GEE",
  crs: 'EPSG:4326',
  fileFormat: 'GeoTIFF',
  formatOptions: {
    cloudOptimized: true
  },
  maxPixels: 1e13,
  region: Nyeri
});