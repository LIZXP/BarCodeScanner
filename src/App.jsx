import { useState } from 'react';
import './App.css';
import VideoCameraComponent from './Components/VideoCameraComponent/VideoCameraComponent';

function App() {
  const [QRCode, setQRCode] = useState(null);
  return (
    <div className="App">
      <h1>React Barcode Scanner and Generator</h1>
      <div>
        <h2>Scanner</h2>
        <VideoCameraComponent setQRCode={setQRCode} />
        {QRCode ? <span>Your QR Code is: {QRCode}</span> : <span>Please scan a QR Code</span>}
      </div>
    </div>
  );
}

export default App;
