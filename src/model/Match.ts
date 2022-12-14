import { v4 as uuidv4 } from "uuid";

export default class Match {
  private id: string;

  private halfTimeScoreTeam1: number;
  private halfTimeScoreTeam2: number;

  private finalScoreTeam1: number;
  private finalScoreTeam2: number;

  constructor(
    private team1Id: string,
    private team2Id: string,
    private referee?: string
  ) {
    this.id = uuidv4();
  }

  get Id() {
    return this.id;
  }

  set Id(id: string) {
    this.id = id;
  }

  get Referee() {
    return this.referee;
  }

  set Referee(referee: string) {
    this.referee = referee;
  }

  get Team1Id() {
    return this.team1Id;
  }

  set Team1Id(team1Id) {
    this.team1Id = team1Id;
  }

  get Team2Id() {
    return this.team2Id;
  }

  set Team2Id(team2Id) {
    this.team2Id = team2Id;
  }

  get HalfTimeScoreTeam1() {
    return this.halfTimeScoreTeam1;
  }

  set HalfTimeScoreTeam1(goalsTeam1: number) {
    this.halfTimeScoreTeam1 = goalsTeam1;
  }

  get HalfTimeScoreTeam2() {
    return this.halfTimeScoreTeam2;
  }

  set HalfTimeScoreTeam2(goalsTeam2: number) {
    this.halfTimeScoreTeam2 = goalsTeam2;
  }

  get FinalScoreTeam1() {
    return this.finalScoreTeam1;
  }

  set FinalScoreTeam1(goalsTeam1: number) {
    this.finalScoreTeam1 = goalsTeam1;
  }

  get FinalScoreTeam2() {
    return this.finalScoreTeam2;
  }

  set FinalScoreTeam2(goalsTeam2: number) {
    this.finalScoreTeam2 = goalsTeam2;
  }

  switchTeams() {
    const tempId = this.team1Id;
    this.team1Id = this.team2Id;
    this.team2Id = tempId;
  }

  toObject() {
    return {
      id: this.id,
      team1Id: this.team1Id,
      team2Id: this.team2Id,
      referee: this.referee,
      halfTimeScoreTeam1: this.halfTimeScoreTeam1,
      halfTimeScoreTeam2: this.halfTimeScoreTeam2,
      finalScoreTeam1: this.finalScoreTeam1,
      finalScoreTeam2: this.finalScoreTeam2,
    };
  }
}
