import one from './assets/one.png';
import two from './assets/two.png';
import three from './assets/three.png';
import four from './assets/four.png';
import five from './assets/five.png';
import six from './assets/six.png';
import seven from './assets/seven.png';
import eight from './assets/eight.png';
import nine from './assets/nine.png';
import ten from './assets/ten.png';
import sound from './assets/sound.mp3';
import sound2 from './assets/sound2.mp3';
// import CARDGAME from '/CARDGAME.mp4';
import { useState, useEffect } from 'react';
// import { motion } from "framer-motion";

const App = () => {
  const images = [one, two, three, four, five, six, seven, eight, nine, ten];
  const [start, setStart] = useState(true);
  const [cards, setCards] = useState([]);
  const [flipped, setFlipped] = useState(Array(20).fill(false));
  const [selected, setSelected] = useState([]);
  const [finish, setFinish] = useState(false);
  const [isEnable, setIsEnable] = useState(true);
  const [miliseceond, setMilliseconds] = useState(0);

  const duplicateImages = [...images, ...images];

  useEffect(() => {
    setCards(setImages(duplicateImages));
  }, []);

 useEffect(() => {
  if(!start)  return

  
  const startTime = Date.now(); // Timer start hone ka reference time

  const timer = setInterval(() => {
    setMilliseconds(Date.now() - startTime); // Kitna time beet gaya calculate karo
  }, 10); // Har 10ms me update hoga (0.01 sec)

  return () => clearInterval(timer); // Cleanup function
 }, [start])
 
  

  useEffect(() => {
    if (flipped.every((val) => val === true)) {
      console.log('Sab cards flip ho chuke hain!');
      setFinish(true);
      setStart(false);
      
    }
  }, [flipped]);

  const minutes = Math.floor(miliseceond / 60000);
  const seconds = Math.floor((miliseceond % 60000) / 1000);
  const milisec = Math.floor((miliseceond % 1000) / 10); // Only 2 digits

  // Shuffle cards...
  const setImages = (arr) => {
    const shuffle = [...arr];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffle[i], shuffle[j]] = [shuffle[j], shuffle[i]];
    }
    return shuffle;
  };

  useEffect(() => {
    if (selected.length === 2) {
      checkMatch(selected);
      setTimeout(() => {
        setSelected([]);
      }, 1000);
    }
  }, [selected]);

  const checkMatch = ([one, two]) => {
    if (cards[one] === cards[two]) {
      correctSound();
    } else {
      setTimeout(() => {
        setFlipped((prev) => {
          const incorrectDivs = [...prev];
          incorrectDivs[one] = false;
          incorrectDivs[two] = false;
          return incorrectDivs;
        });
      }, 500);
    }
  };

  // Sound effects functions
  const soundEffect = () => {
    if (isEnable) {
      const audio = new Audio(sound);
      audio.play();
    }
  };

  const correctSound = () => {
    if (isEnable) {
      const audio = new Audio(sound2);
      audio.play();
    }
  };

  const handleClick = (index) => {
    soundEffect();
    if (selected.length < 2) {
      const newSelected = [...selected, index];
      setSelected(newSelected);
      setFlipped((prev) => {
        const currentDiv = [...prev];
        currentDiv[index] = !currentDiv[index];
        return currentDiv;
      });
    }
  };

  const handleNewGame = () => {
    setFlipped(Array(20).fill(false));
    setSelected([]);
    setCards(setImages(duplicateImages));
    setStart(true);
    setFinish(false);
    setMilliseconds(0)
  };

  return (
    <>
    <div className="bg-[#171D18] text-[#C1C2C2] relative min-h-screen flex justify-center items-center w-full">
      <h1 className="absolute top-5 text-3xl left-5 font-Sarpanch">
        <span className="text-xl">MEMORY</span> CARDS
      </h1>

      {/* Game grid */}
      {start ? (
        <div className="h-[65%] w-[90%] md:h-full absolute md:w-[50rem] pt-1 grid grid-cols-4 md:grid-cols-5 place-items-center">
          {cards.map((image, index) => (
            <div
              key={index}
              onClick={() => handleClick(index)}
              className={`flipper-card group h-[80%] w-[80%] md:h-[9.2rem] md:w-[9.2rem] relative bg-[#3FFF19] rounded-2xl`}
            >
              <img
                src={image}
                alt=""
                className="rounded-2xl object-cover object-center absolute inset-0 h-full w-full"
              />
              <div
                className={`absolute inset-0 h-full w-full transition-all duration-500 ${
                  flipped[index]
                    ? 'translate-x-40 opacity-[0.02]'
                    : 'translate-0 opacity-100'
                } bg-purple-300 rounded-2xl`}
              ></div>
            </div>
          ))}
        </div>
      ) : null}

      {/* Timer */}
      <div>
        <h1 className="absolute p-2 right-16 md:right-20 bottom-10 text-[1.45rem] md:text-2xl font-Sarpanch">
          Timer {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}.<span className='absolute'>0{String(milisec).padStart(2, '0')}</span>
        </h1>
      </div>

      {/* Sound Button */}
      <div
        onClick={() => setIsEnable(!isEnable)}
        className="h-12 w-12 rounded-xl bottom-10 left-5 border-white border-[0.05rem] absolute flex justify-center items-center text-xl hover:bg-white hover:text-black transition duration-200"
      >
        {isEnable ? (
          <i className="fa-solid fa-volume-high"></i>
        ) : (
          <i className="fa-solid fa-volume-xmark"></i>
        )}
      </div>

      {/* Outro */}
      {finish ? (
        <div
          onClick={handleNewGame}
          className="h-[35rem] w-[25rem] bg-[#3FFF19] p-4 absolute flex flex-col justify-center items-center text-black font-Sarpanch font-bold"
        >
          <h1 className="text-5xl">GAME OVER</h1>
          <button className="absolute bottom-5 text-2xl font-thin p-4 w-[90%] border-[0.05rem] border-black">
            NEW GAME
          </button>
        </div>
      ) : null}
    </div>

    </>
  );
};

export default App;
