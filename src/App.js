// App.js
import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  const [topText, setTopText] = useState("");
  const [bottomText, setBottomText] = useState("");
  const [image, setImage] = useState(null);
  const [size, setSize] = useState("medium");
  const [font, setFont] = useState("Impact");
  const [fontColor, setFontColor] = useState("#ffffff");
  const [strokeColor, setStrokeColor] = useState("#000000");
  const [darkMode, setDarkMode] = useState(false);
  const [watermarkEnabled, setWatermarkEnabled] = useState(true);
  const [watermarkText, setWatermarkText] = useState("@NidhimemeApp");
  const [watermarkPosition, setWatermarkPosition] = useState("bottom-right");

  const canvasRef = useRef(null);

  const sizeMap = {
    small: 300,
    medium: 500,
    large: 600,
  };

  const textPositions = {
    top: { x: 0.5, y: 0.1 },
    bottom: { x: 0.5, y: 0.9 },
  };

  const strokeWidth = 2;

  const drawMeme = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const img = new Image();
    img.src = typeof image === "string" ? image : URL.createObjectURL(image);
    img.onload = () => {
      const width = sizeMap[size];
      const scale = width / img.width;
      const height = img.height * scale;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, 0, 0, width, height);

      const fontSize = Math.max(30, width / 15);
      ctx.font = `bold ${fontSize}px ${font}`;
      ctx.fillStyle = fontColor;
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = strokeWidth;
      ctx.textAlign = "center";

      ctx.fillText(topText, width * textPositions.top.x, height * textPositions.top.y);
      ctx.strokeText(topText, width * textPositions.top.x, height * textPositions.top.y);

      ctx.fillText(bottomText, width * textPositions.bottom.x, height * textPositions.bottom.y);
      ctx.strokeText(bottomText, width * textPositions.bottom.x, height * textPositions.bottom.y);

      // Watermark
      if (watermarkEnabled && watermarkText.trim()) {
        ctx.font = `14px ${font}`;
        ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
        ctx.textAlign = "right";

        let wmX = width - 10;
        let wmY = height - 10;

        if (watermarkPosition === "bottom-left") {
          ctx.textAlign = "left";
          wmX = 10;
          wmY = height - 10;
        } else if (watermarkPosition === "top-right") {
          wmX = width - 10;
          wmY = 20;
        } else if (watermarkPosition === "top-left") {
          ctx.textAlign = "left";
          wmX = 10;
          wmY = 20;
        }

        ctx.fillText(watermarkText, wmX, wmY);
      }
    };
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const toggleDarkMode = () => setDarkMode(!darkMode);

  return (
    <div className={`container ${darkMode ? "dark" : ""}`}>
      <h1>Meme Generator 😄</h1>

      <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} />

      <div className="inputs">
        <input
          type="text"
          placeholder="Top Text"
          value={topText}
          onChange={(e) => setTopText(e.target.value)}
        />
        <input
          type="text"
          placeholder="Bottom Text"
          value={bottomText}
          onChange={(e) => setBottomText(e.target.value)}
        />
        <select value={font} onChange={(e) => setFont(e.target.value)}>
          <option value="Impact">Impact</option>
          <option value="Comic Sans MS">Comic Sans</option>
          <option value="Arial Black">Arial Black</option>
        </select>
        <input type="color" value={fontColor} onChange={(e) => setFontColor(e.target.value)} />
        <input type="color" value={strokeColor} onChange={(e) => setStrokeColor(e.target.value)} />
        <select value={size} onChange={(e) => setSize(e.target.value)}>
          <option value="small">Small (300px)</option>
          <option value="medium">Medium (500px)</option>
          <option value="large">Large (600px)</option>
        </select>

        <label>
          <input
            type="checkbox"
            checked={watermarkEnabled}
            onChange={(e) => setWatermarkEnabled(e.target.checked)}
          />
          Enable Watermark
        </label>

        {watermarkEnabled && (
          <>
            <input
              type="text"
              placeholder="Watermark Text"
              value={watermarkText}
              onChange={(e) => setWatermarkText(e.target.value)}
            />
            <select value={watermarkPosition} onChange={(e) => setWatermarkPosition(e.target.value)}>
              <option value="bottom-right">Bottom Right</option>
              <option value="bottom-left">Bottom Left</option>
              <option value="top-right">Top Right</option>
              <option value="top-left">Top Left</option>
            </select>
          </>
        )}
      </div>

      <div className="buttons">
        <button onClick={drawMeme}>🎨 Generate Meme</button>
        <button onClick={handleDownload}>⬇️ Download Meme</button>
        <button onClick={toggleDarkMode}>{darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}</button>
      </div>

      <canvas ref={canvasRef} className="meme-canvas"></canvas>
    </div>
  );
}

export default App;
