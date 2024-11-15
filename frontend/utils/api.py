import requests

class WeatherAPI:
    def __init__(self):
        self.base_url = "http://localhost:5000/api"
        self.timeout = 5  # secondes

    def get_stations(self):
        try:
            response = requests.get(f"{self.base_url}/stations", timeout=self.timeout)
            if response.status_code == 200:
                return response.json()
            else:
                print(f"Erreur API: {response.status_code}")
                return []
        except Exception as e:
            print(f"Erreur lors de la récupération des stations: {e}")
            return []