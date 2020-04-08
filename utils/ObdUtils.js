'use strict';

module.exports = {
    dataFormats :
    {
        "speed" : "ddd",
        "rpm" : "dddd",
        "kmh" : "ddd",
        "mph" : "ddd",
        "aat" : "dd",
        "fuelCons" : "ddd",
        "maf" : "dddd",
    },
    
    maxValues :
    {
        "speed" : 240,
        "rpm" : 6000,
        "kmh" : 240,
        "mph" : 140,
        "aat" : 100,
        "fuelCons" : 200,
        "maf" : "200"
    },
    
    analogInputs :
    [
      {
          name: "Speed",
          address: "speed"
      },
      {
          name: "RPM",
          address: "rpm"
      }
    ],
    
    digitalInputs :
    [
        {
            name: "Speed",
            address: "speed"
        },
        {
            name: "RPM",
            address: "rpm"
        },
        {
            name: "Ambient Air Temperature",
            address: "aat"
        },
        {
            name: "Air Intake Temperature",
            address: "ait"
        },
        {
            name: "Fuel Economy",
            address: "fuelCons"
        },
        {
            name: "Mass Air Flow",
            address: "maf"
        }
    ],
    
    mpgRatio :
    {
        diesel : 244.724,
        petrol : 217.572
    },
    
    units :
    {
        speed: "km/h",
        rpm: "RPM",
        aat: "°C",
        ait: "°C",
        maf: "g/s",
        fuelCons: "mpg"
    },
    
    cmdIDMap :
    {
        speed: "SPEED",
        maf: "MAF",
        fuelCons: "FUEL_CONSUMPTION_RATE",
        rpm: "ENGINE_RPM",
        aat: "AMBIENT_AIR_TEMP",
        ait: "AIR_INTAKE_TEMP",
    },
    
    presetColors :
    [
        {
          name: "Red",
          rgbCode: "#FF0000"
        },
        {
          name: "Green",
          rgbCode: "#00FF00"
        },
        {
          name: "Black",
          rgbCode: "#000000"
        },
        {
          name: "Grey",
          rgbCode: "#aaaaaa"
        }
    ],
};