import React from 'react';

function iconUrl(icon){
    return `https://openweathermap.org/img/wn/${icon}@2x.png`;
}

export default function WeatherTile({day,units}){
    const date=new Date(day.dt*1000);
    const lable= date.toLocaleDateString(undefined, {weekday:"short"});
    const icon=day.weather?.[0]?.icon;
    return(
        <div className= "forecast-tile">
            <div style={{ foreweight:700}}>{lable}</div>
            <img src={iconUrl(icon)} alt=""/>
            <div style={{marginTop:6}}>{Math.round(day.temp.max)}°/{Math.round(day.temp.min)}°</div>
            <div style={{fontSize:12,color: "#475569"}}>{day.weather?.[0]?.main}</div>
        </div>
    );
}