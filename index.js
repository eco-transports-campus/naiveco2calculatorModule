/**
 * @typedef {Object} gpsPoint
 * @property {Number} latitude - latitude
 * @property {Number} longitude - longitude
 */


// https://www.ratp.fr/categorie-faq/5041
const marche = "marche";
const velo = "velo";
const metro = "metro";
const rer = "rer";
const tramway = "tramway";
const bus = "bus";
const voiture = "voiture";
const transilien = "transilien";

/**
 * Emission level in gram per kilometer
 */
const emissionLevel = {marche: 0, velo : 0, metro : 3.8, rer : 3.9, tramway : 3.1, bus : 95.4, voiture : 206, transilien : 6.4}

/**
 * Convert a value in degree to radian
 * @param {number} degrees - Value in degree to convert
 * 
 * @returns {number} - Value converted to radian
 */
function degreesToRadians(degrees) {
    return degrees * Math.PI / 180;
}

/**
 * Calculate the distance in Kilometers between two Gps points
 * @param {gpsPoint} coor1 
 * @param {gpsPoint} coor2
 * 
 * @return {number} - Distance between the two points
 */
function distanceInKmBetweenEarthCoordinates(coor1, coor2) {
  const earthRadiusKm = 6371;

  const dLat = degreesToRadians(coor2.latitude-coor1.latitude);
  const dLon = degreesToRadians(coor2.longitude-coor1.longitude);

  const lat1 = degreesToRadians(coor1.latitude);
  const lat2 = degreesToRadians(coor2.latitude);

  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return earthRadiusKm * c;
}

/**
 * Create a GPS point
 * 
 * @param {number} lat - latitude
 * @param {number} long - longitude
 * 
 * @returns {gpsPoint} - a GPS point object
 */
function gpsPoint(lat, long){
    return {latitude : lat, longitude : long}
}


///////// CO2 emission Computing /////////
/**
 * Compute the average CO2 emission for a given distance and a given transportation
 * 
 * @param {number} dist - distance in kilometers
 * @param {String} locomotionType - Key of the emission level dictionary 
 * 
 * @returns {number} Co2 emission in gram
 */
function emissionForDistance(dist, locomotionType) {
    if(!dist){
        console.log("Undefined distance") 
        return -1;
    }
    if(locomotionType == voiture){      
        return dist * 1.2 * emissionLevel[locomotionType];
    }
    else if(locomotionType == metro  || locomotionType == rer   || locomotionType == tramway  || locomotionType == transilien   || locomotionType == bus){       
        return dist * emissionLevel[locomotionType];
    }
    else if(locomotionType == marche   || locomotionType == velo){       
        return 0;
    }
    else{
        console.log("Undefined ")
        return -2;
    }
};

/**
 * Compute the average CO2 emission for a given transportation between two gps point
 * 
 * @param {gpsPoint} start - starting point gps cordonate 
 * @param {gpsPoint} end - ending point gps coordonate
 * @param {String} locomotionType - Key of the emission level dictionary 
 * 
 * @returns {number} Co2 emission in gram
 */
function emissionFromGPSPoints(start, end, locomotionType) {
    if(!(start && start.latitude && start.longitude)){
        console.log("Undefined start point") 
        return -1;
    }
    if(!(end && end.latitude && end.longitude)){
        console.log("Undefined end point") 
        return -1;
    }
    return module.exports.emissionForDistance(distanceInKmBetweenEarthCoordinates(start, end), locomotionType);
};




////////////// EXPORTS //////////////
module.exports.marche = marche;
module.exports.velo = velo;
module.exports.rer = rer;
module.exports.tramway = tramway;   
module.exports.bus = bus;
module.exports.voiture = voiture;
module.exports.transilien = transilien;

module.exports.gpsPoint = gpsPoint;
module.exports.emissionForDistance = emissionForDistance;
module.exports.emissionFromGPSPoints = emissionFromGPSPoints;