import React, { useEffect, useState } from 'react';
import axios from '../../utils/API'
import { useHistory } from "react-router-dom";

const Locations = () => {

    let [locations, setLocations] = useState([])
    const history = useHistory();

    const post = () => {
        axios.post('/locations/32bhsbbf7f6s6/1', locations)
        .then(response => {
            setLocations(response.data)
        })
        .catch(error => {
            console.log(error);
        });
    }

    const locationsa = locations.map(location => {
        return <div onClick={() => {routeChange(`draw/` + location.id)}} className="location" style={{borderRadius: 5, overflow: "hidden", width: "31%", display: "inline-block", marginBottom: "3%"}}>
            <div style={{backgroundImage: "url('https://www.homekoncept.com.pl/wp-content/uploads/2020/05/HomeKONCEPT-NH-717-zdjecie-1.jpg')", backgroundSize: "cover", backgroundPositionX: "50%", height: 200}}>

            </div>
            <div style={{textAlign: "center", padding: 15, fontSize: 20, borderWidth: "0px 1px 1px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "0px 0px 5px 5px", backgroundColor: "#fff"}}>
                {location.name}
            </div>
        </div>
    });

    const routeChange = (path) =>{
        history.push(path);
    }

    useEffect(() => {
        axios.get('/locations',
            {
                headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            const locationss = Array.from(response.data)
            setLocations(locationss)
        })
        .catch(error => {
            console.log(error);
        });
    }, []);

    return(
        <div>
            <h2 style={{fontSize: "1.5em"}}>Your locations:</h2>
            { locations != [] ? locationsa : "aaa" }
            <div onClick={() => {routeChange(`draw/`)}} className="location" style={{borderRadius: 5, overflow: "hidden", width: "31%", display: "inline-block", marginBottom: "3%"}}>
                <div style={{backgroundImage: "url('https://static.thenounproject.com/png/2996504-200.png')", backgroundSize: "100px 100px", backgroundRepeat: "no-repeat", backgroundPosition: "50%", height: 200, borderWidth: "1px 1px 0px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "5px 5px 0px 0px"}}>

                </div>
                <div style={{textAlign: "center", padding: 15, fontSize: 20, borderWidth: "1px 1px 1px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "0px 0px 5px 5px", backgroundColor: "#fff"}}>
                    Add new location
                </div>
            </div>
            <div onClick={() => {post()}}>aaa</div>
        </div>
    );
}

export default Locations;