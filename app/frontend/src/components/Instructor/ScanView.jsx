

function ScanView(props) {
    if(props.isOpen) {
        return(<div className = "bg-[rgba(255,_0,_0,_1.0)] fixed top-[35%] left-1/10 w-1/5 h-[10%] text-center overflow-y-scroll">
            <button onClick = {props.onClose}>Close</button>
            <p>Lorem</p>
            <p>{props.studentId}</p>
            <p>{props.exam}</p>
            <p>{props.course}</p>
            <p>{props.isOpen ? "isOpen" : "notOpen"}</p>
        </div>)
        } else {
            return null;
        }
}

export default ScanView;
