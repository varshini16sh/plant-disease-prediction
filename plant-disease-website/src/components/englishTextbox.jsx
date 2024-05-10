import axios from 'axios';
import { useState, useEffect, useRef } from 'react'
import { faUpload, faPaperPlane } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faVolumeUp } from '@fortawesome/free-solid-svg-icons'

const englishTextBox = () => {
  const [text, setText] = useState('')
  const [messages, setMessages] = useState([])
  const [imageFile, setImageFile] = useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = useState(null);
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(scrollToBottom, [messages]);

  const handleClick = async () => {
    if (!text) {
      alert("Please enter some text.");
      return;
    }

    setMessages(prevMessages => [...prevMessages, { text: text, user: 'User', image: imagePreviewUrl }]);

    const formData = new FormData();
    formData.append('query', text);

    let apiEndpoint = 'https://glowing-polite-porpoise.ngrok-free.app/english_text_query';

    if (imageFile) {
      formData.append('image', imageFile, imageFile.name);
      apiEndpoint = 'https://glowing-polite-porpoise.ngrok-free.app/english_image_query';
    }

    setImageFile(null);
    setImagePreviewUrl(null);

    try {
      const response = await axios.post(apiEndpoint, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      const data = response.data;
      console.log(response);
      setMessages(prevMessages => [...prevMessages, { text: '', user: 'GreenAI' }]);
      const words = data.response.split(' ');
      let wordIndex = 0;

      const typingInterval = setInterval(() => {
        if (wordIndex < words.length) {
          const modelMessage = words.slice(0, wordIndex + 1).join(' ');
          setMessages(prevMessages => {
            const newMessages = [...prevMessages];
            newMessages[newMessages.length - 1] = { text: modelMessage, user: 'GreenAI' };
            return newMessages;
          });
          wordIndex++;
        } else {
          clearInterval(typingInterval);
        }
      }, 100);
    }

    catch (error) {
      console.error('Error:', error);
      setMessages(prevMessages => [...prevMessages, { text: 'An error occurred while processing your request.', user: 'GreenAI' }]);
    };

    setText('');
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImageFile(null);
  }

  function speak_english(word) {
    if (!window.speechSynthesis) {
      console.log('Web Speech API not supported');
      return;
    }
  
    const utterance_english = new SpeechSynthesisUtterance(word);
    const voices_english = speechSynthesis.getVoices();
    console.log(voices_english); 
  
    const englishVoice = voices_english.find(voice => voice.lang === 'en-US'); 
  
    if (!englishVoice) {
      console.log('English voice not available');
      return;
    }
  
    utterance_english.voice = englishVoice;
    speechSynthesis.speak(utterance_english);
  }

  return (
    <div className='flex flex-col h-[100%] justify-center item-center'>
      <div className='mt-2 mx-4 flex space-x-3 items-center'>
        <h1 className='text-green-500 tracking-tight font-mono font-bold text-4xl'>GreenAI </h1>
        <h1 className='text-white tracking-tight font-mono font-bold text-2xl' style={{ lineHeight: '0.5', position: 'relative', top: '2px' }}>v1.0</h1>
      </div>
      <div className='flex-1 mx-auto left-1/4 sm:w-1/2 w-[100vw] p-3 message-container overflow-y-auto'
        style={{
          scrollbarWidth: 'thin',
          scrollbarColor: 'black transparent'
        }}
      >     {messages.map((message, index) => {
        return (
          <pre key={index}>
              <div className={`mt-4 mx-2 text-left overflow-y-auto text-wrap ${message.user === 'User' ? 'flex flex-col' : ''}`} style={{ wordWrap: 'break-word' }}>
                  <div className="flex items-center">
                      <p className={`text-${message.user === 'User' ? 'white' : 'green-500'} font-mono font-bold text-wrap`}>{message.user}</p>
                  </div>
                  <div className='flex flex-col items-start text-wrap'>
                      {message.image && <img className='object-cover rounded-md w-24 h-24 mb-2' src={message.image} alt='Preview' />}
                      {message.user === 'GreenAI' && (
                          <button className='mr-2 hover:bg-green-700 text-white font-bold rounded' onClick={_ => speak_english(message.text)}>
                              <FontAwesomeIcon icon={faVolumeUp} />
                          </button>
                      )}
                      <p className='text-white font-mono font-bold'>{message.text}</p>
                  </div>
              </div>
          </pre>
      );
      
      })}

        <div ref={messagesEndRef} />
      </div>

      <div className='mx-auto left-1/4 w-1/2 p-3 border-gray-300 rounded flex flex-col items-center justify-between max-sm:w-[100vw]'>

        <div className='w-full flex flex-col w-[100%]'>
          {imagePreviewUrl && (
            <div className='relative w-24 h-24 self-start'>
              <img className='object-cover rounded-md w-24 h-24' src={imagePreviewUrl} alt='Preview' />
              <button
                className='absolute top-0 right-0 bg-red-500 text-white rounded-full p-1'
                onClick={handleRemoveImage}
              >

              </button>
            </div>
          )}
          <div className='flex items-center justify-between p-4 w-[100%] mx-auto'>
            <input
              className='w-full font-mono font-bold py-2 px-4 border border-gray-300 rounded focus:outline-none'
              type='text'
              placeholder='Ask me anything....!'
              value={text}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // prevent the default action of the Enter key
                  const currentText = text; // store the current text
                  setText(''); // clear the input box
                  handleClick(currentText); // call handleClick with the current text
                }
              }}
            />
            <div className='flex ml-2'>
              <input
                type='file'
                accept='image/*'
                onChange={handleImageUpload}
                style={{ display: 'none', width: 0, height: 0 }}
                id='image-upload'
              />
              <label htmlFor='image-upload' className='mr-2 py-2 px-4 bg-green-500 text-white rounded cursor-pointer'>
                <FontAwesomeIcon icon={faUpload} size='lg' color='white' />
              </label>
            </div>
            <div className='flex '>
              <button
                className='mr-2 py-2 px-4 bg-green-500 text-white rounded cursor-pointer'
                onClick={() => {
                  const currentText = text; // store the current text
                  setText(''); // clear the input box
                  handleClick(currentText); // call handleClick with the current text
                }}
              >
                <FontAwesomeIcon icon={faPaperPlane} size='lg' color='white' />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default englishTextBox;
