from dash import html
import dash_bootstrap_components as dbc
from datetime import datetime
from utils.api import WeatherAPI

def create_station_card(station_data):
    """
    Crée une carte météo compacte avec les informations essentielles et effets 3D
    """
    if not station_data:
        return dbc.Card(
            dbc.CardBody(
                html.I("Données non disponibles", className="text-muted small"),
            ),
            className="m-1 border-danger card-3d"
        )

    try:
        # Récupération sécurisée des données avec get()
        conditions_list = station_data.get('conditionsActuelles', [])
        conditions = conditions_list[0] if conditions_list else {}
        temperature = conditions.get('temperature', 'N/A')
        humidite = conditions.get('humidite', 'N/A')
        description = conditions.get('description', 'Pas de données')

   
        # En-tête compact
        header_content = html.Div([
            html.H5(station_data.get('nom', 'Station inconnue'), 
                   className="card-title mb-0 text-primary small"),
            html.Small(f"{station_data.get('ville', 'Ville inconnue')}, {station_data.get('pays', 'Pays inconnu')}", 
                      className="text-muted d-block small"),
            html.Small([
                html.I(className="bi bi-geo-alt me-1"),
                f"{station_data.get('latitude', 0):.2f}°, {station_data.get('longitude', 0):.2f}°"
            ], className="text-muted d-block small")
        ], className="text-center py-2")

        # Conditions actuelles
        current_conditions = html.Div([
            html.Div([
                html.Div([
                    html.I(className="bi bi-thermometer-half text-danger me-2"),
                    html.Span(f"{temperature}°C", className="h5 mb-0")
                ], className="d-flex align-items-center justify-content-center"),
                html.Small(description, className="text-muted d-block small mt-1")
            ], className="text-center p-2"),
            
            html.Div([
                html.Div([
                    html.I(className="bi bi-droplet text-primary me-1 small"),
                    html.Span(f"{humidite}%", className="small")
                ], className="text-center"),
                
                html.Div([
                    html.I(className="bi bi-mountain text-secondary me-1 small"),
                    html.Span(f"{station_data.get('altitude', 0)}m", className="small")
                ], className="text-center")
            ], className="d-flex justify-content-around py-2 bg-light")
        ])

        # Prévision (si disponible)
        previsions = station_data.get('previsions', [])
        forecast = None
        if previsions:
            prev = previsions[0]
            forecast = html.Div([
                html.Small("Prévision", className="text-primary d-block text-center mb-1"),
                html.Div([
                    html.Small(prev.get('date', ''), className="text-muted d-block small"),
                    html.Div([
                        html.I(className="bi bi-cloud-sun text-warning me-1 small"),
                        html.Span(f"{prev.get('temperature', 'N/A')}°C", className="small fw-bold")
                    ], className="d-flex align-items-center justify-content-center"),
                    html.Small(prev.get('description', 'Pas de données'), 
                             className="text-muted d-block small")
                ], className="text-center")
            ], className="border-top pt-2 pb-1")

        # Alerte (si disponible)
        alertes = station_data.get('alertes', [])
        alert = None
        if alertes:
            alerte = alertes[0]
            alert = html.Div([
                dbc.Alert([
                    html.Small(alerte.get('titre', ''), className="fw-bold d-block"),
                    html.Small(alerte.get('description', ''), className="small")
                ], color="danger", className="py-1 px-2 mb-0 small")
            ], className="px-2 pb-2")

        return dbc.Card([
            dbc.CardHeader(header_content, className="p-0 bg-white card-header-3d"),
            dbc.CardBody([
                current_conditions,
                forecast,
                alert
            ], className="p-0")
        ], className="station-card m-1 card-3d")

    except Exception as e:
        print(f"Erreur lors de la création de la carte: {e}")
        return dbc.Card(
            dbc.CardBody(
                html.I("Erreur d'affichage", className="text-muted small"),
            ),
            className="m-1 border-danger card-3d"
        )

def create_station_list():
    """
    Crée une grille de cartes compactes
    """
    api = WeatherAPI()
    stations = api.get_stations()
    
    if not stations:
        return html.Div(
            html.I("Aucune station disponible", className="text-muted"),
            className="text-center p-3"
        )
    
    station_rows = []
    for i in range(0, len(stations), 3):
        row_stations = stations[i:i+3]
        row = dbc.Row([
            dbc.Col(create_station_card(station), 
                   width=12, sm=6, md=4, className="mb-3")
            for station in row_stations
        ], className="g-2")
        station_rows.append(row)
    
    return html.Div(station_rows)