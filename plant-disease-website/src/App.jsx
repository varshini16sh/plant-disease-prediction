import React, { useState } from 'react';
import EnglishTextBox from './components/englishTextbox'
import TamilTextBox from './components/tamilTextbox'

function App() {
  const [lang, setLang] = useState("english"); // Set default language to English

  return (
    <div className='h-[100vh]'>
      {
        lang === "english" ?
        <EnglishTextBox setLang={setLang} lang={lang} />
        :
        <TamilTextBox setLang={setLang} lang={lang} />
      }
      <div className='fixed sm:bottom-3 max-sm:top-0 right-0 flex max-sm:flex-col'>
        <button className="text-white p-6 max-sm:p-2 font-mono font-bold" style={{ color: lang === "english" ? "green" : "white" }} onClick={() => setLang("english")}>English</button>
        <button  className="text-white p-6 max-sm:p-2 font-mono font-bold" style={{ color: lang === "tamil" ? "green" : "white" }} onClick={() => setLang("tamil")}>தமிழ்</button>
      </div>
    </div>
  )
}

export default App;