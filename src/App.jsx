import Die from './components/Die'
import { useEffect, useState } from 'react'
import { nanoid } from "nanoid"
import Confetti from 'react-confetti'

export default function App(){
  
  const [dice, setDice] = useState(allNewDice())
  const [win, setWin] = useState(false)
  const [rollCount, setRollCount] = useState(0)
  const [time, setTime] = useState(0)
  const [startCount, setStartCount] = useState(false)
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("key")) || []);
  const [pointer, setPointer] = useState(true);

useEffect(() =>{
  const isAllHeld = dice.every(die => die.isHeld);
  const dieValue = dice[0].value;
  const isAllSameValue = dice.every(die => die.value === dieValue);

if(isAllHeld && isAllSameValue){
  console.log("win")
  setPointer(false)
  setWin(true)
  setStartCount(false)
  history.push({
    time: time,
    rolls: rollCount
  })
  localStorage.setItem("key", JSON.stringify(history))
}else{
  setWin(false)
}

}, [dice])

function allNewDice(){
    const newDie = []
    for(let i = 0; i<10; i++){
      newDie.push( {
        value: Math.ceil(Math.random() * 6), 
        isHeld: false,
        id: nanoid()
      })
    }
    return newDie
  }
  //helper function
function generateNewDie(){
  return  {
    value: Math.ceil(Math.random() * 6), 
    isHeld: false,
    id: nanoid()
  }
}
  function handleClick(id){
    gameStart()
    setDice(prevData =>{
      return prevData.map(data =>{
        //
        // if(id===data.id){
          //   return {...data, isHeld: !data.isHeld}
          // }else{
        //   return {...data}
        // }
        return id === data.id ? {...data, isHeld: !data.isHeld} : data
      })
    })
  }
  
  function diceRoll(){
    gameStart()
    setRollCount(count => count + 1)
    setDice(prevDie => {
      return prevDie.map(data =>{
        // if(data.isHeld === true){
          //   return {...data}
          // }else{
        //   return {...data, value: Math.ceil(Math.random() * 6)}
        // }
        return data.isHeld === true ? data : generateNewDie()
      })
    })
  }
  
  
  function gameStart(){
   setStartCount(true)
  }
  
  useEffect(() => {
    if(startCount){
      const interval = setInterval(() => {
        setTime(prevTime => prevTime + 1)
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [startCount]);
  
  
  const historyElements = history.map(data => {
    return(
      <div className='history-elements-container'>
        <p className='history-elements'>Time: {data.time} seconds</p>
        <p className='history-elements'>Dice Roll: {data.rolls} rolls</p>
      </div>
    )
  })
  
  function clearHistory(){
    setHistory([])
    localStorage.clear();
  }
  return(
      <>
      <h2 className='number-of-rolls'>Number of {rollCount < 1 ? 'Roll:' : 'Rolls:'} {rollCount}</h2>
      <div className="Main">
          {win && <Confetti style={{width: "100%"}}/>}
          <h1>Tenzies</h1>
          <p>Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
          <Die allNewDice={dice} handleClick={handleClick}  pointer={pointer} />
          <button className="roll-btn" 
            onClick={win ? ()=>{setDice(allNewDice); setRollCount(0); setTime(0); setStartCount(true); setPointer(true)} : diceRoll}>
            {win ? "New Game" : "Roll"}
          </button>
      </div>
      <h4 className='timer'>Timer: {time}</h4>
      <div className='history-container'>
        <h4 className='history'>History:</h4>
        <button className='clear-history-btn' onClick={() => clearHistory()}>Clear History</button>
      </div>
      <div className='history-main-container'>
        {historyElements}
      </div>
    </>
  )
}