/*
====================================================
🎯 CONTEXTE DU TP - EXERCICE DE REFACTO

Un ancien développeur (visiblement pressé... ou stagiaire 😬)
a rédigé ce code qui sépare les nombres pairs et impairs
d'un tableau, les trie, puis calcule leur moyenne.

Malheureusement, son code ne respecte AUCUNE bonne pratique :
- Noms de variables illisibles
- Répétition de code
- Mauvaise indentation
- Aucune gestion d’erreurs
- Aucun retour de valeur propre
- Logique difficile à comprendre
- Utilisation abusive des boucles imbriquées
- Code non commenté et peu maintenable

🧩 VOTRE MISSION :
1. Comprendre ce que fait ce code (bon courage).
2. Le **réécrire de manière propre, claire et optimisée** :
   - Variables bien nommées
   - Utilisation de `const` / `let`
   - Fonctions séparées pour chaque tâche (tri, calcul, affichage, etc.)
   - Utiliser les méthodes natives JavaScript (`filter`, `sort`, `reduce`, etc.)
   - Retourner un objet ou une structure propre au lieu de `console.log` bruts

💀 Bonus : rendre le code suffisamment clair pour qu’un autre étudiant puisse
le lire et le comprendre en moins de 30 secondes.
====================================================
*/

function separateEvenOdd(list) {
  const even = list.filter(num => num % 2 === 0);
  const odd = list.filter(num => num % 2 !== 0);
  return { even, odd };
}

function sortAscending(arr) {
  return arr.slice().sort((a, b) => a - b);
}

function sortDescending(arr) {
  return arr.slice().sort((a, b) => b - a);
}

function calculateAverage(arr) {
  if (arr.length === 0) return 0;
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

function analyzeNumbers(list) {
  try {
    if (!Array.isArray(list)) throw new Error("Erreur : l'entree doit etre un tableau de nombres");
    if (list.length === 0) throw new Error("Erreur : le tableau est vide");
    if (!list.every(n => typeof n === "number" && !isNaN(n))) {
      throw new Error("Erreur : le tableau doit contenir uniquement des nombres valides");
    }

    const { even, odd } = separateEvenOdd(list);
    const sortedEven = sortAscending(even);
    const sortedOdd = sortDescending(odd);
    const avgEven = calculateAverage(sortedEven);
    const avgOdd = calculateAverage(sortedOdd);

    return {
      evenNumbers: sortedEven,
      oddNumbers: sortedOdd,
      averageEven: avgEven,
      averageOdd: avgOdd
    };

  } catch (err) {
    console.error(err.message);
    return null;
  }
}

const result = analyzeNumbers([9, 3, 5, 2, 8, 10, 1, 4, 7]);
console.log(result);




