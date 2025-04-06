// Función para iniciar la cámara (sin cambios)
async function startCamera() {
    const video = document.getElementById('video');
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment' }
    });
    video.srcObject = stream;
    video.setAttribute('playsinline', true); // Necesario para iOS
  }
  
  // Función para escanear QR constantemente (sin cambios)
  function scanQRCode() {
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
      validateQRCode(code.data);
    } else {
      messageDiv.textContent = 'Escaneando...';
    }
  
    requestAnimationFrame(scanQRCode);
  }
  
  // Función para validar el QR (sin cambios)
  function validateQRCode(code) {
    fetch('data/codes.json')
      .then(response => response.json())
      .then(data => {
        if (data.codes.includes(code)) {
          document.getElementById('message').textContent = '¡Código válido!';
        } else {
          document.getElementById('message').textContent = 'Código no válido.';
        }
      })
      .catch(err => {
        document.getElementById('message').textContent = 'Error al verificar el código.';
      });
  }
  
  // Función para validar el código ingresado manualmente
  function validateManualCode() {
    const code = document.getElementById('manualCode').value;  // Obtener el valor del campo de texto
    const messageDiv = document.getElementById('message');
  
    if (code === "") {
      messageDiv.textContent = "Por favor, ingresa un código.";
      return;
    }
  
    // Validar el código ingresado con el JSON
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
  