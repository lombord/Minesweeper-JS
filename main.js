import { Field } from "./scripts/field.js";

/**
 * Main function to control the game
 */
function main() {
  const field = new Field(9, 9, 10);
  console.dir(field);
  document.getElementById("settingsForm").addEventListener("submit", (ev) => {
    ev.preventDefault();
    const {
      size: { value: size },
      mines: { value: mines },
    } = ev.target;
    field.setSettings(size, size, mines);
  });
}

main();
