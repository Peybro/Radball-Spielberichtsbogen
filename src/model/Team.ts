import { v4 as uuidv4 } from "uuid";

type person = { firstName: string; lastName: string; licence: string };

export default class Team {
  private id: string;

  constructor(
    private name: string = "",
    private player1: person = { firstName: "", lastName: "", licence: "" },
    private player2: person = { firstName: "", lastName: "", licence: "" },
    private player3: person = { firstName: "", lastName: "", licence: "" }
  ) {
    this.id = uuidv4();
  }

  get Id() {
    return this.id;
  }

  get Name() {
    return this.name;
  }

  set Name(name: string) {
    this.name = name;
  }

  get Player1() {
    return this.player1;
  }

  set Player1(player1: person) {
    this.player1 = player1;
  }

  get Player2() {
    return this.player2;
  }

  set Player2(player2: person) {
    this.player2 = player2;
  }

  get Player3() {
    return this.player3;
  }

  set Player3(player3: person) {
    this.player3 = player3;
  }

  toString() {
    return {
      name: this.name,
      player1: this.player1,
      player2: this.player2,
      player3: this.player3,
    };
  }
}
