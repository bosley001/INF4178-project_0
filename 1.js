// choix d'alternatives
// criters
// echelle de preference relatives au criteres
// 1 Importance egale , 3 Importance modérée , 5 Importance forte, 7 Importance tres forte , 9 Importance extreme
// 2, 4, 6, 8 Importance intermédiaire entre les valeurs ci-dessus
// valeur inverse 1/3 , 1/5 , 1/7 , 1/9




function matrix_norm (matrix) {
    let n = matrix.length;
    let matrix_copy = matrix.map(row => row.slice()); // Create a copy of the matrix
    let matrix_norm = matrix_copy.map(row => row.slice()); // Create another copy for normalization
    for (let i = 1; i < n; i++) {
        for (let j = 1; j < n-1; j++) {
            matrix_norm[i][j] = matrix_copy[i][j] / matrix_copy[n - 1][j];
        }
    }
    return matrix_norm;
}

function criteres_ponderes(matrix_norm) {
    let n = matrix_norm.length;
    let criteres_ponderes = [];
    for (let i = 1; i < n-1; i++) {
        let sum = 0;
        for (let j = 1; j < n-1; j++) {
            sum += matrix_norm[i][j];
        }
        criteres_ponderes.push(sum/(n-2)); // Average of the row
    }
    return criteres_ponderes;
}

function somme_criteres_ponderes(matrix,criteres) {
    let n = matrix.length;
    let somme_criteres_ponderes = [];
    let matrix_copy = matrix.map(row => row.slice()); // Crée une copie du tableau
    for (let i = 1; i < n-1; i++) {
        for (let j = 1; j < n-1; j++) {
            p = matrix_copy[i][j]
            matrix_copy[i][j]=p* criteres[j-1]; // Multiply the matrix by the normalized matrix
        }
    }
    console.log('matrice copie ',matrix_copy);
    for (let i = 1; i < n-1; i++) {
        let sum = 0;
        for (let j = 1; j < n-1; j++) {
            sum += matrix_copy[i][j];
        }
        somme_criteres_ponderes.push(sum); // Average of the row
    }
    // somme_criteres_ponderes = criteres_ponderes(matrix_copy);
    return somme_criteres_ponderes;
}

function coherence_i(criteres_ponderes,somme_criteres_ponderes){
    let n = criteres_ponderes.length;
    let coherence_i = [];
    for (let i = 0; i < n; i++) {
        coherence_i[i] = somme_criteres_ponderes[i] / criteres_ponderes[i];
    }
    return coherence_i;
}

function coherence_max(coherence_i){
    let n = coherence_i.length;
    let coherence_max = 0;
    for (let i = 0; i < n; i++) {
        coherence_max = coherence_max + coherence_i[i];
    }
    return coherence_max/n;
}

function indice_coherence(coherence_max,n){
    return (coherence_max - n) / (n - 1);
}

function taux_coherence(indice_c,n){
    return indice_c / n;

}

function creerMatriceTelephonesCriteres(phones, criteres) {
    // Créer une matrice vide
    let n = phones.length + 1; // +1 pour inclure les en-têtes
    let m = criteres.length + 1; // +1 pour inclure les en-têtes
    let matrice = Array.from({ length: n }, () => Array(m).fill(null));

    // Remplir la première ligne avec les critères
    for (let j = 1; j < m; j++) {
        matrice[0][j] = criteres[j - 1];
    }

    // Remplir la première colonne avec les téléphones
    for (let i = 1; i < n; i++) {
        matrice[i][0] = phones[i - 1];
    }

    // Afficher la matrice sous forme de tableau HTML
    let tableDiv = document.querySelector('#table-container'); // Assurez-vous d'avoir un div avec cet ID dans votre HTML
    tableDiv.innerHTML = ''; // Réinitialiser le contenu du div
    let table = document.createElement('table');
    table.border = 1;

    matrice.forEach((row, i) => {
        let tr = document.createElement('tr');
        row.forEach((cell, j) => {
            let td = document.createElement(i === 0 || j === 0 ? 'th' : 'td');
            if (i === 0 || j === 0) {
                td.textContent = cell; // En-têtes
            } else {
                let input = document.createElement('input');
                input.type = 'number';
                input.min = 0;
                input.addEventListener('input', function () {
                    matrice[i][j] = parseFloat(input.value); // Mettre à jour la matrice
                });
                td.appendChild(input);
            }
            tr.appendChild(td);
        });
        table.appendChild(tr);
    });

    tableDiv.appendChild(table);

    // Ajouter un bouton pour valider et afficher la matrice remplie
    let validateButton = document.createElement('button');
    validateButton.textContent = 'Valider';
    validateButton.addEventListener('click', function () {
        console.log('Matrice remplie :', matrice);
    });
    tableDiv.appendChild(validateButton);
}

// Exemple d'utilisation
// document.querySelector('#generate-matrix').addEventListener('click', function () {
//     creerMatriceTelephonesCriteres(selectedPhones, selectedCriteria);
// });



let echellePreferences = [[1,'Importance egale'],[2,'moyen'], [3,'Importance modérée'],[4,'moyen'], [5,'Importance forte'], [7,'Importance tres forte'], [9,'Importance extreme']];


let selectedPhones = [];
let selectedCriteria = [];

document.querySelector('#phones-confirm').addEventListener('click', function() {
    selectedPhones = Array.from(document.querySelectorAll('input[name="phones"]:checked'))
        .map(input => input.value);
    console.log(selectedPhones); 
});
let innerJoinDiv = document.querySelector('#echelle-preferences');


document.querySelector('#criteres-confirm').addEventListener('click', function() {
    selectedCriteria = Array.from(document.querySelectorAll('input[name="criteria"]:checked'))
        .map(input => input.value);
    console.log(selectedCriteria); // Send this data to your JS logic

    // Create a matrix of size (n+1) x n
    let n = selectedCriteria.length + 1;
    let matrix = Array.from({ length: n }, () => Array(n).fill(null));

    // Fill the first row and first column with selectedCriteria
    for (let i = 1; i < n; i++) {
        matrix[i][0] = selectedCriteria[i - 1];
        matrix[0][i] = selectedCriteria[i - 1];
    }

    // Generate the preference selection UI
    selectedCriteria.forEach((elt, index) => {
        selectedCriteria.forEach((elts, indexs) => {
            if (index < indexs) {
                let paragraph = document.createElement('p');
                paragraph.innerHTML = `Le critère ${elt} a une <select id="preference-${index}-${indexs}"><option>choisir---</option>
                    ${echellePreferences.map(pref => `<option value="${pref[0]}">${pref[1]}</option>`).join('')}
                </select> que le critère ${elts}`;
                innerJoinDiv.appendChild(paragraph);

                // Add event listener to update the matrix when a preference is selected
                paragraph.querySelector('select').addEventListener('change', function(event) {
                    let preferenceValue = parseInt(event.target.value);
                    matrix[index + 1][indexs + 1] = preferenceValue;
                    matrix[indexs + 1][index + 1] = 1 / preferenceValue; // Set the inverse value in the lower diagonal
                    // console.log(matrix); // Log the updated matrix
                });
            }
        });
    });
    document.querySelector('#valider').addEventListener('click', function() {
        for (let i = 1; i < n; i++) {
            matrix[i][i] = 1; // Set diagonal to 1
        }
        // Add a last row to the matrix
        let lastRow = Array(n).fill(0);
        lastRow[0] = 'Somme'; // Label for the first column

        for (let j = 1; j < n; j++) {
            let columnSum = 0;
            for (let i = 1; i < n; i++) {
                columnSum += matrix[i][j];
            }
            lastRow[j] = columnSum; // Sum of the column
        }
   
        matrix.push(lastRow); // Append the last row to the matrix
        console.log('matrice ',matrix);
        // console.log('valeur de lindice finale');
        let matrice_norm = matrix_norm(matrix);
        console.log('matrice normalisée ',matrice_norm);
        let criteresPonderes = criteres_ponderes(matrice_norm);
        console.log('criteres ponderes ',criteresPonderes);
        let sommeCriteresPonderes = somme_criteres_ponderes(matrix, criteresPonderes);
        console.log('somme criteres ponderes ',sommeCriteresPonderes);
        let coherenceI = coherence_i(criteresPonderes,sommeCriteresPonderes);
        console.log('coherence i ',coherenceI);
        let coherenceMax = coherence_max(coherenceI);
        console.log('coherence max ',coherenceMax);
        let indiceCoherence = indice_coherence(coherenceMax,selectedCriteria.length);
        let tauxCoherence = taux_coherence(indiceCoherence,selectedCriteria.length);
        console.log('taux coherence ',tauxCoherence);
        // let k = taux_coherence(indice_coherence(coherence_max(coherence_i(criteres_ponderes(matrix_norm(matrix)),somme_criteres_ponderes(matrix,matrix_norm(matrix)))),selectedCriteria.length),selectedCriteria.length);
        // console.log(k)
        // if(tauxCoherence){}
        creerMatriceTelephonesCriteres(selectedPhones, selectedCriteria);
    
    });

     // Initial matrix
});


// #echelle-preferences
