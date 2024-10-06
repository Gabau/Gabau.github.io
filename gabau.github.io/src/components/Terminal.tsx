import { useEffect, useState } from "react";
import { Terminal as TerminalObject } from "@xterm/xterm";
import '@xterm/xterm/css/xterm.css';
import useModals from "../hooks/useModals";

const TERMINAL_RED = '\x1B[31m';
const TERMINAL_NORMAL = '\x1B[0m';
const TERMINAL_GREEN = '\x1B[32m';

const leftKey = '\x1B[D';
const rightKey = '\x1B[C';
const upKey = '\x1B[A';
const downKey = '\x1B[B';
const hideCursor = '\x1b[?25l';
const showCursor = '\x1b[?25h';


class TerminalState {
  // history of data
  history: string[];
  prompt: (directory: string) => string;
  loaded: boolean;
  history_counter: number;
  current_prompt: string;
  cursor_location: number;
  root_dir: VirtualFile;
  current_dir: number;
  file_map: Map<number, VirtualFile>;
  max_file_id: number;
  open_file: (file: VirtualFile) => void;
  constructor() {
    this.history = [];
    this.prompt = (dir) => {
      return dir + `${TERMINAL_RED}gabau${TERMINAL_NORMAL}@${TERMINAL_GREEN}playground${TERMINAL_NORMAL}$ `
    };
    this.loaded = false;
    this.current_prompt = "";
    this.history_counter = 0;
    this.cursor_location = 0;
    this.root_dir = {
      parent: -1,
      id: -1,
      children: new Map<string, VirtualFile>(),
      name: "root",
      data: "",
      fileType: "directory"
    };
    this.file_map = new Map<number, VirtualFile>();
    this.file_map.set(-1, this.root_dir);
    this.current_dir = -1;
    this.max_file_id = 0;
    this.open_file = () => {};
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

  MkDir(flags: string[], terminal: TerminalObject) {
    if (flags.length <= 1) {
      terminal.write('\n\r');
      terminal.write('Insufficient arguments for mkdir');
      return;
    }
    const toCreate = flags[1].split("/");
    
    let current_dir = this.current_dir;
    if (flags[1].startsWith("/")) {
      current_dir = this.root_dir.id;
    }

    toCreate.forEach((dir) => {
      this.file_map.get(current_dir)?.children.set(dir, {
        parent: current_dir,
        id: this.max_file_id,
        children: new Map<string, VirtualFile>(),
        data: "",
        name: dir,
        fileType: "directory"
      });
      const v = this.file_map.get(current_dir)?.children.get(dir);
      if (v) {
        // update the file map
        this.file_map.set(this.max_file_id, 
          v);
      }
      
      current_dir = this.max_file_id;
      this.max_file_id += 1;

    })
  }

  // Open a file for writing
  Open(flags: string[], terminal: TerminalObject) {
    
    if (flags.length <= 1) {
      terminal.write('\n\r');
      terminal.write('Insufficient arguments for cd');
      return;
    }
    const target_dir = flags[1];
    let current_dir = this.current_dir;
    if (target_dir.startsWith('/')) {
      // absolute path
      current_dir = this.root_dir.id;
    }
    const m = target_dir.split("/");
    for (let i = 0; i < m.length; ++i) {
      // move up
      if (m[i] === '..') {
        current_dir = this.file_map.get(current_dir)?.parent ?? current_dir;
        continue;
      }
      const tmp = this.file_map.get(current_dir)?.children.get(m[i].trim())?.id;
      if (tmp !== undefined) {
        current_dir = tmp;
      }
    }
    const v = this.file_map.get(current_dir);
    if (v) this.open_file(v);
  }

  Cd(flags: string[], terminal: TerminalObject) {
    if (flags.length <= 1) {
      terminal.write('\n\r');
      terminal.write('Insufficient arguments for open');
      return;
    }
    const target_dir = flags[1];
    let current_dir = this.current_dir;
    if (target_dir.startsWith('/')) {
      // absolute path
      current_dir = this.root_dir.id;
    }

    
    const m = target_dir.split("/");
    for (let i = 0; i < m.length; ++i) {
      // move up
      if (m[i] === '..') {
        current_dir = this.file_map.get(current_dir)?.parent ?? current_dir;
        continue;
      }
      const tmp = this.file_map.get(current_dir)?.children.get(m[i].trim())?.id;
      if (tmp !== undefined) {
        current_dir = tmp;
      }
    }
    this.current_dir = current_dir;
    

  }

  Help(terminal: TerminalObject) {
    terminal.write(`\n\rSimple unix-like terminal with basic commands
      \r\tls List the current directory
      \r\tcd Change directories [target directory]
      \r\tmkdir Make a directory
      \r\topen Opens a directory for writing
      \r\tMore to come`);
  }

  Ls(_: string[], terminal: TerminalObject) {
    const current_dir = this.file_map.get(this.current_dir);
    if (current_dir) {
    
      for (const [name, file] of current_dir.children.entries()) {
        if (file.fileType === 'directory') {
          terminal.write(`\n\r${TERMINAL_GREEN}${name}${TERMINAL_NORMAL}`);
        } else {
          terminal.write('\n\r${name}');
        }
      }
    }
  }

  onEnter(val: string, terminal: TerminalObject) {
    const tokens = val.split(" ").map((v) => v.trim());
    if (tokens.length !== 0) {

      switch (tokens[0]) {
        case 'mkdir':
          // create a directory
          this.MkDir(tokens, terminal);
          break;
        case 'cd':
          this.Cd(tokens, terminal);
          break;
        case 'ls':
          this.Ls(tokens, terminal);
          break;
        case 'help':
          this.Help(terminal);
          break;
        case 'open':
          this.Open(tokens, terminal);
          break;

      }
  
    }


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
  const { setModalType } = useModals();

  function prompt() {

    terminal.onEnter((' ' + terminal.current_prompt).slice(1), terminalObject);
  }

  useEffect(() => {
    
    if (terminal.loaded) return;
    terminal.open_file = (f) => {
      setModalType("editor", { virt_file: f });
    };
    terminal.setLoaded();
    terminalObject.open(document.getElementById(id)!);
    terminalObject.clear();
    terminalObject.write(terminal.prompt(""));
    terminalObject.onKey(key => {
      const char = key;
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
        terminal.history_counter = 0;
        prompt();
        
      } else {
        
        terminalObject.write(char.key);
        
        if (terminal.cursor_location < terminal.current_prompt.length) {
          terminal.current_prompt = terminal.current_prompt.substring(0, terminal.cursor_location) + char.key + terminal.current_prompt.substring(terminal.cursor_location + 1);
        } else {
          terminal.current_prompt += char.key;
        }
        terminal.cursor_location += 1;
      }
    });
  }, [terminalObject, id, terminal]);

  return (
    <div className="overflow-auto w-full h-full text-left">
  <div id={id}>
    
  </div>
  </div>)


}
