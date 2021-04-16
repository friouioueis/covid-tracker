import { useEffect, useState } from "react";
import Map from "./Map";
import InfoBox from "./InfoBox";
import Table from "./Table";
import { prettyPrintStat, sortData } from "./utils";
import {
  Card,
  CardContent,
  FormControl,
  MenuItem,
  Select,
} from "@material-ui/core";
import LineGraph from "./LineGraph";
import "./App.css";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [tableData, setTableData] = useState([]);
  const [countryInfo, setCountryInfo] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setTableData(sortedData);
          setMapCountries(data);
          setCountries(countries);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = (e) => {
    const countryCode = e.target.value;
    setCountry(countryCode);
    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        if (countryCode !== "worldwide") {
          setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
          setMapZoom(4);
        } else {
          setMapCenter({ lat: 34.80746, lng: -40.4796 });
          setMapZoom(3);
        }
      });
  };

  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>COVID-19 TRACKER</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              value={country}
              onChange={onCountryChange}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem key={country.name} value={country.value}>
                  {country.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        <div className="app__stats">
          <InfoBox
            isRed
            active={casesType === "cases"}
            onClick={(e) => setCasesType("cases")}
            title="Coronavirus cases"
            cases={prettyPrintStat(countryInfo.todayCases)}
            total={prettyPrintStat(countryInfo.cases)}
          />
          <InfoBox
            active={casesType === "recovered"}
            onClick={(e) => setCasesType("recovered")}
            title="Recovered"
            cases={prettyPrintStat(countryInfo.todayRecovered)}
            total={prettyPrintStat(countryInfo.recovered)}
          />
          <InfoBox
            isRed
            active={casesType === "deaths"}
            onClick={(e) => setCasesType("deaths")}
            title="Deaths"
            cases={prettyPrintStat(countryInfo.todayDeaths)}
            total={prettyPrintStat(countryInfo.deaths)}
          />
        </div>
        <Map
          countries={mapCountries}
          center={mapCenter}
          zoom={mapZoom}
          casesType={casesType}
        />
      </div>
      <Card className="app__right">
        <CardContent>
          <h3>Live cases by country</h3>
          <Table countries={tableData} />
          <h3>Worldwide new {casesType}</h3>
          <LineGraph casesType={casesType} />
        </CardContent>
      </Card>
    </div>
  );
}

export default App;
