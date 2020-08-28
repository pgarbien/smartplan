import axios from "axios";

export default axios.create({
    baseURL: "http://192.168.0.115:4000/",
    responseType: "json"
});
