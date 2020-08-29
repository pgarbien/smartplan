import React, { useEffect, useState } from 'react';
import axios from '../../utils/API'
import { useHistory } from "react-router-dom";
import NewLocationModal from '../../components/Locations/NewLocationModal';

const Locations = () => {

    const history = useHistory();

    const [locations, setLocations] = useState([])
    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        fetchLocations()
    }, []);

    const fetchLocations = () => {
        axios.get('/locations',
        {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token')
            }
        })
        .then(response => {
            setLocations(response.data)
        })
        .catch(error => {
            console.log(error);
        });
    }

    const mappedLocations = locations.map(location => {
        return <div onClick={() => {routeChange(`draw?locationId=` + location.id)}} className="location" style={{borderRadius: 5, overflow: "hidden", width: "31%", display: "inline-block", marginBottom: "3%"}}>
            <div style={{backgroundImage: location.photoUrl ? "url(" + location.photoUrl + ")" : "url('https://www.homekoncept.com.pl/wp-content/uploads/2020/05/HomeKONCEPT-NH-717-zdjecie-1.jpg')", backgroundSize: "cover", backgroundPositionX: "50%", backgroundPositionY: "50%", height: 200}}>

            </div>
            <div style={{textAlign: "center", padding: 15, fontSize: 20, borderWidth: "0px 1px 1px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "0px 0px 5px 5px", backgroundColor: "#fff"}}>
                {location.name}
            </div>
        </div>
    });

    const routeChange = (path) =>{
        history.push(path);
    }

    return(
        <div>
            <h2 style={{fontSize: "1.5em"}}>Your locations:</h2>
            { mappedLocations }
            <div onClick={() => {setShowModal(true)}} className="location" style={{borderRadius: 5, overflow: "hidden", width: "31%", display: "inline-block", marginBottom: "3%"}}>
                <div style={{backgroundColor: "#fff", backgroundImage: "url('https://static.thenounproject.com/png/2996504-200.png')", backgroundSize: "100px 100px", backgroundRepeat: "no-repeat", backgroundPosition: "50%", height: 200, borderWidth: "1px 1px 0px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "5px 5px 0px 0px"}}>

                </div>
                <div style={{textAlign: "center", padding: 15, fontSize: 20, borderWidth: "1px 1px 1px 1px", borderColor: "rgb(198, 198, 198)", borderStyle: "solid", borderRadius: "0px 0px 5px 5px", backgroundColor: "#fff"}}>
                    Add new location
                </div>
            </div>

            <NewLocationModal showModal={showModal} setShowModal={setShowModal} fetchLocations={fetchLocations} />
        </div>
    );
}

export default Locations;