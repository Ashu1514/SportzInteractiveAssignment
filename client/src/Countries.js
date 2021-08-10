import React, {useEffect, useState} from "react";
import axios from "axios";

const Contries = () => {
    const [contries, setContries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState();
    const [file, setFile] = useState();
    const [imageErr, setImageErr] = useState('');
    const [formData, setFormData] = useState({
        name: {
            value: "",
            validation: {
              minLength: 3,
              required: true,
            },
            errMsg: "Invalid Country Name!",
            valid: true,
        },
        rank: {
            value: "",
            validation: {
              required: true,
              isNumeric: true,
            },
            errMsg: "Invalid rank!",
            valid: true,
        },
        continent: {
            value: "",
            validation: {},
            errMsg: "Invalid rank!",
            valid: true,
        },
    });

    useEffect(() => {
        fetchCountries(true);
    }, []);

    const fetchCountries = (firstTime) => {
        axios.get("http://localhost:5000/api/countries")
        .then(res => {
            let contries = res.data.data.countries;
            setContries(contries);
            if(firstTime){
                setSelectedCountry(contries[0]);
            }
        })
        .catch(err => {
            console.log("get countries",err);
        })
    };

    const selectHandler = (e) => {
        let rank = Number(e.target.value);
        let selected = contries[contries.findIndex(el => el.rank === rank)];
        setSelectedCountry(selected);
    }

    const fileHandler = (e) => {
        let image = e.target.files[0];
        if (!image.name.toLowerCase().match(/\.(jpg|jpeg|png)$/)) {
            setImageErr("Please select Image file.")
        }else if (image.size / 1000 > 4000) {
            setImageErr("Image File size should be less than 4MB.")
        } else {
            setFile(image);
        }
    }

    const inputHandler = (e, inputName) => {
        const updatedForm = { ...formData };
        const updatedFormElement = { ...updatedForm[inputName] };
        updatedFormElement.value = e.target.value;
        updatedForm[inputName] = updatedFormElement;
        updatedForm[inputName].valid = checkValidity(
          updatedForm[inputName].value,
          updatedForm[inputName].validation
        );
        let formValid = true;
        for (let key in updatedForm) {
          formValid =
            updatedForm[key].valid && formValid && updatedForm[key].value !== "";
        }
        setFormData(updatedForm);
    }

    function checkValidity(value, rules) {
        let isValid = true;
        if (rules.required) {
          isValid = value.trim() !== "" && isValid;
        }
    
        if (rules.minLength) {
          isValid = value.length >= rules.minLength && isValid;
        }
    
        if (rules.isNumeric) {
          const pattern = /^\d+$/;
          isValid = pattern.test(value) && isValid;
        }
        return isValid;
    }
    
    const formSubmitHandler = (e) => {
        e.preventDefault();
        let data = {};
        const formDataObj = new FormData();
        for(let input in formData){
            data[input] = formData[input].value
            formDataObj.append(input, formData[input].value);
        }
        formDataObj.append('flag', file);
        const config = {
            headers: {
              'content-type': 'multipart/form-data'
            }
        }
        axios.post("http://localhost:5000/api/country", formDataObj, config)
        .then(res => {
            fetchCountries(false);
            console.log("contry created", res);
        })
        .catch(err => console.log("contry create err", err));
        console.log({data}, formDataObj);
    }

    return (
        <div>
            <label for="countries">Choose a country:</label>
            <select onChange={(e) => selectHandler(e)} name="countries" id="countries">
                {contries.map(el => {
                    return (<option value={el.rank}>{el.name}</option> )
                })}
            </select>
            <br/>
            <br/>
            <h3>Selected Country</h3>
            {selectedCountry ? 
            <div>
                <p>Country Name: {selectedCountry.name}</p>
                <p>Flag: <img src={"http://localhost:5000/"+selectedCountry.flag}/></p>
                <p>Rank: {selectedCountry.rank}</p>
            </div> : null}

            <br/>
            <br/>
            <br/>
            <h3>Create New Country</h3>
            <form onSubmit={formSubmitHandler}>
                <p>Country name: <input type="text" onChange={(e) => inputHandler(e, "name")} /></p>
                <p>Country Rank: <input type="number" onChange={(e) => inputHandler(e, "rank")} /></p>
                <p>Country continent: 
                    <select onChange={(e) => inputHandler(e, "continent")}>
                    <option value="" selected disabled hidden>Choose continent...</option>
                        {contries.map(el => {
                            return (<option value={el.continent}>{el.continent}</option> )
                        })}
                    </select>
                </p>
                <p>Country Flag: <input accept="image/*" type="file" onChange={fileHandler} /> {imageErr.length ? imageErr : null}</p>
                <button type="submit">Create Country</button>
            </form>
        </div>

    );
};

export default Contries;