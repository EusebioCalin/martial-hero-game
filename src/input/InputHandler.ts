import Phaser from 'phaser';
import { InputState, PlayerIndex } from '../types';

type KeyBindings = {
  left: Phaser.Input.Keyboard.Key;
  right: Phaser.Input.Keyboard.Key;
  jump: Phaser.Input.Keyboard.Key;
  attack1: Phaser.Input.Keyboard.Key;
  attack2: Phaser.Input.Keyboard.Key;
};

const P1_BINDINGS = {
  left:    Phaser.Input.Keyboard.KeyCodes.A,
  right:   Phaser.Input.Keyboard.KeyCodes.D,
  jump:    Phaser.Input.Keyboard.KeyCodes.W,
  attack1: Phaser.Input.Keyboard.KeyCodes.G,
  attack2: Phaser.Input.Keyboard.KeyCodes.H,
};

const P2_BINDINGS = {
  left:    Phaser.Input.Keyboard.KeyCodes.LEFT,
  right:   Phaser.Input.Keyboard.KeyCodes.RIGHT,
  jump:    Phaser.Input.Keyboard.KeyCodes.UP,
  attack1: Phaser.Input.Keyboard.KeyCodes.K,
  attack2: Phaser.Input.Keyboard.KeyCodes.L,
};

export class InputHandler {
  private keys: KeyBindings;

  constructor(scene: Phaser.Scene, playerIndex: PlayerIndex) {
    const km = scene.input.keyboard!;
    const bindings = playerIndex === 0 ? P1_BINDINGS : P2_BINDINGS;
    this.keys = {
      left:    km.addKey(bindings.left),
      right:   km.addKey(bindings.right),
      jump:    km.addKey(bindings.jump),
      attack1: km.addKey(bindings.attack1),
      attack2: km.addKey(bindings.attack2),
    };
  }

  getState(): InputState {
    return {
      left:    this.keys.left.isDown,
      right:   this.keys.right.isDown,
      jump:    Phaser.Input.Keyboard.JustDown(this.keys.jump),
      attack1: Phaser.Input.Keyboard.JustDown(this.keys.attack1),
      attack2: Phaser.Input.Keyboard.JustDown(this.keys.attack2),
    };
  }
}
