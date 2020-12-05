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
    "en": {
        [Commands.TOGGLE]: {
            type: Commands.TOGGLE,
            name: "Toggle",
            description: "Toggles background blueprint visibility (if any photo uploaded).",
            image: "/toggleImageOff.svg"
        },
        [Commands.DRAW]: {
            type: Commands.DRAW,
            name: "Draw",
            description: "LPM: Add new room point <br/>LPM (on begining point): Finish room <br/>RPM (on room): Delete selected room <br/> RPM (while building): Remove added room point <br/>",
            image: "/drawRoom.svg"
        },
        [Commands.MOVE_ROOMS]: {
            type: Commands.MOVE_ROOMS,
            name: "Move rooms",
            description: "LPM drag (on room): Move selected room <br/>LPM drag (on wall): Move selected wall <br/>LPM drag (on point): Move selected point <br/>",
            image: "/moveRoom.svg"
        },
        [Commands.ADD_DEVICE]: {
            type: Commands.ADD_DEVICE,
            name: "Add device",
            description: "<table><tbody><tr><td>LPM:</td><td>Adds new device in selected place</td></tr><tr><td>RPM:</td><td>Removes selected device</td></tr></tbody></table>",
            image: "/addDevice.svg"
        },
        [Commands.MOVE_DEVICE]: {
            type: Commands.MOVE_DEVICE,
            name: "Move device",
            description: "LPM (drag): Moves selected device",
            image: "/moveDevice.svg"
        },
        [Commands.UNDO]: {
            type: Commands.UNDO,
            name: "Undo",
            description: "Undoes the last performed action.",
            image: "/undo.svg"
        },
        [Commands.REDO]: {
            type: Commands.REDO,
            name: "Redo",
            description: "Redoes the last performed action.",
            image: "/redo.svg"
        }
    },
    "pl": {
        [Commands.TOGGLE]: {
            type: Commands.TOGGLE,
            name: "Przełącz",
            description: "Zmiania widoczność załączonego schematu (jeśli był załączony).",
            image: "/toggleImageOff.svg"
        },
        [Commands.DRAW]: {
            type: Commands.DRAW,
            name: "Rysuj",
            description: "LPM: Dodaj nowy punkt do pomieszczenia <br/>LPM (na początku punktu): Skończ pomieszczenie <br/>RPM (na pokoju): Usuń zaznaczony pokój <br/> RPM (podczas tworzenia): Usuń dodany punkt pomieszczenia <br/>",
            image: "/drawRoom.svg"
        },
        [Commands.MOVE_ROOMS]: {
            type: Commands.MOVE_ROOMS,
            name: "Przenieś pomieszczenia",
            description: "LPM przeciągnięcie (na pokoju): Przenosi wybrany pokój <br/>LPM przeciągnięcie (na ścianie): Przesuwa zaznaczoną ścianę <br/>LPM przeciągnięcie (na punkcie): Przenosi zaznaczony punkt <br/>",
            image: "/moveRoom.svg"
        },
        [Commands.ADD_DEVICE]: {
            type: Commands.ADD_DEVICE,
            name: "Dodaj urządzenie",
            description: "<table><tbody><tr><td>LPM:</td><td>Dodaje nowe urządzenie w kliknięte miejsce</td></tr><tr><td>RPM:</td><td>Usuwa wybrane urządzenie</td></tr></tbody></table>",
            image: "/addDevice.svg"
        },
        [Commands.MOVE_DEVICE]: {
            type: Commands.MOVE_DEVICE,
            name: "Przenieś urządzenia",
            description: "LPM (przeciągnięcie): Przenosi wybrane urządzenie",
            image: "/moveDevice.svg"
        },
        [Commands.UNDO]: {
            type: Commands.UNDO,
            name: "Undo",
            description: "Cofa ostatnio wykonaną akcję",
            image: "/undo.svg"
        },
        [Commands.REDO]: {
            type: Commands.REDO,
            name: "Redo",
            description: "Ponawia ostatnio wykonaną akcję",
            image: "/redo.svg"
        }
    }
}