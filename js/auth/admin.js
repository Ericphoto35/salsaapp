const userTable = document.getElementById('userTable');
const tbody = userTable.querySelector('tbody');
const myHeaders = new Headers();
const token = getToken();
myHeaders.append("X-AUTH-TOKEN", token);
const requestOptions = {
  method: "GET",
  headers: myHeaders,
  redirect: "follow"
};

fetch("http://127.0.0.1:8000/api/users", requestOptions)
.then(response => response.json())
.then(data => {
    data.forEach(user => {
        // Récupérer le premier rôle du tableau (ou une chaîne vide si le tableau est vide)
        const userRole = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : '';

        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.username}</td>
            <td class="role-cell">${userRole}</td>
            <td><button class="edit-btn" data-id="${user.id}">Modifier</button></td>
        `;
        tbody.appendChild(row);

        const editBtn = row.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => editUserRole(user, row));
    });
})
.catch(error => {
    console.error('Error fetching user data:', error);
});

function editUserRole(user, row) {
    const roleCell = row.querySelector('.role-cell');
    const currentRole = Array.isArray(user.roles) && user.roles.length > 0 ? user.roles[0] : '';

    // Créer un select pour choisir le nouveau rôle
    const selectRole = document.createElement('select');
    selectRole.innerHTML = `
        <option value="ROLE_USER" ${currentRole === 'ROLE_USER' ? 'selected' : ''}>ROLE_USER</option>
        <option value="ROLE_ADMIN" ${currentRole === 'ROLE_ADMIN' ? 'selected' : ''}>ROLE_ADMIN</option>
        <option value="ROLE_DEBUTANT" ${currentRole === 'ROLE_DEBUTANT' ? 'selected' : ''}>ROLE_DEBUTANT</option>
        <option value="ROLE_INTER" ${currentRole === 'ROLE_INTER' ? 'selected' : ''}>ROLE_INTER</option>
        <option value="ROLE_AVANCE" ${currentRole === 'ROLE_AVANCE' ? 'selected' : ''}>ROLE_AVANCE</option>
    `;

    // Remplacer le texte du rôle par le select
    roleCell.textContent = '';
    roleCell.appendChild(selectRole);

    // Créer un bouton de sauvegarde
    const saveBtn = document.createElement('button');
    saveBtn.textContent = 'Enregistrer';
    saveBtn.addEventListener('click', () => saveUserRole(user.id, selectRole.value, roleCell));

    // Ajouter le bouton de sauvegarde
    roleCell.appendChild(saveBtn);
}

function saveUserRole(userId, newRole, roleCell) {
    const saveHeaders = new Headers(myHeaders);
    saveHeaders.append('Content-Type', 'application/json');

    fetch(`http://127.0.0.1:8000/api/users/${userId}`, {
        method: 'PATCH',
        headers: saveHeaders,
        body: JSON.stringify({ role: newRole })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Erreur lors de la mise à jour du rôle');
        }
        return response.json();
    })
    .then(updatedUser => {
        // Mettre à jour l'affichage
        roleCell.textContent = updatedUser.role;
    })
    .catch(error => {
        console.error('Erreur lors de la mise à jour du rôle:', error);
        roleCell.textContent = 'Erreur lors de la mise à jour';
    });
}
