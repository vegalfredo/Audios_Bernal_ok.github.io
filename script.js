// Variable global para mantener una referencia al audio actualmente en reproducción
let currentAudio = null;

// Selecciona todos los tracks
const tracks = document.querySelectorAll('.track');
tracks.forEach(track => {
  const audioButton = track.querySelector('.audio-button');
  const volumeIcon = track.querySelector('.volume-icon');
  const volumeBar = track.querySelector('.volume-bar');
  const seekBar = track.querySelector('.seek-bar');
  const timeDisplay = track.querySelector('.time');

  // Crea un objeto de audio
  const audio = new Audio();
  audio.src = audioButton.getAttribute('data-audio');

  // Reproducir o pausar el audio
  audioButton.addEventListener('click', () => {
    // Si hay un audio reproduciéndose y es diferente del actual, detenerlo
    if (currentAudio && currentAudio !== audio) {
      currentAudio.pause();
      currentAudio.currentTime = 0; // Reiniciar el tiempo del audio anterior
      const previousButton = document.querySelector(`[data-audio="${currentAudio.src.split('/').pop()}"]`);
      if (previousButton) {
        previousButton.textContent = 'Reproducir'; // Restaurar el texto del botón anterior
      }
    }

    // Actualizar la referencia al audio actual
    currentAudio = audio;

    if (audio.paused) {
      audio.play();
      audioButton.textContent = 'Pausar'; // Cambia el texto del botón a "Pausar"
    } else {
      audio.pause();
      audioButton.textContent = 'Reproducir'; // Cambia el texto del botón a "Reproducir"
    }
  });

  // Control de volumen
  volumeBar.addEventListener('input', () => {
    audio.volume = volumeBar.value;
    // Cambia el ícono según el volumen
    if (audio.volume == 0) {
      volumeIcon.innerHTML = '<i class="fas fa-volume-mute"></i>';
    } else {
      volumeIcon.innerHTML = '<i class="fas fa-volume-up"></i>';
    }
  });

  // Actualizar la barra de progreso y el tiempo
  audio.addEventListener('timeupdate', () => {
    const currentTime = formatTime(audio.currentTime);
    const duration = formatTime(audio.duration);

    // Asegúrate de que la duración no sea NaN
    if (!isNaN(audio.duration)) {
      timeDisplay.textContent = `${currentTime} / ${duration}`;
      seekBar.value = (audio.currentTime / audio.duration) * 100;
    }
  });

  // Adelantar o atrasar la canción
  seekBar.addEventListener('input', () => {
    const seekTime = (seekBar.value / 100) * audio.duration;
    audio.currentTime = seekTime;
  });

  // Formatear el tiempo en minutos y segundos
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  // Detener completamente el audio al finalizar
  audio.addEventListener('ended', () => {
    audioButton.textContent = 'Reproducir';
    seekBar.value = 0;
    timeDisplay.textContent = `00:00 / ${formatTime(audio.duration)}`;

    // Limpiar la referencia al audio actual si este termina
    if (currentAudio === audio) {
      currentAudio = null;
    }
  });
});