const fs = require('fs/promises');

/**
 * Lis le fichier players.json et renvoie la liste des joueurs.
 * 
 * @async
 * @function loadPlayers
 * @returns {Promise<Array>} Retourne un tableau d'objets representant les joueurs
 * @throws {Error} Si le fichier ne peut pas etre lu ou que le JSON est invalide
 */
async function loadPlayers() {
  try {
    const data = await fs.readFile('./players.json', 'utf-8');
    return JSON.parse(data);
  } catch (err) {
    throw new Error('Erreur lors du chargement du fichier players.json');
  }
}

/**
 * Calcule le taux de victoire d'un joueur.
 * 
 * @param {Object} player - Objet representant le joueur
 * @param {number} player.matches - Nombre total de matchs joues
 * @param {number} player.wins - Nombre de matchs gagnes
 * @returns {number} Le pourcentage de victoire
 * @throws {Error} Si les donnees du joueur sont invalides
 */
function calculateWinRate(player) {
  if (!player || typeof player.matches !== 'number' || typeof player.wins !== 'number') {
    throw new Error('Donnees du joueur invalides');
  }
  return player.matches === 0 ? 0 : (player.wins / player.matches) * 100;
}

/**
 * Calcule la moyenne d'heures jouees par semaine.
 * 
 * @param {Object} player - Objet representant le joueur
 * @param {number} totalWeeks - Nombre total de semaines
 * @returns {number} Moyenne d'heures jouees par semaine
 * @throws {Error} Si le nombre de semaines est invalide
 * 
 * @example
 * const player = { hoursPlayed: 120 };
 * const avg = calculateAverageHours(player, 8);
 * console.log(avg); // 15
 */
function calculateAverageHours(player, totalWeeks) {
  if (typeof totalWeeks !== 'number' || totalWeeks <= 0) {
    throw new Error('Nombre de semaines invalide');
  }
  return player.hoursPlayed / totalWeeks;
}

/**
 * Analyse les statistiques de tous les joueurs et retourne un tableau avec leurs performances.
 * 
 * @async
 * @function analyzePlayerStats
 * @param {number} [totalWeeks=12] - Nombre total de semaines
 * @returns {Promise<Array>} Tableau contenant les statistiques de chaque joueur
 * @throws {Error} Si le chargement des joueurs echoue
 * 
 * @example
 * const stats = await analyzePlayerStats(10);
 * console.log(stats);
 */
async function analyzePlayerStats(totalWeeks = 12) {
  const players = await loadPlayers();

  return players.map(p => ({
    id: p.id,
    name: p.name,
    winRate: calculateWinRate(p),
    avgHours: calculateAverageHours(p, totalWeeks)
  }));
}

/**
 * Trouve le joueur ayant le meilleur taux de victoire.
 * 
 * @async
 * @function findTopPlayer
 * @returns {Promise<Object>} L'objet representant le meilleur joueur
 * @throws {Error} Si aucune donnee n'est disponible
 * 
 * @example
 * const top = await findTopPlayer();
 * console.log(top);
 */
async function findTopPlayer() {
  const stats = await analyzePlayerStats();
  return stats.reduce((best, current) => current.winRate > best.winRate ? current : best);
}

/**
 * Genere un rapport global base sur les statistiques de tous les joueurs.
 * 
 * @async
 * @function generateGlobalReport
 * @returns {Promise<Object>} Un objet contenant les statistiques globales
 * @throws {Error} Si les donnees sont invalides ou absentes
 * 
 * @example
 * const report = await generateGlobalReport();
 * console.log(report);
 */
async function generateGlobalReport() {
  const stats = await analyzePlayerStats();
  const totalWinRate = stats.reduce((sum, p) => sum + p.winRate, 0);
  const totalHours = stats.reduce((sum, p) => sum + p.avgHours, 0);
  const mostActive = stats.reduce((a, b) => a.avgHours > b.avgHours ? a : b);

  return {
    averageWinRate: totalWinRate / stats.length,
    averageHours: totalHours / stats.length,
    mostActivePlayer: mostActive.name
  };
}

/**
 * Sauvegarde un rapport dans un fichier JSON.
 * 
 * @async
 * @function saveReport
 * @param {Object} report - Rapport a sauvegarder
 * @returns {Promise<boolean>} Retourne true si l'ecriture reussit
 * @throws {Error} Si l'ecriture du fichier echoue
 * 
 * @example
 * const success = await saveReport(report);
 * console.log(success); // true
 */
async function saveReport(report) {
  const json = JSON.stringify(report, null, 2);
  await fs.writeFile('./report.json', json, 'utf-8');
  return true;
}

/**
 * Fonction principale du programme.
 * Genere les statistiques, trouve le meilleur joueur et sauvegarde le rapport.
 */
async function main() {
  const stats = await analyzePlayerStats(10);
  const top = await findTopPlayer();
  const report = await generateGlobalReport();

  await saveReport({ stats, topPlayer: top, global: report });

  console.log('Rapport cree avec succes !');
  console.log(`Top joueur : ${top.name} (${top.winRate.toFixed(1)}% de victoires)`);
  console.log(`Taux de victoire moyen : ${report.averageWinRate.toFixed(2)}%`);
  console.log(`Joueur le plus actif : ${report.mostActivePlayer}`);
}

main();