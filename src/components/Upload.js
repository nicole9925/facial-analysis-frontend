import React, {useState} from 'react'
import ImageUploader from 'react-images-upload'
import UploadService from './UploadService'
import CircleLoader from 'react-spinners/CircleLoader'
import { css } from "@emotion/core";
import './Upload.css';
const UploadComponent = props => (
    <form>
        <ImageUploader
            key='image-uploader'
            withIcon={false}
            singleImage={true}
            label="Please upload an image with a single face."
            buttonText="Choose file"
            onChange={props.onImage}
            imgExtension={['.jpg', '.png', '.jpeg']}
            withPreview={true}
            labelStyles = {{color: '#ffffff'}}
            fileContainerStyle={{backgroundColor: 'var(--primary)', padding: '20px'}}
            buttonStyles = {{backgroundColor: 'var(--highlight)'}}
        />
    </form>
);
const Upload = (props) => {

    const [url, setImageUrl] = useState(undefined);
    const [errorMessage, setErrorMessage] = useState('');
    const [img, setImage] = useState(null);
    const [disableButton, setDisabled] = useState(true);
    const [raceIG, setRaceIG] = useState(null);
    const [genderIG, setGenderIG] = useState(null);
    const [ageIG, setAgeIG] = useState(null);
    const [raceG, setRaceG] = useState(null);
    const [genderG, setGenderG] = useState(null);
    const [ageG, setAgeG] = useState(null);
    const [raceBP, setRaceBP] = useState(null);
    const [genderBP, setGenderBP] = useState(null);
    const [ageBP, setAgeBP] = useState(null);

    const [vizType, setVizType] = useState("grad");

    const showViz = () => {
        switch(vizType) {
            case "grad":
                return (<>
                    <div className="ig-container">
                        <img className = "image-container-ig" src={raceG} alt="Race Grad"></img>
                        <img className = "image-container-ig" src={genderG} alt="Gender Grad"></img>
                        <img className = "image-container-ig" src={ageG} alt="Age Grad"></img>
                    </div>
                </>)
            case "ig":
                return(<>
                        <div className="ig-container">
                            <img className = "image-container-ig" src={raceIG} alt="Race Integrated Grad"></img>
                            <img className = "image-container-ig" src={genderIG} alt="Gender Integrated Grad"></img>
                            <img className = "image-container-ig" src={ageIG} alt="Age Integrated Grad"></img>
                        </div>
                </>)
            case "bp":
                return(<>
                        <div className="ig-container">
                            <img className = "image-container-ig" src={raceBP} alt="Race Back Prop"></img>
                            <img className = "image-container-ig" src={genderBP} alt="Gender Back Prop"></img>
                            <img className = "image-container-ig" src={ageBP} alt="Age Back Prop"></img>
                        </div>
                </>)

        }
    }
    
    const onImage = async (failedImages, successImages) => {
        try {
            setDisabled(false)
            setImage(successImages)

        } catch(error) {
            setErrorMessage(error.message);

        } 
    }

    const loading = () => {
        const override = css`
        display: block;
        margin-left: 0px;
        `;
        
        return(
            <CircleLoader 
            className={'loader'}
            color={'#80D8FF'}
            loading={true}
            size={150}
            css={override}
            />
        )
    }

    const submit = async () => {
        props.setProgress("Uploading");
        // const parts = img[0].split(';');
        const name = '';

        const resp = await UploadService.UploadToServer(img, name)
        console.log(resp)
        setImageUrl('data:image/jpeg;base64,' + resp.pp_img)

        setRaceIG( 'data:image/jpeg;base64,' + resp.race_ig)
        setGenderIG( 'data:image/jpeg;base64,' + resp.gender_ig)
        setAgeIG( 'data:image/jpeg;base64,' + resp.age_ig)

        setRaceG( 'data:image/jpeg;base64,' + resp.race_grad)
        setGenderG( 'data:image/jpeg;base64,' + resp.gender_grad)
        setAgeG( 'data:image/jpeg;base64,' + resp.age_grad)

        setRaceBP( 'data:image/jpeg;base64,' + resp.race_back)
        setGenderBP( 'data:image/jpeg;base64,' + resp.gender_back)
        setAgeBP( 'data:image/jpeg;base64,' + resp.age_back)

        props.setProgress('Uploaded')
        props.setData({"race": resp.race, "gender": resp.gender, "age": resp.age})
        props.setPlotData1({"title": "Race Prediction", "data": resp.race_results, "colors": ["#9900ff", "#00ccff"]})
        props.setPlotData2({"title": "Age Prediction", "data": resp.age_results, "colors": ["#ff4aa7", "#e04646"]})    }
 
    const content = (props) => {
        const progress = props.progress
        switch(progress) {
            case 'getUpload':
                return <>
                <div className="upload-container">
                    <UploadComponent onImage={onImage} url={url} />
                    <button className="submit" onClick={submit}>Submit</button>
                </div>
                </>
                
            case 'Uploading':
                return loading()
            case 'Uploaded':
                return (
                <>
                    <div className="image-container">
                        <img className = "pp-img" src={url} alt="Your Face"></img>
                    </div>
                </>
                )
            case 'uploadError':
                return (
                    <>
                        <div className="error-message">{errorMessage}</div>
                        <div className="upload-container">
                            <UploadComponent onImage={onImage} url={url} />
                            <button className="submit" onClick={submit}>Submit</button>
                        </div>
                    </>
                )
            case 'Analysis':
                return (
                <>  
                <div className="grid">
                    <div className="viz-headers">
                        <h2>Race</h2>
                        <h2>Gender</h2>
                        <h2>Age</h2>
                    </div>

                    {showViz()}

                    <div className="viz-button-container">
                        <button className="viz-button" name="grad" onClick={() => setVizType('grad')}>Grad-CAM</button>
                        <button className="viz-button" name="ig" onClick={() => setVizType('bp')}>Guided BP</button>
                        <button className="viz-button" name="bp" onClick={() => setVizType('ig')}>Integrated Grad</button>
                    </div>                    
                </div>


                </>
                )
            default:
                return <>
                    <div className="image-container">
                        <img className = "pp-img" src={url} alt="Your Face"></img>
                    </div>
                </>
        }
        
    }

    return (
        <div>
            {content(props)}
        </div>
    )
}

export default Upload;