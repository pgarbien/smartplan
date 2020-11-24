import React, { useEffect, useState, Fragment } from 'react';
import mAxios from '../../utils/API';
import { useHistory } from "react-router-dom";
import NewLocationModal from '../../components/Locations/NewLocationModal';
import '../../new_css/location_css/Locations.css';
import '../../new_css/app_css/App.css';
import '../../pe-icon-7-stroke/css/pe-icon-7-stroke.css';
import '../../pe-icon-7-stroke/css/helper.css';

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
        return <div class="slide">
            <div className="location lift-up" onClick={() => { history.push(`draw/manager?locationId=` + location.id) }}>
                <div class="location-wrapper">
                    <div class="center">
                        <div className="location-photo"
                            style={{backgroundImage: location.photoUrl ? "url(" + location.photoUrl + ")" : staticLocationPhoto}}></div>
                        <div>
                            <div class="separator"/>
                            {location.name}
                        </div>
                    </div>
                    <div class="dynamic-buttons">
                        <div className="location-edit" onClick={(e) => { e.stopPropagation(); history.push(`draw?locationId=` + location.id) }}>
                            <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/64/Edit_icon_%28the_Noun_Project_30184%29.svg/1024px-Edit_icon_%28the_Noun_Project_30184%29.svg.png" />
                        </div>
                        <div className="location-add-devices" onClick={(e) => { e.stopPropagation(); history.push(`draw/devices?locationId=` + location.id) }}>
                            <img src="https://static.thenounproject.com/png/1129430-200.png" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    });

    return(
        <Fragment>
            <div class="container">
                <div class="row">
                    <div class="col-locations">
                        <h1 class="carousel-title">Lokalizacje</h1>
                        <div class="loading-cover">
                            {/* <div class="filters">WSZYSTKO|INNE|WYŁĄCZONE|WŁĄCZONE|---SZUKAJ---</div> */}
                            <div class="locations">
                                { mappedLocations }
                                <div class="slide">
                                    <div onClick={() => {setShowModal(true)}} class="location lift-up black">
                                        <div class="center">
                                            <span class="span">
                                                <i class="pe-7s-plus"></i>Utwórz nową lokalizację
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                <NewLocationModal showModal={showModal} setShowModal={setShowModal} fetchLocations={fetchLocations} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Locations;