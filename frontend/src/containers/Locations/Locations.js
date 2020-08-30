import React, { useEffect, useState, Fragment } from 'react';
import mAxios from '../../utils/API'
import { useHistory } from "react-router-dom";
import NewLocationModal from '../../components/Locations/NewLocationModal';
import './Locations.css'

const Locations = () => {
    const history = useHistory();
    const [locations, setLocations] = useState([])
    const [showModal, setShowModal] = useState(false)

    const staticLocationPhoto = "url('https://www.homekoncept.com.pl/wp-content/uploads/2020/05/HomeKONCEPT-NH-717-zdjecie-1.jpg')"

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
        return <div onClick={() => { history.push(`draw?locationId=` + location.id) }} className="location">
            <div className="location-photo"
                style={{backgroundImage: location.photoUrl ? "url(" + location.photoUrl + ")" : staticLocationPhoto}}></div>
            <div className="location-name">
                {location.name}
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