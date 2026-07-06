const API_BASE_URL = '/api/v1/students';

const api = {
    async getStudents() {
        try {
            const response = await fetch(API_BASE_URL);
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    async getStudentById(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`);
            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error fetching student ${id}:`, error);
            throw error;
        }
    },

    async createStudent(studentData) {
        try {
            const response = await fetch(API_BASE_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error('Error creating student:', error);
            throw error;
        }
    },

    async updateStudent(id, studentData) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(studentData)
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error updating student ${id}:`, error);
            throw error;
        }
    },

    async deleteStudent(id) {
        try {
            const response = await fetch(`${API_BASE_URL}/${id}`, {
                method: 'DELETE'
            });
            return await this.handleResponse(response);
        } catch (error) {
            console.error(`Error deleting student ${id}:`, error);
            throw error;
        }
    },

    async handleResponse(response) {
        const json = await response.json();
        if (!response.ok || !json.success) {
            const errorMsg = json.message || 'API request failed';
            throw new Error(errorMsg);
        }
        return json.data;
    }
};
