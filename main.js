class WeatherAPI{
    constructor(longitude = 78.6382, latitude = 35.7796, zip_code = 20601, country_code = 'US', weather_section){
        this.longitude = longitude;
        this.latitude = latitude;
        this.zip_code = zip_code;
        this.country_code = country_code;
        this.url = null;
        this.response = null;
        this.weather_section = weather_section;
    }

    long_lat_entry_function(){
        this.url = `https://api.weatherbit.io/v2.0/current?lat=${this.latitude}&lon=-${this.longitude}&key=682fcb489fad405587f47896768d6936&units=I&lang=en&include=minutely`;
        this.weather_api_handler(this.url);
        return;
    }

    zip_code_entry_function(){
        this.url = `https://api.weatherbit.io/v2.0/current?postal_code=${this.zip_code}&country=${this.country_code}&key=682fcb489fad405587f47896768d6936&units=I&lang=en&include=minutely`;
        this.weather_api_handler(this.url);
        return;
    }

    async weather_api_handler(url){
        try{
            let response = await fetch(url);
            let response_data = await response.json();
            let city_name = response_data.data[0].city_name;
            let state_code = response_data.data[0].state_code;
            let temp = response_data.data[0].temp;
            let timezone = response_data.data[0].timezone;
            let weather_description = response_data.data[0].weather.description;
            let wind_speed = response_data.data[0].wind_spd;
            this.handleResponse(city_name, state_code, temp, timezone, weather_description, wind_speed);
            return;
        }catch(e){
            console.log('error is: ' + e);
            alert('Oh, no! You\'ve entered invalid data. Please try again.');
        }
    }

    handleResponse(city_name, state_code, temp, timezone, weather_description, wind_speed){
        let img_src;
        switch(weather_description){
            case 'Clear sky':
                img_src = 'sunny.png';
                break;
            case 'Few clouds':
            case 'Scattered clouds':
                img_src = 'clouds.png';
                break;
            case 'Heavy shower rain':
            case 'Shower rain':
            case 'Light shower rain':
            case 'Freezingrain':
            case 'Heavy Rain':
            case 'Moderate Rain':
            case 'Light Rain':
            case 'Heavy Drizzle':
            case 'Drizzle':
            case 'Light Drizzle':
            case 'Thunderstorm with light rain':
            case 'Thunderstorm with rain':
            case 'Thunderstorm with drizzle':
                img_src = 'storm.png';
                break;
            case 'Flurries':
            case 'Heavy snow shower':
            case 'Snow shower':
            case 'Heavy sleet':
            case 'Sleet':
            case 'Mix snow/rain':
            case 'Heavy Snow':
            case 'Snow':
            case 'Light snow':
                img_src = 'snow.png';
                break;
            default:
                img_src = 'clouds.png';
                break;
        }

       this.weather_section.innerHTML += `
       <main class="weather-section" id="weather-api-reponse">
            <h1 class="weather-icon"><img src="${img_src}" alt="" data-weather-icon></h1>
            <h1 class="city-section" data-city-section>${city_name}, ${state_code}</h1>
            <h5>${timezone.replace('_', ' ')}</h5>
            <div class="temperature-wrap">
                <h1 class="temperature" data-temperature>${temp}</h1>
                <h3 class="degrees">° Fahrenheit</h3>
            </div>
            <h3 class="weather-description" data-weather-description>${weather_description}</h3>
            <h3>Wind: ${wind_speed}</h3>
        </main>
       `;
       const submit_btn = document.getElementById('submit-btn');
       submit_btn.onclick = test;
       this.weather_description = document.querySelector('[data-weather-description]');
        this.weather_description.scrollIntoView({behavior: 'smooth', block: 'start'});
        return;
    }
}

const submit_btn = document.getElementById('submit-btn');
let searched = false;

function test(){

    const longitude = document.getElementById('longitude');
    const latitude = document.getElementById('latitude');
    const zip_code = document.getElementById('zip-code');
    const country = document.getElementById('country');

    let longitude_entry = longitude.value;
    let latitude_entry = latitude.value;
    let zip_code_entry = zip_code.value;
    let country_code_entry = country.value;

    if(longitude_entry && latitude_entry){

        const weather_section = document.querySelector('[data-weather-section]');
        const weather_icon = document.querySelector('[data-weather-icon]');
        const city_section = document.querySelector('[data-city-section]');
        const weather_description = document.querySelector('[data-weather-description]');
        const temperature = document.querySelector('[data-temperature]');

        if(!weather_description){
            let api_call = new WeatherAPI(longitude_entry, latitude_entry, null, null, weather_section);
            api_call.long_lat_entry_function();
        }else{
            weather_section.removeChild(weather_section.lastChild);
            weather_section.removeChild(weather_section.lastChild);
            let api_call = new WeatherAPI(longitude_entry, latitude_entry, null, null, weather_section);
            api_call.long_lat_entry_function();
        }


    }else if(zip_code_entry && country_code_entry){

        if(country_code_entry != 'default'){

            const weather_section = document.querySelector('[data-weather-section]');
            const weather_icon = document.querySelector('[data-weather-icon]');
            const city_section = document.querySelector('[data-city-section]');
            const weather_description = document.querySelector('[data-weather-description]');
            const temperature = document.querySelector('[data-temperature]');

            if(!weather_description){

                let api_call = new WeatherAPI(null, null, zip_code_entry, country_code_entry, weather_section);
                api_call.zip_code_entry_function();

            }else{
                
                weather_section.removeChild(weather_section.lastChild);
                weather_section.removeChild(weather_section.lastChild);
                let api_call = new WeatherAPI(null, null, zip_code_entry, country_code_entry, weather_section);
                api_call.zip_code_entry_function();

            }


        }else{

            console.log('please select a country');

        }
    }else{

        console.log('Invalid entries. Please try again');
    }
}

submit_btn.onclick = test;

country.addEventListener('focus', () => {
    country.size = 5;
});

country.addEventListener('blur', () =>{
    country.size = 1;
});
