const generateBtn = document.getElementById("generate-btn");

const PaletteContainer = document.querySelector(".pallet-container");

generateBtn.addEventListener("click", generatePalette);

const copyBtns = document.querySelectorAll(".copy-btn");
const colorContainers = document.querySelectorAll(".color");

for (const button of copyBtns) {
  button.addEventListener("click", copyText);
}

for (const colorContainer of colorContainers) {
  colorContainer.addEventListener("click", copyText);
}

function copyText() {
  const hexValue = this.parentElement.querySelector(".hex-value").textContent;
  navigator.clipboard.writeText(hexValue);
  this.parentElement.querySelector(".copy-btn").classList.add("active");
  // Bug — copyText breaks for swatch clicks. .color is a sibling of .color-info, not inside it, so this.parentElement when this is the swatch is .color-box, but when this is the icon it's .color-info. It happens to work now because .querySelector still finds .hex-value/.copy-btn from .color-box downward — but it's fragile. Safer: use this.closest(".color-box") in both cases.
}

function generatePalette() {
  for (const colorBox of PaletteContainer.children) {
    const generatedColor = generateHexa();
    colorBox.querySelector(".color").style.backgroundColor = generatedColor;
    colorBox.querySelector(".hex-value").textContent = generatedColor;
  }
}

// Returns a random hexaDecimal number
function generateHexa() {
  let hexaNumber = "#";
  for (let i = 0; i < 6; i++) {
    const randomColor = Math.floor(Math.random() * 16);
    // hexaNumber = hexaNumber.concat(randomColor.toString(16)); old
    hexaNumber += randomColor.toString(16); // works better

    //better approach: const generateHexa = () => "#" + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, "0");
  }

  return hexaNumber;
}
