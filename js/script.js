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

// Función para escanear QR constantemente
function scanQRCode() {
  const video = document.getElementById('video');
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const messageDiv = document.getElementById('message');

  // Establecer el tamaño del canvas igual al tamaño del video
  canvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    console.log('QR detectado:', code.data);
    validateQRCode(code.data);
  } else {
    messageDiv.textContent = 'Escaneando...';
  }

  requestAnimationFrame(scanQRCode);
}

// Función para validar el QR
function validateQRCode(code) {
  const messageDiv = document.getElementById('message');
  
  fetch('data/codes.json')
    .then(response => response.json())
    .then(data => {
      if (data.codes.includes(code)) {
        messageDiv.textContent = '¡Código válido!';
      } else {
        messageDiv.textContent = 'Código no válido.';
      }
    })
    .catch(err => {
      messageDiv.textContent = 'Error al verificar el código.';
    });
}

// Iniciar la cámara y el escaneo al cargar la página
window.onload = () => {
  startCamera();
  scanQRCode();
};
