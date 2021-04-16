import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

const casesTypeColors = {
  cases: {
    multiplier: 300,
    option: { color: "#cc1034", fillColor: "#cc1034" },
  },
  recovered: {
    multiplier: 300,
    option: { color: "#7dd71d", fillColor: "#7dd71d" },
  },
  deaths: {
    multiplier: 500,
    option: { color: "#ff6c47", fillColor: "#ff6c47" },
  },
};

export const sortData = (data) => {
  const sortedData = [...data];
  return sortedData.sort((a, b) => (b.cases > a.cases ? 1 : -1));
};

export const prettyPrintStat = (stat) =>
  stat ? `+${numeral(stat).format("0.0a")}` : "+0";

export const showDataOnMap = (data, casesType = "cases") =>
  data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      pathOptions={casesTypeColors[casesType].option}
      fillOpacity={0.4}
      radius={
        Math.sqrt(country[casesType]) * casesTypeColors[casesType].multiplier
      }
    >
      <Popup>
        <div className="info__container">
          <div
            className="info__flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info__name">{country.country}</div>
          <div className="info__confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info__recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info__deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
