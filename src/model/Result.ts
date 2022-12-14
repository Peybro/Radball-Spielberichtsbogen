import {v4 as uuidv4} from "uuid";

export default class Result {
    private readonly id: string;

    constructor(
        private team: string,
        private games: number,
        private wins: number,
        private ties: number,
        private loses: number,
        private goals: number,
        private conceded: number
    ) {
        this.id = uuidv4();
    }

    get Id() {
        return this.id;
    }

    get Team() {
        return this.team;
    }

    get Games() {
        return this.games;
    }

    get Wins() {
        return this.wins;
    }

    get Ties() {
        return this.ties;
    }

    get Loses() {
        return this.loses;
    }

    get Points() {
        return this.wins * 3 + this.ties;
    }

    get Goals() {
        return this.goals;
    }

    get Conceded() {
        return this.conceded;
    }

    get Difference() {
        return this.goals - this.conceded;
    }
}
