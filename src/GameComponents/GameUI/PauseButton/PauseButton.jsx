import {useRef} from "react"
import "./PauseButton.css"



export default function PauseButton({onClickCallback}) {

    const buttonRef  = useRef();

    const onClick  =  () => {
        onClickCallback();
    }

    return (
        <div
            onClick={onClick} 
            className="pause-button"
            ref={buttonRef}
        >
            <div className="pause-button-stroke"></div>
            <div className="pause-button-stroke"></div>
        </div>
    )
}