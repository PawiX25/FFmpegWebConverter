# FFmpegWebConverter

FFmpegWebConverter is a browser-based video conversion tool that leverages FFmpeg to convert videos directly in the user's browser. This application allows users to convert video files into various formats with ease, providing a seamless and efficient user experience without the need for backend processing.

## Features

- **Client-Side Conversion:** Utilizes FFmpeg compiled for WebAssembly to perform video conversions entirely in the browser.
- **Multiple Formats:** Supports conversion to MP4, WebM, and GIF formats.
- **Quality Settings:** Offers high, medium, and low-quality options to balance between file size and output quality.
- **Video Trimming:** Users can specify start and end times to trim videos during conversion.
- **Real-Time Progress:** Displays conversion progress with a visual progress bar.
- **Download Converted Files:** Provides a download link for the converted video once the process is complete.
- **Responsive Design:** Built with Tailwind CSS for a modern and responsive user interface.

## Installation

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/PawiX25/FFmpegWebConverter.git
   ```
2. **Navigate to the Project Directory:**
   ```bash
   cd FFmpegWebConverter
   ```
3. **Install Dependencies:**
   ```bash
   npm install
   ```
4. **Build CSS:**
   ```bash
   npm run build:css
   ```
5. **Start the Server:**
   ```bash
   node server.js
   ```
6. **Access the Application:**
   Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Select a Video File:**
   - Click on the "Choose Video File" button to upload a video from your device.
2. **Preview Video:**
   - After selecting a file, a preview along with file size, duration, and resolution details will be displayed.
3. **Configure Settings:**
   - **Format:** Choose the desired output format (MP4, WebM, GIF).
   - **Quality:** Select the quality level (High, Medium, Low).
   - **Start Time & End Time:** Specify the start and end times in seconds to trim the video.
4. **Convert Video:**
   - Click on the "Start Conversion" button to begin the conversion process.
   - A progress bar will indicate the conversion status.
5. **Download Converted File:**
   - Once the conversion is complete, a download link will appear. Click to download your converted video.

## Technology Stack

- **Frontend:**
  - HTML, CSS (Tailwind CSS), JavaScript
- **Backend:**
  - Node.js, Express.js
- **Video Processing:**
  - FFmpeg compiled for WebAssembly

## Acknowledgements

- [FFmpeg](https://ffmpeg.org/) for their powerful multimedia framework.
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS framework.
- [Express.js](https://expressjs.com/) for the web framework.