import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from 'react';
import { Html5Qrcode, Html5QrcodeSupportedFormats } from 'html5-qrcode';

const VideoCameraComponent = ({ setQRCode }) => {
    const [result, setResult] = useState('Not Found');
    const [cameraDevices, setCameraDevices] = useState([]);
    const [selectedCamera, setSelectedCamera] = useState(null);
    const html5QrCodeRef = useRef(null);

    useEffect(() => {
        html5QrCodeRef.current = new Html5Qrcode("reader", {
            formatsToSupport: [Html5QrcodeSupportedFormats.QR_CODE, Html5QrcodeSupportedFormats.CODE_128],
        });

        Html5Qrcode.getCameras().then(devices => {
            if (devices && devices.length) {
                setCameraDevices(devices);
            }
        }).catch(err => console.log(err));

        return () => {
            if (html5QrCodeRef.current.isScanning) {
                html5QrCodeRef.current.stop().then(ignore => {
                    html5QrCodeRef.current.clear();
                }).catch(err => {
                    console.log(err);
                });
            } else {
                html5QrCodeRef.current.clear();
            }
        };
    }, []);

    const startScanning = (cameraId) => {
        html5QrCodeRef.current.start(
            cameraId,
            {
                fps: 10,
                qrbox: 250,
            },
            qrCodeMessage => {
                setResult(qrCodeMessage);
                setQRCode(qrCodeMessage);
            },
            errorMessage => {
                console.log(errorMessage);
            }
        ).catch(err => {
            console.log(err);
        });
    };

    const handleCameraSelect = (event) => {
        const cameraId = event.target.value;
        setSelectedCamera(cameraId);
        startScanning(cameraId);
    };

    return (
        <div>
            <h2>Barcode Scanner</h2>
            {cameraDevices.length > 0 ? (
                <div>
                    <label htmlFor="cameraSelect">Select Camera: </label>
                    <select id="cameraSelect" onChange={handleCameraSelect}>
                        <option value="">Select a camera</option>
                        {cameraDevices.map((device, index) => (
                            <option key={index} value={device.id}>{device.label || `Camera ${index + 1}`}</option>
                        ))}
                    </select>
                </div>
            ) : (
                <p>Loading cameras...</p>
            )}
            <div id="reader" style={{ width: '100%' }}></div>
            <p>{result}</p>
        </div>
    );
};

VideoCameraComponent.propTypes = {
    setQRCode: PropTypes.func.isRequired
}

export default VideoCameraComponent;
