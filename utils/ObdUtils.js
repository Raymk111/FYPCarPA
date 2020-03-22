'use strict';

module.exports = {
    dataFormats :
    {
        "speed" : "ddd",
        "rpm" : "dddd",
        "kmh" : "ddd",
        "mph" : "ddd",
        "aat" : "dd"
    },
    
    maxValues :
    {
        "speed" : 240,
        "rpm" : 6000,
        "kmh" : 240,
        "mph" : 140,
        "aat" : 100
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
    ],
    
    cmdIDMap :
    {
        speed: "SPEED",
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