const generateBtn = document.getElementById("generate-btn");
const paletteContainer = document.getElementById("palette-container");

// Starting palette. Generated into the DOM on load so the markup
// only lives in one place (here), instead of being duplicated in HTML too.
const initialColors = ["#920092", "#924400", "#f0bcf0", "#005592", "#360092"];

init();

function init() {
  initialColors.forEach((hex) => {
    paletteContainer.appendChild(createColorBox(hex));
  });
}

function createColorBox(hex) {
  const box = document.createElement("div");
  box.className = "color-box";
  box.innerHTML = `
    <div class="color" style="background-color: ${hex}" tabindex="0" role="button" aria-label="Copy color ${hex}"></div>
    <div class="color-info">
      <span class="hex-value">${hex}</span>
      <i class="fa-solid fa-copy copy-btn" title="Copy to clipboard" aria-hidden="true"></i>
    </div>
  `;
  return box;
}

generateBtn.addEventListener("click", generatePalette);

// Event delegation: one listener on the container instead of one per
// swatch/icon. This also means newly generated boxes work automatically,
// with no need to re-attach listeners after generatePalette() runs.
paletteContainer.addEventListener("click", (event) => {
  const trigger = event.target.closest(".color, .copy-btn");
  if (trigger) copyText(trigger);
});

paletteContainer.addEventListener("keydown", (event) => {
  if (event.key !== "Enter" && event.key !== " ") return;
  const trigger = event.target.closest(".color");
  if (trigger) {
    event.preventDefault();
    copyText(trigger);
  }
});

function copyText(trigger) {
  const colorBox = trigger.closest(".color-box");
  const hexValue = colorBox.querySelector(".hex-value").textContent;
  const copyBtn = colorBox.querySelector(".copy-btn");

  navigator.clipboard
    .writeText(hexValue)
    .then(() => {
      copyBtn.classList.add("active");
      // Revert the checkmark back to the copy icon after a short delay.
      setTimeout(() => copyBtn.classList.remove("active"), 1500);
    })
    .catch((err) => {
      console.error("Could not copy text: ", err);
    });
}

function generatePalette() {
  for (const colorBox of paletteContainer.children) {
    const generatedColor = generateHexa();
    colorBox.querySelector(".color").style.backgroundColor = generatedColor;
    colorBox.querySelector(".hex-value").textContent = generatedColor;
  }
}

// Returns a random 6-digit hex color, e.g. "#a3f21c"
function generateHexa() {
  return (
    "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0")
  );
}

