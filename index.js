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
    for (let i = 1; i < n-1; i++) {
        let sum = 0;
        for (let j = 1; j < n-1; j++) {
            sum += matrix_copy[i][j];
        }
        somme_criteres_ponderes.push(sum); // Average of the row
    }
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

function creerMatriceTelephonesCriteres(phones, criteres,criteres_ponderes) {
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
        let meilleurChoix = calculatePoid(matrice, criteres_ponderes);
        document.querySelector("#result").textContent = `Le meilleur choix est ${meilleurChoix}`;
    });
    tableDiv.appendChild(validateButton);

}

function calculatePoid(matrice_f,criteres_ponderes){

    n=matrice_f.length
    let total = []
    // let indice = 0
    
    let matrix_copy = matrice_f.map(row => row.slice()); // Crée une copie du tableau
    for (let i = 1; i < n; i++) {
        let sum_l=0
        for (let j = 1; j < n; j++) {
        matrix_copy[i][j] = matrix_copy[i][j]*criteres_ponderes[j-1] 
        sum_l = sum_l + matrix_copy[i][j]
        
        
        }
        total[i] = sum_l
    }
        let maxIndex = 1;
        let tot = total
        let maxValue = tot[1];
        for (let i = 2; i < tot.length; i++) {
            if (tot[i] > maxValue) {
                maxValue = tot[i];
                maxIndex = i;
            }
        }
        // Retrieve a div from the HTML to display the title and table
        let resultDiv = document.querySelector('#details');
        resultDiv.innerHTML = '<h2>Détails</h2>'; // Add a title

        // Create a table to display the matrix with the last column as "Total"
        let table = document.createElement('table');
        table.border = 1;

        // Add headers to the table
        let headerRow = document.createElement('tr');
        for (let j = 0; j < matrice_f[0].length; j++) {
            let th = document.createElement('th');
            th.textContent = matrice_f[0][j];
            headerRow.appendChild(th);
        }
        let totalHeader = document.createElement('th');
        totalHeader.textContent = 'Total du poids';
        headerRow.appendChild(totalHeader);
        table.appendChild(headerRow);

        // Add rows to the table
        for (let i = 1; i < matrice_f.length; i++) {
            let tr = document.createElement('tr');
            for (let j = 0; j < matrice_f[i].length; j++) {
            let td = document.createElement('td');
            td.textContent = matrice_f[i][j];
            tr.appendChild(td);
            }
            let totalCell = document.createElement('td');
            totalCell.textContent = total[i];
            tr.appendChild(totalCell);
            table.appendChild(tr);
        }

        // Append the table to the result div
        resultDiv.appendChild(table);

        return matrix_copy[maxIndex][0]; // Retourne le nom du téléphone avec le score le plus élevé
    

}

let echellePreferences = [[2,'Importance un peu moderee'], [3,'Importance modérée'],[4,'Importance un peu forte'], [5,'Importance forte'], [7,'Importance tres forte'], [9,'Importance extreme']];

let selectedPhones = [];
let selectedCriteria = [];

document.querySelector('#phones-confirm').addEventListener('click', function() {
    selectedPhones = Array.from(document.querySelectorAll('input[name="phones"]:checked'))
        .map(input => input.value);
});
let innerJoinDiv = document.querySelector('#echelle-preferences');


document.querySelector('#criteres-confirm').addEventListener('click', function() {

    document.getElementById('cache').style.display = 'block';
    selectedCriteria = Array.from(document.querySelectorAll('input[name="criteria"]:checked'))
        .map(input => input.value);

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
        let matrice_norm = matrix_norm(matrix);
        let criteresPonderes = criteres_ponderes(matrice_norm);
        let sommeCriteresPonderes = somme_criteres_ponderes(matrix, criteresPonderes);
        let coherenceI = coherence_i(criteresPonderes,sommeCriteresPonderes);
        let coherenceMax = coherence_max(coherenceI);
        let indiceCoherence = indice_coherence(coherenceMax,selectedCriteria.length);
        let tauxCoherence = taux_coherence(indiceCoherence,selectedCriteria.length);

        creerMatriceTelephonesCriteres(selectedPhones, selectedCriteria,criteresPonderes);

    
    });

});

