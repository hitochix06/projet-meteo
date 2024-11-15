from dash import Dash, html
import dash_bootstrap_components as dbc
from components.station_card import create_station_list

app = Dash(__name__, external_stylesheets=[
    dbc.themes.BOOTSTRAP,
    'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css'
])

app.layout = dbc.Container([
    html.H1("Stations Météo", className="my-4 text-center"),
    dbc.Row([
        dbc.Col(create_station_list())
    ])
])

if __name__ == '__main__':
    app.run_server(debug=True)