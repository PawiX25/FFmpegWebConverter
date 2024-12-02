const { createFFmpeg, fetchFile } = FFmpeg;
const loading = document.getElementById('loading');

const ffmpeg = createFFmpeg({
    log: true,
    corePath: 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/ffmpeg-core.js',
    progress: ({ ratio }) => {
        const progressBar = document.querySelector('.progress-bar');
        progressBar.style.width = `${ratio * 100}%`;
    },
});

let inputFileName = '';

document.addEventListener('DOMContentLoaded', async () => {
    loading.style.display = 'block';
    try {
        await ffmpeg.load();
        console.log('FFmpeg is ready!');
        loading.style.display = 'none';
    } catch (error) {
        console.error('Failed to load FFmpeg:', error);
        loading.textContent = 'Failed to load FFmpeg. Please use a modern browser and try again.';
    }
});

document.getElementById('videoFile').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        inputFileName = file.name;
        document.getElementById('convertBtn').disabled = false;
    }
});

document.getElementById('convertBtn').addEventListener('click', async () => {
    const format = document.getElementById('formatSelect').value;
    const file = document.getElementById('videoFile').files[0];
    
    if (!file) return;

    const convertBtn = document.getElementById('convertBtn');
    const progress = document.getElementById('progress');
    const downloadLink = document.getElementById('downloadLink');

    convertBtn.disabled = true;
    progress.style.display = 'block';
    downloadLink.style.display = 'none';

    try {
        const inputName = 'input' + getExtension(file.name);
        const outputName = `output.${format}`;

        ffmpeg.FS('writeFile', inputName, await fetchFile(file));

        let ffmpegCommand;
        switch (format) {
            case 'mp4':
                ffmpegCommand = ['-i', inputName, '-c:v', 'libx264', outputName];
                break;
            case 'webm':
                ffmpegCommand = ['-i', inputName, '-c:v', 'libvpx', '-c:a', 'libvorbis', outputName];
                break;
            case 'gif':
                ffmpegCommand = [
                    '-i', inputName,
                    '-vf', 'fps=10,scale=320:-1:flags=lanczos',
                    outputName
                ];
                break;
        }

        await ffmpeg.run(...ffmpegCommand);

        const data = ffmpeg.FS('readFile', outputName);
        const url = URL.createObjectURL(new Blob([data.buffer], { type: `video/${format}` }));
        
        downloadLink.href = url;
        downloadLink.download = `converted.${format}`;
        downloadLink.style.display = 'block';

        // Cleanup
        ffmpeg.FS('unlink', inputName);
        ffmpeg.FS('unlink', outputName);

    } catch (error) {
        console.error('Error during conversion:', error);
        alert('An error occurred during conversion. Please try again.');
    } finally {
        convertBtn.disabled = false;
    }
});

function getExtension(filename) {
    return '.' + filename.split('.').pop();
}
