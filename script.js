document.addEventListener('DOMContentLoaded', function() {
    const addBtn = document.querySelector('.add');
    const mobilesTableBody = document.getElementById('mobiles-table-body');

    // Load saved data from localStorage
    const savedMobilesData = JSON.parse(localStorage.getItem('mobilesData')) || [];
    savedMobilesData.forEach(mobile => addMobileRow(mobile, false));

    addBtn.addEventListener('click', function() {
        addMobileRow({mobile: '', price: '', ram: '', storage: ''}, true);
    });

    function addMobileRow(mobileData, isNew) {
        const newRow = document.createElement('tr');

        newRow.innerHTML = `
            <td><input type="text" class="form-control" value="${mobileData.mobile}"></td>
            <td><input type="text" class="form-control" value="${mobileData.price}"></td>
            <td><input type="text" class="form-control" value="${mobileData.ram}"></td>
            <td><input type="text" class="form-control" value="${mobileData.storage}"></td>
            <td><button class="btn btn-primary save-btn">SAVE</button></td>
            <td><button class="btn btn-danger delete-btn">DELETE</button></td>
        `;

        mobilesTableBody.appendChild(newRow);
        addRowListeners(newRow);

        if (!isNew) {
            saveRow({ target: newRow.querySelector('.save-btn') });
        }
    }

    function saveRow(event) {
        const row = event.target.closest('tr');
        const inputs = row.querySelectorAll('input');
        let allFilled = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                allFilled = false;
            }
        });

        if (!allFilled) {
            alert('Please fill all fields');
            return;
        }

        inputs.forEach(input => {
            const cell = document.createElement('td');
            cell.textContent = input.value;
            input.parentNode.replaceWith(cell);
        });

        toggleEditSaveButtons(row);
        saveDataToLocalStorage();
    }

    function editRow(event) {
        const row = event.target.closest('tr');
        const cells = row.querySelectorAll('td');

        cells.forEach((cell, index) => {
            if (index < 4) {
                const input = document.createElement('input');
                input.type = 'text';
                input.classList.add('form-control');
                input.value = cell.textContent.trim();
                cell.textContent = '';
                cell.appendChild(input);
            }
        });

        toggleEditSaveButtons(row);
    }

    function deleteRow(event) {
        const row = event.target.closest('tr');
        const confirmed = confirm('Are you sure you want to delete this row?');

        if (confirmed) {
            row.remove();
            saveDataToLocalStorage();
        }
    }

    function toggleEditSaveButtons(row) {
        const saveBtn = row.querySelector('.save-btn');
        const editBtn = row.querySelector('.edit-btn');

        if (saveBtn) {
            saveBtn.textContent = 'EDIT';
            saveBtn.classList.remove('save-btn');
            saveBtn.classList.add('edit-btn');
            saveBtn.removeEventListener('click', saveRow);
            saveBtn.addEventListener('click', editRow);
        } else if (editBtn) {
            editBtn.textContent = 'SAVE';
            editBtn.classList.remove('edit-btn');
            editBtn.classList.add('save-btn');
            editBtn.removeEventListener('click', editRow);
            editBtn.addEventListener('click', saveRow);
        }
    }

    function addRowListeners(row) {
        const saveBtn = row.querySelector('.save-btn');
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');

        if (saveBtn) saveBtn.addEventListener('click', saveRow);
        if (editBtn) editBtn.addEventListener('click', editRow);
        if (deleteBtn) deleteBtn.addEventListener('click', deleteRow);
    }

    function saveDataToLocalStorage() {
        const mobilesData = [];
        const rows = mobilesTableBody.querySelectorAll('tr');

        rows.forEach(row => {
            const cells = row.querySelectorAll('td');
            if (cells.length > 0) {
                mobilesData.push({
                    mobile: cells[0].textContent.trim(),
                    price: cells[1].textContent.trim(),
                    ram: cells[2].textContent.trim(),
                    storage: cells[3].textContent.trim(),
                });
            }
        });

        localStorage.setItem('mobilesData', JSON.stringify(mobilesData));
    }

    addRowListeners(document); 
});
