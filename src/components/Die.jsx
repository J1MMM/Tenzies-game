

export default function Die(props){
    const dice = props.allNewDice.map(data => {
        
        return(
            <div 
            className={`dice dots${data.value}`} 
            key={data.id} 
            style={{backgroundColor: data.isHeld ? "#59E391" : "white"}}
            onClick={() => props.handleClick(data.id)}>
                
            </div>
        )
    })

    return(
        <div className="die-container"  style={props.pointer ? {pointerEvents: "all"} : {pointerEvents: "none"}}>
            {dice}
        </div>
    )
}