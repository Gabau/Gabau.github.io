/* eslint-disable @typescript-eslint/no-explicit-any */
// disabled as cannot find types for dragging
import { useCallback, useState } from "react";
import { Graphics } from "pixi.js";
import { Graphics as GraphicComponent } from '@pixi/react';
import { Stage, Sprite } from "@pixi/react";
import '@pixi/events';
type ChessPieceType = "pawn" | "queen" | "king" | "rook" | "bishop" | "knight";

type ChessPiece = {
  chess_type: ChessPieceType;
  // the location the piece is on the board
  x: number;
  y: number;
  color: "white" | "black";
  status: "alive" | "dead";

};

// assumes the chess piece is not dead
function getChessPiecePosition(w: number, h: number, chess_piece: ChessPiece) {
  const width = w / 8;
  const height = h / 8;
  return [chess_piece.x * width + width / 2, chess_piece.y * height + height / 2];
}

class ChessGameState {
  pieces: ChessPiece[];
  constructor() {
    this.pieces = [];
    // initialise the 8 pawns a side
    for (let i = 0; i < 8; ++i) {
      this.pieces.push({
        chess_type: "pawn",
        color: "white",
        x: i,
        y: 6,
        status: "alive"
      });
    }

    for (let i = 0; i < 8; ++i) {
      this.pieces.push({
        chess_type: "pawn",
        color: "black",
        x: i,
        y: 1,
        status: "alive"
      });
    }
    const values: ChessPieceType[] = ["rook", "knight", "bishop"];
    // push the bishops on both sides, the knights  and then the rooks
    for (let i = 0; i < 3; ++i) {
      this.pieces.push({
        chess_type: values[i],
        x: i,
        y: 0,
        color: 'black',
        status: 'alive'
      });
      this.pieces.push({
        chess_type: values[i],
        x: 7-i,
        y: 0,
        color: 'black',
        status: 'alive'
      });

      this.pieces.push({
        chess_type: values[i],
        x: i,
        y: 7,
        color: 'white',
        status: 'alive'
      });
      this.pieces.push({
        chess_type: values[i],
        x: 7-i,
        y: 7,
        color: 'white',
        status: 'alive'
      });
    }
    this.pieces.push({
      chess_type: 'king',
      x: 4,
      y: 0,
      color: 'black',
      status: 'alive'
    });
    this.pieces.push({
      chess_type: 'queen',
      x: 3,
      y: 0,
      color: 'black',
      status: 'alive'
    })

    this.pieces.push({
      chess_type: 'king',
      x: 4,
      y: 7,
      color: 'white',
      status: 'alive'
    });
    this.pieces.push({
      chess_type: 'queen',
      x: 3,
      y: 7,
      color: 'white',
      status: 'alive'
    })


  }
};

function ChessPieceSprite({ piece, dragEnd }: { piece: ChessPiece, dragEnd?: (x: number, y: number, sprite: any) => void }) {
  const v = piece;
  const baseUrl = "https://gabau.github.com/";
  const onDragStart = (event: any) => {
    const sprite = event.currentTarget as any;
    sprite.alpha = 0.5;
    sprite.data = event.data;
    sprite.dragging = true;
  };

  const onDragEnd = (event: any) => {
    const sprite = event.currentTarget as any;
    // check with the original position of the sprite
    // and update the original location of the sprite
    if (dragEnd) {
      // determine what to do witht his
      dragEnd(sprite.x, sprite.y, sprite);
    }

    sprite.alpha = 1;
    sprite.dragging = false;
    sprite.data = null;
  };

  const onDragMove = (event: any) => {
    const sprite = event.currentTarget as any;
    if (sprite.dragging) {
      const newPosition = sprite.data!.getLocalPosition(sprite.parent);
      sprite.x = newPosition.x;
      sprite.y = newPosition.y;
    }
  };

  return <Sprite image={`${baseUrl}/chess/${v.color}_${v.chess_type}.png`} 
    interactive={true}
    anchor={0.5}
    x={getChessPiecePosition(600, 600, v)[0]}
    y={getChessPiecePosition(600, 600, v)[1]}
    cursor="pointer"
    pointerdown={onDragStart}
    pointerup={onDragEnd}
    pointerupoutside={onDragEnd}
    pointermove={onDragMove}
/>
}


const Chess = () => {

  const [gameState] = useState(new ChessGameState());
  
  const draw = useCallback((g: Graphics) => {
    g.clear();
    const color1 = 0xe0cccc;
    const color2 = 0x696060;
    const width = 600 / 8;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        if ((i+j)%2 == 0) {
          g.beginFill(color1);
        } else {
          g.beginFill(color2);
        }
        g.drawRect(i * width, j * width, width, width);
      }
    }

  }, []);
  return (
    <Stage width={600} height={600} options={{ background: 0x1099bb }}>
      <GraphicComponent draw={draw} />
      {gameState.pieces.filter((v) => v.status !== "dead").map(v => {
        return <ChessPieceSprite key={v.x * 8 + v.y} piece={v} />
      })}
      {/* <Sprite image={bunnyUrl} x={300} y={150} />
      <Sprite image={bunnyUrl} x={500} y={150} />
      <Sprite image={bunnyUrl} x={400} y={200} />
      <Container x={200} y={200}>
        <Text
          text="Hello World"
          anchor={0.5}
          x={220}
          y={150}
          filters={[blurFilter]}
          style={
            new TextStyle({
              align: "center",
              fill: "0xffffff",
              fontSize: 50,
              letterSpacing: 20,
              dropShadow: true,
              dropShadowColor: "#E72264",
              dropShadowDistance: 6,
            })
          }
        /> */}
      {/* </Container> */}
    </Stage>
  );
};

export default Chess;
