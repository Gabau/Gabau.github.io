import { useEffect, useState } from "react";
import { IDisposable, Terminal as TerminalObject } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css';

const TERMINAL_RED = '\x1B[31m';
const TERMINAL_NORMAL = '\x1B[0m';
const TERMINAL_GREEN = '\x1B[32m';

const leftKey = '\x1B[D';
const rightKey = '\x1B[C';
const upKey = '\x1B[A';
const downKey = '\x1B[B';
const hideCursor = '\x1b[?25l';
const showCursor = '\x1b[?25h'
class TerminalState {
  // history of data
  history: string[];
  prompt: (directory: string) => string;
  loaded: boolean;
  history_counter: number;
  current_prompt: string;
  cursor_location: number;
  constructor() {
    this.history = [];
    this.prompt = (dir) => {
      return dir + `${TERMINAL_RED}gabau${TERMINAL_NORMAL}@${TERMINAL_GREEN}playground${TERMINAL_NORMAL}$ `
    };
    this.loaded = false;
    this.current_prompt = "";
    this.history_counter = 0;
    this.cursor_location = 0;
  }

  onUpKey() { 
    if (this.history.length === 0) return "";
    const result = this.history[this.history.length - this.history_counter - 1];
    this.history_counter = Math.max(Math.min(this.history_counter + 1, this.history.length - 1), 0);
    return result;
  }

  onDownKey() {
    if (this.history.length === 0) return "";
    const result = this.history[this.history.length - this.history_counter - 1];
    this.history_counter = Math.max(Math.min(this.history_counter - 1, this.history.length - 1), 0);
    return result;
  }

  onEnter(val: string, terminal: TerminalObject) {
    if (val === 'clear') {
      terminal.clear();
      terminal.write(hideCursor);
      terminal.write('\r\x1b[2K');
      terminal.write(showCursor);
      terminal.write(this.prompt(""));
    } else {
      terminal.write(hideCursor);
      terminal.write('\r');
      terminal.write('\n');
      terminal.write(this.prompt(""));
      terminal.write(showCursor);
    }
    
    if (val !== "") this.history.push(val);
    this.current_prompt = "";
  }

  setLoaded() {
    this.loaded = true;
  }
};

function makeid(length: number) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  let counter = 0;
  while (counter < length) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
    counter += 1;
  }
  return result;
}


// A simple terminal emulator in the browser
// To emulate the feal of a terminal
export default function Terminal(
  // eslint-disable-next-line no-empty-pattern
  {}: {
    // When a command is enterred into the terminal
    onEnter?: (data: string) => void
  }
) {
  const [terminal] = useState(new TerminalState());
  const [id] = useState(makeid(10));
  const [terminalObject] = useState(new TerminalObject());
  const [stopListening, setDisposableOnKey] = useState<IDisposable | null>(null);

  function prompt() {

    terminal.onEnter((' ' + terminal.current_prompt).slice(1), terminalObject);
  }

  useEffect(() => {
    if (stopListening != null) {
      stopListening.dispose();
    }
    const item = terminalObject.onKey(key => {
      const char = key;
      // console.log(key);
      // console.log(char.key === "");
      if (char.key === upKey) {
        // clear current buffer and write the up key
        
        terminalObject.write(`\r${hideCursor}`);
        terminalObject.write('\x1b[2K');
        const val = terminal.onUpKey();
        terminal.current_prompt = val;
        terminalObject.write(terminal.prompt(""));
        terminalObject.write(val);
        terminalObject.write(showCursor);
        terminal.cursor_location = terminal.current_prompt.length;
        return;
      }
      if (char.key === downKey) {
        
        // clear current buffer and write the up key
        terminalObject.write(`\r${hideCursor}`);
        terminalObject.write('\x1b[2K');
        const val = terminal.onDownKey();
        terminal.current_prompt = val;
        
        terminalObject.write(terminal.prompt(""));
        
        terminal.cursor_location = terminal.current_prompt.length;
        terminalObject.write(val);
        
        terminalObject.write(showCursor);
        return;
      }
      if (char.key === leftKey) {
        if (terminal.cursor_location != 0) {
          terminalObject.write(char.key);
        }
        terminal.cursor_location = Math.max(terminal.cursor_location - 1, 0);
        return;
      }
      if (char.key === rightKey) {
        if (terminal.cursor_location != terminal.current_prompt.length) {
          terminalObject.write(char.key);
        }
        terminal.cursor_location = Math.min(terminal.cursor_location + 1, terminal.current_prompt.length);
        return;
      }
      if (char.key === '\x7f') {
        if (terminal.current_prompt !== "") {
          
          terminal.cursor_location -= 1;
          const first_half = terminal.current_prompt.substring(0, terminal.cursor_location);
          const second_half = terminal.current_prompt.substring(terminal.cursor_location + 1);
          terminal.current_prompt = first_half + second_half;
          terminalObject.write('\x1b[D\x1b[P');
        }
        return;
      }
      if (char.key === '\r') {
        terminal.cursor_location = 0;
        prompt();
        
      } else {
        
        terminalObject.write(char.key);
        terminal.cursor_location += 1;
        terminal.current_prompt += char.key;
      }
    });
    setDisposableOnKey(item);
    if (terminal.loaded) return;
    terminal.setLoaded();
    terminalObject.open(document.getElementById(id)!);
    terminalObject.clear();
    terminalObject.write(terminal.prompt(""));

  }, [terminalObject, id, terminal]);

  return (
    <div className="overflow-auto w-full h-full text-left">
  <div id={id}>
    
  </div>
  </div>)


}
