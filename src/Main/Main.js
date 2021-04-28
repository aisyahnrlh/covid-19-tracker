import React, { useState, useEffect } from 'react';
import './Main.css';
import InfoBox from './InfoBox';
import Map from './Map';
import { sortData, prettyPrintStat } from './util';
import Table from './Table';
import LineGraph from './LineGraph';
import "leaflet/dist/leaflet.css";
import numeral from 'numeral';

function Main() {
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('worldwide');
    const [countryInfo, setCountryInfo] = useState({});
    const [tableData, setTableData] = useState([]);
    const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
    const [mapZoom, setMapZoom] = useState(3);
    const [casesType, setCasesType] = useState("cases");
    const [mapCountries, setMapCountries] = useState([]);

    useEffect(() => {
        fetch("https://disease.sh/v3/covid-19/all")
            .then(response => response.json())
            .then(data => {
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
                        value: country.countryInfo.iso2
                    }
                    ))
                    const sortedData = sortData(data);
                    setTableData(sortedData);
                    setMapCountries(data)
                    setCountries(countries);
                }
                )
        }
        getCountriesData();
    }, [])

    const onCountryChange = async (event) => {
        const countryCode = event.target.value;

        const url = countryCode === "worldwide" ? "https://disease.sh/v3/covid-19/all" : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

        await fetch(url)
            .then(response => response.json())
            .then(data => {
                setCountry(countryCode);
                setCountryInfo(data);
                if (countryCode === "worldwide") {
                    setMapCenter([34.80746, -40.4796]);
                } else {
                    setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
                }
                setMapZoom(3);
            })
    };

    return (
        <div className="main">
            <div className="main__left">
                <form className="main__dropdown">
                    <select value={country} onChange={onCountryChange} className="main__dropdownButton">
                        <option value="worldwide">Worldwide</option>
                        {
                            countries.map(country => (
                                <option value={country.value}>{country.name}</option>
                            ))
                        }
                    </select>
                </form>

                <div className="main__stats">
                    <InfoBox
                        active={casesType === "cases"}
                        onClick={e => setCasesType('cases')}
                        title="Total Cases"
                        cases={prettyPrintStat(countryInfo.todayCases)}
                        total={numeral(countryInfo.cases).format("0,0")}
                    />

                    <InfoBox
                        active={casesType === "deaths"}
                        onClick={e => setCasesType('deaths')}
                        title="Death Cases"
                        cases={prettyPrintStat(countryInfo.todayDeaths)}
                        total={numeral(countryInfo.deaths).format("0,0")}
                    />

                    <InfoBox
                        active={casesType === "recovered"}
                        onClick={e => setCasesType('recovered')}
                        title="Recovered Cases"
                        cases={prettyPrintStat(countryInfo.todayRecovered)}
                        total={numeral(countryInfo.recovered).format("0,0")}
                    />
                </div>

                <Map casesType={casesType} countries={mapCountries} center={mapCenter} zoom={mapZoom} />
            </div>

            <div className="main__right">
                <div className="main__table">
                    <h2>Countries Affected</h2>
                    <Table countries={tableData} />
                </div>
                <div className="main__graph">
                    <h2>Worldwide New {casesType.charAt(0).toUpperCase() + casesType.slice(1)}</h2>
                    <LineGraph casesType={casesType} />
                </div>
            </div>
        </div>
    )
}

export default Main

