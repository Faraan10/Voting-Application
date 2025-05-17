/**
 * Calculate new ELO ratings for two players after a match
 * @param winnerRating The ELO rating of the winner before the match
 * @param loserRating The ELO rating of the loser before the match
 * @param kFactor The K-factor determines how much ratings change (default: 32)
 * @returns An object with the new ratings for both players
 */
export function calculateElo(
  winnerRating: number,
  loserRating: number,
  kFactor: number = 32
): { winnerNewRating: number; loserNewRating: number } {
  // Calculate the expected scores
  const expectedScoreWinner = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
  const expectedScoreLoser = 1 / (1 + Math.pow(10, (winnerRating - loserRating) / 400));

  // Calculate the new ratings
  const winnerNewRating = Math.round(winnerRating + kFactor * (1 - expectedScoreWinner));
  const loserNewRating = Math.round(loserRating + kFactor * (0 - expectedScoreLoser));

  return { winnerNewRating, loserNewRating };
}
