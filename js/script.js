// Función para iniciar la cámara
async function startCamera() {
  const video = document.getElementById('video');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    video.srcObject = stream;
    video.setAttribute('playsinline', true); // Necesario para iOS
    console.log('Cámara iniciada correctamente');
  } catch (error) {
    console.error('Error al acceder a la cámara:', error);
  }
}

// Función para capturar el frame y escanear el QR cuando el usuario hace clic en "Verificar imagen"
document.getElementById('verifyButton').addEventListener('click', () => {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const messageDiv = document.getElementById('message');

  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    console.log('QR detectado:', code.data);
    validateQRCode(code.data);
  } else {
    messageDiv.textContent = 'No se detectó un QR. Intenta de nuevo.';
  }
});

// Función para validar el QR escaneado
function validateQRCode(code) {
  const messageDiv = document.getElementById('message');
  const scannedCode = code.trim().toUpperCase();

  fetch('data/codes.json')
    .then(response => response.json())
    .then(data => {
      const validCodes = data.codes.map(c => c.trim().toUpperCase());
      if (validCodes.includes(scannedCode)) {
        messageDiv.textContent = '¡Código válido!';
      } else {
        messageDiv.textContent = 'Código no válido.';
      }
    })
    .catch(err => {
      console.error('Error al verificar el código:', err);
      messageDiv.textContent = 'Error al verificar el código.';
    });
}

// Función para validar el código ingresado manualmente
function validateManualCode() {
  const code = document.getElementById('manualCode').value;
  const messageDiv = document.getElementById('message');

  if (code === "") {
    messageDiv.textContent = "Por favor, ingresa un código.";
    return;
  }

  const manualCode = code.trim().toUpperCase();

  fetch('data/codes.json')
    .then(response => response.json())
    .then(data => {
      const validCodes = data.codes.map(c => c.trim().toUpperCase());
      if (validCodes.includes(manualCode)) {
        messageDiv.textContent = '¡Código válido!';
      } else {
        messageDiv.textContent = 'Código no válido.';
      }
    })
    .catch(err => {
      console.error('Error al verificar el código:', err);
      messageDiv.textContent = 'Error al verificar el código.';
    });
}

// Iniciar la cámara al cargar la página
window.onload = () => {
  startCamera();
};
