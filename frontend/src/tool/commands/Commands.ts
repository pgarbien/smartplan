export enum Commands {
    DRAW,
    MOVE_ROOMS,
    ADD_DEVICE,
    MOVE_DEVICE,
    MANAGE
}

export const commandsDescription = {
  "toggle": {
    name: "Toggle",
    description: "Toggles background blueprint visibility (if any photo uploaded)."
  },
  "draw": {
    name: "Draw",
    description: "LPM: Add new room point <br/>LPM (on begining point): Finish room <br/>RPM (on room): Delete selected room <br/> RPM (while building): Remove added room point <br/>"
  },
  "move": {
    name: "Move",
    description: "LPM drag (on room): Move selected room <br/>LPM drag (on wall): Move selected wall <br/>LPM drag (on point): Move selected point <br/>"
  },
  "add_device": {
    name: "Add device",
    description: "LPM: Adds new device in selected place <br/> RPM: Removes selected device"
  },
  "move_device": {
    name: "Move device",
    description: "LPM (drag): Moves selected device"
  },
  "undo": {
    name: "Undo",
    description: "Undoes the last performed action."
  },
  "redo": {
    name: "Redo",
    description: "Redoes the last performed action."
  }
}