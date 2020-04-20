import React, { useEffect, useRef, useState } from 'react';
import './App.css';
import { Rooms } from './tool/data/rooms'
import Creator from './tool/Creator'

const Tool = () => {
  const creationCanvas = useRef(null);
  const [creator, setCreator] = useState(null);

  useEffect(() => {
    const creator = new Creator(creationCanvas.current);
    setCreator(creator);

    creator.setBackgroundImage("https://www.roomsketcher.com/wp-content/uploads/2015/11/RoomSketcher-2-Bedroom-Floor-Plans.jpg");
    creator.setRooms(Rooms);
    creator.drawCanvas();
  }, []);

  return (
    <div className="tool-container">
        <canvas ref={creationCanvas} id="mainCanvas" width="600" height="600" style={{border: "1px solid #ccc", display: "inline-block", verticalAlign: "middle"}}></canvas>
        <div style={{display: "inline-block", width: "calc(100% - 800px)", verticalAlign: "middle", marginLeft: 100}}>
          <h1>Podstawowe narzędzie do rysowania mapy domu.</h1>
          <p style={{width: "70%"}}>Poruszając kursorem po płótnie możemy zaznaczać utworzone pomieszczenia i kasować je klikając PPM.  
            <br/><br/>
            Po kliknięciu w dowolnym miejscu zaczynamy budowę pokoju (stawiamy pierwszy punkt). Kursor dopasowuje swoją pozycję do pobliskich punktów (rogów utworzonych 
            już pomieszczeń). Poruszając kursorem widzimy ścianę, która powstanie po ponownym kliknięciu w wybranym miejscu.
            Ściana dopasowuje się (poziomo i pionowo) do pierwszego i ostatniego punktu (obecnie budowanego pokoju). Kursor również dopasowuje swoją pozycję do pobliskich 
            punktów, a dodatkowo podświetla wszystkie punkty znajdujące się w linii prostej (pionowo i poziomo) względem pozycji kursora. Klikając kursorem w miejsce bliskie
            pierwszego punktu, pomieszczenie zostaje zapisane, a my wracamy do punktu wyjścia. 
            <br/><br/>
            Podczas rysowania możemy usunąć ostatni naniesiony punkt klikając PPM. 
            <br/><br/>
            Dodatkowo zapisywana jest historia edycji (działają przyciski 'Undo'/'Redo') oraz możemy wyłączyć wyświetlanie naniesionego zdjęcia przyciskiem 'Toggle image'.
            <br/><br/>
            Klikając przycisk 'Change tool' możemy zmienić narzędzie na przesuwające obiektami. Poruszając kursorem możemy wybrać obiekt, który chcemy przenieść
            (zostanie on podświetlony). Możemy przenosić całe pomieszczenia, ściany i pojedyncze punkty. Aby przenieść obiekt należy najechać na niego, kliknąc dowolny przycisk
            myszy i nie puszczając go, przenieść kursor w wybrane miejsce.
          </p>
        </div>

        <br/>

        <button onClick={() => creator.toggleBackgroundImage()}>Toggle image</button>
        <button onClick={() => creator.setTool()}>Change tool</button>
        <button onClick={() => creator.undoCommand()}>Undo</button>
        <button onClick={() => creator.redoCommand()}>Redo</button>
    </div>
  );
}

export default Tool;
