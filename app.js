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

document.getElementById('videoFile').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (file) {
        inputFileName = file.name;
        document.getElementById('convertBtn').disabled = false;
        
        const previewContainer = document.getElementById('previewContainer');
        const videoPreview = document.getElementById('videoPreview');
        previewContainer.style.display = 'block';
        
        videoPreview.src = URL.createObjectURL(file);
        
        document.getElementById('fileSize').textContent = `${(file.size / (1024 * 1024)).toFixed(2)} MB`;
        document.getElementById('duration').textContent = 'Loading...';
        document.getElementById('resolution').textContent = 'Loading...';

        videoPreview.onloadedmetadata = function() {
            const duration = Math.round(videoPreview.duration);
            const minutes = Math.floor(duration / 60);
            const seconds = Math.floor(duration % 60);
            document.getElementById('duration').textContent = 
                `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            document.getElementById('resolution').textContent = 
                `${videoPreview.videoWidth}x${videoPreview.videoHeight}`;
            
            document.getElementById('endTime').value = duration;
            document.getElementById('endTime').max = duration;
            document.getElementById('startTime').max = duration;
        };
    }
});

document.getElementById('convertBtn').addEventListener('click', async () => {
    const format = document.getElementById('formatSelect').value;
    const quality = document.getElementById('qualitySelect').value;
    const file = document.getElementById('videoFile').files[0];
    
    if (!file) return;

    const convertBtn = document.getElementById('convertBtn');
    const progress = document.getElementById('progress');
    const downloadLink = document.getElementById('downloadLink');

    convertBtn.disabled = true;
    progress.style.display = 'block';
    downloadLink.style.display = 'none';

    try {
        const videoPreview = document.getElementById('videoPreview');
        if (videoPreview.src) {
            URL.revokeObjectURL(videoPreview.src);
        }

        const inputName = 'input' + getExtension(file.name);
        const outputName = `output.${format}`;

        ffmpeg.FS('writeFile', inputName, await fetchFile(file));

        let ffmpegCommand;
        const startTime = document.getElementById('startTime').value;
        const endTime = document.getElementById('endTime').value;
        const trimParams = [];
        
        if (startTime > 0 || endTime < videoPreview.duration) {
            if (startTime > 0) {
                trimParams.push('-ss', startTime);
            }
            if (endTime < videoPreview.duration) {
                trimParams.push('-t', (endTime - startTime).toString());
            }
        }

        switch (format) {
            case 'mp4':
                const crf = quality === 'high' ? '18' : quality === 'medium' ? '23' : '28';
                ffmpegCommand = [
                    ...trimParams, 
                    '-i', inputName, 
                    '-c:v', 'libx264', 
                    '-crf', crf,
                    '-preset', 'medium',
                    outputName
                ];
                break;
            case 'webm':
                const vbitrate = quality === 'high' ? '1M' : quality === 'medium' ? '750k' : '500k';
                ffmpegCommand = [
                    ...trimParams, 
                    '-i', inputName, 
                    '-c:v', 'libvpx',
                    '-b:v', vbitrate,
                    '-c:a', 'libvorbis',
                    outputName
                ];
                break;
            case 'gif':
                const scale = quality === 'high' ? '640:-1' : quality === 'medium' ? '480:-1' : '320:-1';
                ffmpegCommand = [
                    ...trimParams,
                    '-i', inputName,
                    '-vf', `fps=10,scale=${scale}:flags=lanczos`,
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
