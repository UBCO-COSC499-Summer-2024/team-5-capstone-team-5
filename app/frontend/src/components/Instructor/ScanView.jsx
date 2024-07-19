
function ScanView(props) {
    let scanViewInfo = props.scanViewInfo;
    if(scanViewInfo.isOpen) {
        return(<div className = "bg-[rgba(255,_0,_0,_1.0)] fixed top-[20%] left-[10%] w-[80%] h-[70%] text-center overflow-y-scroll">
            <button onClick = {props.onClose}>Close</button>
            <p>Student Id: {scanViewInfo.student}</p>
            <p>Exam Id: {scanViewInfo.exam}</p>
            <p>Score: {scanViewInfo.score}</p>
            <p>Course Id: {scanViewInfo.course}</p>
            <p>Scan View is {scanViewInfo.isOpen ? "open" : "not open"}</p>
        </div>)
    } else {
        return null;
    }
}

export default ScanView;
