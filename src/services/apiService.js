const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

class ApiService {
    async getPlayerStats() {
        try {
            const response = await fetch(`${API_BASE_URL}/getPlayerStats`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching player stats:', error);
            throw error;
        }
    }

    async getTeams() {
        try {
            const response = await fetch(`${API_BASE_URL}/getTeams`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            return await response.json();
        } catch (error) {
            console.error('Error fetching teams:', error);
            throw error;
        }
    }

    getActionStream() {
        return new EventSource(`${API_BASE_URL}/getActionStream`);
    }

    getStatsStream() {
        return new EventSource(`${API_BASE_URL}/getStatsStream`);
    }
}

export default new ApiService();