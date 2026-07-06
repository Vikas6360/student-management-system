const studentManager = {
    students: [],
    studentToDelete: null,
    deleteModal: null,

    async initDashboard() {
        app.showLoading();
        try {
            this.students = await api.getStudents();
            this.updateDashboardStats();
        } catch (error) {
            app.showAlert('Failed to load dashboard statistics', 'error');
        } finally {
            app.hideLoading();
        }
    },

    updateDashboardStats() {
        const totalElement = document.getElementById('totalStudents');
        if (totalElement) {
            totalElement.textContent = this.students.length;
        }

        const newElement = document.getElementById('newStudents');
        if (newElement) {
            // Count students added in the last 30 days
            const thirtyDaysAgo = new Date();
            thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
            
            let newCount = 0;
            this.students.forEach(s => {
                if (s.createdAt) {
                    const createdDate = new Date(s.createdAt);
                    if (createdDate >= thirtyDaysAgo) newCount++;
                }
            });
            // Fallback to recent 5 if no createdAt dates exist
            newElement.textContent = newCount > 0 ? newCount : Math.min(this.students.length, 5);
        }

        const statusElement = document.getElementById('systemStatus');
        if (statusElement) {
            statusElement.textContent = 'Online';
            statusElement.classList.add('text-success');
        }
    },

    async initStudentList() {
        app.showLoading();
        try {
            this.students = await api.getStudents();
            this.renderStudentTable(this.students);
            this.setupSearch();
            
            const deleteModalEl = document.getElementById('deleteConfirmModal');
            if (deleteModalEl) {
                this.deleteModal = new bootstrap.Modal(deleteModalEl);
            }
        } catch (error) {
            app.showAlert('Failed to load students', 'error');
        } finally {
            app.hideLoading();
        }
    },

    renderStudentTable(studentsToRender) {
        const tbody = document.getElementById('studentTableBody');
        const emptyMessage = document.getElementById('emptyTableMessage');
        
        if (!tbody) return;
        
        tbody.innerHTML = '';
        
        if (studentsToRender.length === 0) {
            if (emptyMessage) emptyMessage.classList.remove('d-none');
        } else {
            if (emptyMessage) emptyMessage.classList.add('d-none');
            
            studentsToRender.forEach(student => {
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>#${student.id}</td>
                    <td>
                        <div class="fw-bold">${student.firstName} ${student.lastName}</div>
                        <div class="small text-muted">${student.department || 'N/A'}</div>
                    </td>
                    <td>${student.email}</td>
                    <td>${student.phoneNumber || '-'}</td>
                    <td>
                        <a href="edit-student.html?id=${student.id}" class="btn btn-sm btn-outline-primary me-2">
                            <i class="bi bi-pencil-square"></i> Edit
                        </a>
                        <button onclick="studentManager.confirmDelete(${student.id})" class="btn btn-sm btn-outline-danger">
                            <i class="bi bi-trash"></i> Delete
                        </button>
                    </td>
                `;
                tbody.appendChild(tr);
            });
        }
    },

    setupSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const term = e.target.value.toLowerCase();
                const filtered = this.students.filter(student => 
                    student.firstName.toLowerCase().includes(term) ||
                    student.lastName.toLowerCase().includes(term) ||
                    student.email.toLowerCase().includes(term)
                );
                this.renderStudentTable(filtered);
            });
        }
    },

    confirmDelete(id) {
        this.studentToDelete = id;
        if (this.deleteModal) {
            this.deleteModal.show();
        }
    },

    async executeDelete() {
        if (!this.studentToDelete) return;
        
        app.showLoading();
        if (this.deleteModal) {
            this.deleteModal.hide();
        }
        
        try {
            await api.deleteStudent(this.studentToDelete);
            app.showAlert('Student deleted successfully', 'success');
            // Refresh list
            await this.initStudentList();
        } catch (error) {
            app.showAlert(error.message || 'Failed to delete student', 'error');
        } finally {
            app.hideLoading();
            this.studentToDelete = null;
        }
    },

    async initAddForm() {
        const form = document.getElementById('studentForm');
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitForm(form, 'create');
            });
        }
    },

    async initEditForm() {
        const form = document.getElementById('studentForm');
        if (!form) return;

        const urlParams = new URLSearchParams(window.location.search);
        const id = urlParams.get('id');

        if (!id) {
            app.showAlert('No student ID provided', 'error');
            setTimeout(() => window.location.href = 'students.html', 2000);
            return;
        }

        app.showLoading();
        try {
            const student = await api.getStudentById(id);
            this.populateForm(form, student);
            
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                await this.submitForm(form, 'update', id);
            });
        } catch (error) {
            app.showAlert('Failed to load student details', 'error');
        } finally {
            app.hideLoading();
        }
    },

    populateForm(form, student) {
        Object.keys(student).forEach(key => {
            const input = form.elements[key];
            if (input) {
                input.value = student[key] || '';
            }
        });
    },

    async submitForm(form, action, id = null) {
        if (!form.checkValidity()) {
            form.classList.add('was-validated');
            return;
        }

        const formData = new FormData(form);
        const studentData = Object.fromEntries(formData.entries());

        app.showLoading();
        try {
            if (action === 'create') {
                await api.createStudent(studentData);
                app.showAlert('Student created successfully', 'success');
                form.reset();
                form.classList.remove('was-validated');
            } else if (action === 'update') {
                await api.updateStudent(id, studentData);
                app.showAlert('Student updated successfully', 'success');
            }
            
            // Redirect back to list after short delay
            setTimeout(() => {
                window.location.href = 'students.html';
            }, 1500);
        } catch (error) {
            app.showAlert(error.message || `Failed to ${action} student`, 'error');
        } finally {
            app.hideLoading();
        }
    }
};
