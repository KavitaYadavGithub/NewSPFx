import * as React from 'react';
import styles from './WeatherApi.module.scss';
import axios from 'axios';
import type { IWeatherApiProps } from './IWeatherApiProps';
// import {FontAwesomeIcon} from '@fortawesome/react/-FontawesomeIcon'
// import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';
// import { faFontAwesome } from '@fortawesome/free-solid-svg-icons';
// import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
// import { faCloud } from '@fortawesome/free-solid-svg-icons';

export interface IWeatherData{
  temperature:string;
  description:string;
}

export interface IWeatherApiState{
  weatherData:IWeatherData|null;
}
export default class WeatherApi extends React.Component<IWeatherApiProps, IWeatherApiState> {
  constructor(props:any){
    super(props);
    this.state={
      weatherData:null
    }
  }
   public componentDidMount(): void {
    axios.get(`https://api.weatherapi.com/v1/current.json?key=d5f495559ff34377a0343116241701&q=Pune`)
    .then((response:any)=>{
      const{temp_c,condition}=response.data.current;
      const weatherData:IWeatherData={
        temperature:temp_c,
        description:condition.text
      };
      this.setState({weatherData});
    })
    .catch((error)=>{
      console.error('Error fetching weather data:' , error);
    })
  }
  public render(): React.ReactElement<IWeatherApiProps> {

    return (
   <>
   <div className={styles.weatherApi}>
    <div className={styles.container}>
      <div className={styles.row}>
        <div className={styles.column}>
          <span className={styles.title}>Weather Information</span>
        {this.state.weatherData?(
          <div>
            <p>Temperature:{this.state.weatherData.temperature}*C</p>
            <p>Description:{this.state.weatherData.description}</p>
            </div>
            
        )
        :(
          <p>Loading Weather data....</p>
        )
      }
        </div>
      </div>
    </div>
    </div>  
     </>
    );
  }
}
