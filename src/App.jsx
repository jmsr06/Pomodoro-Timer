import { useEffect, useRef, useState } from 'react'

function App() {
  const [sessionTime, setSessionTime] = useState(25)
  const [breakTime, setBreakTime] = useState(5)
  const [seconds, setSeconds] = useState(0)
  const [minutes, setMinutes] = useState(sessionTime)
  const [isWorking, setIsWorking] = useState(true)
  const [isPaused, setIsPaused] = useState(true)
  const label = useRef(null)
  const audio = useRef(null)

  const incrementSessionTime = () => {
    if (sessionTime < 60) {
      setSessionTime((prev) => prev + 1);
      setMinutes(sessionTime + 1)
    }
  };

  const decrementSessionTime = () => {
    if (sessionTime > 1) {
      setSessionTime((prev) => prev - 1);
      setMinutes(sessionTime - 1);
    }
  };

  const incrementBreakTime = () => {
    if (breakTime < 60) {
      setBreakTime((prev) => prev + 1);
    }
  };

  const decrementBreakTime = () => {
    if (breakTime > 1) {
      setBreakTime((prev) => prev - 1);
    }
  };

  const startStop = () => {
    setIsPaused((prev) => !prev);
  };

  const resetTimer = () => {
    label.current.innerText = 'Session'
    audio.current.pause()
    audio.current.currentTime = 0
    setSeconds(0)
    setMinutes(25);
    setSessionTime(25)
    setBreakTime(5)
    setIsPaused(true);
    setIsWorking(true);
  }

  useEffect(() => {
    let intervalId;
    if (!isPaused) {
      intervalId = setInterval(() => {
        if (seconds === 0 && minutes === 0) {
          // cambiar de trabajo a descanso o viceversa
          audio.current.play()
          setIsWorking((prev) => !prev);
          if (isWorking) {
            label.current.innerText = 'Break'
            setMinutes(breakTime);
          } else {
            label.current.innerText = 'Session'
            setMinutes(sessionTime);
          }
        } else if (seconds === 0) {
          setSeconds(59);
          setMinutes((prev) => prev - 1);
        } else {
          setSeconds((prev) => prev - 1);
        }
      }, 1000);
    }
    return () => clearInterval(intervalId);
  }, [isPaused, seconds, minutes]);


  return (
    <div className="nunito-regular w-full h-screen flex flex-col justify-center items-center gap-20">
      <h1 className='text-blue-700 text-5xl font-semibold'>Pomodoro Timer</h1>
      <div className='border-4 border-[#D3E0FB] bg-[#EDF4FE] text-blue-700 rounded-full font-semibold w-96 h-96 flex flex-col justify-center items-center gap-5'>
        <span className='text-3xl' id="timer-label" ref={label}>Session</span>
        <span className='text-[90px]' id="time-left">{minutes.toString().padStart(2, "0")}:
          {seconds.toString().padStart(2, "0")}</span>
        <div className='flex flex-row gap-3 text-3xl'>
          <span id="start_stop" onClick={startStop} className='cursor-pointer hover:opacity-60'><i className="fa-solid fa-forward-step"></i></span>
          <span className='cursor-pointer hover:opacity-60' onClick={resetTimer} id="reset"><i className="fa-solid fa-arrow-rotate-right"></i></span>
        </div>
      </div>
      <div className='flex flex-row gap-16 justify-center items-center text-blue-700 font-semibold'>
        <div className='flex flex-col justify-center items-center gap-5'>
          <label className='text-3xl' id="break-label">Break Length</label>
          <div className='flex flex-row gap-4 justify-center text-2xl'>
            <span onClick={decrementBreakTime} id="break-decrement"><i className="rounded-full bg-blue-700 p-2 text-white hover:opacity-70 cursor-pointer fa-solid fa-minus"></i></span>
            <span id="break-length">{breakTime}</span>
            <span onClick={incrementBreakTime} id="break-increment"><i className="rounded-full bg-blue-700 p-2 text-white hover:opacity-70 cursor-pointer fa-solid fa-plus"></i></span>
          </div>
        </div>
        <div className='flex flex-col justify-center items-center gap-5'>
          <label className='text-3xl' id="session-label">Session Length</label>
          <div className='flex flex-row gap-4 justify-center text-2xl'>
            <span onClick={decrementSessionTime} id="session-decrement"><i className="rounded-full bg-blue-700 p-2 text-white hover:opacity-70 cursor-pointer fa-solid fa-minus"></i></span>
            <span id="session-length">{sessionTime}</span>
            <span onClick={incrementSessionTime} id="session-increment"><i className="rounded-full bg-blue-700 p-2 text-white hover:opacity-70 cursor-pointer fa-solid fa-plus"></i></span>
          </div>
        </div>

        <audio ref={audio} id="beep" src="./static/audio.mp3"/>
      </div>

    </div>
  )
}

export default App
