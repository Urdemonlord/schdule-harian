// Fungsi untuk efek mengetik
function typeWriter(text, element, delay) {
    let index = 0;
    function type() {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++;
            setTimeout(type, delay);
        }
    }
    type();
}

function createRain() {
    const rainCount = 50; // Jumlah elemen hujan
    for (let i = 0; i < rainCount; i++) {
        const rainDrop = document.createElement('div');
        rainDrop.className = 'rain';
        rainDrop.style.left = Math.random() * 100 + 'vw'; // Acak posisi horizontal
        rainDrop.style.animationDuration = Math.random() * 2 + 2 + 's'; // Acak durasi
        document.body.appendChild(rainDrop);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const titleElement = document.getElementById('title');
    typeWriter('Aplikasi Jadwal Kegiatan', titleElement, 100); // Mengatur delay ke 100 ms
    createRain(); // Panggil fungsi untuk membuat hujan kode

    const datePicker = document.getElementById('datePicker');
    const clearScheduleButton = document.getElementById('clearSchedule');
    const saveScheduleButton = document.getElementById('saveSchedule');
    const loadingIndicator = document.getElementById('loading');

    // Muat jadwal dari localStorage ketika tanggal dipilih
    datePicker.addEventListener('change', () => {
        const date = datePicker.value;
        if (!date) return;

        loadingIndicator.classList.add('visible'); // Tampilkan loading
        const storedSchedule = JSON.parse(localStorage.getItem(`schedule-${date}`));
        loadingIndicator.classList.remove('visible'); // Sembunyikan loading

        if (storedSchedule) {
            document.querySelectorAll('.activity').forEach(input => {
                const hour = input.dataset.hour;
                input.value = storedSchedule[hour] ? storedSchedule[hour].activity : '';
            });
        } else {
            alert('Tidak ada jadwal tersimpan untuk tanggal ini.');
        }
    });

    // Menyimpan jadwal ke localStorage
    saveScheduleButton.addEventListener('click', () => {
        const date = datePicker.value;
        if (!date) {
            alert('Silakan pilih tanggal terlebih dahulu.');
            return;
        }

        const schedule = {};
        document.querySelectorAll('.activity').forEach(input => {
            const hour = input.dataset.hour;
            const activity = input.value;
            schedule[hour] = { activity };
        });

        loadingIndicator.classList.add('visible'); // Tampilkan loading
        localStorage.setItem(`schedule-${date}`, JSON.stringify(schedule));
        loadingIndicator.classList.remove('visible'); // Sembunyikan loading
        
        // Animasi saat menyimpan jadwal
        const notification = document.createElement('div');
        notification.innerText = 'Jadwal telah disimpan!';
        notification.classList.add('notification');
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.classList.add('fade-out');
        }, 2000); // Menghilang setelah 2 detik

        setTimeout(() => {
            notification.remove();
        }, 2500); // Menghapus elemen setelah animasi selesai
    });

    // Menghapus jadwal
    clearScheduleButton.addEventListener('click', () => {
        const date = datePicker.value;
        if (!date) {
            alert('Silakan pilih tanggal terlebih dahulu.');
            return;
        }

        if (confirm('Apakah Anda yakin ingin menghapus semua jadwal?')) {
            loadingIndicator.classList.add('visible'); // Tampilkan loading
            localStorage.removeItem(`schedule-${date}`);
            document.querySelectorAll('.activity').forEach(input => {
                input.value = '';
            });
            loadingIndicator.classList.remove('visible'); // Sembunyikan loading
            alert('Jadwal telah dihapus!');
        }
    });
});
