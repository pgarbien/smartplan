import React, { useEffect, useState, Fragment } from 'react';
import mAxios from '../../utils/API';
import { useHistory } from "react-router-dom";
import NewLocationModal from '../../components/Locations/NewLocationModal';
import './Locations.css';

const Locations = () => {
    const history = useHistory();
    const [locations, setLocations] = useState([]);
    const [showModal, setShowModal] = useState(false);

    const staticLocationPhoto = "url('https://www.homekoncept.com.pl/wp-content/uploads/2020/05/HomeKONCEPT-NH-717-zdjecie-1.jpg')";

    useEffect(() => fetchLocations(), []);

    const fetchLocations = () => {
        mAxios.get('/locations')
            .then(response => {
                setLocations(response.data)
            })
            .catch(error => {
                console.log(error);
            });
    }

    const mappedLocations = locations.map(location => {
        return <div className="location"onClick={() => { history.push(`draw/manager?locationId=` + location.id) }}>
            <div className="location-photo"
                style={{backgroundImage: location.photoUrl ? "url(" + location.photoUrl + ")" : staticLocationPhoto}}></div>
            <div className="location-name">
                {location.name}
            </div>
            <div className="location-edit" onClick={(e) => { e.stopPropagation(); history.push(`draw?locationId=` + location.id) }}>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/1024px-Edit_icon_%28the_Noun_Project_30184%29.svg.png" />
            </div>
            <div className="location-add-devices" onClick={(e) => { e.stopPropagation(); history.push(`draw/devices?locationId=` + location.id) }}>
                <img src="https://static.thenounproject.com/png/1129430-200.png" />
            </div>
        </div>
    });

    return(
        <Fragment>
            <h2>Your locations:</h2>
            { mappedLocations }
            <div onClick={() => {setShowModal(true)}} className="location">
                <div className="location-photo location-add-photo"></div>
                <div className="location-name location-add-name">
                    Add new location
                </div>
            </div>

            <NewLocationModal showModal={showModal} setShowModal={setShowModal} fetchLocations={fetchLocations} />
        </Fragment>
    );
}

export default Locations;