import axios from "axios";
const get = async (url) => {
    const responce = await axios.get(url);
    return responce.data;
};

export default { get };