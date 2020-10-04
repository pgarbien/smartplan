export enum Commands {
    TOGGLE,
    DRAW,
    MOVE_ROOMS,
    ADD_DEVICE,
    MOVE_DEVICE,
    MANAGE,
    UNDO,
    REDO
}

export const commandsDescription = {
    [Commands.TOGGLE]: {
        type: Commands.TOGGLE,
        name: "Toggle",
        description: "Toggles background blueprint visibility (if any photo uploaded)."
    },
    [Commands.DRAW]: {
        type: Commands.DRAW,
        name: "Draw",
        description: "LPM: Add new room point <br/>LPM (on begining point): Finish room <br/>RPM (on room): Delete selected room <br/> RPM (while building): Remove added room point <br/>"
    },
    [Commands.MOVE_ROOMS]: {
        type: Commands.MOVE_ROOMS,
        name: "Move rooms",
        description: "LPM drag (on room): Move selected room <br/>LPM drag (on wall): Move selected wall <br/>LPM drag (on point): Move selected point <br/>"
    },
    [Commands.ADD_DEVICE]: {
        type: Commands.ADD_DEVICE,
        name: "Add device",
        description: "LPM: Adds new device in selected place <br/> RPM: Removes selected device"
    },
    [Commands.MOVE_DEVICE]: {
        type: Commands.MOVE_DEVICE,
        name: "Move device",
        description: "LPM (drag): Moves selected device"
    },
    [Commands.UNDO]: {
        type: Commands.UNDO,
        name: "Undo",
        description: "Undoes the last performed action."
    },
    [Commands.REDO]: {
        type: Commands.REDO,
        name: "Redo",
        description: "Redoes the last performed action."
    }
}