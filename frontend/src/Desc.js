import React, { useEffect, useRef } from 'react';
import './Desc.css';

function wrapText(context, text, x, y, maxWidth, lineHeight) {
    var words = text.split(' ');
        var line = '';

        for(var n = 0; n < words.length; n++) {
          var testLine = line + words[n] + ' ';
          var metrics = context.measureText(testLine);
          var testWidth = metrics.width;
          if (testWidth > maxWidth && n > 0) {
            context.fillText(line, x, y);
            line = words[n] + ' ';
            y += lineHeight;
          }
          else {
            line = testLine;
          }
        }
        context.fillText(line, x, y);
}

const Desc = () => {
    const descCanvas = useRef(null);

    useEffect(() => {
        const canv = descCanvas.current
        const ctx = canv.getContext("2d")
        var maxWidth = 200
        var lineHeight = 25
        var x = (canv.width - maxWidth) / 2
        var y = 60
        var text = "Poruszając kursorem po płótnie możemy zaznaczać utworzone pomieszczenia i kasować je klikając PPM." + 
                    "Dodatkowo zapisywana jest historia edycji (działają przyciski 'Undo'/'Redo') oraz możemy wyłączyć wyświetlanie naniesionego zdjęcia przyciskiem 'Toggle image'."
        ctx.font = "lighter 14px Arial"
        ctx.fillStyle = "#00d051"
        wrapText(ctx, text, x, y, maxWidth, lineHeight);
    })

    return(
        <div className="description">
              <h3>Podstawowe narzędzie do rysowania mapy domu.</h3>
                <canvas className="canvas" ref={descCanvas} id="canvas" height="400px" width="250px"></canvas>
        </div>
    );
}

export default Desc;