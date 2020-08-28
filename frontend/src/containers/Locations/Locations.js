import React, { useEffect, useState } from 'react';
import axios from '../../utils/API'
import { useHistory } from "react-router-dom";

const Locations = () => {

    let [locations, setLocations] = useState([])
    const history = useHistory();

    const locationsa = locations.map(location => {
        return <div onClick={() => {routeChange(location.id)}} style={{borderRadius: 5, overflow: "hidden", width: "30%", display: "inline-block", margin: "0 3% 3% 0"}}>
            <div style={{backgroundImage: "url('https://www.homekoncept.com.pl/wp-content/uploads/2020/05/HomeKONCEPT-NH-717-zdjecie-1.jpg')", backgroundSize: "cover", backgroundPositionX: "50%", height: 200}}>

            </div>
            <div style={{textAlign: "center", padding: 15, fontSize: 20, borderWidth: "0px 1px 1px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "0px 0px 5px 5px", backgroundColor: "#fff"}}>
                {location.name}
            </div>
        </div>
    });

    const routeChange = (locationId) =>{ 
        let path = `draw/` + locationId; 
        history.push(path);
    }

    useEffect(() => {
        axios.get('/locations')
        .then(response => {
            const locationss = Array.from(response.data)
            locationss.push(...response.data)
            locationss.push(...response.data)
            locationss.push(...response.data)
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
        </div>
    );
}

export default Locations;